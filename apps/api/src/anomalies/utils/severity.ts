export function determineSeverity(increasePercentage: number) {
  if (increasePercentage >= 500) {
    return 'CRITICAL';
  }

  if (increasePercentage >= 250) {
    return 'HIGH';
  }

  if (increasePercentage >= 100) {
    return 'MEDIUM';
  }

  return 'LOW';
}

export function generateSeverityMessage(severity: string) {
  switch (severity) {
    case 'CRITICAL':
      return 'Critical operational instability detected';

    case 'HIGH':
      return 'Major error spike detected';

    case 'MEDIUM':
      return 'Elevated error activity detected';

    default:
      return 'Minor anomaly detected';
  }
}
