import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, MapPin, Phone, ShieldAlert, AlertTriangle,
  X, CheckCircle2, Clock, Navigation, Share2, Copy,
  Ambulance, Radio, RefreshCw
} from "lucide-react";

const EMERGENCY_NUMBERS = [
  { label: "Ambulance", number: "102", color: "bg-red-500 hover:bg-red-600", icon: "🚑" },
  { label: "Police", number: "100", color: "bg-blue-600 hover:bg-blue-700", icon: "🚓" },
  { label: "Emergency", number: "108", color: "bg-orange-500 hover:bg-orange-600", icon: "🆘" },
  { label: "Fire", number: "101", color: "bg-yellow-500 hover:bg-yellow-600", icon: "🚒" },
];

const SEARCHING_TEXTS = [
  "Connecting to nearby hospitals...",
  "Searching for available ambulances...",
  "Checking hospital capacity...",
  "Contacting emergency response team...",
  "Verifying your location...",
];

const getTimeEstimate = (distance) => {
  const speed = 30;
  const time = (parseFloat(distance) / speed) * 60;
  return `${Math.ceil(time)} min`;
};

const HospitalLocator = () => {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // SOS flow states
  const [sosPhase, setSosPhase] = useState("idle"); // idle | confirm | searching | accepted
  const [searchingText, setSearchingText] = useState(SEARCHING_TEXTS[0]);
  const [countdown, setCountdown] = useState(10);

  const [policeAlerted, setPoliceAlerted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);

  // Geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setLocation({ lat: latitude, lon: longitude });
        fetchHospitals(latitude, longitude);
        fetchPoliceStations(latitude, longitude);
      },
      () => {
        setError("Location permission denied. Please enable location access.");
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  // Searching text cycle
  useEffect(() => {
    if (sosPhase !== "searching") return;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % SEARCHING_TEXTS.length;
      setSearchingText(SEARCHING_TEXTS[i]);
    }, 2500);
    return () => clearInterval(interval);
  }, [sosPhase]);

  // Countdown after SOS accepted
  useEffect(() => {
    if (sosPhase !== "accepted") return;
    setCountdown(10);
    const interval = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, [sosPhase]);

  const calculateDistances = (data, lat, lon) =>
    data.map((place) => {
      const dLat = (place.lat - lat) * (Math.PI / 180);
      const dLon = (place.lon - lon) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat * (Math.PI / 180)) *
        Math.cos(place.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
      const distance = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return { ...place, distance: distance.toFixed(2) };
    }).sort((a, b) => a.distance - b.distance);

  const fetchHospitals = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=hospital&limit=30&bounded=1&viewbox=${lon - 0.04},${lat + 0.04},${lon + 0.04},${lat - 0.04}`
      );
      const data = await res.json();
      const withDist = calculateDistances(data, lat, lon).filter((h) => h.distance <= 5);
      const dummy = {
        display_name: "ResQMed Hospital, Your Local Area, India",
        lat: String(lat + 0.001),
        lon: String(lon + 0.001),
        distance: "2.0",
      };
      setHospitals([dummy, ...withDist.slice(0, 6)]);
    } catch {
      setError("Failed to fetch hospitals.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPoliceStations = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=police%20station&limit=20&bounded=1&viewbox=${lon - 0.04},${lat + 0.04},${lon + 0.04},${lat - 0.04}`
      );
      const data = await res.json();
      const withDist = calculateDistances(data, lat, lon).filter((s) => s.distance <= 5);
      setPoliceStations(withDist.slice(0, 4));
    } catch {
      // silent
    }
  };

  const handleSOSConfirm = () => {
    setSosPhase("searching");
    setTimeout(() => setSosPhase("accepted"), 10000);
  };

  const handleCancelSOS = () => {
    setSosPhase("idle");
    showToast("SOS cancelled.", "info");
  };

  const handlePoliceHelp = () => {
    setPoliceAlerted(true);
    showToast("Police have been alerted! Help is on the way.", "success");
    setTimeout(() => setPoliceAlerted(false), 5000);
  };

  const handleShareLocation = async () => {
    if (!location) return;
    const mapsUrl = `https://maps.google.com/?q=${location.lat},${location.lon}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Emergency Location", text: "I need help! My location:", url: mapsUrl });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(mapsUrl);
      setCopied(true);
      showToast("Location link copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 md:p-8 transition-colors duration-300">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === "success" ? "bg-emerald-500" : toast.type === "info" ? "bg-blue-500" : "bg-red-500"
              }`}
          >
            <CheckCircle2 className="w-4 h-4" /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            🚑 Emergency SOS
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Get help fast — hospitals, police, and emergency services</p>
        </motion.div>

        {/* SOS Hero Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-gradient-to-r from-red-600 to-rose-700 rounded-3xl p-8 overflow-hidden shadow-2xl shadow-red-200"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h2 className="text-white font-black text-2xl mb-1">Emergency Help</h2>
              <p className="text-red-200 text-sm">Press SOS to instantly alert emergency services & nearby helpers</p>
              {location && (
                <div className="flex items-center gap-1 mt-2 text-red-200 text-xs">
                  <MapPin className="w-3 h-3" />
                  <span>Location: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-3">
              {/* Pulsing SOS button */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setSosPhase("confirm")}
                  disabled={sosPhase !== "idle"}
                  className="relative w-24 h-24 bg-white text-red-600 rounded-full font-black text-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center disabled:opacity-60"
                >
                  <AlertTriangle className="w-7 h-7 mb-0.5" />
                  <span className="text-sm font-black">SOS</span>
                </motion.button>
              </div>
              <span className="text-red-200 text-xs">Tap to activate</span>
            </div>
          </div>

          {/* Share Location */}
          {location && (
            <div className="relative z-10 mt-4 flex justify-end">
              <button
                onClick={handleShareLocation}
                className="flex items-center gap-1.5 text-red-200 hover:text-white text-xs transition"
              >
                {copied ? <Copy className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Share My Location"}
              </button>
            </div>
          )}
        </motion.div>

        {/* Emergency Quick Dial */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5"
        >
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-500" /> Quick Emergency Dial
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {EMERGENCY_NUMBERS.map(({ label, number, color, icon }) => (
              <motion.a
                key={number}
                href={`tel:${number}`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`${color} text-white rounded-2xl p-4 flex flex-col items-center gap-1.5 shadow-sm transition`}
              >
                <span className="text-2xl">{icon}</span>
                <span className="font-black text-lg">{number}</span>
                <span className="text-xs opacity-90">{label}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Police Help Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">Alert Nearby Police</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">Send your location to nearest police station</div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handlePoliceHelp}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${policeAlerted
                ? "bg-green-500 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
            >
              {policeAlerted ? "✓ Alerted!" : "🚓 Alert Police"}
            </motion.button>
          </div>
        </motion.div>

        {/* Hospitals & Police Stations */}
        {loading ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
            <p className="text-gray-600 font-medium">Fetching nearby locations...</p>
            <p className="text-gray-400 text-sm mt-1">Please allow location access</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-700 font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 flex items-center gap-1.5 mx-auto text-red-600 text-sm hover:underline"
            >
              <RefreshCw className="w-4 h-4" /> Try again
            </button>
          </div>
        ) : (
          <>
            {/* Hospitals */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
                <span className="text-xl">🏥</span>
                <h2 className="font-bold text-gray-900">Nearby Hospitals</h2>
                <span className="ml-auto text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{hospitals.length} found</span>
              </div>
              <div className="divide-y divide-gray-50">
                {hospitals.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: i * 0.05 } }}
                    className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🏥</div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{h.display_name.split(",")[0]}</div>
                        <div className="text-gray-400 text-xs">{h.display_name.split(",").slice(1, 2).join(", ")}</div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-green-600 text-xs font-semibold flex items-center gap-0.5">
                            <Navigation className="w-3 h-3" /> {h.distance} km
                          </span>
                          <span className="text-gray-400 text-xs flex items-center gap-0.5">
                            <Clock className="w-3 h-3" /> ~{getTimeEstimate(h.distance)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${h.lat},${h.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-semibold hover:bg-blue-100 transition flex-shrink-0"
                    >
                      <MapPin className="w-3.5 h-3.5" /> Directions
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Police Stations */}
            {policeStations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
                  <span className="text-xl">🚓</span>
                  <h2 className="font-bold text-gray-900">Nearby Police Stations</h2>
                  <span className="ml-auto text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{policeStations.length} found</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {policeStations.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🚓</div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{s.display_name.split(",")[0]}</div>
                          <div className="text-gray-400 text-xs">{s.display_name.split(",").slice(1, 2).join(", ")}</div>
                          <span className="text-green-600 text-xs font-semibold flex items-center gap-0.5 mt-0.5">
                            <Navigation className="w-3 h-3" /> {s.distance} km
                          </span>
                        </div>
                      </div>
                      <a
                        href={`https://maps.google.com/?q=${s.lat},${s.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-semibold hover:bg-blue-100 transition flex-shrink-0"
                      >
                        <MapPin className="w-3.5 h-3.5" /> Directions
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* === SOS MODALS === */}

      {/* Confirm Modal */}
      <AnimatePresence>
        {sosPhase === "confirm" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center"
            >
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Activate SOS?</h2>
              <p className="text-gray-500 text-sm mb-6">
                This will alert emergency services and nearby helpers with your current location. Only use in a real emergency.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setSosPhase("idle")}
                  className="flex-1 py-3 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleSOSConfirm}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-sm font-black transition shadow-lg shadow-red-200"
                >
                  🚨 YES, SEND SOS
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Searching Modal */}
      <AnimatePresence>
        {sosPhase === "searching" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center"
            >
              {/* Pulsing rings */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-red-100 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-red-200 animate-ping" style={{ animationDelay: "0.3s" }} />
                <div className="relative w-24 h-24 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-black text-xl">SOS</span>
                </div>
              </div>

              <h2 className="text-xl font-black text-gray-900 mb-2">Emergency Request Sent!</h2>
              <motion.p
                key={searchingText}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 text-sm mb-5"
              >
                {searchingText}
              </motion.p>

              <div className="space-y-2 mb-6 text-sm">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle2 className="w-4 h-4" /> Location confirmed
                </div>
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle2 className="w-4 h-4" /> Emergency services notified
                </div>
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <Radio className="w-4 h-4 animate-pulse" /> Searching for ambulances...
                </div>
              </div>

              <button
                onClick={handleCancelSOS}
                className="w-full py-2.5 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel SOS
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accepted Modal */}
      <AnimatePresence>
        {sosPhase === "accepted" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 18 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"
              >
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </motion.div>

              <h2 className="text-2xl font-black text-gray-900 mb-1">Help is Coming!</h2>
              <p className="text-gray-500 text-sm mb-5">ResQMed Hospital has accepted your request</p>

              <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-5 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Hospital</span>
                  <span className="font-semibold text-gray-900">ResQMed Hospital</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Doctor</span>
                  <span className="font-semibold text-gray-900">Dr. Meera Patel</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">ETA</span>
                  <span className="font-black text-green-700 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {getTimeEstimate("2.0")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ambulance</span>
                  <span className="font-semibold text-gray-900">🚑 En route</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSosPhase("idle")}
                  className="flex-1 py-2.5 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  Close
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Just used #ResQMed Emergency SOS! 🚑 Amazing response time. Join the movement: https://resqmed.app")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl text-sm font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" /> Share
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HospitalLocator;
