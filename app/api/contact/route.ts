import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const destinationEmails = ["mtsharma1@gmail.com", "info@cunnectit.com"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  description?: unknown;
  website?: unknown;
};

function clean(value: unknown, maximumLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

export async function POST(request: Request) {
  const smtpUser = process.env.GODADDY_SMTP_USER?.trim();
  const smtpPassword = process.env.GODADDY_SMTP_PASSWORD;
  const smtpHost =
    process.env.GODADDY_SMTP_HOST?.trim() || "smtpout.secureserver.net";
  const smtpPort = Number(process.env.GODADDY_SMTP_PORT || "465");
  const smtpSecure =
    process.env.GODADDY_SMTP_SECURE?.toLowerCase() !== "false";
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim() || smtpUser;

  if (!smtpUser || !smtpPassword || !fromEmail || !Number.isInteger(smtpPort)) {
    console.error("Contact form email is not configured with valid GoDaddy SMTP settings.");
    return NextResponse.json(
      { message: "Email delivery is not configured yet. Please contact us directly." },
      { status: 503 },
    );
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ message: "Invalid enquiry data." }, { status: 400 });
  }

  const name = clean(payload.name, 100);
  const email = clean(payload.email, 254).toLowerCase();
  const phone = clean(payload.phone, 40);
  const description = clean(payload.description, 5000);
  const website = clean(payload.website, 200);

  if (website) {
    return NextResponse.json({ message: "Enquiry received." });
  }

  if (name.length < 2 || !emailPattern.test(email) || description.length < 10) {
    return NextResponse.json(
      { message: "Please provide a valid name, email address, and project description." },
      { status: 400 },
    );
  }

  const emailText = [
    "New website project enquiry",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    "",
    "Project requirement:",
    description,
  ].join("\n");

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    requireTLS: !smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  try {
    await transporter.sendMail({
      from: `Cunnectit Website <${fromEmail}>`,
      to: destinationEmails,
      replyTo: email,
      subject: `Project enquiry from ${name}`,
      text: emailText,
    });
  } catch (emailError) {
    console.error(
      "GoDaddy SMTP contact email failed:",
      emailError instanceof Error ? emailError.message : "Unknown SMTP error",
    );
    return NextResponse.json(
      { message: "The enquiry could not be emailed right now. Please try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ message: "Enquiry emailed successfully." });
}
