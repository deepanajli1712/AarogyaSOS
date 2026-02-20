import React, { useState, useEffect } from "react";
import { Calendar, Clock, Search, Plus, CheckCircle, XCircle, FileText, Trash2, X, AlertCircle } from "lucide-react";
import service from "../appwrite/config";

const DUMMY_APPOINTMENTS = [
  {
    $id: "demo-1",
    hospitalName: "AIIMS Delhi",
    dateTime: new Date(Date.now() + 86400000 * 3).toISOString(),
    description: "Cardiology follow-up consultation",
    status: "scheduled",
  },
  {
    $id: "demo-2",
    hospitalName: "Apollo Hospital",
    dateTime: new Date(Date.now() - 86400000 * 5).toISOString(),
    description: "General health checkup",
    status: "completed",
  },
  {
    $id: "demo-3",
    hospitalName: "Fortis Healthcare",
    dateTime: new Date(Date.now() - 86400000 * 10).toISOString(),
    description: "Orthopedic consultation",
    status: "cancelled",
  },
];

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    hospitalName: "",
    dateTime: "",
    description: "",
    status: "scheduled",
  });
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usingDummy, setUsingDummy] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const user = await service.getCurrentUser();
      if (!user) {
        // Not logged in — show dummy data
        setAppointments(DUMMY_APPOINTMENTS);
        setUsingDummy(true);
        setIsLoading(false);
        return;
      }
      setCurrentUser(user);
      const res = await service.getAppointments(user.$id);
      if (res && res.documents) {
        if (res.documents.length === 0) {
          // Logged in but no appointments yet — show empty state (not dummy)
          setAppointments([]);
        } else {
          setAppointments(res.documents);
        }
        setUsingDummy(false);
      } else {
        // API returned false (error) — fall back to dummy
        setAppointments(DUMMY_APPOINTMENTS);
        setUsingDummy(true);
      }
    } catch (err) {
      setAppointments(DUMMY_APPOINTMENTS);
      setUsingDummy(true);
    } finally {
      setIsLoading(false);
    }
  };

  const validateAppointment = (appointment) => {
    if (!appointment.hospitalName.trim()) throw new Error("Hospital name is required");
    if (!appointment.dateTime) throw new Error("Date and time are required");
    if (!appointment.description.trim()) throw new Error("Description is required");
    const appointmentDate = new Date(appointment.dateTime);
    if (appointmentDate < new Date()) throw new Error("Appointment date must be in the future");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      validateAppointment(newAppointment);

      if (usingDummy || !currentUser) {
        // Simulate creation with dummy data
        const newDoc = {
          $id: `demo-${Date.now()}`,
          hospitalName: newAppointment.hospitalName.trim(),
          dateTime: new Date(newAppointment.dateTime).toISOString(),
          description: newAppointment.description.trim(),
          status: "scheduled",
        };
        setAppointments(prev => [newDoc, ...prev]);
        setUsingDummy(true);
      } else {
        const data = {
          userId: currentUser.$id,
          hospitalId: "67ef8fb4001a141fc205",
          hospitalName: newAppointment.hospitalName.trim(),
          dateTime: new Date(newAppointment.dateTime).toISOString(),
          description: newAppointment.description.trim(),
          status: "scheduled",
        };
        const response = await service.createAppointment(data);
        if (!response) throw new Error("Failed to create appointment. Please try again.");
        await fetchAppointments();
      }

      setShowModal(false);
      setNewAppointment({ hospitalName: "", dateTime: "", description: "", status: "scheduled" });
      setSuccessMsg("Appointment booked successfully! ✅");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to create appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (usingDummy || id.startsWith("demo-")) {
      setAppointments(prev => prev.filter(a => a.$id !== id));
      return;
    }
    try {
      const success = await service.deleteAppointment(id);
      if (success) {
        setAppointments(prev => prev.filter(a => a.$id !== id));
      } else {
        setError("Failed to delete appointment");
      }
    } catch (err) {
      setError("Failed to delete: " + err.message);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    const match =
      a.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return statusFilter === "all" ? match : match && a.status === statusFilter;
  });

  const totalAppointments = appointments.length;
  const completed = appointments.filter((a) => a.status === "completed").length;
  const cancelled = appointments.filter((a) => a.status === "cancelled").length;
  const scheduled = appointments.filter((a) => a.status === "scheduled").length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Appointments</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Manage your hospital appointments</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold w-full sm:w-auto"
          >
            <Plus className="h-5 w-5" /> New Appointment
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex justify-between items-center animate-slide-up">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-slide-up">
            <CheckCircle className="h-5 w-5" />
            <span>{successMsg}</span>
          </div>
        )}
        {usingDummy && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>Showing demo data. Log in to see and manage your real appointments.</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { title: "Total", value: totalAppointments, color: "from-blue-500 to-indigo-600", bg: "bg-blue-50", text: "text-blue-700", icon: Calendar },
            { title: "Scheduled", value: scheduled, color: "from-sky-500 to-blue-600", bg: "bg-sky-50", text: "text-sky-700", icon: Clock },
            { title: "Completed", value: completed, color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle },
            { title: "Cancelled", value: cancelled, color: "from-red-500 to-rose-600", bg: "bg-red-50", text: "text-red-700", icon: XCircle },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-3 sm:p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 ${s.bg} rounded-xl flex items-center justify-center mb-2 sm:mb-3`}>
                <s.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${s.text}`} />
              </div>
              <div className={`text-2xl sm:text-3xl font-black ${s.text}`}>{s.value}</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">{s.title}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {["all", "scheduled", "completed", "cancelled"].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 capitalize ${statusFilter === s
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-3">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-16 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No appointments found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'Book your first appointment to get started.'}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Book Appointment
              </button>
            </div>
          ) : (
            filteredAppointments.map((app) => {
              const status = app.status ?? "scheduled";
              const statusStyles = {
                scheduled: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
                completed: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
                cancelled: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
              };
              const st = statusStyles[status] || statusStyles.scheduled;

              return (
                <div key={app.$id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">🏥</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg">{app.hospitalName || "Unknown Hospital"}</h3>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.text} border ${st.border}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${st.dot} ${status === 'scheduled' ? 'animate-pulse' : ''}`} />
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(app.dateTime).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          <span>•</span>
                          <Clock className="h-4 w-4" />
                          <span>{new Date(app.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300 text-sm">
                          <FileText className="h-4 w-4 flex-shrink-0 mt-0.5 text-gray-400" />
                          <span>{app.description}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(app.$id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0"
                      title="Delete appointment"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">New Appointment</h2>
              <button
                onClick={() => { setShowModal(false); setError(""); }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Hospital Name *</label>
                <input
                  type="text"
                  value={newAppointment.hospitalName}
                  onChange={(e) => setNewAppointment({ ...newAppointment, hospitalName: e.target.value })}
                  placeholder="e.g. AIIMS Delhi"
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date & Time *</label>
                <input
                  type="datetime-local"
                  value={newAppointment.dateTime}
                  onChange={(e) => setNewAppointment({ ...newAppointment, dateTime: e.target.value })}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description *</label>
                <textarea
                  value={newAppointment.description}
                  onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
                  placeholder="Reason for visit, symptoms, etc."
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm resize-none placeholder-gray-400"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setError(""); }}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Booking...</>
                  ) : (
                    <><Calendar className="h-4 w-4" /> Book Appointment</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;