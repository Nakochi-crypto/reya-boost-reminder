import { z } from 'zod';

const ReyaApiResponseSchema = z.object({
  bodyId: z.string(),
  status: z.enum(['lockedIn', 'expired', 'notStarted', 'notLockedIn']),
  boostRate: z.number(),
  nextBoostStartTimestampMilliseconds: z.number(),
});

type ReyaApiResponse = z.infer<typeof ReyaApiResponseSchema>;

export async function fetchExpiration(
  address: string,
): Promise<ReyaApiResponse> {
  const url = `https://api.reya.xyz/api/xp/user-game-status/${address}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(await res.text());
  }
  const json = await res.json();
  return ReyaApiResponseSchema.parse(json);
}
