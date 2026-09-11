export const PAYMENT_CONFIG = {
  UPI_ID: "9586030292-2@ybl",
  PAYEE_NAME: "Tween Hook's Enterprise",
  WHATSAPP_NUMBER: "919586030292", // India E.164 format
  DEFAULT_MESSAGE: "Hi! I'm interested in custom crochet products from Crochet Shop."
};

export function createWhatsAppUrl(message: string) {
  return `https://wa.me/${PAYMENT_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function createUpiPaymentUrl(amount: number, note = "TwinHooks order") {
  const params = new URLSearchParams({
    pa: PAYMENT_CONFIG.UPI_ID,
    pn: PAYMENT_CONFIG.PAYEE_NAME,
    am: amount.toFixed(2),
    cu: "INR",
    tn: note,
  });

  return `upi://pay?${params.toString()}`;
}
