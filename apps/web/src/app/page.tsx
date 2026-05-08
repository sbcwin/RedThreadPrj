import Link from "next/link";
import { StartConversationButton } from "@/components/StartConversationButton";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-24 pt-10">
      <div className="flex-1">
        <p className="text-sm font-medium text-zinc-600">Welcome</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          대화를 시작하는 느낌의 랜딩
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-700">
          처음 실행하면 항상 여기서 시작합니다. 아래 탭은 경험한 기능만
          활성화되고, 우측 하단의 전체 메뉴에서 전체 기능을 확인할 수 있어요.
        </p>

        <div className="mt-10 space-y-3">
          <StartConversationButton />
          <Link
            href="/about"
            className="block rounded-xl border border-zinc-200 bg-white px-4 py-3 text-center text-sm font-medium text-zinc-800 hover:bg-zinc-50"
          >
            앱 소개(예시 화면)
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <p className="text-sm font-medium text-zinc-800">Hint</p>
        <p className="mt-1 text-sm text-zinc-600">
          메뉴 잠금 해제는 “경험”으로 처리합니다. 예를 들어 채팅 화면에 한 번
          들어가면 채팅 메뉴가 활성화됩니다.
        </p>
      </div>
    </main>
  );
}

