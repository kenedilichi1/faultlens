export function getLevelColor(level: string) {
  switch (level) {
    case "ERROR":
      return "text-red-500";

    case "WARN":
      return "text-yellow-500";

    default:
      return "text-green-500";
  }
}
