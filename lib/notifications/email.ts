import nodemailer from "nodemailer";

export interface OrderConfirmationEmailData {
  orderId: string;
  customerName: string;
  email: string;
  items: Array<{ name: string; quantity: number; size?: string }>;
  totalAmount: number;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
}

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

export async function sendOrderConfirmationEmail(
  data: OrderConfirmationEmailData
): Promise<{ sent: boolean; error?: string }> {
  if (!data.email) return { sent: false, error: "No email on order" };

  const transporter = getTransporter();
  if (!transporter) {
    console.log(`[order-confirmation email] SMTP not configured — skipping for ${data.orderId}`);
    return { sent: false, error: "SMTP not configured" };
  }

  const itemsHtml = data.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0;color:#1C1C1A">${i.name}${i.size ? ` (${i.size})` : ""} × ${i.quantity}</td></tr>`
    )
    .join("");

  const trackUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://hardinorganics.com"}/track/${data.orderId}`;

  try {
    await transporter.sendMail({
      from: `"Hardin Organics" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: data.email,
      subject: `Your order is confirmed! 🌿 #${data.orderId}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#F5F0E8;border-radius:16px">
          <h2 style="color:#1C1C1A;margin-bottom:4px">Thank you, ${data.customerName.split(" ")[0]}! 🎉</h2>
          <p style="color:#6B6B6B;line-height:1.6">Your order <strong>#${data.orderId}</strong> is confirmed and being prepared with care.</p>
          <table style="width:100%;margin:16px 0;border-top:1px solid #e5ddd0;border-bottom:1px solid #e5ddd0;padding:8px 0">
            ${itemsHtml}
          </table>
          <p style="color:#1C1C1A;font-weight:700">Total: ₹${data.totalAmount}</p>
          <p style="color:#6B6B6B;font-size:14px;line-height:1.6">Shipping to:<br/>${data.addressLine1}${
            data.addressLine2 ? `, ${data.addressLine2}` : ""
          }<br/>${data.city}, ${data.state} - ${data.pincode}</p>
          <a href="${trackUrl}" style="display:inline-block;background:#A0522D;color:#fff;padding:14px 28px;border-radius:50px;text-decoration:none;font-weight:700;margin-top:20px;font-size:15px">Track Your Order →</a>
          <p style="color:#999;font-size:12px;margin-top:24px">Questions? Just reply to this email or WhatsApp us.</p>
        </div>
      `,
    });
    return { sent: true };
  } catch (err) {
    console.error(`[order-confirmation email] send failed for ${data.orderId}:`, err);
    return { sent: false, error: String(err) };
  }
}
