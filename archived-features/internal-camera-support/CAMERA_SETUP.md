# Internal camera dashboard setup

This feature uses the existing `DATABASE_URL` MySQL connection for device presence and WebRTC signaling. Video is peer-to-peer and is not stored in the database.

## Required server variable

Add a private administrator key of at least 16 characters to the local `.env` file and to the live hosting environment:

```env
CAMERA_ADMIN_KEY=Mithu@123
```

Restart or redeploy the website after adding the value. Never expose this key in client code or commit a real value to source control.

## Pages

- `/camera-device` — open on each computer, enter a friendly name, and register it.
- `/camera-admin` — enter the private administrator key to see online computers.

Clicking an online IP address sends a request. The remote user must select **Accept & share** before their browser requests camera permission and starts the camera. Either side can stop the session.

## Network note

The implementation uses peer-to-peer WebRTC with a public STUN server. Most same-network and common internet connections work directly. Networks with strict NAT or firewall rules require a TURN server; add its URL and credentials to `lib/webrtc.ts` when available.
