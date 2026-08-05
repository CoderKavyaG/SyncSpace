export const PRESENCE_PALETTE = [
  "#F56539", // Terracotta Ember
  "#2DD4BF", // Teal Signal
  "#EC4899", // Electric Pink
  "#8B5CF6", // Violet Indigo
  "#F59E0B", // Amber Flame
  "#10B981", // Emerald Tech
  "#3B82F6", // Sky Blue
  "#A855F7", // Purple Pulse
];

/**
 * Deterministically maps any userId string to one of 8 high-contrast presence colors.
 */
export function getUserPresenceColor(userId: string): string {
  if (!userId) return PRESENCE_PALETTE[0];

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % PRESENCE_PALETTE.length;
  return PRESENCE_PALETTE[index];
}
