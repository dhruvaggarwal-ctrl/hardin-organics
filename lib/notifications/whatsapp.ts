export interface OrderConfirmationWhatsAppData {
  orderId: string;
  customerName: string;
  mobile: string; // 10-digit Indian mobile, no country code
}

// Sends the approved "order_confirmation" template via Meta's WhatsApp Cloud API.
// A template is required (not a free-form message) because this is a business-initiated
// conversation — the customer hasn't messaged us first on WhatsApp.
export async function sendOrderConfirmationWhatsApp(
  data: OrderConfirmationWhatsAppData
): Promise<{ sent: boolean; error?: string }> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_ORDER_TEMPLATE_NAME || "order_confirmation";

  if (!token || !phoneNumberId) {
    console.log(`[order-confirmation WA] Not configured — skipping for ${data.orderId}`);
    return { sent: false, error: "WhatsApp not configured" };
  }

  const to = `91${data.mobile}`;

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", parameter_name: "customer_name", text: data.customerName.split(" ")[0] },
                { type: "text", parameter_name: "order_id", text: data.orderId },
              ],
            },
          ],
        },
      }),
      signal: AbortSignal.timeout(10000),
    });

    const json = await res.json();
    if (!res.ok) {
      console.error(`[order-confirmation WA] send failed for ${data.orderId}:`, json);
      return { sent: false, error: JSON.stringify(json?.error || json) };
    }
    return { sent: true };
  } catch (err) {
    console.error(`[order-confirmation WA] exception for ${data.orderId}:`, err);
    return { sent: false, error: String(err) };
  }
}
