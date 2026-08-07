"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type CameraStatus = "idle" | "requesting" | "live" | "error";

function getCameraErrorMessage(error: unknown) {
  if (!(error instanceof DOMException)) {
    return "The camera could not be started. Please try again.";
  }

  if (error.name === "NotAllowedError") {
    return "Camera access was blocked. Allow camera permission in your browser, then try again.";
  }

  if (error.name === "NotFoundError") {
    return "No camera was found on this device.";
  }

  if (error.name === "NotReadableError") {
    return "Your camera is being used by another application. Close it there and try again.";
  }

  return "The camera could not be started. Please check your browser permissions and try again.";
}

export function CameraFun() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const autoStartedRef = useRef(false);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [message, setMessage] = useState("Your camera is off and your privacy is protected.");

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setStatus("idle");
    setMessage("Camera stopped. Click the button whenever you want to start again.");
  };

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("error");
      setMessage("Camera access is not supported here. Open this page on localhost or a secure HTTPS website.");
      return;
    }

    setStatus("requesting");
    setMessage("Waiting for camera permission…");

    try {
      streamRef.current?.getTracks().forEach((track) => track.stop());

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setStatus("live");
      setMessage("You are live! The video stays on this page and is not uploaded.");
    } catch (error) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStatus("error");
      setMessage(getCameraErrorMessage(error));
    }
  }, []);

  useEffect(() => {
    if (!autoStartedRef.current) {
      autoStartedRef.current = true;
      void startCamera();
    }

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [startCamera]);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[#071d4f]/10 bg-white p-4 shadow-[0_28px_90px_rgba(7,29,79,0.12)] sm:p-6">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[#071d4f]">
        <video
          ref={videoRef}
          muted
          playsInline
          aria-label="Live camera preview"
          className={`size-full scale-x-[-1] object-cover transition-opacity duration-500 ${
            status === "live" ? "opacity-100" : "opacity-0"
          }`}
        />

        {status !== "live" && (
          <div className="absolute inset-0 grid place-items-center p-8 text-center">
            <div>
              <div className="mx-auto grid size-20 place-items-center rounded-full border border-white/20 bg-white/10 text-3xl text-white shadow-inner">
                <span aria-hidden="true">●</span>
              </div>
              <p className="mt-5 text-sm font-semibold text-white/85">
                {status === "requesting" ? "Connecting to your camera…" : "Camera preview"}
              </p>
            </div>
          </div>
        )}

        {status === "live" && (
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/55 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur">
            <span className="size-2 rounded-full bg-coral" aria-hidden="true" />
            Live
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 px-1 pb-1 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={`max-w-md text-sm leading-6 ${status === "error" ? "font-medium text-red-700" : "text-muted"}`}
          aria-live="polite"
        >
          {message}
        </p>

        {status === "live" ? (
          <button
            type="button"
            onClick={stopCamera}
            className="shrink-0 rounded-xl border border-[#071d4f]/20 bg-white px-6 py-3 text-sm font-bold text-[#071d4f] transition hover:border-[#071d4f] hover:bg-[#071d4f] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
          >
            Stop camera
          </button>
        ) : (
          <button
            type="button"
            onClick={startCamera}
            disabled={status === "requesting"}
            className="shrink-0 rounded-xl bg-coral px-7 py-3 text-sm font-bold text-white shadow-lg shadow-coral/20 transition hover:bg-[#071d4f] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-65"
          >
            {status === "requesting" ? "Please wait…" : "Click me"}
          </button>
        )}
      </div>
    </section>
  );
}
