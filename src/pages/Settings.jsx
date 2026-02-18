import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import {
  User, Mail, Lock, Bell, Moon, Sun, Key, Phone, Heart,
  Plus, Trash2, Eye, EyeOff, CheckCircle2, Save, Globe,
  Shield, Camera, AlertCircle
} from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati'];

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' } }),
};

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${checked ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const SectionCard = ({ title, icon: Icon, iconColor = 'text-indigo-600', iconBg = 'bg-indigo-50 dark:bg-indigo-900/30', children, index }) => (
  <motion.div
    custom={index}
    variants={sectionVariants}
    initial="hidden"
    animate="visible"
    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
  >
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50 dark:border-gray-700">
      <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <h2 className="text-base font-bold text-gray-900 dark:text-white">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

const Settings = () => {
  const userData = useSelector((state) => state.auth.userData);
  const { darkMode, toggleDarkMode } = useTheme();

  // Load profile: prefer localStorage (set at signup), fallback to Redux userData
  const getInitialProfile = () => {
    try {
      const stored = localStorage.getItem('aarogya_profile');
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return {
      name: userData?.name || '',
      email: userData?.email || '',
      phone: '',
      bloodGroup: 'O+',
      dob: '',
    };
  };

  const [profile, setProfile] = useState(getInitialProfile);

  const [contacts, setContacts] = useState(() => {
    try {
      const stored = localStorage.getItem('aarogya_emergency_contacts');
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return [];
  });
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [showAddContact, setShowAddContact] = useState(false);

  const [security, setSecurity] = useState({ current: '', newPwd: '', confirm: '' });
  const [showPwd, setShowPwd] = useState({ current: false, newPwd: false, confirm: false });

  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('aarogya_notifications');
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return {
      emailAlerts: true,
      smsAlerts: false,
      appointmentReminders: true,
      healthAlerts: true,
      emergencyAlerts: true,
      newsUpdates: false,
    };
  });

  const [language, setLanguage] = useState(() => localStorage.getItem('aarogya_language') || 'English');
  const [toast, setToast] = useState(null);
  const [pwdError, setPwdError] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    if (security.newPwd && security.newPwd !== security.confirm) {
      setPwdError('Passwords do not match.');
      return;
    }
    setPwdError('');
    // Persist all settings
    localStorage.setItem('aarogya_profile', JSON.stringify(profile));
    localStorage.setItem('aarogya_emergency_contacts', JSON.stringify(contacts));
    localStorage.setItem('aarogya_notifications', JSON.stringify(notifications));
    localStorage.setItem('aarogya_language', language);
    setSecurity({ current: '', newPwd: '', confirm: '' });
    showToast('Settings saved successfully!');
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;
    const updated = [...contacts, newContact];
    setContacts(updated);
    setNewContact({ name: '', phone: '' });
    setShowAddContact(false);
    showToast('Emergency contact added!');
  };

  const removeContact = (i) => {
    setContacts(contacts.filter((_, idx) => idx !== i));
  };

  const notifLabels = {
    emailAlerts: 'Email Alerts',
    smsAlerts: 'SMS Alerts',
    appointmentReminders: 'Appointment Reminders',
    healthAlerts: 'Health Alerts',
    emergencyAlerts: 'Emergency Alerts',
    newsUpdates: 'News & Updates',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 md:p-8 transition-colors duration-300">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
          >
            <CheckCircle2 className="w-4 h-4" /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto space-y-5">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-2">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your account and preferences</p>
        </motion.div>

        {/* Profile */}
        <SectionCard title="Profile" icon={User} index={0}>
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
                {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition">
                <Camera className="w-3 h-3 text-gray-500 dark:text-gray-300" />
              </button>
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white">{profile.name || 'Your Name'}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{profile.email || 'your@email.com'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Full Name', icon: User, key: 'name', type: 'text', placeholder: 'Full Name' },
              { label: 'Email Address', icon: Mail, key: 'email', type: 'email', placeholder: 'Email' },
              { label: 'Phone Number', icon: Phone, key: 'phone', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
            ].map(({ label, icon: Icon, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={type}
                    value={profile[key]}
                    onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Blood Group</label>
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                <select
                  value={profile.bloodGroup}
                  onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                  className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none"
                >
                  {BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date of Birth</label>
              <input
                type="date"
                value={profile.dob}
                onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </SectionCard>

        {/* Emergency Contacts */}
        <SectionCard title="Emergency Contacts" icon={Phone} iconColor="text-red-600" iconBg="bg-red-50 dark:bg-red-900/20" index={1}>
          <div className="space-y-3 mb-4">
            {contacts.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-2">No emergency contacts added yet.</p>
            )}
            {contacts.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
              >
                <div>
                  <div className="font-medium text-gray-800 dark:text-white text-sm">{c.name}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">{c.phone}</div>
                </div>
                <button onClick={() => removeContact(i)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {showAddContact && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Contact name"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
                  />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowAddContact(false)} className="flex-1 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
                  <button onClick={addContact} className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">Add Contact</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!showAddContact && (
            <button
              onClick={() => setShowAddContact(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:border-indigo-300 hover:text-indigo-600 transition"
            >
              <Plus className="w-4 h-4" /> Add Emergency Contact
            </button>
          )}
        </SectionCard>

        {/* Security */}
        <SectionCard title="Security" icon={Shield} iconColor="text-emerald-600" iconBg="bg-emerald-50 dark:bg-emerald-900/20" index={2}>
          <div className="space-y-4">
            {[
              { key: 'current', label: 'Current Password' },
              { key: 'newPwd', label: 'New Password' },
              { key: 'confirm', label: 'Confirm New Password' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPwd[key] ? 'text' : 'password'}
                    value={security[key]}
                    onChange={(e) => setSecurity({ ...security, [key]: e.target.value })}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd({ ...showPwd, [key]: !showPwd[key] })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPwd[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            {pwdError && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" /> {pwdError}
              </div>
            )}
          </div>
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notifications" icon={Bell} iconColor="text-violet-600" iconBg="bg-violet-50 dark:bg-violet-900/20" index={3}>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{notifLabels[key]}</span>
                </div>
                <Toggle checked={val} onChange={(v) => setNotifications({ ...notifications, [key]: v })} />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Appearance & Language */}
        <SectionCard title="Appearance & Language" icon={Globe} iconColor="text-amber-600" iconBg="bg-amber-50 dark:bg-amber-900/20" index={4}>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-white">Dark Mode</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{darkMode ? 'Dark theme active' : 'Light theme active'}</div>
                </div>
              </div>
              <Toggle checked={darkMode} onChange={toggleDarkMode} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Language</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none"
                >
                  {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold text-base shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition"
        >
          <Save className="w-5 h-5" /> Save All Changes
        </motion.button>

        <div className="h-4" />
      </div>
    </div>
  );
};

export default Settings;
