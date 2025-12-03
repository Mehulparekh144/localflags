import crypto from "crypto";

function hashFlagToPercentage({
  flagName,
  userId,
}: {
  flagName: string;
  userId: string;
}): number {
  const combined = `${flagName}:${userId}`;
  const hash = crypto.createHash("sha256").update(combined).digest("hex");
  const percentage = parseInt(hash.slice(0, 8), 16) % 100;
  return percentage;
}
/**
 * Evaluates a feature flag for a user
 * @param flag Takes in a feature flag object defined in the database
 * @param userIdentifier Takes in a user identifier. e.g. id, email or username. This is to check if that user is part of the feature flag
 * @param userConditions Takes in a user conditions. e.g. { role: "admin" } to check if that user has the admin role. Make sure it's an object
 * @returns Returns a boolean
 */
export function evaluateFlag({
  flag,
  userIdentifier,
  userConditions,
}: {
  flag: any;
  userIdentifier: string;
  userConditions: Record<string, any> | null;
}) {
  if (!flag || !flag.enabled) return false;

  if (flag.users && Array.isArray(flag.users)) {
    return flag.users.includes(userIdentifier);
  }

  const conditions = flag.conditions || {};
  for (const key in conditions) {
    if (userConditions && userConditions[key] !== conditions[key]) return false;
  }

  if (
    typeof flag.rolloutPercentage === "number" &&
    flag.rolloutPercentage > 0
  ) {
    const percentage = hashFlagToPercentage({
      flagName: flag.name,
      userId: userIdentifier,
    });
    return percentage < flag.rolloutPercentage;
  }

  return true;
}
