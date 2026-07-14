"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import {
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  ExternalLink,
  GraduationCap,
  LogOut,
  FileText,
} from "lucide-react";

interface Application {
  id: number;
  status: string;
  paymentStatus: string;
  transactionId: string | null;
  paymentMethod: string | null;
  notes: string | null;
  adminNotes: string | null;
  appliedAt: string;
  courseTitle: string | null;
  courseFee: string | null;
}

interface TeacherApp {
  id: number;
  proposedCourseTitle: string;
  status: string;
  classType: string;
  classLink: string | null;
  appliedAt: string;
  adminNotes: string | null;
}

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [studentApps, setStudentApps] = useState<Application[]>([]);
  const [teacherApps, setTeacherApps] = useState<TeacherApp[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (user?.role === "admin") {
      router.push("/admin");
      return;
    }
    if (user) {
      fetchData();
    }
  }, [user, loading]);

  const fetchData = async () => {
    try {
      const [studentRes, teacherRes] = await Promise.all([
        fetch("/api/applications/student"),
        fetch("/api/applications/teacher"),
      ]);

      if (studentRes.ok) {
        const data = await studentRes.json();
        setStudentApps(data.applications || []);
      }
      if (teacherRes.ok) {
        const data = await teacherRes.json();
        setTeacherApps(data.applications || []);
      }
    } catch {}
    setLoadingData(false);
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    router.push("/");
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      approved: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
    };
    return styles[status] || "bg-slate-100 text-slate-600";
  };

  const getPaymentBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-gray-100 text-gray-600",
      submitted: "bg-blue-100 text-blue-700",
      verified: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-slate-100 text-slate-600";
  };

  const enrolledCourses = studentApps.filter(
    (a) => a.status === "approved" && a.paymentStatus === "verified"
  );

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-400">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 rounded-3xl p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 text-9xl opacity-10">🎓</div>
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-black">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-green-400 text-sm font-semibold">Welcome back 👋</p>
                  <h1 className="text-white text-2xl font-black">{user.name}</h1>
                  <p className="text-slate-400 text-sm">{user.email}</p>
                  <span className="inline-block mt-1 bg-green-700/30 border border-green-700/50 text-green-300 text-xs px-2 py-0.5 rounded-full capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/courses"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shine"
                >
                  <BookOpen className="w-4 h-4" />
                  Browse Courses
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm px-4 py-2.5 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Applications",
                value: studentApps.length,
                icon: "📋",
                color: "from-blue-500 to-blue-600",
              },
              {
                label: "Enrolled Courses",
                value: enrolledCourses.length,
                icon: "🎓",
                color: "from-green-500 to-green-600",
              },
              {
                label: "Pending Review",
                value: studentApps.filter((a) => a.status === "pending").length,
                icon: "⏳",
                color: "from-amber-500 to-amber-600",
              },
              {
                label: "Teacher Apps",
                value: teacherApps.length,
                icon: "👨‍🏫",
                color: "from-purple-500 to-purple-600",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm"
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-lg mb-3`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                <div className="text-slate-500 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Enrolled Courses */}
          {enrolledCourses.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                  My Courses
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {enrolledCourses.map((app) => (
                  <div
                    key={app.id}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                      <span className="font-bold text-slate-900 text-sm">{app.courseTitle}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-700 text-xs font-semibold">✅ Enrolled</span>
                      <span className="text-slate-400 text-xs">
                        Fee: PKR {parseInt(app.courseFee || "0").toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Student Applications */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                My Applications
              </h2>
              <Link
                href="/courses"
                className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                Apply for Course
              </Link>
            </div>

            {loadingData ? (
              <div className="text-center py-8 text-slate-400 text-sm">Loading...</div>
            ) : studentApps.length === 0 ? (
              <div className="text-center py-10">
                <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No applications yet</p>
                <Link
                  href="/courses"
                  className="inline-block mt-3 bg-green-600 text-white text-sm px-5 py-2.5 rounded-xl font-semibold hover:bg-green-500 transition-colors"
                >
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {studentApps.map((app) => (
                  <div
                    key={app.id}
                    className="border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{app.courseTitle}</p>
                        <p className="text-slate-400 text-xs mt-0.5">
                          Applied: {new Date(app.appliedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        {app.adminNotes && (
                          <p className="text-slate-500 text-xs mt-1 italic">
                            Admin note: {app.adminNotes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusBadge(app.status)}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPaymentBadge(app.paymentStatus)}`}>
                          💳 {app.paymentStatus}
                        </span>
                      </div>
                    </div>
                    {app.transactionId && (
                      <p className="text-slate-400 text-xs mt-2">
                        TxID: <span className="font-mono text-slate-600">{app.transactionId}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Teacher Applications */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                👨‍🏫 Teacher Applications
              </h2>
              <Link
                href="/apply-teacher"
                className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                Apply to Teach
              </Link>
            </div>

            {teacherApps.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm mb-3">
                  Want to share your knowledge? Apply to become a teacher!
                </p>
                <Link
                  href="/apply-teacher"
                  className="inline-block bg-green-600 text-white text-sm px-5 py-2.5 rounded-xl font-semibold hover:bg-green-500 transition-colors"
                >
                  Apply as Teacher
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {teacherApps.map((app) => (
                  <div key={app.id} className="border border-slate-100 rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{app.proposedCourseTitle}</p>
                        <p className="text-slate-400 text-xs mt-0.5">
                          Via {app.classType === "google_meet" ? "Google Meet" : app.classType === "discord" ? "Discord" : "Online"}
                          {app.classLink && (
                            <a href={app.classLink} target="_blank" rel="noopener noreferrer" className="ml-2 text-green-600">
                              <ExternalLink className="w-3 h-3 inline" />
                            </a>
                          )}
                        </p>
                        {app.adminNotes && (
                          <p className="text-slate-500 text-xs mt-1 italic">Note: {app.adminNotes}</p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border font-medium shrink-0 ${getStatusBadge(app.status)}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
