import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Read webhook payload
    const payload = await request.json();

    console.log("Webhook received:", payload);

    // Example: identify the webhook event
    const eventType = request.headers.get("x-event-type");

    switch (eventType) {
      case "order.created":
        console.log("New order:", payload);
        break;

      case "payment.completed":
        console.log("Payment completed:", payload);
        break;

      default:
        console.log("Unknown webhook event:", eventType);
    }

    // Webhook providers usually expect a quick 200 response
    return NextResponse.json(
      {
        success: true,
        message: "Webhook received successfully",
        refresh_token: "mytoken"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Invalid webhook request",
      },
      { status: 400 }
    );
  }
}