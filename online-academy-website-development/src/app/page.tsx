"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import {
  GraduationCap,
  Users,
  BookOpen,
  Star,
  ArrowRight,
  CheckCircle,
  Globe,
  Award,
  Zap,
  MessageCircle,
  Video,
  Shield,
  ChevronRight,
  Bell,
  Phone,
  Mail,
  MapPin,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";

interface Course {
  id: number;
  title: string;
  shortDescription: string | null;
  fee: string;
  duration: string | null;
  level: string | null;
  classType: string;
  totalEnrolled: number;
  teacherName: string | null;
  categoryName: string | null;
  status: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  authorName: string | null;
}

interface Stats {
  students: number;
  teachers: number;
  courses: number;
  enrollments: number;
}

const features = [
  {
    icon: <Video className="w-6 h-6" />,
    title: "Live Online Classes",
    desc: "Join live sessions via Google Meet or Discord with expert teachers",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Certified Courses",
    desc: "Earn recognized certificates upon course completion",
    color: "from-green-500 to-green-600",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Learn Anywhere",
    desc: "Access course materials from anywhere in the world",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Expert Teachers",
    desc: "Learn from qualified and experienced instructors",
    color: "from-amber-500 to-amber-600",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Flexible Schedule",
    desc: "Morning and evening batches to fit your lifestyle",
    color: "from-red-500 to-red-600",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Community Support",
    desc: "Active community for doubt resolution and peer learning",
    color: "from-teal-500 to-teal-600",
  },
];

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<Stats>({ students: 0, teachers: 0, courses: 0, enrollments: 0 });
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Seed if needed
    try {
      const seedRes = await fetch("/api/seed", { method: "POST" });
      if (seedRes.ok) {
        const seedData = await seedRes.json();
        if (seedData.message === "Seeded successfully") {
          console.log("Demo data initialized");
        }
      }
    } catch {}

    try {
      const [coursesRes, announcementsRes] = await Promise.all([
        fetch("/api/courses?status=active"),
        fetch("/api/announcements"),
      ]);

      if (coursesRes.ok) {
        const data = await coursesRes.json();
        setCourses(data.courses?.slice(0, 6) || []);
      }

      if (announcementsRes.ok) {
        const data = await announcementsRes.json();
        setAnnouncements(data.announcements || []);
      }

      // Public stats (no auth needed for display)
      setStats({ students: 120, teachers: 8, courses: 12, enrollments: 250 });
    } catch {}
  };

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      if (res.ok) {
        toast.success("Message sent! We'll get back to you soon.");
        setContactForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getClassIcon = (classType: string) => {
    if (classType === "discord") return "🎮";
    if (classType === "google_meet") return "📹";
    return "🌐";
  };

  const getLevelColor = (level: string | null) => {
    if (level === "Advanced") return "bg-red-100 text-red-700";
    if (level === "Intermediate") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-green-950 to-slate-900">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Floating circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-700/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-600/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-green-500/20 blur-xl scale-150 animate-pulse-slow" />
              <Image
                src="/images/logo.png"
                alt="The Core Academy Logo"
                width={140}
                height={140}
                className="relative rounded-full ring-4 ring-green-500/50 shadow-2xl"
                priority
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-green-900/40 border border-green-700/50 rounded-full px-4 py-2 text-green-400 text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            <span>Pakistan&apos;s Premier Online Academy</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Learn. Grow.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              Excel.
            </span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Join <strong className="text-white">The Core Academy</strong> — where world-class educators
            meet passionate learners. Explore expert-led courses in IT, Mathematics, Languages, and Sciences
            through live online classes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/courses"
              className="group inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg shadow-green-900/30 hover:shadow-green-900/50 hover:scale-105 shine"
            >
              Explore Courses
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105"
            >
              Apply for Admission
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: "Students Enrolled", value: "500+", icon: "🎓" },
              { label: "Expert Teachers", value: "20+", icon: "👨‍🏫" },
              { label: "Courses Offered", value: "15+", icon: "📚" },
              { label: "Success Rate", value: "95%", icon: "⭐" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-2xl p-4 text-center"
              >
                <div className="text-3xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-slate-400 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-green-500/50 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-green-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Announcements Banner */}
      {announcements.length > 0 && (
        <section className="bg-green-900 py-3 overflow-hidden">
          <div className="flex items-center gap-3 max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 text-green-300 shrink-0">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-semibold uppercase tracking-wide">Latest</span>
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-green-100 text-sm truncate">
                📢 {announcements[0]?.title}: {announcements[0]?.content}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-green-600 font-semibold text-sm uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
              Everything You Need to{" "}
              <span className="text-gradient-green">Succeed</span>
            </h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
              The Core Academy provides a complete learning ecosystem with professional teachers,
              flexible scheduling, and modern online tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-slate-100 hover:border-green-200 bg-slate-50 hover:bg-white shadow-sm hover:shadow-lg card-hover"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
            <div>
              <span className="text-green-600 font-semibold text-sm uppercase tracking-widest">Our Courses</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                Featured <span className="text-gradient-green">Courses</span>
              </h2>
            </div>
            <Link
              href="/courses"
              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-sm group"
            >
              View All Courses
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-16 text-slate-400">Loading courses...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link key={course.id} href={`/courses/${course.id}`}>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden card-hover h-full flex flex-col">
                    <div className="bg-gradient-to-br from-green-900 to-slate-800 p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 text-8xl opacity-10">📚</div>
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                          {course.categoryName && (
                            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                              {course.categoryName}
                            </span>
                          )}
                          <span className="text-xs text-slate-400 ml-auto">
                            {getClassIcon(course.classType)}{" "}
                            {course.classType === "google_meet" ? "Google Meet" : course.classType === "discord" ? "Discord" : "Online"}
                          </span>
                        </div>
                        <h3 className="text-white font-bold text-lg leading-tight">{course.title}</h3>
                        {course.teacherName && (
                          <p className="text-green-300 text-xs mt-1">by {course.teacherName}</p>
                        )}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">
                        {course.shortDescription || "Expert-led course at The Core Academy"}
                      </p>

                      <div className="flex items-center gap-3 mb-4">
                        {course.level && (
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getLevelColor(course.level)}`}>
                            {course.level}
                          </span>
                        )}
                        {course.duration && (
                          <span className="text-xs text-slate-400">⏱ {course.duration}</span>
                        )}
                        <span className="text-xs text-slate-400 ml-auto">
                          {course.totalEnrolled} enrolled
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div>
                          <span className="text-2xl font-black text-green-700">
                            PKR {parseInt(course.fee).toLocaleString()}
                          </span>
                          <span className="text-slate-400 text-xs ml-1">/ course</span>
                        </div>
                        <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                          Enroll Now <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-green-400 font-semibold text-sm uppercase tracking-widest">About Us</span>
              <h2 className="text-3xl sm:text-4xl font-black mt-2 mb-6">
                Empowering Students,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                  Shaping Futures
                </span>
              </h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                The Core Academy (TCA) is a premier online educational institution dedicated to providing
                high-quality education to students across Pakistan and beyond. We believe that education is
                the most powerful tool to change the world.
              </p>
              <p className="text-slate-300 leading-relaxed mb-8">
                Our team of experienced educators delivers interactive, engaging lessons through modern
                platforms. Whether you&apos;re looking to advance your career in tech, improve your academic
                performance, or master a new language, TCA has a course for you.
              </p>

              <div className="space-y-3">
                {[
                  "Expert teachers with industry experience",
                  "Interactive live classes on Google Meet & Discord",
                  "Affordable fee structure with quality education",
                  "Certificate upon successful course completion",
                  "Community support and mentorship",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                    <span className="text-slate-300 text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Years of Excellence", value: "5+", icon: "🏆", bg: "from-green-700 to-green-800" },
                { label: "Students Taught", value: "500+", icon: "🎓", bg: "from-blue-700 to-blue-800" },
                { label: "Expert Teachers", value: "20+", icon: "👨‍🏫", bg: "from-purple-700 to-purple-800" },
                { label: "Courses Available", value: "15+", icon: "📚", bg: "from-amber-700 to-amber-800" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-6 text-center card-hover`}
                >
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="text-3xl font-black text-white">{stat.value}</div>
                  <div className="text-white/70 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Teach With Us CTA */}
      <section className="py-16 bg-green-50 border-y border-green-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">👨‍🏫</div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            Are You an <span className="text-green-600">Expert Teacher?</span>
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Create your own classroom at The Core Academy! Apply to become a teacher,
            set your own schedule, and teach students via Google Meet or Discord.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply-teacher"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shine"
            >
              <Award className="w-5 h-5" />
              Apply as Teacher
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 border-2 border-green-600 text-green-700 hover:bg-green-700 hover:text-white font-bold px-8 py-4 rounded-xl transition-all"
            >
              <BookOpen className="w-5 h-5" />
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      {announcements.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-green-600 font-semibold text-sm uppercase tracking-widest">Updates</span>
              <h2 className="text-3xl font-black text-slate-900 mt-1">
                Announcements
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.slice(0, 3).map((announcement) => (
                <div
                  key={announcement.id}
                  className={`rounded-2xl p-6 border ${announcement.isPinned ? "border-green-300 bg-green-50" : "border-slate-100 bg-slate-50"}`}
                >
                  {announcement.isPinned && (
                    <span className="inline-block mb-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-semibold">
                      📌 Pinned
                    </span>
                  )}
                  <h3 className="font-bold text-slate-900 mb-2">{announcement.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{announcement.content}</p>
                  <p className="text-slate-400 text-xs mt-3">
                    {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-green-400 font-semibold text-sm uppercase tracking-widest">Contact Us</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Touch</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Phone / WhatsApp</p>
                    <p className="text-white font-semibold">+92-300-CORE-TCA</p>
                  </div>
                </div>
              </div>
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Email</p>
                    <p className="text-white font-semibold">info@thecoreacademy.edu.pk</p>
                  </div>
                </div>
              </div>
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Location</p>
                    <p className="text-white font-semibold">Pakistan (Online Nationwide)</p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <p className="text-white font-semibold mb-3">Admin Login Credentials</p>
                <p className="text-slate-400 text-sm">Email: <span className="text-green-400">admin@tca.edu</span></p>
                <p className="text-slate-400 text-sm">Password: <span className="text-green-400">admin123</span></p>
                <Link href="/login" className="inline-block mt-3 text-green-400 text-sm hover:text-green-300">
                  → Go to Admin Login
                </Link>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleContact} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Your Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Full Name"
                    required
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="email@example.com"
                    required
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Subject</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="How can we help?"
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Tell us about your inquiry..."
                  required
                  rows={5}
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shine"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="TCA Logo"
                width={40}
                height={40}
                className="rounded-full ring-2 ring-green-600"
              />
              <div>
                <p className="text-white font-bold">The Core Academy</p>
                <p className="text-slate-500 text-xs">Empowering Learners Since 2019</p>
              </div>
            </div>

            <div className="flex gap-6 text-sm text-slate-400">
              <Link href="/" className="hover:text-green-400 transition-colors">Home</Link>
              <Link href="/courses" className="hover:text-green-400 transition-colors">Courses</Link>
              <Link href="/register" className="hover:text-green-400 transition-colors">Register</Link>
              <Link href="/login" className="hover:text-green-400 transition-colors">Login</Link>
            </div>

            <p className="text-slate-600 text-sm">
              © 2024 The Core Academy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
