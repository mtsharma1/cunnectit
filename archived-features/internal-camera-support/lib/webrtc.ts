export const peerConfiguration: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export function waitForIceGathering(peer: RTCPeerConnection) {
  if (peer.iceGatheringState === "complete") return Promise.resolve();

  return new Promise<void>((resolve) => {
    const timeout = window.setTimeout(finish, 8_000);

    function finish() {
      window.clearTimeout(timeout);
      peer.removeEventListener("icegatheringstatechange", handleChange);
      resolve();
    }

    function handleChange() {
      if (peer.iceGatheringState === "complete") finish();
    }

    peer.addEventListener("icegatheringstatechange", handleChange);
  });
}

export function makeDeviceSecret() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
