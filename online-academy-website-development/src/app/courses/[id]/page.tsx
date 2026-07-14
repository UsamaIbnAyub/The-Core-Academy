"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Clock,
  Users,
  Video,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Send,
  ExternalLink,
} from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  shortDescription: string | null;
  fee: string;
  duration: string | null;
  level: string | null;
  classType: string;
  classLink: string | null;
  schedule: string | null;
  maxStudents: number | null;
  totalEnrolled: number;
  syllabus: string | null;
  requirements: string | null;
  teacherName: string | null;
  teacherBio: string | null;
  categoryName: string | null;
  status: string;
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    paymentMethod: "JazzCash",
    transactionId: "",
    notes: "",
  });

  useEffect(() => {
    if (id) {
      fetch(`/api/courses/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setCourse(data.course || null);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login first to apply");
      router.push("/login");
      return;
    }

    setApplying(true);
    try {
      const res = await fetch("/api/applications/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: id,
          paymentMethod: form.paymentMethod,
          transactionId: form.transactionId,
          notes: form.notes,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Application submitted successfully! Admin will review and approve.");
        setShowForm(false);
        router.push("/dashboard");
      } else {
        toast.error(data.error || "Failed to apply");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const getClassIcon = () => {
    if (course?.classType === "discord") return "🎮";
    if (course?.classType === "google_meet") return "📹";
    return "🌐";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-slate-400 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30 animate-pulse" />
            <p>Loading course details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-slate-500">Course not found</p>
            <Link href="/courses" className="text-green-600 mt-2 block hover:underline">
              ← Back to Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-green-400 mb-6 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {course.categoryName && (
                <span className="inline-block bg-green-900/50 text-green-300 text-xs px-3 py-1 rounded-full mb-3">
                  {course.categoryName}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">{course.title}</h1>
              <p className="text-slate-400 text-lg mb-6">
                {course.shortDescription || course.description.slice(0, 150) + "..."}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-green-400" />
                  {getClassIcon()}{" "}
                  {course.classType === "google_meet"
                    ? "Google Meet"
                    : course.classType === "discord"
                    ? "Discord"
                    : "Online Class"}
                </span>
                {course.duration && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-green-400" />
                    {course.duration}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-green-400" />
                  {course.totalEnrolled} / {course.maxStudents || 50} enrolled
                </span>
                {course.level && (
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-green-400" />
                    {course.level}
                  </span>
                )}
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="text-center mb-4">
                <span className="text-4xl font-black text-green-700">
                  PKR {parseInt(course.fee).toLocaleString()}
                </span>
                <span className="text-slate-400 text-sm block">one-time course fee</span>
              </div>

              {course.status === "upcoming" ? (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center mb-4">
                  <p className="text-purple-700 font-semibold text-sm">🔜 Coming Soon</p>
                  <p className="text-purple-500 text-xs mt-1">Registrations not yet open</p>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (!user) {
                      router.push("/login");
                      return;
                    }
                    setShowForm(!showForm);
                  }}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-xl transition-all shine mb-3"
                >
                  {user ? "Apply for Admission" : "Login to Apply"}
                </button>
              )}

              <div className="space-y-2 text-sm">
                {[
                  { icon: "✅", text: "Expert instructor" },
                  { icon: "📜", text: "Certificate on completion" },
                  { icon: "💬", text: "Community access" },
                  { icon: "📱", text: "Learn from anywhere" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-slate-600">
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
            <h2 className="text-2xl font-black text-slate-900 mb-1">Apply for {course.title}</h2>
            <p className="text-slate-500 text-sm mb-6">
              Submit your payment proof to complete the enrollment
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-amber-800 font-semibold text-sm">Payment Instructions</p>
                  <p className="text-amber-700 text-xs mt-1">
                    Send PKR {parseInt(course.fee).toLocaleString()} to our account and provide the
                    transaction ID below for verification.
                  </p>
                  <p className="text-amber-600 text-xs mt-1 font-medium">
                    JazzCash / EasyPaisa: 0300-CORETCA
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Payment Method</label>
                <select
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                >
                  <option>JazzCash</option>
                  <option>EasyPaisa</option>
                  <option>Bank Transfer</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">
                  Transaction ID / Reference Number
                </label>
                <input
                  type="text"
                  value={form.transactionId}
                  onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
                  placeholder="e.g. TXN-123456789"
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any queries or special requests..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border-2 border-slate-200 text-slate-600 font-semibold py-3 rounded-xl text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="flex-1 bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shine"
                >
                  <Send className="w-4 h-4" />
                  {applying ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="text-xl font-black text-slate-900 mb-4">About this Course</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{course.description}</p>
            </div>

            {/* Schedule */}
            {course.schedule && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-xl font-black text-slate-900 mb-4">📅 Class Schedule</h2>
                <p className="text-slate-600">{course.schedule}</p>
                {course.classLink && (
                  <a
                    href={course.classLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-green-600 hover:text-green-700 text-sm font-semibold"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Join Class Link
                  </a>
                )}
              </div>
            )}

            {/* Syllabus */}
            {course.syllabus && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-xl font-black text-slate-900 mb-4">📋 Course Syllabus</h2>
                <div className="space-y-2">
                  {course.syllabus.split(",").map((topic, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      <span className="text-slate-600 text-sm">{topic.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {course.requirements && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-xl font-black text-slate-900 mb-4">📌 Requirements</h2>
                <p className="text-slate-600 text-sm leading-relaxed">{course.requirements}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Instructor */}
            {course.teacherName && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-lg font-black text-slate-900 mb-4">Your Instructor</h2>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-black text-lg">
                    {course.teacherName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{course.teacherName}</p>
                    <p className="text-green-600 text-xs font-medium">Certified Instructor</p>
                  </div>
                </div>
                {course.teacherBio && (
                  <p className="text-slate-500 text-sm leading-relaxed">{course.teacherBio}</p>
                )}
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="text-lg font-black text-slate-900 mb-4">Course Info</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Level</span>
                  <span className="font-semibold text-slate-800">{course.level || "All Levels"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-semibold text-slate-800">{course.duration || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Class Mode</span>
                  <span className="font-semibold text-slate-800">
                    {course.classType === "google_meet"
                      ? "Google Meet"
                      : course.classType === "discord"
                      ? "Discord"
                      : "Online"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Max Students</span>
                  <span className="font-semibold text-slate-800">{course.maxStudents || 50}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Enrolled</span>
                  <span className="font-semibold text-green-700">{course.totalEnrolled}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
