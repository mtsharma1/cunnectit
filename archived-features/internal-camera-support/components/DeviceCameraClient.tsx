"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { makeDeviceSecret, peerConfiguration, waitForIceGathering } from "@/lib/webrtc";

type CameraSession = {
  id: string;
  status: string;
  answer: RTCSessionDescriptionInit | null;
};

type SavedDevice = {
  id: string;
  secret: string;
  name: string;
};

const storageKey = "cunnectit-camera-device";

async function cameraApi(body: Record<string, unknown>) {
  const response = await fetch("/api/camera", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "The request failed.");
  return result;
}

export function DeviceCameraClient() {
  const [name, setName] = useState("");
  const [device, setDevice] = useState<SavedDevice | null>(null);
  const [incoming, setIncoming] = useState<CameraSession | null>(null);
  const [activeSession, setActiveSession] = useState<CameraSession | null>(null);
  const [status, setStatus] = useState("Register this computer to make it visible to the administrator.");
  const [busy, setBusy] = useState(false);
  const previewRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const answerAppliedRef = useRef(false);

  const stopLocalMedia = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    peerRef.current?.close();
    peerRef.current = null;
    answerAppliedRef.current = false;
    if (previewRef.current) previewRef.current.srcObject = null;
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return;
      const parsed = JSON.parse(saved) as SavedDevice;
      if (parsed.id && parsed.secret && parsed.name) {
        setDevice(parsed);
        setName(parsed.name);
        setStatus("This computer is registered and waiting for camera requests.");
      }
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, []);

  const registerDevice = async () => {
    const cleanName = name.trim();
    if (!cleanName) {
      setStatus("Enter a computer name first.");
      return;
    }

    setBusy(true);
    try {
      const saved: SavedDevice = device || {
        id: crypto.randomUUID(),
        secret: makeDeviceSecret(),
        name: cleanName,
      };
      saved.name = cleanName;
      await cameraApi({
        action: "register",
        deviceId: saved.id,
        deviceSecret: saved.secret,
        name: saved.name,
      });
      localStorage.setItem(storageKey, JSON.stringify(saved));
      setDevice({ ...saved });
      setStatus("Online and waiting for camera requests.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Registration failed.");
    } finally {
      setBusy(false);
    }
  };

  const pollDevice = useCallback(async () => {
    if (!device) return;
    try {
      await cameraApi({
        action: "heartbeat",
        deviceId: device.id,
        deviceSecret: device.secret,
        name: device.name,
      });
      const response = await fetch(`/api/camera?mode=device-session&deviceId=${encodeURIComponent(device.id)}`, {
        headers: { "x-device-secret": device.secret },
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to check requests.");
      const session = result.session as CameraSession | null;

      if (!session) {
        if (activeSession) {
          stopLocalMedia();
          setActiveSession(null);
          setStatus("Camera sharing ended. Waiting for another request.");
        }
        return;
      }

      if (session.status === "requested" && !activeSession) {
        setIncoming(session);
        setStatus("The administrator is requesting camera access.");
      }

      if (session.status === "active" && activeSession?.id === session.id && session.answer && !answerAppliedRef.current) {
        answerAppliedRef.current = true;
        await peerRef.current?.setRemoteDescription(session.answer);
        setStatus("Camera is being shared. You can stop sharing at any time.");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Connection lost. Retrying…");
    }
  }, [activeSession, device, stopLocalMedia]);

  useEffect(() => {
    if (!device) return;
    void pollDevice();
    const timer = window.setInterval(() => void pollDevice(), 2_500);
    return () => window.clearInterval(timer);
  }, [device, pollDevice]);

  useEffect(() => () => stopLocalMedia(), [stopLocalMedia]);

  const respond = async (accepted: boolean) => {
    if (!incoming || !device) return;
    setBusy(true);
    try {
      if (!accepted) {
        await cameraApi({
          action: "decline",
          sessionId: incoming.id,
          deviceId: device.id,
          deviceSecret: device.secret,
        });
        setIncoming(null);
        setStatus("Camera request declined. Waiting for another request.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (previewRef.current) previewRef.current.srcObject = stream;

      await cameraApi({
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

      await cameraApi({
        action: "offer",
        sessionId: incoming.id,
        deviceId: device.id,
        deviceSecret: device.secret,
        description: peer.localDescription?.toJSON(),
      });
      setActiveSession(incoming);
      setIncoming(null);
      setStatus("Camera accepted. Connecting securely to the administrator…");
    } catch (error) {
      stopLocalMedia();
      setStatus(error instanceof Error ? error.message : "Camera access failed.");
    } finally {
      setBusy(false);
    }
  };

  const endSharing = async () => {
    if (activeSession && device) {
      try {
        await cameraApi({
          action: "device-end",
          sessionId: activeSession.id,
          deviceId: device.id,
          deviceSecret: device.secret,
        });
      } catch {
        // Local shutdown still takes priority if the network is unavailable.
      }
    }
    stopLocalMedia();
    setActiveSession(null);
    setStatus("Camera stopped. Waiting for another request.");
  };

  return (
    <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-[2rem] border border-[#071d4f]/10 bg-white p-6 shadow-sm sm:p-8">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-coral">Computer registration</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-[#071d4f]">Camera device</h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          Give this computer a recognizable name. Its server-visible IP and online status will appear on the protected admin page.
        </p>

        <label className="mt-7 block text-sm font-semibold text-ink" htmlFor="device-name">Computer name</label>
        <input
          id="device-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Example: Reception laptop"
          maxLength={80}
          className="mt-2 w-full rounded-xl border border-[#071d4f]/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/15"
        />
        <button
          type="button"
          onClick={registerDevice}
          disabled={busy}
          className="mt-4 w-full rounded-xl bg-coral px-5 py-3 text-sm font-bold text-white transition hover:bg-[#071d4f] disabled:opacity-60"
        >
          {device ? "Update computer name" : "Register this computer"}
        </button>

        <div className="mt-6 rounded-xl bg-[#f5f9f1] p-4 text-sm leading-6 text-ink/70" aria-live="polite">
          <span className={`mr-2 inline-block size-2 rounded-full ${device ? "bg-emerald-500" : "bg-amber-500"}`} />
          {status}
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-[#071d4f]/10 bg-[#071d4f] p-4 shadow-[0_28px_90px_rgba(7,29,79,0.16)] sm:p-6">
        <div className="relative aspect-video overflow-hidden rounded-[1.4rem] bg-black/25">
          <video ref={previewRef} autoPlay muted playsInline className="size-full scale-x-[-1] object-cover" />
          {!activeSession && (
            <div className="absolute inset-0 grid place-items-center p-8 text-center text-white/70">
              Camera is off until you accept a request.
            </div>
          )}
          {activeSession && (
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white">
              <span className="size-2 rounded-full bg-coral" /> Sharing
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={endSharing}
            disabled={!activeSession}
            className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#071d4f] transition hover:bg-coral hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Stop sharing
          </button>
        </div>
      </section>

      {incoming && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#071d4f]/70 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="camera-request-title">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-2xl sm:p-9">
            <div className="grid size-12 place-items-center rounded-full bg-coral/10 text-xl text-coral" aria-hidden="true">●</div>
            <h2 id="camera-request-title" className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-[#071d4f]">Camera access requested</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              An administrator wants to view this camera. Video starts only if you accept, and nothing is recorded by this page.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <button type="button" disabled={busy} onClick={() => void respond(false)} className="rounded-xl border border-[#071d4f]/15 px-4 py-3 text-sm font-bold text-[#071d4f] transition hover:bg-cream">Decline</button>
              <button type="button" disabled={busy} onClick={() => void respond(true)} className="rounded-xl bg-coral px-4 py-3 text-sm font-bold text-white transition hover:bg-[#071d4f]">Accept & share</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
