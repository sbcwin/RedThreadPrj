"use client";

import { useRouter } from "next/navigation";
import { unlockFeature } from "@/lib/featureProgress";

export function StartConversationButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black"
      onClick={() => {
        unlockFeature("chat");
        router.push("/chat");
      }}
    >
      대화 시작하기
    </button>
  );
}

