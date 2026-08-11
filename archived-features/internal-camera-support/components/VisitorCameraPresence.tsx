"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { makeDeviceSecret, peerConfiguration, waitForIceGathering } from "@/lib/webrtc";

type VisitorDevice = {
  id: string;
  secret: string;
  name: string;
};

type CameraSession = {
  id: string;
  status: string;
  answer: RTCSessionDescriptionInit | null;
};

const visitorStorageKey = "cunnectit-website-visitor";
const presenceConsentKey = "cunnectit-presence-consent";

function describeVisitor() {
  const agent = navigator.userAgent;
  const operatingSystem = /Windows/i.test(agent)
    ? "Windows"
    : /Android/i.test(agent)
      ? "Android"
      : /iPhone|iPad|iPod/i.test(agent)
        ? "iPhone/iPad"
        : /Macintosh|Mac OS/i.test(agent)
          ? "Mac"
          : /Linux/i.test(agent)
            ? "Linux"
            : "Unknown device";
  const browser = /Edg\//i.test(agent)
    ? "Edge"
    : /Chrome\//i.test(agent)
      ? "Chrome"
      : /Firefox\//i.test(agent)
        ? "Firefox"
        : /Safari\//i.test(agent)
          ? "Safari"
          : "Browser";
  return `Website visitor · ${operatingSystem} · ${browser}`;
}

async function postCamera(body: Record<string, unknown>) {
  const response = await fetch("/api/camera", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "The camera request failed.");
  return result;
}

export function VisitorCameraPresence() {
  const [device, setDevice] = useState<VisitorDevice | null>(null);
  const [incoming, setIncoming] = useState<CameraSession | null>(null);
  const [activeSession, setActiveSession] = useState<CameraSession | null>(null);
  const [message, setMessage] = useState("Camera sharing is active.");
  const [busy, setBusy] = useState(false);
  const [showPresenceConsent, setShowPresenceConsent] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const answerAppliedRef = useRef(false);

  const stopMedia = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    peerRef.current?.close();
    peerRef.current = null;
    answerAppliedRef.current = false;
    if (previewRef.current) previewRef.current.srcObject = null;
  }, []);

  const registerVisitor = useCallback(async () => {
    try {
      let visitor: VisitorDevice | null = null;
      const saved = localStorage.getItem(visitorStorageKey);
      if (saved) visitor = JSON.parse(saved) as VisitorDevice;
      if (!visitor?.id || !visitor.secret) {
        visitor = {
          id: crypto.randomUUID(),
          secret: makeDeviceSecret(),
          name: describeVisitor(),
        };
      } else {
        visitor.name = describeVisitor();
      }
      await postCamera({
        action: "register",
        deviceId: visitor.id,
        deviceSecret: visitor.secret,
        name: visitor.name,
      });
      localStorage.setItem(visitorStorageKey, JSON.stringify(visitor));
      setDevice(visitor);
    } catch {
      // Website content remains available if visitor presence is unavailable.
    }
  }, []);

  useEffect(() => {
    const consent = localStorage.getItem(presenceConsentKey);
    if (consent === "accepted") {
      void registerVisitor();
    } else if (consent !== "declined") {
      setShowPresenceConsent(true);
    }
  }, [registerVisitor]);

  const acceptPresence = () => {
    localStorage.setItem(presenceConsentKey, "accepted");
    setShowPresenceConsent(false);
    void registerVisitor();
  };

  const declinePresence = () => {
    localStorage.setItem(presenceConsentKey, "declined");
    setShowPresenceConsent(false);
  };

  const poll = useCallback(async () => {
    if (!device) return;
    try {
      await postCamera({
        action: "heartbeat",
        deviceId: device.id,
        deviceSecret: device.secret,
        name: device.name,
      });
      const response = await fetch(
        `/api/camera?mode=device-session&deviceId=${encodeURIComponent(device.id)}`,
        { headers: { "x-device-secret": device.secret }, cache: "no-store" },
      );
      const result = await response.json();
      if (!response.ok) return;
      const session = result.session as CameraSession | null;

      if (!session) {
        setIncoming(null);
        if (activeSession) {
          stopMedia();
          setActiveSession(null);
        }
        return;
      }

      if (session.status === "requested" && !activeSession) {
        setIncoming(session);
      }

      if (
        session.status === "active"
        && activeSession?.id === session.id
        && session.answer
        && !answerAppliedRef.current
      ) {
        answerAppliedRef.current = true;
        await peerRef.current?.setRemoteDescription(session.answer);
        setMessage("Your camera is being shared with the site administrator.");
      }
    } catch {
      // The next heartbeat retries automatically.
    }
  }, [activeSession, device, stopMedia]);

  useEffect(() => {
    if (!device) return;
    void poll();
    const timer = window.setInterval(() => void poll(), 2_500);
    return () => window.clearInterval(timer);
  }, [device, poll]);

  useEffect(() => () => stopMedia(), [stopMedia]);

  useEffect(() => {
    if (activeSession && previewRef.current && streamRef.current) {
      previewRef.current.srcObject = streamRef.current;
    }
  }, [activeSession]);

  const respond = async (accepted: boolean) => {
    if (!incoming || !device) return;
    setBusy(true);
    try {
      if (!accepted) {
        await postCamera({
          action: "decline",
          sessionId: incoming.id,
          deviceId: device.id,
          deviceSecret: device.secret,
        });
        setIncoming(null);
        return;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access is not supported in this browser.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (previewRef.current) previewRef.current.srcObject = stream;

      await postCamera({
        action: "accept",
        sessionId: incoming.id,
        deviceId: device.id,
        deviceSecret: device.secret,
      });

      const peer = new RTCPeerConnection(peerConfiguration);
      peerRef.current = peer;
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      await waitForIceGathering(peer);
      await postCamera({
        action: "offer",
        sessionId: incoming.id,
        deviceId: device.id,
        deviceSecret: device.secret,
        description: peer.localDescription?.toJSON(),
      });

      setActiveSession(incoming);
      setIncoming(null);
      setMessage("Connecting your camera to the site administrator…");
    } catch (error) {
      stopMedia();
      setMessage(error instanceof Error ? error.message : "Camera sharing could not start.");
    } finally {
      setBusy(false);
    }
  };

  const stopSharing = async () => {
    if (activeSession && device) {
      try {
        await postCamera({
          action: "device-end",
          sessionId: activeSession.id,
          deviceId: device.id,
          deviceSecret: device.secret,
        });
      } catch {
        // Stop the local camera even when the connection is unavailable.
      }
    }
    stopMedia();
    setActiveSession(null);
  };

  return (
    <>
      {showPresenceConsent && (
        <aside className="fixed bottom-4 left-4 z-[95] w-[min(460px,calc(100vw-32px))] rounded-2xl border border-[#071d4f]/10 bg-white p-5 shadow-2xl" aria-label="Visitor presence permission">
          <p className="text-sm font-bold text-[#071d4f]">Internal camera support</p>
          <p className="mt-2 text-xs leading-5 text-muted">
            Allow your server-visible IP, device type, and online status to be stored in the site database and shown to the administrator. Your camera stays off unless you separately accept a camera request.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={declinePresence} className="rounded-lg px-4 py-2 text-xs font-bold text-[#071d4f] transition hover:bg-cream">Not now</button>
            <button type="button" onClick={acceptPresence} className="rounded-lg bg-coral px-4 py-2 text-xs font-bold text-white transition hover:bg-[#071d4f]">Allow presence</button>
          </div>
        </aside>
      )}

      {incoming && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-[#071d4f]/75 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="visitor-camera-title">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-2xl sm:p-9">
            <div className="grid size-12 place-items-center rounded-full bg-coral/10 text-xl text-coral" aria-hidden="true">●</div>
            <h2 id="visitor-camera-title" className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-[#071d4f]">Camera request</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              The Cunnectit site administrator is requesting a live camera view. Nothing starts unless you accept, and this page does not record the video.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <button type="button" disabled={busy} onClick={() => void respond(false)} className="rounded-xl border border-[#071d4f]/15 px-4 py-3 text-sm font-bold text-[#071d4f] transition hover:bg-cream disabled:opacity-60">Decline</button>
              <button type="button" disabled={busy} onClick={() => void respond(true)} className="rounded-xl bg-coral px-4 py-3 text-sm font-bold text-white transition hover:bg-[#071d4f] disabled:opacity-60">Accept & share</button>
            </div>
          </div>
        </div>
      )}

      {activeSession && (
        <aside className="fixed bottom-4 right-4 z-[90] w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-white/15 bg-[#071d4f] p-3 text-white shadow-2xl">
          <video ref={previewRef} autoPlay muted playsInline className="aspect-video w-full scale-x-[-1] rounded-xl bg-black/30 object-cover" />
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs leading-5 text-white/70">{message}</p>
            <button type="button" onClick={() => void stopSharing()} className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#071d4f] transition hover:bg-coral hover:text-white">Stop sharing</button>
          </div>
        </aside>
      )}
    </>
  );
}
