"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LOTTIE_SRC =
  "https://lottie.host/4c7cda1c-5f79-4dfe-872f-b11a37555fab/wz3B9QHuao.lottie";

export function HomeLottie() {
  return (
    <div className="relative flex w-full justify-center lg:justify-end">
      <div className="absolute inset-0 -z-10 rounded-[2rem] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] blur-2xl" />
      <div className="relative rounded-[2rem] border border-[color-mix(in_srgb,var(--accent)_25%,transparent)] bg-[color-mix(in_srgb,var(--background)_70%,transparent)] p-6 shadow-[0_0_60px_-20px_color-mix(in_srgb,var(--primary)_30%,transparent)]">
        <div className="h-[260px] w-[260px] sm:h-[300px] sm:w-[300px]">
          <DotLottieReact src={LOTTIE_SRC} loop autoplay className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
