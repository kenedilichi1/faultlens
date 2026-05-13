export function generateFingerprint(
  serviceName: string,
  message: string,
): string {
  const normalizedMessage = message.toLowerCase().trim().replace(/\d+/g, '');

  return `${serviceName}:${normalizedMessage}`;
}
