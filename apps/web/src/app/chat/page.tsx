export default function ChatPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-24 pt-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Chat</h1>
        <p className="mt-2 text-sm text-zinc-600">
          여기서부터 “대화”가 시작되는 느낌을 확장할 수 있어요. (현재는 골격만)
        </p>
      </header>

      <div className="mt-6 flex-1 rounded-2xl border border-zinc-200 bg-white p-4">
        <p className="text-sm text-zinc-500">Conversation timeline (placeholder)</p>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 rounded-xl border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-zinc-400"
          placeholder="메시지를 입력하세요..."
        />
        <button
          type="button"
          className="rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white"
        >
          전송
        </button>
      </div>
    </main>
  );
}

