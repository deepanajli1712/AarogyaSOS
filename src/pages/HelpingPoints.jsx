import React, { useState, useEffect } from 'react';
import { MapPin, Heart, Award, Coins, Clock, ChevronRight, Star, Trophy, Zap, CheckCircle, X, Users } from 'lucide-react';

// Dummy help requests
const DUMMY_REQUESTS = [
    {
        id: 1,
        name: 'Rajesh Kumar',
        initials: 'RK',
        condition: 'Chest pain, difficulty breathing',
        distance: '1.2 km',
        time: '2 min ago',
        urgency: 'critical',
        reward: 80,
        location: 'Sector 15, Noida',
        color: 'from-blue-500 to-blue-700',
    },
    {
        id: 2,
        name: 'Sunita Devi',
        initials: 'SD',
        condition: 'Diabetic emergency, needs insulin',
        distance: '0.8 km',
        time: '5 min ago',
        urgency: 'high',
        reward: 60,
        location: 'Green Park, Delhi',
        color: 'from-rose-500 to-rose-700',
    },
    {
        id: 3,
        name: 'Mohan Lal',
        initials: 'ML',
        condition: 'Elderly, fell down, needs assistance',
        distance: '1.8 km',
        time: '8 min ago',
        urgency: 'medium',
        reward: 40,
        location: 'Rajouri Garden, Delhi',
        color: 'from-amber-500 to-amber-700',
    },
    {
        id: 4,
        name: 'Priya Singh',
        initials: 'PS',
        condition: 'Allergic reaction, needs antihistamine',
        distance: '2.1 km',
        time: '12 min ago',
        urgency: 'medium',
        reward: 40,
        location: 'Dwarka Sector 6, Delhi',
        color: 'from-emerald-500 to-emerald-700',
    },
    {
        id: 5,
        name: 'Arjun Mehta',
        initials: 'AM',
        condition: 'Road accident, minor injuries',
        distance: '0.5 km',
        time: '1 min ago',
        urgency: 'critical',
        reward: 100,
        location: 'NH-8, Gurugram',
        color: 'from-violet-500 to-violet-700',
    },
];

const LEADERBOARD = [
    { rank: 1, name: 'Vikram Sharma', coins: 4850, assists: 97, badge: '🥇' },
    { rank: 2, name: 'Anita Rao', coins: 3920, assists: 78, badge: '🥈' },
    { rank: 3, name: 'Deepak Nair', coins: 3100, assists: 62, badge: '🥉' },
    { rank: 4, name: 'Kavya Patel', coins: 2750, assists: 55, badge: '⭐' },
    { rank: 5, name: 'Rohit Jain', coins: 2200, assists: 44, badge: '⭐' },
];

const urgencyConfig = {
    critical: { label: 'CRITICAL', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
    high: { label: 'HIGH', bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
    medium: { label: 'MEDIUM', bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500' },
};

const CoinAnimation = ({ coins, onDone }) => {
    useEffect(() => {
        const t = setTimeout(onDone, 2500);
        return () => clearTimeout(t);
    }, [onDone]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="animate-coin-pop bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl px-8 py-6 shadow-2xl text-center">
                <div className="text-5xl mb-2">🪙</div>
                <div className="text-white font-black text-3xl">+{coins} Coins!</div>
                <div className="text-white/80 text-sm mt-1">Thank you for helping! 💙</div>
            </div>
        </div>
    );
};

const HelpingPoints = () => {
    const [requests, setRequests] = useState(DUMMY_REQUESTS);
    const [coins, setCoins] = useState(320);
    const [totalAssists, setTotalAssists] = useState(6);
    const [coinAnim, setCoinAnim] = useState(null);
    const [acceptedId, setAcceptedId] = useState(null);
    const [activeTab, setActiveTab] = useState('requests');
    const [notification, setNotification] = useState(null);

    const handleAccept = (request) => {
        setAcceptedId(request.id);
        setTimeout(() => {
            setCoins(prev => prev + request.reward);
            setTotalAssists(prev => prev + 1);
            setCoinAnim(request.reward);
            setRequests(prev => prev.filter(r => r.id !== request.id));
            setAcceptedId(null);
            setNotification(`You're on your way to help ${request.name}! 🚗`);
            setTimeout(() => setNotification(null), 4000);
        }, 1500);
    };

    const handleDecline = (id) => {
        setRequests(prev => prev.filter(r => r.id !== id));
    };

    const coinLevel = coins >= 5000 ? 'Platinum' : coins >= 2000 ? 'Gold' : coins >= 500 ? 'Silver' : 'Bronze';
    const coinLevelColor = coins >= 5000 ? 'from-cyan-400 to-blue-500' : coins >= 2000 ? 'from-yellow-400 to-amber-500' : coins >= 500 ? 'from-gray-300 to-gray-400' : 'from-amber-600 to-amber-800';
    const nextLevel = coins >= 5000 ? 5000 : coins >= 2000 ? 5000 : coins >= 500 ? 2000 : 500;
    const progress = Math.min((coins / nextLevel) * 100, 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
            {/* Coin animation overlay */}
            {coinAnim && <CoinAnimation coins={coinAnim} onDone={() => setCoinAnim(null)} />}

            {/* Notification toast */}
            {notification && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg font-medium animate-slide-up">
                    {notification}
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white px-6 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black mb-1">Community Helper</h1>
                            <p className="text-violet-200 text-sm">Help others, earn ResQ Coins 🪙</p>
                        </div>
                        <div className="sm:text-right">
                            <div className="text-3xl font-black text-yellow-400">{coins.toLocaleString()}</div>
                            <div className="text-violet-200 text-sm">ResQ Coins</div>
                        </div>
                    </div>

                    {/* Coin wallet card */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 bg-gradient-to-br ${coinLevelColor} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                    {coinLevel === 'Gold' ? '🥇' : coinLevel === 'Silver' ? '🥈' : coinLevel === 'Platinum' ? '💎' : '🥉'}
                                </div>
                                <div>
                                    <div className="text-white font-bold">{coinLevel} Helper</div>
                                    <div className="text-violet-200 text-sm">{totalAssists} assists completed</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-white/70 text-xs mb-1">Next: {nextLevel.toLocaleString()} coins</div>
                                <div className="text-white font-semibold text-sm">{(nextLevel - coins).toLocaleString()} to go</div>
                            </div>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full bg-gradient-to-r ${coinLevelColor} transition-all duration-1000`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-4xl mx-auto px-6 mt-6">
                <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
                    {[
                        { id: 'requests', label: '🚨 Requests', count: requests.length },
                        { id: 'leaderboard', label: '🏆 Leaderboard', count: null },
                        { id: 'redeem', label: '🎁 Redeem', count: null },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === tab.id
                                ? 'bg-white dark:bg-gray-700 text-violet-700 dark:text-violet-300 shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                        >
                            {tab.label}
                            {tab.count !== null && (
                                <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-violet-100 text-violet-700' : 'bg-gray-200 text-gray-600'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* REQUESTS TAB */}
                {activeTab === 'requests' && (
                    <div className="space-y-4 pb-8">
                        {requests.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">🎉</div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">All caught up!</h3>
                                <p className="text-gray-500 dark:text-gray-400">No pending help requests nearby. Check back soon.</p>
                            </div>
                        ) : (
                            requests.map(req => {
                                const urg = urgencyConfig[req.urgency];
                                const isAccepting = acceptedId === req.id;
                                return (
                                    <div
                                        key={req.id}
                                        className={`bg-white dark:bg-gray-800 rounded-2xl p-5 border ${urg.border} dark:border-gray-700 shadow-sm transition-all duration-300 ${isAccepting ? 'scale-95 opacity-70' : 'hover:shadow-md'}`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 bg-gradient-to-br ${req.color} rounded-xl flex items-center justify-center text-white font-bold shadow-md`}>
                                                    {req.initials}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-white">{req.name}</div>
                                                    <div className="text-gray-500 dark:text-gray-400 text-sm">{req.condition}</div>
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${urg.bg} ${urg.text} text-xs font-bold`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${urg.dot} animate-pulse`} />
                                                {urg.label}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4 text-blue-500" />
                                                {req.distance}
                                            </div>
                                            <div className="text-gray-400">{req.location}</div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                {req.time}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleAccept(req)}
                                                disabled={isAccepting}
                                                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
                                            >
                                                {isAccepting ? (
                                                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Accepting...</>
                                                ) : (
                                                    <><Heart className="h-4 w-4" /> Accept (+{req.reward} 🪙)</>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleDecline(req.id)}
                                                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-1"
                                            >
                                                <X className="h-4 w-4" /> Skip
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* LEADERBOARD TAB */}
                {activeTab === 'leaderboard' && (
                    <div className="pb-8">
                        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 mb-6 text-white text-center">
                            <div className="text-4xl mb-2">🏆</div>
                            <h3 className="text-xl font-bold mb-1">Top Helpers This Month</h3>
                            <p className="text-violet-200 text-sm">Making a difference, one assist at a time</p>
                        </div>

                        <div className="space-y-3">
                            {LEADERBOARD.map((user) => (
                                <div key={user.rank} className={`bg-white dark:bg-gray-800 rounded-xl p-4 border flex items-center gap-4 shadow-sm ${user.rank <= 3 ? 'border-yellow-200 dark:border-yellow-700' : 'border-gray-100 dark:border-gray-700'}`}>
                                    <div className="text-2xl w-8 text-center">{user.badge}</div>
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-900 dark:text-white">{user.name}</div>
                                        <div className="text-gray-500 dark:text-gray-400 text-sm">{user.assists} assists</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-yellow-600 text-lg">{user.coins.toLocaleString()}</div>
                                        <div className="text-gray-400 text-xs">coins</div>
                                    </div>
                                </div>
                            ))}

                            {/* Current user */}
                            <div className="bg-violet-50 rounded-xl p-4 border border-violet-200 flex items-center gap-4">
                                <div className="text-2xl w-8 text-center">👤</div>
                                <div className="flex-1">
                                    <div className="font-bold text-violet-900">You</div>
                                    <div className="text-violet-600 text-sm">{totalAssists} assists</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-black text-violet-700 text-lg">{coins.toLocaleString()}</div>
                                    <div className="text-violet-400 text-xs">coins</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* REDEEM TAB */}
                {activeTab === 'redeem' && (
                    <div className="pb-8 space-y-4">
                        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl p-5 text-white mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-white/80 text-sm mb-1">Your Balance</div>
                                    <div className="text-4xl font-black">{coins.toLocaleString()} 🪙</div>
                                </div>
                                <div className="text-5xl opacity-30">💰</div>
                            </div>
                        </div>

                        {[
                            { title: 'Free Appointment Booking', desc: 'Book any hospital appointment for free', cost: 200, icon: '📅', available: coins >= 200 },
                            { title: '50% Off Consultation', desc: 'Half price on your next doctor visit', cost: 350, icon: '👨‍⚕️', available: coins >= 350 },
                            { title: 'Free Ambulance Booking', desc: 'One free ambulance booking', cost: 500, icon: '🚑', available: coins >= 500 },
                            { title: 'Premium Health Report', desc: 'Comprehensive AI health analysis', cost: 750, icon: '📊', available: coins >= 750 },
                            { title: 'VIP Hospital Fast Track', desc: 'Skip the queue at partner hospitals', cost: 1000, icon: '⚡', available: coins >= 1000 },
                        ].map((item, i) => (
                            <div key={i} className={`bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 border dark:border-gray-700 shadow-sm flex items-center gap-3 sm:gap-4 ${item.available ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
                                <div className="text-2xl sm:text-3xl flex-shrink-0">{item.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{item.title}</div>
                                    <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{item.desc}</div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div className="text-amber-600 font-bold text-sm">{item.cost} 🪙</div>
                                    <button
                                        disabled={!item.available}
                                        onClick={() => {
                                            if (item.available) {
                                                setCoins(prev => prev - item.cost);
                                                setNotification(`✅ Redeemed: ${item.title}!`);
                                                setTimeout(() => setNotification(null), 3000);
                                            }
                                        }}
                                        className={`mt-1 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold transition ${item.available ? 'bg-violet-600 text-white hover:bg-violet-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                    >
                                        {item.available ? 'Redeem' : 'Need more'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HelpingPoints;
