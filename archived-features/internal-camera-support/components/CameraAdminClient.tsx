"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { peerConfiguration, waitForIceGathering } from "@/lib/webrtc";

type Device = {
  id: string;
  name: string;
  ipAddress: string;
  lastSeen: string;
  online: boolean;
};

type CameraSession = {
  id: string;
  status: string;
  offer: RTCSessionDescriptionInit | null;
};

async function adminFetch(key: string, url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options?.body ? { "Content-Type": "application/json" } : {}),
      "x-camera-admin-key": key,
      ...options?.headers,
    },
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "The request failed.");
  return result;
}

export function CameraAdminClient() {
  const [keyInput, setKeyInput] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [devices, setDevices] = useState<Device[]>([]);
  const [selected, setSelected] = useState<Device | null>(null);
  const [sessionId, setSessionId] = useState("");
  const [status, setStatus] = useState("Enter the administrator key to view website visitors.");
  const [busy, setBusy] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const answerSentRef = useRef(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("cunnectit-camera-admin-key");
    if (saved) {
      setKeyInput(saved);
      setAdminKey(saved);
    }
  }, []);

  const loadDevices = useCallback(async () => {
    if (!adminKey) return;
    try {
      const result = await adminFetch(adminKey, "/api/camera?mode=devices");
      setDevices(result.devices);
      setStatus("Device list updated.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to load website visitors.");
    }
  }, [adminKey]);

  useEffect(() => {
    if (!adminKey) return;
    void loadDevices();
    const timer = window.setInterval(() => void loadDevices(), 5_000);
    return () => window.clearInterval(timer);
  }, [adminKey, loadDevices]);

  const closePeer = useCallback(() => {
    peerRef.current?.close();
    peerRef.current = null;
    answerSentRef.current = false;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => () => closePeer(), [closePeer]);

  useEffect(() => {
    if (!adminKey || !sessionId) return;
    let stopped = false;

    const checkSession = async () => {
      try {
        const result = await adminFetch(
          adminKey,
          `/api/camera?mode=session&sessionId=${encodeURIComponent(sessionId)}`,
        );
        if (stopped) return;
        const session = result.session as CameraSession;

        if (session.status === "declined") {
          setStatus("The user declined the camera request.");
          setSessionId("");
          closePeer();
          return;
        }
        if (session.status === "ended") {
          setStatus("Camera sharing ended.");
          setSessionId("");
          closePeer();
          return;
        }
        if (session.status === "offered" && session.offer && !answerSentRef.current) {
          answerSentRef.current = true;
          setStatus("Permission accepted. Connecting to the camera…");
          const peer = new RTCPeerConnection(peerConfiguration);
          peerRef.current = peer;
          peer.ontrack = (event) => {
            if (videoRef.current) videoRef.current.srcObject = event.streams[0];
          };
          await peer.setRemoteDescription(session.offer);
          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          await waitForIceGathering(peer);
          await adminFetch(adminKey, "/api/camera", {
            method: "POST",
            body: JSON.stringify({
              action: "answer",
              sessionId,
              description: peer.localDescription?.toJSON(),
            }),
          });
          setStatus("Camera connected. Live video is shown below.");
        } else if (session.status === "requested") {
          setStatus("Waiting for the user to accept or decline…");
        }
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Unable to check the camera request.");
      }
    };

    void checkSession();
    const timer = window.setInterval(() => void checkSession(), 1_500);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [adminKey, closePeer, sessionId]);

  const unlock = async () => {
    const key = keyInput.trim();
    if (!key) return;
    setBusy(true);
    try {
      await adminFetch(key, "/api/camera?mode=devices");
      sessionStorage.setItem("cunnectit-camera-admin-key", key);
      setAdminKey(key);
      setStatus("Administrator access confirmed.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Access denied.");
    } finally {
      setBusy(false);
    }
  };

  const requestCamera = async (device: Device) => {
    setBusy(true);
    closePeer();
    setSelected(device);
    try {
      const result = await adminFetch(adminKey, "/api/camera", {
        method: "POST",
        body: JSON.stringify({ action: "request", deviceId: device.id }),
      });
      setSessionId(result.sessionId);
      setStatus(`Camera request sent to ${device.name}. Waiting for consent…`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to send the request.");
    } finally {
      setBusy(false);
    }
  };

  const endSession = async () => {
    if (sessionId) {
      try {
        await adminFetch(adminKey, "/api/camera", {
          method: "POST",
          body: JSON.stringify({ action: "admin-end", sessionId }),
        });
      } catch {
        // Always close the local viewer even if signaling is unavailable.
      }
    }
    setSessionId("");
    closePeer();
    setStatus("Camera session stopped.");
  };

  if (!adminKey) {
    return (
      <section className="mx-auto max-w-lg rounded-[2rem] border border-[#071d4f]/10 bg-white p-7 shadow-[0_28px_90px_rgba(7,29,79,0.12)] sm:p-9">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-coral">Protected area</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-[#071d4f]">Camera administrator</h1>
        <p className="mt-4 text-sm leading-6 text-muted">Enter the private administrator key configured on the server.</p>
        <label htmlFor="admin-key" className="mt-7 block text-sm font-semibold">Administrator key</label>
        <input id="admin-key" type="password" value={keyInput} onChange={(event) => setKeyInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && void unlock()} className="mt-2 w-full rounded-xl border border-[#071d4f]/15 px-4 py-3 outline-none focus:border-coral focus:ring-2 focus:ring-coral/15" />
        <button type="button" onClick={() => void unlock()} disabled={busy} className="mt-4 w-full rounded-xl bg-coral px-5 py-3 text-sm font-bold text-white transition hover:bg-[#071d4f] disabled:opacity-60">Open dashboard</button>
        <p className="mt-5 text-sm text-muted" aria-live="polite">{status}</p>
      </section>
    );
  }

  return (
    <div className="grid gap-7 xl:grid-cols-[1fr_0.9fr]">
      <section className="overflow-hidden rounded-[2rem] border border-[#071d4f]/10 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#071d4f]/10 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-coral">Opted-in live presence</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#071d4f]">Website visitors</h1>
          </div>
          <button type="button" onClick={() => void loadDevices()} className="w-fit rounded-xl border border-[#071d4f]/15 px-4 py-2.5 text-sm font-semibold text-[#071d4f] transition hover:border-coral hover:text-coral">Refresh</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-[#f5f9f1] text-xs uppercase tracking-[0.1em] text-ink/55">
              <tr><th className="px-6 py-4">Visitor device</th><th className="px-6 py-4">IP address</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Last seen</th></tr>
            </thead>
            <tbody className="divide-y divide-[#071d4f]/10">
              {devices.map((device) => (
                <tr key={device.id} className="hover:bg-[#f5f9f1]/70">
                  <td className="px-6 py-4 font-semibold text-[#071d4f]">{device.name}</td>
                  <td className="px-6 py-4">
                    <button type="button" disabled={!device.online || busy} onClick={() => void requestCamera(device)} className="font-mono text-sm font-bold text-coral underline decoration-coral/30 underline-offset-4 transition hover:text-[#071d4f] disabled:cursor-not-allowed disabled:text-ink/35">{device.ipAddress}</button>
                  </td>
                  <td className="px-6 py-4"><span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${device.online ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"}`}><span className={`size-2 rounded-full ${device.online ? "bg-emerald-500" : "bg-stone-400"}`} />{device.online ? "Online" : "Offline"}</span></td>
                  <td className="px-6 py-4 text-ink/55">{new Date(device.lastSeen).toLocaleString()}</td>
                </tr>
              ))}
              {!devices.length && <tr><td colSpan={4} className="px-6 py-12 text-center text-muted">No visitors currently have the website open.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-[2rem] bg-[#071d4f] p-4 text-white shadow-[0_28px_90px_rgba(7,29,79,0.16)] sm:p-6">
        <div className="relative aspect-video overflow-hidden rounded-[1.4rem] bg-black/25">
          <video ref={videoRef} autoPlay muted playsInline className="size-full object-cover" />
          {!sessionId && <div className="absolute inset-0 grid place-items-center p-8 text-center text-white/65">Click an online visitor IP to send a camera request.</div>}
        </div>
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-sm font-bold">{selected?.name || "No computer selected"}</p><p className="mt-1 text-xs leading-5 text-white/60" aria-live="polite">{status}</p></div>
          <button type="button" onClick={() => void endSession()} disabled={!sessionId} className="shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#071d4f] transition hover:bg-coral hover:text-white disabled:cursor-not-allowed disabled:opacity-40">Stop viewing</button>
        </div>
      </section>
    </div>
  );
}
