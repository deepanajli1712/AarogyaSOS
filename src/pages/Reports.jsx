/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Search, Download, Eye, Clock, User, PlusCircle,
  X, Upload, FlaskConical, Stethoscope, Pill, Scan, ChevronRight,
  Calendar, AlertCircle, CheckCircle2, Filter
} from 'lucide-react';

const TYPE_CONFIG = {
  'Lab Report': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: FlaskConical, dot: 'bg-blue-500' },
  'X-Ray': { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Scan, dot: 'bg-purple-500' },
  'Prescription': { color: 'bg-green-100 text-green-700 border-green-200', icon: Pill, dot: 'bg-green-500' },
  'Imaging': { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: Scan, dot: 'bg-orange-500' },
  'Consultation': { color: 'bg-teal-100 text-teal-700 border-teal-200', icon: Stethoscope, dot: 'bg-teal-500' },
};

const INITIAL_RECORDS = [
  { id: '1', patientId: 'Arjun Sharma', doctorId: 'Dr. Meera Patel', date: new Date('2024-03-15'), type: 'Lab Report', description: 'Complete Blood Count (CBC) Results', attachments: ['cbc_report.pdf'] },
  { id: '2', patientId: 'Priya Nair', doctorId: 'Dr. Rahul Gupta', date: new Date('2024-03-14'), type: 'X-Ray', description: 'Chest X-Ray Analysis — No abnormalities', attachments: ['chest_xray.pdf', 'radiologist_notes.pdf'] },
  { id: '3', patientId: 'Rohan Verma', doctorId: 'Dr. Sunita Rao', date: new Date('2024-03-13'), type: 'Prescription', description: 'Blood pressure medication prescription', attachments: ['prescription.pdf'] },
  { id: '4', patientId: 'Kavya Reddy', doctorId: 'Dr. Anil Kumar', date: new Date('2024-03-10'), type: 'Imaging', description: 'MRI Brain Scan — Routine checkup', attachments: ['mri_brain.pdf'] },
  { id: '5', patientId: 'Suresh Menon', doctorId: 'Dr. Deepa Singh', date: new Date('2024-03-08'), type: 'Consultation', description: 'Cardiology follow-up consultation notes', attachments: ['consult_notes.pdf'] },
];

const TABS = ['All', 'Lab Report', 'X-Ray', 'Prescription', 'Imaging', 'Consultation'];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35, ease: 'easeOut' } }),
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const Records = () => {
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [showUpload, setShowUpload] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const [toast, setToast] = useState(null);

  // Upload form state
  const [form, setForm] = useState({ patientId: '', doctorId: '', type: 'Lab Report', description: '', date: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.doctorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || r.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleUpload = (e) => {
    e.preventDefault();
    if (!form.patientId || !form.description || !form.date) return;
    const newRecord = {
      id: String(Date.now()),
      patientId: form.patientId,
      doctorId: form.doctorId || 'Unknown Doctor',
      date: new Date(form.date),
      type: form.type,
      description: form.description,
      attachments: ['report.pdf'],
    };
    setRecords([newRecord, ...records]);
    setForm({ patientId: '', doctorId: '', type: 'Lab Report', description: '', date: '' });
    setShowUpload(false);
    showToast('Report uploaded successfully!');
  };

  const handleDownload = (record) => {
    const blob = new Blob(
      [`Medical Report\n\nPatient: ${record.patientId}\nDoctor: ${record.doctorId}\nDate: ${record.date.toLocaleDateString()}\nType: ${record.type}\n\nDescription:\n${record.description}`],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${record.type.replace(' ', '_')}_${record.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Report downloaded!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 md:p-8 transition-colors duration-300">
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

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-600" /> Medical Records
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{records.length} records on file</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-blue-200 transition"
          >
            <PlusCircle className="w-5 h-5" /> Upload Report
          </motion.button>
        </div>

        {/* Search + Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-6">
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-2.5 mb-4">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by patient, doctor, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent w-full text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === tab
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Records Count */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 px-1">
          Showing <span className="font-semibold text-gray-700 dark:text-gray-200">{filteredRecords.length}</span> record{filteredRecords.length !== 1 ? 's' : ''}
        </p>

        {/* Cards */}
        <AnimatePresence mode="popLayout">
          {filteredRecords.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-500">No records found</h3>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {filteredRecords.map((record, i) => {
                const cfg = TYPE_CONFIG[record.type] || TYPE_CONFIG['Lab Report'];
                const TypeIcon = cfg.icon;
                return (
                  <motion.div
                    key={record.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 p-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Icon + Info */}
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color.split(' ').slice(0, 1).join(' ')} border ${cfg.color.split(' ').slice(2).join(' ')}`}>
                          <TypeIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cfg.color}`}>
                              {record.type}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {record.date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 text-sm">{record.description}</h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {record.patientId}</span>
                            <span className="text-gray-300">•</span>
                            <span>{record.doctorId}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
                            <FileText className="w-3 h-3" />
                            {record.attachments.length} attachment{record.attachments.length > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 sm:flex-shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setViewRecord(record)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition"
                        >
                          <Eye className="w-4 h-4" /> View
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDownload(record)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
                        >
                          <Download className="w-4 h-4" /> Download
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600" /> Upload Report
                </h2>
                <button onClick={() => setShowUpload(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    value={form.patientId}
                    onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                    placeholder="e.g. Arjun Sharma"
                    className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Doctor Name</label>
                  <input
                    type="text"
                    value={form.doctorId}
                    onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                    placeholder="e.g. Dr. Meera Patel"
                    className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.keys(TYPE_CONFIG).map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                  <textarea
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief description of the report..."
                    rows={3}
                    className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-sm text-gray-400 hover:border-blue-300 transition cursor-pointer">
                  <Upload className="w-6 h-6 mx-auto mb-1 text-gray-300" />
                  Click to attach files (PDF, JPG, PNG)
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowUpload(false)} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition shadow-sm shadow-blue-200">
                    Upload Report
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Detail Modal */}
      <AnimatePresence>
        {viewRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setViewRecord(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Report Details</h2>
                <button onClick={() => setViewRecord(null)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              {(() => {
                const cfg = TYPE_CONFIG[viewRecord.type] || TYPE_CONFIG['Lab Report'];
                const TypeIcon = cfg.icon;
                return (
                  <div className="space-y-4">
                    <div className={`flex items-center gap-3 p-4 rounded-xl border ${cfg.color}`}>
                      <TypeIcon className="w-6 h-6" />
                      <span className="font-semibold">{viewRecord.type}</span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-700">
                        <span className="text-gray-500 dark:text-gray-400">Description</span>
                        <span className="font-medium text-gray-800 dark:text-white text-right max-w-[60%]">{viewRecord.description}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-700">
                        <span className="text-gray-500 dark:text-gray-400">Patient</span>
                        <span className="font-medium text-gray-800 dark:text-white">{viewRecord.patientId}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-700">
                        <span className="text-gray-500 dark:text-gray-400">Doctor</span>
                        <span className="font-medium text-gray-800 dark:text-white">{viewRecord.doctorId}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-700">
                        <span className="text-gray-500 dark:text-gray-400">Date</span>
                        <span className="font-medium text-gray-800 dark:text-white">{viewRecord.date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500">Attachments</span>
                        <div className="text-right">
                          {viewRecord.attachments.map((a, i) => (
                            <div key={i} className="text-blue-600 font-medium">{a}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => { handleDownload(viewRecord); setViewRecord(null); }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Download Report
                    </button>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Records;