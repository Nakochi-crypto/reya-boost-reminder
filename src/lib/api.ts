import { z } from 'zod';

const RenaApiResponseSchema = z.object({
  bodyId: z.string(),
  status: z.enum(['lockedIn', 'expired', 'notStarted']),
  boostRate: z.number(),
  nextBoostStartTimestampMilliseconds: z.number(),
});

type RenaApiResponse = z.infer<typeof RenaApiResponseSchema>;

export async function fetchExpiration(
  address: string,
): Promise<RenaApiResponse> {
  const url = `https://api.reya.xyz/api/xp/user-game-status/${address}`;
  const res = await fetch(url);
  const json = await res.json();
  return RenaApiResponseSchema.parse(json);
}
