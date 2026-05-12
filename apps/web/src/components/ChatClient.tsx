"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CHAT_TEST_RAG_CONTEXT, CHAT_TEST_SYSTEM_PROMPT } from "@/lib/chatTestConfig";

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

type ApiMessage = {
  role: "user" | "assistant";
  content: string;
};

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function toApiMessages(messages: ChatMessage[]): ApiMessage[] {
  return messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role, content: m.content }));
}

export function ChatClient() {
  const [timeline, setTimeline] = useState<ChatMessage[]>([]);
  const timelineRef = useRef<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [retryAfterSeconds, setRetryAfterSeconds] = useState<number | null>(null);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const didAutoStartRef = useRef(false);

  const bootMessage = useMemo<ChatMessage>(
    () => ({
      id: uid(),
      role: "system",
      content:
        "대화 모드를 시작합니다. (Gemini 3.1 Flash Lite + RAG 컨텍스트가 서버로 전달됩니다)"
    }),
    []
  );

  useEffect(() => {
    setTimeline([bootMessage]);
  }, [bootMessage]);

  useEffect(() => {
    timelineRef.current = timeline;
  }, [timeline]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [timeline.length]);

  useEffect(() => {
    if (didAutoStartRef.current) return;
    didAutoStartRef.current = true;

    const start = async () => {
      // Prevent repeated auto-start calls on refresh/navigation within the same tab session
      if (typeof window !== "undefined") {
        const already = window.sessionStorage.getItem("rt:chatAutoStarted:v1");
        if (already === "1") return;
        window.sessionStorage.setItem("rt:chatAutoStarted:v1", "1");
      }

      setBusy(true);
      setRetryAfterSeconds(null);
      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        content: "대화를 시작할게. 지금부터 테스트 모드로 진행해줘."
      };
      setTimeline((prev) => [...prev, userMsg]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            systemPrompt: CHAT_TEST_SYSTEM_PROMPT,
            ragContext: CHAT_TEST_RAG_CONTEXT,
            messages: toApiMessages([...timelineRef.current, userMsg])
          })
        });

        const data = (await res.json()) as {
          text?: string;
          model?: string;
          error?: string;
          retryAfterSeconds?: number | null;
        };
        if (!res.ok) {
          if (res.status === 429) {
            setRetryAfterSeconds(data.retryAfterSeconds ?? null);
          }
          throw new Error(data.error ?? `HTTP ${res.status}`);
        }

        if (data.model) setActiveModel(data.model);

        setTimeline((prev) => [
          ...prev,
          { id: uid(), role: "assistant", content: data.text ?? "" }
        ]);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        setTimeline((prev) => [
          ...prev,
          { id: uid(), role: "system", content: `오류: ${message}` }
        ]);
      } finally {
        setBusy(false);
      }
    };

    void start();
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;

    const userMsg: ChatMessage = { id: uid(), role: "user", content: text };
    setInput("");
    setBusy(true);
    setRetryAfterSeconds(null);

    setTimeline((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          systemPrompt: CHAT_TEST_SYSTEM_PROMPT,
          ragContext: CHAT_TEST_RAG_CONTEXT,
          messages: toApiMessages([...timelineRef.current, userMsg])
        })
      });

      const data = (await res.json()) as {
        text?: string;
        model?: string;
        error?: string;
        retryAfterSeconds?: number | null;
      };
      if (!res.ok) {
        if (res.status === 429) {
          setRetryAfterSeconds(data.retryAfterSeconds ?? null);
        }
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      if (data.model) setActiveModel(data.model);

      const assistantMsg: ChatMessage = {
        id: uid(),
        role: "assistant",
        content: data.text ?? ""
      };
      setTimeline((prev) => [...prev, assistantMsg]);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setTimeline((prev) => [
        ...prev,
        { id: uid(), role: "system", content: `오류: ${message}` }
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-24 pt-10">
      <div className="mb-3 w-full text-left">
        <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
          Google API · 연결 모델
        </p>
        <p className="mt-0.5 font-mono text-sm font-semibold text-zinc-900">
          {activeModel ?? "확인 중…"}
        </p>
      </div>

      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Chat</h1>
        <p className="mt-2 text-sm text-zinc-600">
          테스트 모드: 진입 시 프롬프트+RAG 컨텍스트로 세션을 구성하고, 전송 시
          Gemini API 호출 결과를 타임라인에 표시합니다. (실제 사용 모델은 상단
          표시)
        </p>
      </header>

      {retryAfterSeconds ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">요청이 제한되었습니다(429)</p>
          <p className="mt-1">
            약 <b>{retryAfterSeconds}</b>초 후에 다시 시도해보세요.
          </p>
          <button
            type="button"
            className="mt-3 rounded-xl bg-amber-900 px-3 py-2 text-xs font-semibold text-white"
            onClick={() => window.location.reload()}
          >
            새로고침 후 재시도
          </button>
        </div>
      ) : null}

      <div className="mt-6 flex-1 overflow-auto rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="space-y-3">
          {timeline.map((m) => (
            <div key={m.id} className={m.role === "user" ? "text-right" : ""}>
              <div
                className={[
                  "inline-block max-w-[90%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-6",
                  m.role === "user"
                    ? "bg-zinc-900 text-white"
                    : m.role === "assistant"
                      ? "bg-zinc-100 text-zinc-900"
                      : "bg-amber-50 text-amber-900 border border-amber-200"
                ].join(" ")}
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void send();
          }}
          className="flex-1 rounded-xl border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-zinc-400"
          placeholder="메시지를 입력하세요..."
          disabled={busy}
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={busy || input.trim().length === 0}
          className="rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-40"
        >
          {busy ? "전송중" : "전송"}
        </button>
      </div>

      <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600">
        <p className="font-semibold text-zinc-800">환경변수</p>
        <p className="mt-1">
          서버에서 Gemini 호출을 위해 <code>GEMINI_API_KEY</code>가 필요합니다.
          <br />
          예: <code>apps/web/.env.local</code>에{" "}
          <code>GEMINI_API_KEY=...</code>
        </p>
      </div>
    </main>
  );
}

