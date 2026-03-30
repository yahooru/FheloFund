import { z } from "zod";
import { isAddress } from "viem";

const envSchema = z.object({
  NEXT_PUBLIC_SEPOLIA_RPC_URL: z.string().optional(),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_FUND_ADDRESS: z
    .string()
    .optional()
    .refine((v) => !v?.trim() || isAddress(v.trim()), "Invalid fund address"),
});

export type PublicEnv = z.infer<typeof envSchema>;

/** Safe parse — never throw in production UI */
export function getPublicEnv(): PublicEnv | null {
  const r = envSchema.safeParse({
    NEXT_PUBLIC_SEPOLIA_RPC_URL: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_FUND_ADDRESS: process.env.NEXT_PUBLIC_FUND_ADDRESS,
  });
  return r.success ? r.data : null;
}

export function getFundAddress(): `0x${string}` | undefined {
  const v = process.env.NEXT_PUBLIC_FUND_ADDRESS?.trim();
  if (!v || !isAddress(v)) return undefined;
  return v as `0x${string}`;
}
