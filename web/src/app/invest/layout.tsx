import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invest",
};

export default function InvestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
