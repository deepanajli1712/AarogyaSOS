import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Stethoscope, Calendar, MapPin, Phone, Heart, Shield, Users, Star, ChevronRight, Zap, Activity, Award } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

// Animated counter hook
const useCounter = (target, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return [count, ref];
};

// Floating particle component
const Particle = ({ style }) => (
  <div
    className="particle"
    style={{
      width: style.size,
      height: style.size,
      left: style.left,
      background: style.color,
      animationDuration: style.duration,
      animationDelay: style.delay,
      opacity: 0.6,
      ...style,
    }}
  />
);

const LandingPage = () => {
  const navigate = useNavigate();
  const [sosClicked, setSosClicked] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const handleSOSClick = useCallback(() => {
    setSosClicked(true);
    setTimeout(() => {
      const isLoggedIn = localStorage.getItem('user');
      navigate(isLoggedIn ? '/sos' : '/login');
      setSosClicked(false);
    }, 800);
  }, [navigate]);

  const particles = Array.from({ length: 15 }, (_, i) => ({
    size: `${Math.random() * 8 + 4}px`,
    left: `${Math.random() * 100}%`,
    color: ['rgba(99,102,241,0.6)', 'rgba(239,68,68,0.5)', 'rgba(16,185,129,0.5)', 'rgba(245,158,11,0.5)'][i % 4],
    duration: `${Math.random() * 10 + 8}s`,
    delay: `${Math.random() * 5}s`,
    animationName: 'particle-float',
  }));

  const features = [
    {
      icon: <AlertTriangle className="h-8 w-8" />,
      title: "Emergency SOS",
      desc: "One-tap emergency dispatch with real-time ambulance tracking and hospital bed availability.",
      color: "from-red-500 to-rose-600",
      bg: "bg-red-50",
      iconBg: "bg-red-100 text-red-600",
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Smart Appointments",
      desc: "Book, manage and track hospital appointments with intelligent scheduling and reminders.",
      color: "from-blue-500 to-indigo-600",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Hospital Locator",
      desc: "Find nearest hospitals, clinics and emergency services with live distance and wait times.",
      color: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Helpers",
      desc: "Nearby verified users can respond to your emergency and earn Aarogya Coins as rewards.",
      color: "from-violet-500 to-purple-600",
      bg: "bg-violet-50",
      iconBg: "bg-violet-100 text-violet-600",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Health Records",
      desc: "Securely store and share your medical reports, prescriptions and health history.",
      color: "from-amber-500 to-orange-600",
      bg: "bg-amber-50",
      iconBg: "bg-amber-100 text-amber-600",
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: "Health Dashboard",
      desc: "Comprehensive health tracking with AI-powered insights and personalized recommendations.",
      color: "from-pink-500 to-fuchsia-600",
      bg: "bg-pink-50",
      iconBg: "bg-pink-100 text-pink-600",
    },
  ];

  const stats = [
    { label: "Lives Saved", value: 12847, suffix: "+" },
    { label: "Hospitals Connected", value: 3200, suffix: "+" },
    { label: "Active Users", value: 89000, suffix: "+" },
    { label: "Response Time", value: 4, suffix: " min avg" },
  ];

  const testimonials = [
    { name: "Priya Sharma", role: "Patient", text: "Aarogya SOS saved my father's life. The ambulance arrived in under 5 minutes!", avatar: "PS", color: "bg-blue-500" },
    { name: "Dr. Rahul Verma", role: "Cardiologist", text: "As a doctor, I recommend Aarogya SOS to all my patients. It's a game-changer.", avatar: "RV", color: "bg-emerald-500" },
    { name: "Amit Kumar", role: "Community Helper", text: "I've earned 2000 Aarogya Coins helping neighbors. It feels amazing to save lives!", avatar: "AK", color: "bg-violet-500" },
    { name: "Sunita Patel", role: "Patient", text: "Booking appointments is so easy now. No more long queues at the hospital.", avatar: "SP", color: "bg-rose-500" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const [livesCount, livesRef] = useCounter(12847);
  const [hospitalsCount, hospitalsRef] = useCounter(3200);
  const [usersCount, usersRef] = useCounter(89000);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen mesh-gradient flex items-center justify-center overflow-hidden">
        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p, i) => <Particle key={i} style={p} />)}
        </div>



        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 animate-slide-up">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium">Emergency Services Active 24/7</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Emergency Care
            <span className="block mt-2 bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              At Your Fingertips
            </span>
          </h1>

          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Aarogya SOS connects you instantly to emergency services, nearby hospitals, and a community of helpers — all in one tap.
          </p>

          {/* SOS Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={handleSOSClick}
              className={`sos-btn relative px-10 py-5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl text-xl font-bold shadow-2xl transition-all duration-300 ${sosClicked ? 'scale-95' : 'hover:scale-105 animate-glow-pulse'}`}
              id="sos-button"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className={`h-7 w-7 ${sosClicked ? 'animate-spin' : 'animate-pulse'}`} />
                <span>Emergency SOS</span>
              </div>
            </button>

            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-5 glass text-white rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Get Started Free <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Quick stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.5s' }}>
            {[
              { value: '< 5 min', label: 'Response Time' },
              { value: '3200+', label: 'Hospitals' },
              { value: '24/7', label: 'Support' },
            ].map((s, i) => (
              <div key={i} className="glass rounded-xl p-3 text-center">
                <div className="text-white font-bold text-lg">{s.value}</div>
                <div className="text-white/60 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-gentle">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center" ref={livesRef}>
              <div className="text-4xl md:text-5xl font-black text-red-600 mb-2 animate-counter-up">
                {livesCount.toLocaleString()}+
              </div>
              <div className="text-gray-500 font-medium">Lives Saved</div>
            </div>
            <div className="text-center" ref={hospitalsRef}>
              <div className="text-4xl md:text-5xl font-black text-blue-600 mb-2">
                {hospitalsCount.toLocaleString()}+
              </div>
              <div className="text-gray-500 font-medium">Hospitals Connected</div>
            </div>
            <div className="text-center" ref={usersRef}>
              <div className="text-4xl md:text-5xl font-black text-emerald-600 mb-2">
                {usersCount.toLocaleString()}+
              </div>
              <div className="text-gray-500 font-medium">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-violet-600 mb-2">4 min</div>
              <div className="text-gray-500 font-medium">Avg Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">Everything You Need</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Complete Healthcare
              <span className="block gradient-text">Ecosystem</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">From emergency response to routine appointments — Aarogya SOS covers your entire healthcare journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="tilt-card bg-white rounded-2xl p-6 border border-gray-100 shadow-sm cursor-pointer group"
              >
                <div className={`w-14 h-14 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                <div className={`mt-4 h-1 w-12 rounded-full bg-gradient-to-r ${feature.color} group-hover:w-full transition-all duration-500`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMMUNITY HELPER SECTION ===== */}
      <section className="py-24 bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-violet-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-violet-500/30 text-violet-300 rounded-full text-sm font-semibold mb-6 border border-violet-500/30">
                🆕 New Feature
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Community
                <span className="block bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                  Helper Network
                </span>
              </h2>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                Nearby Aarogya SOS users get notified when someone needs emergency help. Respond, assist, and earn <strong className="text-yellow-400">Aarogya Coins</strong> — redeemable for free appointments!
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: '📍', text: 'Get notified of emergencies within 2km radius' },
                  { icon: '🚗', text: 'Accept requests and ride to help patients' },
                  { icon: '🪙', text: 'Earn ResQ Coins for every successful assist' },
                  { icon: '🎁', text: 'Redeem coins for free hospital appointments' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/80">
                    <span className="text-2xl">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/helping-points')}
                className="px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-bold hover:from-violet-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <Award className="h-5 w-5" />
                Join as Helper
              </button>
            </div>

            {/* Animated helper card mockup */}
            <div className="relative">
              <div className="glass rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg">🚨 Nearby Help Request</h3>
                  <span className="px-2 py-1 bg-red-500/30 text-red-300 rounded-full text-xs font-semibold animate-pulse">URGENT</span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">RK</div>
                    <div>
                      <div className="text-white font-semibold">Rajesh Kumar</div>
                      <div className="text-white/60 text-sm">Chest pain, needs immediate help</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <MapPin className="h-4 w-4 text-green-400" />
                    <span>1.2 km away • Sector 15, Noida</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition flex items-center justify-center gap-2">
                    <Heart className="h-4 w-4" /> Accept (+50 🪙)
                  </button>
                  <button className="px-4 py-2.5 bg-white/10 text-white/70 rounded-xl hover:bg-white/20 transition">
                    Skip
                  </button>
                </div>
              </div>

              {/* Coin reward popup */}
              <div className="absolute -top-4 -right-4 glass rounded-xl px-4 py-2 border border-yellow-400/30 animate-bounce-gentle">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🪙</span>
                  <div>
                    <div className="text-yellow-400 font-bold text-sm">+50 Coins</div>
                    <div className="text-white/60 text-xs">Reward earned!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AR/VR SECTION ===== */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-semibold mb-6 border border-cyan-500/30">
            🥽 Immersive Technology
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            AR & VR
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Healthcare Experience
            </span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-16">
            The future of healthcare is immersive. Aarogya SOS brings cutting-edge AR and VR experiences to your medical journey.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* AR Card */}
            <div className="group relative bg-gradient-to-br from-cyan-900/50 to-blue-900/50 rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-500 text-left overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">📱</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">AR Hospital Finder</h3>
                <p className="text-white/60 mb-6 leading-relaxed">
                  Point your phone camera and see nearby hospitals overlaid in augmented reality. Get real-time directions, bed availability, and wait times — all in your camera view.
                </p>
                <div className="space-y-2">
                  {['Real-time hospital overlay', 'Distance & ETA display', 'Bed availability markers', 'One-tap navigation'].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-cyan-300 text-sm">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                      {f}
                    </div>
                  ))}
                </div>
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-semibold border border-cyan-500/30">
                  <Zap className="h-4 w-4" /> Coming Soon
                </div>
              </div>
            </div>

            {/* VR Card */}
            <div className="group relative bg-gradient-to-br from-violet-900/50 to-purple-900/50 rounded-2xl p-8 border border-violet-500/20 hover:border-violet-500/50 transition-all duration-500 text-left overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-violet-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🥽</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">VR Health Consultation</h3>
                <p className="text-white/60 mb-6 leading-relaxed">
                  Meet your doctor in a virtual consultation room. Experience immersive telemedicine with 3D body scans, virtual examination tools, and real-time health monitoring.
                </p>
                <div className="space-y-2">
                  {['Virtual doctor consultations', '3D body scan visualization', 'Immersive therapy sessions', 'Remote patient monitoring'].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-violet-300 text-sm">
                      <div className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                      {f}
                    </div>
                  ))}
                </div>
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-violet-500/20 text-violet-400 rounded-lg text-sm font-semibold border border-violet-500/30">
                  <Zap className="h-4 w-4" /> Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold mb-6">
            ⭐ Trusted by Thousands
          </span>
          <h2 className="text-4xl font-black text-gray-900 mb-12">What Our Users Say</h2>

          <div className="relative">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`transition-all duration-500 ${i === activeTestimonial ? 'opacity-100 translate-y-0' : 'opacity-0 absolute inset-0 translate-y-4'}`}
              >
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 shadow-lg max-w-2xl mx-auto">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">"{t.text}"</p>
                  <div className="flex items-center justify-center gap-3">
                    <div className={`w-12 h-12 ${t.color} rounded-full flex items-center justify-center text-white font-bold`}>{t.avatar}</div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900">{t.name}</div>
                      <div className="text-gray-500 text-sm">{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === activeTestimonial ? 'bg-blue-600 w-8' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 animate-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Save Lives?
          </h2>
          <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto">
            Join 89,000+ users who trust Aarogya SOS for emergency care, appointments, and community health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg text-lg"
            >
              Get Started Free
            </button>
            <button
              onClick={handleSOSClick}
              className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all duration-300 hover:scale-105 text-lg flex items-center justify-center gap-2"
            >
              <Phone className="h-5 w-5" /> Emergency SOS
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">Aarogya SOS</span>
            </div>
            <div className="flex gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
            <p className="text-gray-500 text-sm">© 2025 Aarogya SOS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;