"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import { Send, ArrowLeft, Award, Video, MessageCircle, Globe } from "lucide-react";

export default function ApplyTeacherPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    proposedCourseTitle: "",
    proposedCourseDescription: "",
    qualifications: "",
    experience: "",
    classType: "google_meet",
    classLink: "",
    proposedFee: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/applications/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Teacher application submitted! Admin will review within 24-48 hours.");
        router.push("/dashboard");
      } else {
        toast.error(data.error || "Failed to submit application");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const classTypeOptions = [
    { value: "google_meet", label: "Google Meet", icon: <Video className="w-4 h-4" />, desc: "Video calls via Google Meet" },
    { value: "discord", label: "Discord", icon: <MessageCircle className="w-4 h-4" />, desc: "Voice/video channels on Discord" },
    { value: "online", label: "Custom Platform", icon: <Globe className="w-4 h-4" />, desc: "Your own platform or other tools" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-green-600 mb-8 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              Teach at <span className="text-green-600">The Core Academy</span>
            </h1>
            <p className="text-slate-500">
              Share your expertise with hundreds of eager learners. Create your own classroom and
              teach through your preferred platform.
            </p>
          </div>

          {!user && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 text-center">
              <p className="text-amber-800 font-semibold mb-3">Login Required</p>
              <p className="text-amber-600 text-sm mb-4">
                You need to be logged in to apply as a teacher.
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/login" className="bg-amber-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-amber-500 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="border border-amber-600 text-amber-700 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-amber-50 transition-colors">
                  Register
                </Link>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Course Details */}
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  📚 Proposed Course
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      value={form.proposedCourseTitle}
                      onChange={(e) => setForm({ ...form, proposedCourseTitle: e.target.value })}
                      placeholder="e.g. Advanced JavaScript Development"
                      required
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">
                      Course Description *
                    </label>
                    <textarea
                      value={form.proposedCourseDescription}
                      onChange={(e) =>
                        setForm({ ...form, proposedCourseDescription: e.target.value })
                      }
                      placeholder="Describe what students will learn, course outcomes, and structure..."
                      required
                      rows={4}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">
                      Proposed Fee (PKR)
                    </label>
                    <input
                      type="number"
                      value={form.proposedFee}
                      onChange={(e) => setForm({ ...form, proposedFee: e.target.value })}
                      placeholder="e.g. 10000"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Teaching Platform */}
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  📡 Teaching Platform
                </h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {classTypeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, classType: opt.value })}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        form.classType === opt.value
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex justify-center mb-1">{opt.icon}</div>
                      <p className="text-xs font-bold">{opt.label}</p>
                      <p className="text-xs opacity-70">{opt.desc}</p>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-2">
                    Class Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={form.classLink}
                    onChange={(e) => setForm({ ...form, classLink: e.target.value })}
                    placeholder="https://meet.google.com/... or https://discord.gg/..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>
              </div>

              {/* Qualifications */}
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  🎓 Your Qualifications
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">
                      Qualifications & Education *
                    </label>
                    <textarea
                      value={form.qualifications}
                      onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
                      placeholder="List your degrees, certifications, and relevant education..."
                      required
                      rows={3}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">
                      Teaching/Work Experience
                    </label>
                    <textarea
                      value={form.experience}
                      onChange={(e) => setForm({ ...form, experience: e.target.value })}
                      placeholder="Describe your teaching experience, previous jobs, and relevant skills..."
                      rows={3}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !user}
                className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm shine"
              >
                <Send className="w-4 h-4" />
                {loading ? "Submitting Application..." : "Submit Teacher Application"}
              </button>

              <p className="text-slate-400 text-xs text-center">
                Your application will be reviewed by admin within 24-48 hours.
                You&apos;ll be notified of the decision.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
