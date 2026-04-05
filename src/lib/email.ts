import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY?.trim());

const FROM_EMAIL = "The Dream Residence <bookings@thedreamresidencesvg.com>";
const OWNER_EMAIL = "bookings@thedreamresidencesvg.com";

interface BookingEmailData {
  booking_ref: string;
  guest_name: string;
  guest_email: string;
  tier_name: string;
  check_in: string;
  check_out: string;
  nights: number;
  total_price: number; // in cents
  guest_count: number;
  special_requests?: string | null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatCurrency(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

function buildConfirmationHtml(data: BookingEmailData, siteUrl: string) {
  const cancelUrl = `${siteUrl}/booking/cancel?ref=${data.booking_ref}&email=${encodeURIComponent(data.guest_email)}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#FAFAF5;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <div style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#6B3FA0,#8B5FC0);padding:32px 24px;text-align:center;">
        <h1 style="color:#F5C518;margin:0;font-size:28px;font-family:Georgia,serif;">The Dream Residence</h1>
        <p style="color:#ffffff;margin:8px 0 0;font-size:14px;opacity:0.9;">Saint Vincent and the Grenadines</p>
      </div>

      <!-- Content -->
      <div style="padding:32px 24px;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="width:64px;height:64px;background:#d4edda;border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
            <span style="font-size:32px;">&#10003;</span>
          </div>
          <h2 style="color:#1a1a1a;margin:0 0 8px;font-size:24px;">Booking Confirmed!</h2>
          <p style="color:#6B7280;margin:0;font-size:16px;">Thank you for choosing The Dream Residence, ${data.guest_name}.</p>
        </div>

        <!-- Booking Reference -->
        <div style="background:#F5C518;border-radius:12px;padding:16px;text-align:center;margin-bottom:24px;">
          <p style="color:#1a1a1a;margin:0 0 4px;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Booking Reference</p>
          <p style="color:#1a1a1a;margin:0;font-size:28px;font-weight:bold;letter-spacing:2px;">${data.booking_ref}</p>
        </div>

        <!-- Booking Details -->
        <div style="background:#FAFAF5;border-radius:12px;padding:20px;margin-bottom:24px;">
          <h3 style="color:#1a1a1a;margin:0 0 16px;font-size:16px;border-bottom:1px solid #e5e5e5;padding-bottom:12px;">Booking Details</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;color:#6B7280;font-size:14px;">Room Type</td>
              <td style="padding:8px 0;color:#1a1a1a;font-size:14px;font-weight:600;text-align:right;">${data.tier_name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6B7280;font-size:14px;">Check-in</td>
              <td style="padding:8px 0;color:#1a1a1a;font-size:14px;font-weight:600;text-align:right;">${formatDate(data.check_in)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6B7280;font-size:14px;">Check-out</td>
              <td style="padding:8px 0;color:#1a1a1a;font-size:14px;font-weight:600;text-align:right;">${formatDate(data.check_out)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6B7280;font-size:14px;">Nights</td>
              <td style="padding:8px 0;color:#1a1a1a;font-size:14px;font-weight:600;text-align:right;">${data.nights}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6B7280;font-size:14px;">Guests</td>
              <td style="padding:8px 0;color:#1a1a1a;font-size:14px;font-weight:600;text-align:right;">${data.guest_count}</td>
            </tr>
            ${data.special_requests ? `
            <tr>
              <td style="padding:8px 0;color:#6B7280;font-size:14px;" colspan="2">
                <strong>Special Requests:</strong><br>
                <span style="color:#1a1a1a;">${data.special_requests}</span>
              </td>
            </tr>` : ""}
            <tr>
              <td colspan="2" style="padding:16px 0 8px;border-top:2px solid #e5e5e5;">
                <table style="width:100%;">
                  <tr>
                    <td style="color:#1a1a1a;font-size:18px;font-weight:bold;">Total Paid</td>
                    <td style="color:#6B3FA0;font-size:18px;font-weight:bold;text-align:right;">${formatCurrency(data.total_price)} USD</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>

        <!-- Cancellation Policy -->
        <div style="background:#FFF3CD;border-radius:12px;padding:16px;margin-bottom:24px;border:1px solid #FFE69C;">
          <h4 style="color:#856404;margin:0 0 8px;font-size:14px;">Cancellation Policy</h4>
          <ul style="color:#856404;margin:0;padding-left:20px;font-size:13px;line-height:1.6;">
            <li>Free cancellation up to <strong>7 days</strong> before check-in (full refund)</li>
            <li><strong>50% refund</strong> for cancellations 3-7 days before check-in</li>
            <li><strong>No refund</strong> for cancellations within 3 days of check-in</li>
          </ul>
        </div>

        <!-- Cancel Button -->
        <div style="text-align:center;margin-bottom:24px;">
          <a href="${cancelUrl}" style="display:inline-block;padding:12px 32px;background:#ffffff;color:#dc3545;border:2px solid #dc3545;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
            Cancel Booking
          </a>
        </div>

        <!-- Contact Info -->
        <div style="text-align:center;padding:20px;background:#FAFAF5;border-radius:12px;">
          <p style="color:#6B7280;margin:0 0 8px;font-size:14px;">Questions? Contact us:</p>
          <p style="margin:0;font-size:14px;">
            <a href="mailto:bookings@thedreamresidencesvg.com" style="color:#6B3FA0;text-decoration:none;">bookings@thedreamresidencesvg.com</a>
          </p>
          <p style="margin:4px 0 0;font-size:14px;">
            <a href="https://wa.me/17844977361" style="color:#6B3FA0;text-decoration:none;">WhatsApp: +1 (784) 497-7361</a>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#1a1a1a;padding:20px 24px;text-align:center;">
        <p style="color:#9CA3AF;margin:0;font-size:12px;">&copy; ${new Date().getFullYear()} The Dream Residence. All rights reserved.</p>
        <p style="color:#6B7280;margin:8px 0 0;font-size:11px;">Bequia, Saint Vincent and the Grenadines</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  if (!siteUrl.startsWith("http")) siteUrl = `https://${siteUrl}`;
  siteUrl = siteUrl.trim().replace(/\/+$/, "");

  const html = buildConfirmationHtml(data, siteUrl);

  // Send to guest
  const { error: guestError } = await resend.emails.send({
    from: FROM_EMAIL,
    to: data.guest_email,
    subject: `Booking Confirmed - ${data.booking_ref} | The Dream Residence`,
    html,
  });

  if (guestError) {
    console.error("Failed to send guest confirmation email:", guestError);
  }

  // Notify owner
  const { error: ownerError } = await resend.emails.send({
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    subject: `New Booking: ${data.booking_ref} - ${data.guest_name} (${data.tier_name})`,
    html: `
      <h2>New Booking Received</h2>
      <p><strong>Reference:</strong> ${data.booking_ref}</p>
      <p><strong>Guest:</strong> ${data.guest_name} (${data.guest_email})</p>
      <p><strong>Room:</strong> ${data.tier_name}</p>
      <p><strong>Dates:</strong> ${formatDate(data.check_in)} to ${formatDate(data.check_out)} (${data.nights} nights)</p>
      <p><strong>Guests:</strong> ${data.guest_count}</p>
      <p><strong>Total:</strong> ${formatCurrency(data.total_price)} USD</p>
      ${data.special_requests ? `<p><strong>Special Requests:</strong> ${data.special_requests}</p>` : ""}
    `,
  });

  if (ownerError) {
    console.error("Failed to send owner notification email:", ownerError);
  }
}

export async function sendCancellationEmail(data: {
  booking_ref: string;
  guest_name: string;
  guest_email: string;
  tier_name: string;
  check_in: string;
  check_out: string;
  refund_amount: number; // in cents, 0 if no refund
}) {
  const refundText = data.refund_amount > 0
    ? `A refund of <strong>${formatCurrency(data.refund_amount)} USD</strong> will be processed to your original payment method within 5-10 business days.`
    : `Based on our cancellation policy, no refund is applicable for this cancellation.`;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: data.guest_email,
    subject: `Booking Cancelled - ${data.booking_ref} | The Dream Residence`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#FAFAF5;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <div style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <div style="background:linear-gradient(135deg,#6B3FA0,#8B5FC0);padding:32px 24px;text-align:center;">
        <h1 style="color:#F5C518;margin:0;font-size:28px;font-family:Georgia,serif;">The Dream Residence</h1>
      </div>
      <div style="padding:32px 24px;text-align:center;">
        <h2 style="color:#dc3545;margin:0 0 16px;">Booking Cancelled</h2>
        <p style="color:#6B7280;">Your booking <strong>${data.booking_ref}</strong> for <strong>${data.tier_name}</strong> (${formatDate(data.check_in)} - ${formatDate(data.check_out)}) has been cancelled.</p>
        <p style="color:#6B7280;">${refundText}</p>
        <div style="margin-top:24px;padding:16px;background:#FAFAF5;border-radius:12px;">
          <p style="color:#6B7280;margin:0;font-size:14px;">We hope to welcome you another time. Feel free to book again at any time.</p>
          <p style="margin:8px 0 0;font-size:14px;">
            <a href="mailto:bookings@thedreamresidencesvg.com" style="color:#6B3FA0;">bookings@thedreamresidencesvg.com</a> |
            <a href="https://wa.me/17844977361" style="color:#6B3FA0;">WhatsApp</a>
          </p>
        </div>
      </div>
      <div style="background:#1a1a1a;padding:20px 24px;text-align:center;">
        <p style="color:#9CA3AF;margin:0;font-size:12px;">&copy; ${new Date().getFullYear()} The Dream Residence</p>
      </div>
    </div>
  </div>
</body>
</html>`,
  });

  if (error) {
    console.error("Failed to send cancellation email:", error);
  }

  // Notify owner
  await resend.emails.send({
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    subject: `Booking Cancelled: ${data.booking_ref} - ${data.guest_name}`,
    html: `<h2>Booking Cancelled</h2>
      <p><strong>Reference:</strong> ${data.booking_ref}</p>
      <p><strong>Guest:</strong> ${data.guest_name} (${data.guest_email})</p>
      <p><strong>Room:</strong> ${data.tier_name}</p>
      <p><strong>Dates:</strong> ${formatDate(data.check_in)} - ${formatDate(data.check_out)}</p>
      <p><strong>Refund:</strong> ${data.refund_amount > 0 ? formatCurrency(data.refund_amount) + " USD" : "None"}</p>`,
  });
}
