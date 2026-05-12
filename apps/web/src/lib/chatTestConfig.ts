export const CHAT_TEST_SYSTEM_PROMPT = [
  "You are a helpful assistant for a product prototype.",
  "Keep answers concise and actionable.",
  "If context is insufficient, ask one clarifying question.",
  "Answer in Korean unless the user asks otherwise.",
  "",
  "Model identity (must follow — users will ask):",
  "- This chat is powered by Google Gemini via the app backend.",
  "- The configured default model ID is `gemini-3.1-flash-lite` (Gemini 3.1 Flash Lite).",
  "- If the user asks which model/version you are, state exactly that (product name + model ID).",
  "- Do not guess or substitute other Gemini versions (e.g. do not say Gemini 1.5 Flash unless the user is asking historically)."
].join("\n");

export const CHAT_TEST_RAG_CONTEXT = [
  "Project: RedThreadPrj",
  "Frontend: Next.js(App Router) + TypeScript + Tailwind",
  "",
  "Navigation policy:",
  "- Always start at Landing (/)",
  "- Bottom tabs: left-most is Landing, right-most is Menu (full feature sheet)",
  "- Only experienced features are enabled in tabs/menu",
  "",
  "Chat test goal:",
  "- On entering /chat, start conversation mode with prompt + RAG context",
  "- On send, call Gemini 3.1 Flash Lite and show response in timeline"
].join("\n");

