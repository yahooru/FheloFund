import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CoFHE demo",
};

export default function PrivacyDemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
