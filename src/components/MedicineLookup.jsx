import React, { useState, useRef } from 'react';
import { X, Search, Pill, Database, AlertCircle } from 'lucide-react';

// ─── API CONFIG ───────────────────────────────────────────────────────────────
// OpenFDA  → FREE, no API key · https://open.fda.gov/apis/drug/label/
// Gemini   → Your key below  · https://aistudio.google.com/app/apikey
const GEMINI_KEY = "AIzaSyAQPRlYLbSxKIAC3T4dMYmsdyFeaEFcUUc";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`;
const OPENFDA_URL = "https://api.fda.gov/drug/label.json";

// ─── STEP 1: Fetch from OpenFDA ───────────────────────────────────────────────
async function fetchFromOpenFDA(name) {
  const queries = [
    `brand_name:"${name}"`,
    `generic_name:"${name}"`,
    `openfda.brand_name:"${name}"`,
    `openfda.generic_name:"${name}"`,
  ];
  for (const q of queries) {
    try {
      const res = await fetch(`${OPENFDA_URL}?search=${encodeURIComponent(q)}&limit=1`);
      if (!res.ok) continue;
      const data = await res.json();
      if (data?.results?.length > 0) return data.results[0];
    } catch { continue; }
  }
  return null;
}

// ─── STEP 2: Extract relevant FDA fields ─────────────────────────────────────
function extractFDAFields(label) {
  const get = (f) => { const v = label?.[f]; return Array.isArray(v) ? v[0] : v || null; };
  return {
    brandName: get("openfda")?.brand_name?.[0] || get("openfda")?.generic_name?.[0] || "Unknown",
    genericName: get("openfda")?.generic_name?.[0] || "",
    drugClass: get("openfda")?.pharm_class_epc?.[0] || "",
    purpose: get("purpose"),
    indications: get("indications_and_usage"),
    dosage: get("dosage_and_administration"),
    warnings: get("warnings") || get("warnings_and_cautions"),
    sideEffects: get("adverse_reactions"),
    contraindications: get("contraindications"),
    interactions: get("drug_interactions"),
    pregnancy: get("pregnancy"),
  };
}

// ─── STEP 3: Build Gemini prompt ─────────────────────────────────────────────
function buildPrompt(query, fdaData) {
  if (fdaData) {
    const f = extractFDAFields(fdaData);
    return `You are MediBot. A user asked about "${query}".

Use ONLY the FDA data below. Translate it into simple clear English.

--- FDA DATA ---
Drug: ${f.brandName} (${f.genericName})
Class: ${f.drugClass}
Purpose: ${f.purpose || "N/A"}
Indications: ${f.indications || "N/A"}
Dosage: ${f.dosage || "N/A"}
Warnings: ${f.warnings || "N/A"}
Side effects: ${f.sideEffects || "N/A"}
Contraindications: ${f.contraindications || "N/A"}
Interactions: ${f.interactions || "N/A"}
Pregnancy: ${f.pregnancy || "N/A"}
--- END ---

Use these sections with emoji headers and bullet points (•). No asterisks or bold:
💊 Name & Type · 📋 Uses · 📏 Dosage · ⚠️ Side Effects · 🚫 Warnings · 💊 Interactions · 🏥 When to See a Doctor

End with: "⚠️ Source: U.S. FDA Drug Label. Always consult your doctor before taking any medicine."`;
  }

  return `You are MediBot. The user asked about "${query}". This medicine was not found in the FDA database. Use general medical knowledge.

Sections (emoji headers, bullet points with •, no asterisks or bold):
💊 Name & Type · 📋 Uses · 📏 Dosage · ⚠️ Side Effects · 🚫 Warnings · 🏥 When to See a Doctor

End with: "⚠️ Based on general medical knowledge (not FDA data). Always consult your doctor before taking any medicine."`;
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
function MedicineLookup({ onClose }) {
  const [medicine, setMedicine] = useState('');
  const [result, setResult] = useState(null); // { text, source }
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const inputRef = useRef(null);

  const search = async () => {
    const query = medicine.trim();
    if (!query) return;
    setLoading(true);
    setResult(null);
    setError('');

    try {
      // Step 1: OpenFDA
      setLoadingStep('🔍 Searching FDA drug database...');
      const fdaData = await fetchFromOpenFDA(query);

      // Step 2: Gemini
      setLoadingStep(fdaData ? '✅ FDA data found! Formatting...' : 'ℹ️ Using AI knowledge...');
      const prompt = buildPrompt(query, fdaData);

      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
        }),
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.error?.message || `Gemini error ${res.status}`);
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty response from AI.');

      setResult({ text, source: fdaData ? 'fda' : 'ai' });
    } catch (err) {
      console.error(err);
      setError(`❌ ${err.message}`);
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') search(); };

  return (
    <div className="fixed bottom-20 right-3 sm:right-6 w-[calc(100vw-1.5rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
      {/* Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-700 p-4">
        <div className="flex items-center gap-2">
          <Pill className="w-5 h-5 text-white" />
          <div>
            <h2 className="text-base font-bold text-white leading-tight">Medicine Information</h2>
            <p className="text-blue-200 text-xs">FDA Data + Gemini AI</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white transition p-1 rounded-lg hover:bg-white/10">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 max-h-[500px] overflow-y-auto">
        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter medicine name..."
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 p-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={search}
            disabled={loading || !medicine.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-2 rounded-xl transition"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-6 gap-2">
            <div className="w-7 h-7 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-xs text-gray-500">{loadingStep}</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div>
            {/* Source badge */}
            <div className="flex items-center gap-1.5 mb-2">
              {result.source === 'fda' ? (
                <>
                  <Database className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs text-green-600 font-semibold">U.S. FDA Drug Database</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs text-amber-600 font-semibold">AI Knowledge (not in FDA database)</span>
                </>
              )}
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
              <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{result.text}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && !error && (
          <div className="text-center py-6 text-gray-400">
            <Pill className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Enter a medicine name and press Search</p>
            <p className="text-xs mt-1 text-gray-300">Powered by FDA + Gemini AI</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicineLookup;
