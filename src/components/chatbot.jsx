import React, { useState } from "react";
import service from "../appwrite/config";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I can help you book a hospital appointment. Just tell me where, when, and why! Sample: I want to book an appointment at resQmed Hospital tomorrow at 10:30 AM to consult about chest pain.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await parseAndBook(input);
      setMessages((prev) => [...prev, { sender: "bot", text: response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong: " + err.message },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const parseAndBook = async (text) => {
    const currentUser = await service.getCurrentUser();
    if (!currentUser) throw new Error("Please login to use the chatbot.");

    const hospitalMatch = text.match(/at\s([\w\s]+)/i);
    const dateMatch = text.match(/(tomorrow|today|on\s[\w\s]+\d*)/i);
    const timeMatch = text.match(/at\s(\d{1,2})(:\d{2})?\s?(AM|PM)?/i);
    const descMatch = text.match(/to\s(.+)/i);

    const hospitalName = hospitalMatch ? hospitalMatch[1].trim() : "";
    const description = descMatch ? descMatch[1].trim() : "General checkup";

    let date = new Date();
    if (dateMatch?.[1]?.toLowerCase().includes("tomorrow")) {
      date.setDate(date.getDate() + 1);
    }

    if (timeMatch) {
      const hour = parseInt(timeMatch[1]);
      const minute = timeMatch[2] ? parseInt(timeMatch[2].slice(1)) : 0;
      let finalHour = hour;
      if (timeMatch[3]?.toUpperCase() === "PM" && hour < 12) finalHour += 12;

      date.setHours(finalHour);
      date.setMinutes(minute);
      date.setSeconds(0);
    }

    const isoDate = date.toISOString();
    if (!hospitalName) throw new Error("Could not find hospital name.");
    if (!timeMatch) throw new Error("Could not find time.");

    const data = {
      userId: currentUser.$id,
      hospitalId: "67ef8fb4001a141fc205",
      hospitalName,
      dateTime: isoDate,
      description,
      status: "scheduled",
    };

    const response = await service.createAppointment(data);
    if (!response) throw new Error("Failed to book appointment.");

    return `✅ Your appointment at ${hospitalName} on ${date.toLocaleString()} for "${description}" is scheduled!`;
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="max-w-2xl mx-auto  bg-white mb-[2rem] rounded-2xl shadow-xl p-6 mt-8 flex flex-col h-[80vh]">
        
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        🩺 Smart Appointment Chatbot
      </h2>

      <div className="flex-1 overflow-y-auto space-y-3 px-1">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <div className="flex items-center border rounded-full px-4 py-2 shadow-sm">
          <input
            type="text"
            className="flex-1 outline-none px-2 py-1 text-sm"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="ml-3 bg-blue-600 text-white text-sm px-4 py-1.5 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
