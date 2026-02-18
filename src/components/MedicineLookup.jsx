import React, { useState } from 'react';
import { X } from 'lucide-react';

function MedicineLookup({ onClose }) {
  const [medicine, setMedicine] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMedicineInfo = async () => {
    if (!medicine.trim()) return;
    setLoading(true);
    setInfo('');
  
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAQPRlYLbSxKIAC3T4dMYmsdyFeaEFcUUc`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: `Provide a brief, easy-to-understand description of the medicine '${medicine}'. Use bullet points. Remove asterisks. Remove bold letters.` }]
              }
            ]
          })
        }
      );
  
      const data = await response.json();
      const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No information available.";
      setInfo(outputText);
    } catch (error) {
      console.error("Error fetching medicine info:", error);
      setInfo("Failed to fetch medicine details. Try again.");
    }
  
    setLoading(false);
  };
  
  return (
    <div className="fixed bottom-24 right-6 w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
      <div className="flex justify-between items-center bg-blue-600 p-4">
        <h2 className="text-lg font-semibold text-white">Medicine Information</h2>
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
          aria-label="Close medicine lookup"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-4 max-h-[500px] overflow-y-auto">
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Enter medicine name..."
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            className="p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchMedicineInfo}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {info && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Results</h3>
            <p className="text-gray-700 whitespace-pre-wrap mt-2">{info}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicineLookup;
