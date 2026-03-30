"use client";

import { getFundAddress } from "@/lib/env";

/** Client hook — NEXT_PUBLIC_FUND_ADDRESS is inlined at build time. */
export function useFundAddress(): `0x${string}` | undefined {
  return getFundAddress();
}
