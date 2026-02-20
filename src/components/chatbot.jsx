import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Pill, Trash2, AlertCircle, Database } from "lucide-react";

// ─── API CONFIG ───────────────────────────────────────────────────────────────
// 1. OpenFDA  → FREE, no API key needed · https://open.fda.gov/apis/drug/label/
// 2. Gemini   → Your existing key      · https://aistudio.google.com/app/apikey
const GEMINI_KEY = "AIzaSyAQPRlYLbSxKIAC3T4dMYmsdyFeaEFcUUc";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`;
const OPENFDA_URL = "https://api.fda.gov/drug/label.json";

// ─── STEP 1: Fetch real drug data from OpenFDA ────────────────────────────────
async function fetchFromOpenFDA(medicineName) {
  // Search by brand_name first, then generic_name
  const queries = [
    `brand_name:"${medicineName}"`,
    `generic_name:"${medicineName}"`,
    `openfda.brand_name:"${medicineName}"`,
    `openfda.generic_name:"${medicineName}"`,
  ];

  for (const q of queries) {
    try {
      const res = await fetch(
        `${OPENFDA_URL}?search=${encodeURIComponent(q)}&limit=1`
      );
      if (!res.ok) continue;
      const data = await res.json();
      if (data?.results?.length > 0) {
        return data.results[0]; // Return the first drug label result
      }
    } catch {
      continue;
    }
  }
  return null; // Not found in FDA database — will fall back to Gemini-only
}

// ─── STEP 2: Pull relevant fields from OpenFDA label ─────────────────────────
function extractFDAFields(label) {
  const get = (field) => {
    const val = label?.[field];
    return Array.isArray(val) ? val[0] : val || null;
  };
  return {
    brandName: get("openfda")?.brand_name?.[0] || get("openfda")?.generic_name?.[0] || "Unknown",
    genericName: get("openfda")?.generic_name?.[0] || "",
    manufacturer: get("openfda")?.manufacturer_name?.[0] || "",
    drugClass: get("openfda")?.pharm_class_epc?.[0] || "",
    purpose: get("purpose"),
    indications: get("indications_and_usage"),
    dosage: get("dosage_and_administration"),
    warnings: get("warnings") || get("warnings_and_cautions"),
    sideEffects: get("adverse_reactions"),
    contraindications: get("contraindications"),
    interactions: get("drug_interactions"),
    storage: get("storage_and_handling"),
    pregnancy: get("pregnancy"),
  };
}

// ─── STEP 3: Build Gemini prompt with or without FDA data ────────────────────
function buildGeminiPrompt(query, fdaData) {
  if (fdaData) {
    const f = extractFDAFields(fdaData);
    const fdaSummary = `
Drug Name: ${f.brandName} (${f.genericName})
Manufacturer: ${f.manufacturer}
Drug Class: ${f.drugClass}
Purpose: ${f.purpose || "Not specified"}
Indications & Usage: ${f.indications || "Not specified"}
Dosage: ${f.dosage || "Not specified"}
Warnings: ${f.warnings || "Not specified"}
Side Effects: ${f.sideEffects || "Not specified"}
Contraindications: ${f.contraindications || "Not specified"}
Drug Interactions: ${f.interactions || "Not specified"}
Pregnancy: ${f.pregnancy || "Not specified"}
Storage: ${f.storage || "Not specified"}
    `.trim();

    return `You are MediBot, a helpful medical assistant. A user asked: "${query}"

I have fetched real FDA drug label data for this medicine. Use ONLY this data to respond. Translate it into simple, clear English that anyone can understand.

--- OFFICIAL FDA DATA ---
${fdaSummary}
--- END FDA DATA ---

Format your response with these sections (use emoji headers, bullet points with •, NO asterisks or markdown bold):

💊 Medicine Name & Type
📋 What It Is Used For  
📏 How to Use / Dosage
⚠️ Side Effects to Watch For
🚫 Warnings & Who Should Avoid It
💊 Drug Interactions
🏥 When to See a Doctor

Keep each section brief and easy to understand. End with:
"⚠️ Source: U.S. FDA Drug Label Data. Always consult your doctor or pharmacist before taking any medicine."`;
  }

  // Fallback: Gemini knowledge only (no FDA data found)
  return `You are MediBot, a helpful medical assistant for the ResQMed emergency care app.

The user asked: "${query}"

Note: This medicine was not found in the FDA database, so use your general medical knowledge.

Provide clear information with these sections (use emoji headers, bullet points with •, NO asterisks or markdown bold):

💊 Medicine Name & Type
📋 What It Is Used For
📏 How to Use / Dosage
⚠️ Common Side Effects
🚫 Warnings & Precautions
🏥 When to See a Doctor

Keep language simple

End with: "⚠️ This information is based on general medical knowledge (not FDA label data). Always consult your doctor or pharmacist before taking any medicine."`;
}

// ─── STEP 4: Call Gemini with the prompt ─────────────────────────────────────
async function fetchFromGemini(prompt) {
  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 900 },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gemini error ${res.status}`);
  }

  const data = await res.json();
  const blockReason = data?.promptFeedback?.blockReason;
  if (blockReason) throw new Error(`Blocked: ${blockReason}`);

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini.");
  return text;
}

// ─── SUGGESTIONS & INITIAL MESSAGE ───────────────────────────────────────────
const SUGGESTIONS = [
  "Paracetamol",
  "Ibuprofen",
  "Amoxicillin",
  "Omeprazole",
  "Metformin",
  "Aspirin",
];

const INITIAL_MESSAGE = {
  sender: "bot",
  text: `Hello! I'm MediBot — your AI-powered medicine assistant.

I use real FDA drug data + Gemini AI to give you accurate information about any medicine.

Just type a medicine name and I'll explain:
• What it's used for
• How to take it (dosage)
• Side effects & warnings
• Drug interactions
• When to see a doctor

Try typing a medicine name like "Paracetamol" or "Ibuprofen"!`,
  source: null,
};

// ─── CHATBOT COMPONENT ────────────────────────────────────────────────────────
const ChatBot = () => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(""); // shows which API is being called
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (textOverride) => {
    const text = (textOverride || input).trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      // STEP 1: Try OpenFDA
      setLoadingStep("🔍 Searching FDA drug database...");
      const fdaResult = await fetchFromOpenFDA(text);

      // STEP 2: Build prompt (with or without FDA data)
      if (fdaResult) {
        setLoadingStep("✅ FDA data found! Formatting with AI...");
      } else {
        setLoadingStep("ℹ️ Not in FDA database. Using AI knowledge...");
      }

      const prompt = buildGeminiPrompt(text, fdaResult);

      // STEP 3: Call Gemini
      const geminiResponse = await fetchFromGemini(prompt);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: geminiResponse,
          source: fdaResult ? "fda" : "ai",
        },
      ]);
    } catch (err) {
      console.error("MediBot error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `❌ Sorry, something went wrong.\n\nError: ${err.message}\n\nPlease try again.`,
          source: "error",
        },
      ]);
    } finally {
      setLoading(false);
      setLoadingStep("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div
      className="w-full mx-auto mb-0 sm:mb-8 sm:max-w-2xl rounded-none sm:rounded-2xl shadow-none sm:shadow-xl flex flex-col bg-white dark:bg-gray-900 border-0 sm:border border-gray-200 dark:border-gray-700 overflow-hidden"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      {/* ── HEADER ── */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">MediBot</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-blue-200 text-xs">FDA Data</span>
              <span className="text-blue-400 text-xs">+</span>
              <span className="text-blue-200 text-xs">Gemini AI</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-blue-200 text-xs">Online</span>
          </div>
          <button
            onClick={clearChat}
            title="Clear chat"
            className="text-white/70 hover:text-white hover:bg-white/10 transition p-1.5 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── MESSAGES ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50 dark:bg-gray-850">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : ""
              }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.sender === "user"
                ? "bg-blue-600"
                : "bg-gradient-to-br from-indigo-500 to-blue-600"
                }`}
            >
              {msg.sender === "user" ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>

            <div className="flex flex-col gap-1 max-w-[80%]">
              {/* Bubble */}
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-tr-sm"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-sm border border-gray-100 dark:border-gray-700"
                  }`}
              >
                {msg.text}
              </div>

              {/* Source badge */}
              {msg.source === "fda" && (
                <div className="flex items-center gap-1 px-2">
                  <Database className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">
                    Sourced from U.S. FDA Drug Database
                  </span>
                </div>
              )}
              {msg.source === "ai" && (
                <div className="flex items-center gap-1 px-2">
                  <AlertCircle className="w-3 h-3 text-amber-500" />
                  <span className="text-xs text-amber-600 font-medium">
                    AI knowledge (not in FDA database)
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex flex-col gap-2">
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              {loadingStep && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{loadingStep}</span>
              )}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── SUGGESTIONS ── */}
      {showSuggestions && (
        <div className="px-4 py-2 bg-slate-50 dark:bg-gray-850 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
          <p className="text-xs text-gray-400 mb-1.5">Quick search:</p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                disabled={loading}
                className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800 hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                💊 {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── INPUT ── */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full px-4 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Pill className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400"
            placeholder="Medicine name (e.g. Paracetamol)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            autoFocus
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white p-1.5 rounded-full transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-1.5">
          For emergencies, call 112 · Educational purposes only
        </p>
      </div>
    </div>
  );
};

export default ChatBot;
