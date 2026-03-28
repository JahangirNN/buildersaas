export function getWhatsAppLink(phone: string, message: string) {
  // Ensure phone has country code. Default to Indian +91 if not present.
  const formattedPhone = phone.startsWith('+') ? phone.replace('+', '') : `91${phone}`;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}
