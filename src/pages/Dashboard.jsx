import React, { useState, useEffect } from "react";
import { Calendar, Activity, FileText, MapPin, Bell, Search, AlertTriangle, Heart, Users, ChevronRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [news, setNews] = useState([]);
  const [coins] = useState(320);
  const [showSOSPulse] = useState(true);
  const API_KEY = "de73f4aaaa9143e1a3d2a2fac1206a8a";
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
    setHospitals([
      { name: "AIIMS Delhi", state: "Delhi", beds: 120, doctors: 200, distance: "2.1 km", status: "open" },
      { name: "KGMU Lucknow", state: "Uttar Pradesh", beds: 300, doctors: 400, distance: "5.4 km", status: "open" },
      { name: "Apollo Chennai", state: "Tamil Nadu", beds: 150, doctors: 220, distance: "3.8 km", status: "busy" },
    ]);
  }, []);

  const fetchNews = async () => {
    try {
      let response = await fetch(`https://newsapi.org/v2/top-headlines?country=in&q=medical%20schemes&apiKey=${API_KEY}`);
      let data = await response.json();
      if (!data.articles || data.articles.length === 0) {
        response = await fetch(`https://newsapi.org/v2/everything?q=medical%20schemes&language=en&apiKey=${API_KEY}`);
        data = await response.json();
      }
      setNews(data.articles || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const filteredHospitals = hospitals.filter(h =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { name: "Appointments", value: "3", icon: Calendar, emoji: null, color: "from-blue-500 to-indigo-600", bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", link: "/appointments" },
    { name: "Medical Records", value: "12", icon: FileText, emoji: null, color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400", link: "/reports" },
    { name: "Aarogya Coins", value: coins.toLocaleString(), icon: null, emoji: "🪙", color: "from-yellow-400 to-amber-500", bg: "bg-yellow-50 dark:bg-yellow-900/30", text: "text-yellow-600 dark:text-yellow-400", link: "/helping-points" },
    { name: "Nearby Helpers", value: "8", icon: Users, emoji: null, color: "from-violet-500 to-purple-600", bg: "bg-violet-50 dark:bg-violet-900/30", text: "text-violet-600 dark:text-violet-400", link: "/helping-points" },
  ];

  const nearbyRequests = [
    { name: "Rajesh K.", condition: "Chest pain", distance: "1.2 km", reward: 80, urgency: "critical" },
    { name: "Sunita D.", condition: "Diabetic emergency", distance: "0.8 km", reward: 60, urgency: "high" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-black text-gray-900 dark:text-white truncate">Healthcare Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-xs sm:text-sm">{new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-xl px-3 py-2">
              <span className="text-lg">🪙</span>
              <span className="font-bold text-yellow-700 dark:text-yellow-400">{coins}</span>
            </div>
            <button className="relative p-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition shadow-sm">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </div>

        {/* SOS Button */}
        <div className="relative bg-gradient-to-r from-red-600 to-rose-700 rounded-2xl p-6 overflow-hidden shadow-xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-white font-black text-xl sm:text-2xl mb-1">Emergency SOS</h2>
              <p className="text-red-200 text-xs sm:text-sm">Tap to instantly alert emergency services & nearby helpers</p>
            </div>
            <button
              onClick={() => navigate("/sos")}
              className={`sos-btn w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-red-600 rounded-xl font-black text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${showSOSPulse ? 'animate-glow-pulse' : ''}`}
              id="dashboard-sos-btn"
            >
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 animate-pulse" />
              SOS
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => (
            <button
              key={stat.name}
              onClick={() => navigate(stat.link)}
              className="bg-white dark:bg-gray-800 rounded-2xl p-3 sm:p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-left group"
            >
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                {stat.emoji ? (
                  <span className="text-2xl">{stat.emoji}</span>
                ) : (
                  <stat.icon className={`h-6 w-6 ${stat.text}`} />
                )}
              </div>
              <div className={`text-xl sm:text-2xl font-black ${stat.text} mb-1`}>{stat.value}</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium">{stat.name}</div>
              <div className={`mt-2 h-0.5 w-8 rounded-full bg-gradient-to-r ${stat.color} group-hover:w-full transition-all duration-500`} />
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Hospital Search */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-50 dark:border-gray-700">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" /> Nearby Hospitals
              </h2>
            </div>
            <div className="p-4 border-b border-gray-50 dark:border-gray-700">
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-2.5">
                <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search hospitals or states..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent w-full text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-sm"
                />
              </div>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-700">
              {filteredHospitals.map((hospital, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                      <span className="text-lg">🏥</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{hospital.name}</div>
                      <div className="text-gray-400 dark:text-gray-500 text-sm">{hospital.state} • {hospital.distance}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-600 dark:text-blue-400 font-semibold text-sm">{hospital.beds} beds</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${hospital.status === 'open' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400'}`}>
                      {hospital.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4">
              <button
                onClick={() => navigate('/sos')}
                className="w-full py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition text-sm flex items-center justify-center gap-2"
              >
                Find More Hospitals <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Community helper alerts */}
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold flex items-center gap-2">
                  <Users className="h-5 w-5" /> Nearby Requests
                </h2>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{nearbyRequests.length} active</span>
              </div>
              <div className="space-y-3">
                {nearbyRequests.map((req, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{req.name}</span>
                      <span className="text-yellow-400 text-xs font-bold">+{req.reward} 🪙</span>
                    </div>
                    <div className="text-white/70 text-xs">{req.condition} • {req.distance}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/helping-points')}
                className="w-full mt-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
              >
                Help & Earn Coins <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Emergency Alerts */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
              <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-red-500" /> Alerts
              </h2>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0 animate-pulse" />
                  <p className="text-red-700 dark:text-red-400 text-sm">Low blood supply in Delhi hospitals.</p>
                </div>
                <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
                  <p className="text-orange-700 dark:text-orange-400 text-sm">System maintenance tonight at 11 PM.</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
              <h2 className="font-bold text-gray-900 dark:text-white mb-3">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Book Appt', icon: '📅', link: '/appointments', color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
                  { label: 'Reports', icon: '📋', link: '/reports', color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
                  { label: 'Earn Coins', icon: '🪙', link: '/helping-points', color: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
                  { label: 'Find Hospital', icon: '🏥', link: '/sos', color: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
                ].map((a, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(a.link)}
                    className={`${a.color} rounded-xl p-3 text-center font-semibold text-sm hover:opacity-80 transition flex flex-col items-center gap-1`}
                  >
                    <span className="text-xl">{a.icon}</span>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* News Section */}
        {news.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-50 dark:border-gray-700">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" /> Health News
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-50 dark:divide-gray-700">
              {news.slice(0, 4).map((article, i) => (
                <a
                  key={i}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition group block"
                >
                  {article.urlToImage && (
                    <img
                      src={article.urlToImage}
                      alt="news"
                      className="w-full h-32 object-cover rounded-xl mb-3 group-hover:opacity-90 transition"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{article.title}</h3>
                  <span className="text-blue-500 dark:text-blue-400 text-xs mt-2 inline-block">Read more →</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;