"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  FileText,
  Bell,
  MessageSquare,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  ChevronRight,
  Eye,
  Award,
  TrendingUp,
  Menu,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Stats {
  students: number;
  teachers: number;
  courses: number;
  enrollments: number;
  pendingApplications: number;
}

interface Course {
  id: number;
  title: string;
  status: string;
  fee: string;
  totalEnrolled: number;
  teacherName: string | null;
  categoryName: string | null;
  classType: string;
  level: string | null;
  duration: string | null;
  classLink: string | null;
  schedule: string | null;
  maxStudents: number | null;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
}

interface StudentApp {
  id: number;
  studentName: string | null;
  studentEmail: string | null;
  courseTitle: string | null;
  courseFee: string | null;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  transactionId: string | null;
  notes: string | null;
  appliedAt: string;
}

interface TeacherApp {
  id: number;
  applicantName: string | null;
  applicantEmail: string | null;
  proposedCourseTitle: string;
  proposedCourseDescription: string;
  qualifications: string;
  experience: string | null;
  classType: string;
  classLink: string | null;
  proposedFee: string | null;
  status: string;
  adminNotes: string | null;
  appliedAt: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
  icon: string | null;
}

// ─── Main Admin Component ────────────────────────────────────────────────────

export default function AdminPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data
  const [stats, setStats] = useState<Stats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [studentApps, setStudentApps] = useState<StudentApp[]>([]);
  const [teacherApps, setTeacherApps] = useState<TeacherApp[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Forms
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    shortDescription: "",
    categoryId: "",
    teacherId: "",
    fee: "",
    duration: "",
    level: "Beginner",
    status: "active",
    classType: "google_meet",
    classLink: "",
    schedule: "",
    maxStudents: "50",
    syllabus: "",
    requirements: "",
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    isPinned: false,
  });

  const teachers = users.filter((u) => u.role === "teacher");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (!loading && user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    if (user?.role === "admin") {
      fetchAll();
    }
  }, [user, loading]);

  const fetchAll = async () => {
    await Promise.all([
      fetchStats(),
      fetchCourses(),
      fetchUsers(),
      fetchStudentApps(),
      fetchTeacherApps(),
      fetchAnnouncements(),
      fetchCategories(),
    ]);
  };

  const fetchStats = async () => {
    const res = await fetch("/api/stats");
    if (res.ok) {
      const data = await res.json();
      setStats(data.stats);
    }
  };

  const fetchCourses = async () => {
    const res = await fetch("/api/courses");
    if (res.ok) {
      const data = await res.json();
      setCourses(data.courses || []);
    }
  };

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users || []);
    }
  };

  const fetchStudentApps = async () => {
    const res = await fetch("/api/applications/student?all=true");
    if (res.ok) {
      const data = await res.json();
      setStudentApps(data.applications || []);
    }
  };

  const fetchTeacherApps = async () => {
    const res = await fetch("/api/applications/teacher?all=true");
    if (res.ok) {
      const data = await res.json();
      setTeacherApps(data.applications || []);
    }
  };

  const fetchAnnouncements = async () => {
    const res = await fetch("/api/announcements");
    if (res.ok) {
      const data = await res.json();
      setAnnouncements(data.announcements || []);
    }
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data.categories || []);
    }
  };

  // Course CRUD
  const openCourseForm = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({
        title: course.title,
        description: "",
        shortDescription: "",
        categoryId: "",
        teacherId: course.teacherName ? "" : "",
        fee: course.fee,
        duration: course.duration || "",
        level: course.level || "Beginner",
        status: course.status,
        classType: course.classType,
        classLink: course.classLink || "",
        schedule: course.schedule || "",
        maxStudents: String(course.maxStudents || 50),
        syllabus: "",
        requirements: "",
      });
    } else {
      setEditingCourse(null);
      setCourseForm({
        title: "",
        description: "",
        shortDescription: "",
        categoryId: "",
        teacherId: "",
        fee: "",
        duration: "",
        level: "Beginner",
        status: "active",
        classType: "google_meet",
        classLink: "",
        schedule: "",
        maxStudents: "50",
        syllabus: "",
        requirements: "",
      });
    }
    setShowCourseForm(true);
  };

  const saveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingCourse ? "PUT" : "POST";
    const url = editingCourse ? `/api/courses/${editingCourse.id}` : "/api/courses";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courseForm),
    });

    if (res.ok) {
      toast.success(editingCourse ? "Course updated!" : "Course created!");
      setShowCourseForm(false);
      fetchCourses();
      fetchStats();
    } else {
      const data = await res.json();
      toast.error(data.error || "Failed to save course");
    }
  };

  const deleteCourse = async (id: number) => {
    if (!confirm("Delete this course? This action cannot be undone.")) return;
    const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Course deleted");
      fetchCourses();
      fetchStats();
    } else {
      toast.error("Failed to delete course");
    }
  };

  // Application Actions
  const reviewStudentApp = async (id: number, status: string, paymentStatus: string, adminNotes = "") => {
    const res = await fetch(`/api/applications/student/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, paymentStatus, adminNotes }),
    });

    if (res.ok) {
      toast.success(`Application ${status}`);
      fetchStudentApps();
      fetchStats();
    } else {
      toast.error("Failed to update application");
    }
  };

  const reviewTeacherApp = async (id: number, status: string) => {
    const res = await fetch(`/api/applications/teacher/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      toast.success(`Teacher application ${status}`);
      fetchTeacherApps();
      fetchUsers();
    } else {
      toast.error("Failed to update application");
    }
  };

  const toggleUserActive = async (userId: number, isActive: boolean) => {
    const res = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });

    if (res.ok) {
      toast.success(isActive ? "User deactivated" : "User activated");
      fetchUsers();
    } else {
      toast.error("Failed to update user");
    }
  };

  const deleteUser = async (userId: number) => {
    if (!confirm("Delete this user?")) return;
    const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("User deleted");
      fetchUsers();
      fetchStats();
    } else {
      toast.error("Failed to delete user");
    }
  };

  const createAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(announcementForm),
    });

    if (res.ok) {
      toast.success("Announcement posted!");
      setShowAnnouncementForm(false);
      setAnnouncementForm({ title: "", content: "", isPinned: false });
      fetchAnnouncements();
    } else {
      toast.error("Failed to post announcement");
    }
  };

  const deleteAnnouncement = async (id: number) => {
    const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Announcement deleted");
      fetchAnnouncements();
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      active: "bg-green-100 text-green-700",
      inactive: "bg-slate-100 text-slate-600",
      upcoming: "bg-purple-100 text-purple-700",
      submitted: "bg-blue-100 text-blue-700",
      verified: "bg-green-100 text-green-700",
    };
    return colors[status] || "bg-slate-100 text-slate-600";
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "courses", label: "Courses", icon: <BookOpen size={18} /> },
    { id: "users", label: "Users", icon: <Users size={18} /> },
    {
      id: "student-apps",
      label: "Student Applications",
      icon: <GraduationCap size={18} />,
      badge: studentApps.filter((a) => a.status === "pending").length,
    },
    {
      id: "teacher-apps",
      label: "Teacher Applications",
      icon: <Award size={18} />,
      badge: teacherApps.filter((a) => a.status === "pending").length,
    },
    { id: "announcements", label: "Announcements", icon: <Bell size={18} /> },
  ];

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300`}
      >
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="TCA"
              width={40}
              height={40}
              className="rounded-full ring-2 ring-green-600"
            />
            <div>
              <p className="font-bold text-white text-sm">The Core Academy</p>
              <p className="text-green-400 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === item.id
                  ? "bg-green-700 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-5 text-center">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-xs font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user.name}</p>
              <p className="text-slate-500 text-xs truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 text-sm py-1.5 transition-colors"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-white font-black text-lg capitalize">
              {navItems.find((n) => n.id === tab)?.label || "Dashboard"}
            </h1>
          </div>
          <Link
            href="/"
            className="text-slate-400 hover:text-green-400 text-sm flex items-center gap-1 transition-colors"
          >
            <Eye size={15} />
            View Site
          </Link>
        </div>

        <div className="p-6 space-y-6">
          {/* ── Dashboard Tab ─────────────────────────────────────────── */}
          {tab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { label: "Students", value: stats?.students ?? "—", icon: "🎓", color: "from-blue-600 to-blue-700" },
                  { label: "Teachers", value: stats?.teachers ?? "—", icon: "👨‍🏫", color: "from-green-600 to-green-700" },
                  { label: "Courses", value: stats?.courses ?? "—", icon: "📚", color: "from-purple-600 to-purple-700" },
                  { label: "Enrollments", value: stats?.enrollments ?? "—", icon: "✅", color: "from-amber-600 to-amber-700" },
                  { label: "Pending", value: stats?.pendingApplications ?? "—", icon: "⏳", color: "from-red-600 to-red-700" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 shadow-lg`}
                  >
                    <div className="text-3xl mb-2">{s.icon}</div>
                    <div className="text-3xl font-black">{s.value}</div>
                    <div className="text-white/70 text-xs mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Quick Links */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "Manage Courses", desc: "Add, edit, or remove courses", tab: "courses", icon: <BookOpen size={20} /> },
                  { label: "Student Admissions", desc: "Review & approve applications", tab: "student-apps", icon: <GraduationCap size={20} /> },
                  { label: "Teacher Approvals", desc: "Review teacher applications", tab: "teacher-apps", icon: <Award size={20} /> },
                ].map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => setTab(item.tab)}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl p-5 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-green-400 group-hover:text-green-300">{item.icon}</div>
                      <p className="text-white font-bold text-sm">{item.label}</p>
                    </div>
                    <p className="text-slate-400 text-xs">{item.desc}</p>
                    <ChevronRight size={14} className="text-slate-500 mt-2 group-hover:text-green-400 transition-colors" />
                  </button>
                ))}
              </div>

              {/* Recent Applications */}
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-white font-black mb-4">Recent Student Applications</h3>
                {studentApps.slice(0, 5).length === 0 ? (
                  <p className="text-slate-500 text-sm">No applications yet</p>
                ) : (
                  <div className="space-y-3">
                    {studentApps.slice(0, 5).map((app) => (
                      <div key={app.id} className="flex items-center justify-between bg-slate-900/50 rounded-xl p-3">
                        <div>
                          <p className="text-white text-sm font-semibold">{app.studentName}</p>
                          <p className="text-slate-400 text-xs">{app.courseTitle}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Courses Tab ─────────────────────────────────────────── */}
          {tab === "courses" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-slate-400 text-sm">{courses.length} courses total</p>
                <button
                  onClick={() => openCourseForm()}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shine"
                >
                  <Plus size={16} />
                  Add Course
                </button>
              </div>

              <div className="grid gap-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-slate-800 border border-slate-700 rounded-2xl p-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-bold">{course.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(course.status)}`}>
                            {course.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                          <span>👤 {course.teacherName || "Unassigned"}</span>
                          <span>📁 {course.categoryName || "Uncategorized"}</span>
                          <span>💰 PKR {parseInt(course.fee).toLocaleString()}</span>
                          <span>🎓 {course.totalEnrolled} enrolled</span>
                          <span>
                            📡 {course.classType === "google_meet" ? "Google Meet" : course.classType === "discord" ? "Discord" : "Online"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => openCourseForm(course)}
                          className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => deleteCourse(course.id)}
                          className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Course Form Modal */}
              {showCourseForm && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center pt-6 px-4 overflow-y-auto">
                  <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-2xl p-8 mb-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-white text-xl font-black">
                        {editingCourse ? "Edit Course" : "Create New Course"}
                      </h2>
                      <button onClick={() => setShowCourseForm(false)} className="text-slate-400 hover:text-white">
                        <X size={22} />
                      </button>
                    </div>

                    <form onSubmit={saveCourse} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-slate-300 text-xs font-semibold mb-1.5">Course Title *</label>
                          <input
                            type="text"
                            value={courseForm.title}
                            onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                            required
                            placeholder="e.g. Web Development Bootcamp"
                            className="w-full bg-slate-900 border border-slate-600 focus:border-green-500 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-300 text-xs font-semibold mb-1.5">Description *</label>
                          <textarea
                            value={courseForm.description}
                            onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                            required
                            rows={3}
                            placeholder="Full course description..."
                            className="w-full bg-slate-900 border border-slate-600 focus:border-green-500 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-300 text-xs font-semibold mb-1.5">Short Description</label>
                          <input
                            type="text"
                            value={courseForm.shortDescription}
                            onChange={(e) => setCourseForm({ ...courseForm, shortDescription: e.target.value })}
                            placeholder="Brief course summary (shown on cards)"
                            className="w-full bg-slate-900 border border-slate-600 focus:border-green-500 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 text-xs font-semibold mb-1.5">Teacher</label>
                          <select
                            value={courseForm.teacherId}
                            onChange={(e) => setCourseForm({ ...courseForm, teacherId: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500"
                          >
                            <option value="">Select Teacher</option>
                            {teachers.map((t) => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-300 text-xs font-semibold mb-1.5">Category</label>
                          <select
                            value={courseForm.categoryId}
                            onChange={(e) => setCourseForm({ ...courseForm, categoryId: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500"
                          >
                            <option value="">Select Category</option>
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-300 text-xs font-semibold mb-1.5">Fee (PKR) *</label>
                          <input
                            type="number"
                            value={courseForm.fee}
                            onChange={(e) => setCourseForm({ ...courseForm, fee: e.target.value })}
                            required
                            placeholder="15000"
                            className="w-full bg-slate-900 border border-slate-600 focus:border-green-500 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 text-xs font-semibold mb-1.5">Duration</label>
                          <input
                            type="text"
                            value={courseForm.duration}
                            onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                            placeholder="e.g. 3 Months"
                            className="w-full bg-slate-900 border border-slate-600 focus:border-green-500 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 text-xs font-semibold mb-1.5">Level</label>
                          <select
                            value={courseForm.level}
                            onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500"
                          >
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-300 text-xs font-semibold mb-1.5">Status</label>
                          <select
                            value={courseForm.status}
                            onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="upcoming">Upcoming</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-300 text-xs font-semibold mb-1.5">Class Type</label>
                          <select
                            value={courseForm.classType}
                            onChange={(e) => setCourseForm({ ...courseForm, classType: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500"
                          >
                            <option value="google_meet">📹 Google Meet</option>
                            <option value="discord">🎮 Discord</option>
                            <option value="online">🌐 Online</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-300 text-xs font-semibold mb-1.5">Max Students</label>
                          <input
                            type="number"
                            value={courseForm.maxStudents}
                            onChange={(e) => setCourseForm({ ...courseForm, maxStudents: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-600 focus:border-green-500 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-300 text-xs font-semibold mb-1.5">Class Link</label>
                          <input
                            type="text"
                            value={courseForm.classLink}
                            onChange={(e) => setCourseForm({ ...courseForm, classLink: e.target.value })}
                            placeholder="https://meet.google.com/..."
                            className="w-full bg-slate-900 border border-slate-600 focus:border-green-500 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-300 text-xs font-semibold mb-1.5">Schedule</label>
                          <input
                            type="text"
                            value={courseForm.schedule}
                            onChange={(e) => setCourseForm({ ...courseForm, schedule: e.target.value })}
                            placeholder="e.g. Mon, Wed, Fri - 7:00 PM to 9:00 PM PKT"
                            className="w-full bg-slate-900 border border-slate-600 focus:border-green-500 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-300 text-xs font-semibold mb-1.5">Syllabus (comma-separated)</label>
                          <input
                            type="text"
                            value={courseForm.syllabus}
                            onChange={(e) => setCourseForm({ ...courseForm, syllabus: e.target.value })}
                            placeholder="Topic 1, Topic 2, Topic 3..."
                            className="w-full bg-slate-900 border border-slate-600 focus:border-green-500 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-300 text-xs font-semibold mb-1.5">Requirements</label>
                          <textarea
                            value={courseForm.requirements}
                            onChange={(e) => setCourseForm({ ...courseForm, requirements: e.target.value })}
                            rows={2}
                            placeholder="Prerequisites and requirements for students..."
                            className="w-full bg-slate-900 border border-slate-600 focus:border-green-500 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowCourseForm(false)}
                          className="flex-1 border border-slate-600 text-slate-300 hover:text-white py-3 rounded-xl text-sm transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl text-sm transition-all shine"
                        >
                          {editingCourse ? "Update Course" : "Create Course"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Users Tab ─────────────────────────────────────────────── */}
          {tab === "users" && (
            <div className="space-y-4">
              <div className="flex gap-3 mb-2">
                {["all", "student", "teacher", "admin"].map((role) => (
                  <button
                    key={role}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors capitalize"
                    onClick={() => {
                      // Filter handled client side
                    }}
                  >
                    {role === "all" ? `All (${users.length})` : `${role}s (${users.filter((u) => u.role === role).length})`}
                  </button>
                ))}
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left text-slate-400 font-medium px-4 py-3">Name</th>
                        <th className="text-left text-slate-400 font-medium px-4 py-3">Email</th>
                        <th className="text-left text-slate-400 font-medium px-4 py-3">Role</th>
                        <th className="text-left text-slate-400 font-medium px-4 py-3">Status</th>
                        <th className="text-left text-slate-400 font-medium px-4 py-3">Joined</th>
                        <th className="text-left text-slate-400 font-medium px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-green-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-white font-medium">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-400">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusBadge(u.role)}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${u.isActive ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
                              {u.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-xs">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => toggleUserActive(u.id, u.isActive)}
                                className={`p-1.5 rounded-lg text-xs transition-colors ${u.isActive ? "bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30" : "bg-green-600/20 text-green-400 hover:bg-green-600/30"}`}
                                title={u.isActive ? "Deactivate" : "Activate"}
                              >
                                {u.isActive ? <X size={13} /> : <Check size={13} />}
                              </button>
                              {u.role !== "admin" && (
                                <button
                                  onClick={() => deleteUser(u.id)}
                                  className="p-1.5 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── Student Applications Tab ───────────────────────────────── */}
          {tab === "student-apps" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-slate-400 text-sm">
                  {studentApps.filter((a) => a.status === "pending").length} pending ·{" "}
                  {studentApps.length} total
                </p>
              </div>

              {studentApps.length === 0 ? (
                <div className="text-center py-16 text-slate-500">No applications yet</div>
              ) : (
                <div className="space-y-4">
                  {studentApps.map((app) => (
                    <div
                      key={app.id}
                      className="bg-slate-800 border border-slate-700 rounded-2xl p-6"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-white font-bold">{app.studentName}</h3>
                            <span className="text-slate-400 text-xs">{app.studentEmail}</span>
                          </div>
                          <p className="text-green-400 text-sm font-semibold mb-1">
                            📚 {app.courseTitle}
                          </p>
                          <div className="flex flex-wrap gap-3 text-xs text-slate-400 mb-2">
                            <span>💰 PKR {parseInt(app.courseFee || "0").toLocaleString()}</span>
                            {app.paymentMethod && <span>💳 {app.paymentMethod}</span>}
                            {app.transactionId && (
                              <span className="font-mono">TxID: {app.transactionId}</span>
                            )}
                            <span>
                              📅 {new Date(app.appliedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          {app.notes && (
                            <p className="text-slate-400 text-xs italic">Notes: {app.notes}</p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(app.status)}`}>
                              {app.status}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(app.paymentStatus)}`}>
                              💳 {app.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {app.status === "pending" && (
                          <div className="flex flex-col gap-2 shrink-0">
                            <button
                              onClick={() => reviewStudentApp(app.id, "approved", "verified")}
                              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-xs px-4 py-2 rounded-xl font-semibold transition-all"
                            >
                              <Check size={13} />
                              Approve & Enroll
                            </button>
                            <button
                              onClick={() => reviewStudentApp(app.id, "rejected", "rejected", "Payment verification failed")}
                              className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs px-4 py-2 rounded-xl font-semibold transition-all"
                            >
                              <X size={13} />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Teacher Applications Tab ──────────────────────────────── */}
          {tab === "teacher-apps" && (
            <div className="space-y-4">
              {teacherApps.length === 0 ? (
                <div className="text-center py-16 text-slate-500">No teacher applications yet</div>
              ) : (
                <div className="space-y-4">
                  {teacherApps.map((app) => (
                    <div key={app.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-white font-bold">{app.applicantName}</h3>
                            <span className="text-slate-400 text-xs">{app.applicantEmail}</span>
                          </div>
                          <p className="text-green-400 font-semibold mb-2">
                            📚 Proposed: {app.proposedCourseTitle}
                          </p>
                          <p className="text-slate-300 text-sm mb-3 leading-relaxed">
                            {app.proposedCourseDescription}
                          </p>
                          <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-400 mb-2">
                            <div>
                              <span className="text-slate-300 font-semibold block mb-0.5">Qualifications</span>
                              {app.qualifications}
                            </div>
                            {app.experience && (
                              <div>
                                <span className="text-slate-300 font-semibold block mb-0.5">Experience</span>
                                {app.experience}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                            <span>
                              📡{" "}
                              {app.classType === "google_meet" ? "Google Meet" : app.classType === "discord" ? "Discord" : "Online"}
                            </span>
                            {app.proposedFee && (
                              <span>💰 PKR {parseInt(app.proposedFee).toLocaleString()} proposed</span>
                            )}
                            <span>
                              📅 {new Date(app.appliedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(app.status)}`}>
                              {app.status}
                            </span>
                          </div>
                        </div>

                        {app.status === "pending" && (
                          <div className="flex flex-col gap-2 shrink-0">
                            <button
                              onClick={() => reviewTeacherApp(app.id, "approved")}
                              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-xs px-4 py-2 rounded-xl font-semibold transition-all"
                            >
                              <Check size={13} />
                              Approve Teacher
                            </button>
                            <button
                              onClick={() => reviewTeacherApp(app.id, "rejected")}
                              className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs px-4 py-2 rounded-xl font-semibold transition-all"
                            >
                              <X size={13} />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Announcements Tab ─────────────────────────────────────── */}
          {tab === "announcements" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAnnouncementForm(true)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shine"
                >
                  <Plus size={16} />
                  New Announcement
                </button>
              </div>

              {showAnnouncementForm && (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-white font-black mb-4">Post Announcement</h3>
                  <form onSubmit={createAnnouncement} className="space-y-4">
                    <input
                      type="text"
                      value={announcementForm.title}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                      required
                      placeholder="Announcement Title"
                      className="w-full bg-slate-900 border border-slate-600 focus:border-green-500 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none"
                    />
                    <textarea
                      value={announcementForm.content}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                      required
                      rows={4}
                      placeholder="Announcement content..."
                      className="w-full bg-slate-900 border border-slate-600 focus:border-green-500 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none resize-none"
                    />
                    <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={announcementForm.isPinned}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, isPinned: e.target.checked })}
                        className="accent-green-500"
                      />
                      Pin this announcement
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAnnouncementForm(false)}
                        className="flex-1 border border-slate-600 text-slate-300 py-2.5 rounded-xl text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 rounded-xl text-sm shine"
                      >
                        Post Announcement
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div key={ann.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {ann.isPinned && (
                            <span className="text-xs bg-green-700 text-green-100 px-2 py-0.5 rounded-full">
                              📌 Pinned
                            </span>
                          )}
                          <h3 className="text-white font-bold">{ann.title}</h3>
                        </div>
                        <p className="text-slate-400 text-sm">{ann.content}</p>
                        <p className="text-slate-600 text-xs mt-2">
                          {new Date(ann.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteAnnouncement(ann.id)}
                        className="text-red-400 hover:text-red-300 p-1.5 shrink-0"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
