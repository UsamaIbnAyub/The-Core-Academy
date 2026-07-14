"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Search, Filter, BookOpen, ArrowRight, Users, Clock } from "lucide-react";

interface Course {
  id: number;
  title: string;
  shortDescription: string | null;
  description: string;
  fee: string;
  duration: string | null;
  level: string | null;
  classType: string;
  totalEnrolled: number;
  teacherName: string | null;
  categoryName: string | null;
  status: string;
  schedule: string | null;
}

interface Category {
  id: number;
  name: string;
  icon: string | null;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("active");

  useEffect(() => {
    Promise.all([fetch("/api/courses"), fetch("/api/categories")]).then(
      async ([coursesRes, categoriesRes]) => {
        if (coursesRes.ok) {
          const data = await coursesRes.json();
          setCourses(data.courses || []);
        }
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data.categories || []);
        }
        setLoading(false);
      }
    );
  }, []);

  const filtered = courses.filter((c) => {
    const matchSearch =
      search === "" ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.shortDescription || "").toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      selectedCategory === "all" || c.categoryName === selectedCategory;
    const matchLevel = selectedLevel === "all" || c.level === selectedLevel;
    const matchStatus = selectedStatus === "all" || c.status === selectedStatus;
    return matchSearch && matchCategory && matchLevel && matchStatus;
  });

  const getClassIcon = (classType: string) => {
    if (classType === "discord") return "🎮 Discord";
    if (classType === "google_meet") return "📹 Google Meet";
    return "🌐 Online";
  };

  const getLevelBadge = (level: string | null) => {
    const colors: Record<string, string> = {
      Beginner: "bg-green-100 text-green-700 border-green-200",
      Intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Advanced: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[level || "Beginner"] || "bg-slate-100 text-slate-700";
  };

  const getStatusBadge = (status: string) => {
    if (status === "upcoming") return "bg-purple-100 text-purple-700 border-purple-200";
    if (status === "inactive") return "bg-slate-100 text-slate-500";
    return "bg-green-100 text-green-700 border-green-200";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-green-400 text-sm font-semibold uppercase tracking-widest">
            All Courses
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-2 mb-4">
            Explore Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              Courses
            </span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Discover expert-led courses in IT, Mathematics, Languages, and Sciences.
            Start your learning journey today!
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-500 bg-slate-50"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-slate-50 text-slate-700"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-slate-50 text-slate-700"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-slate-50 text-slate-700"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Loading courses...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-semibold text-lg">No courses found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <p className="text-slate-500 text-sm mb-6">{filtered.length} course(s) found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course) => (
                <Link key={course.id} href={`/courses/${course.id}`}>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden card-hover h-full flex flex-col group">
                    <div className="bg-gradient-to-br from-green-900 to-slate-800 p-6 relative overflow-hidden">
                      <div className="absolute top-2 right-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full border font-semibold ${getStatusBadge(course.status)}`}
                        >
                          {course.status === "upcoming" ? "🔜 Upcoming" : course.status === "active" ? "✅ Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="absolute bottom-0 right-0 text-8xl opacity-5">📚</div>
                      <div className="relative">
                        {course.categoryName && (
                          <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full mb-2 inline-block">
                            {course.categoryName}
                          </span>
                        )}
                        <h3 className="text-white font-bold text-lg leading-tight group-hover:text-green-300 transition-colors">
                          {course.title}
                        </h3>
                        {course.teacherName && (
                          <p className="text-green-300 text-xs mt-1 flex items-center gap-1">
                            <Users className="w-3 h-3" /> {course.teacherName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">
                        {course.shortDescription || course.description.slice(0, 100) + "..."}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>📡</span>
                          <span>{getClassIcon(course.classType)}</span>
                        </div>
                        {course.schedule && (
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span className="truncate">{course.schedule}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        {course.level && (
                          <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getLevelBadge(course.level)}`}>
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
                          <span className="text-xl font-black text-green-700">
                            PKR {parseInt(course.fee).toLocaleString()}
                          </span>
                          <span className="text-slate-400 text-xs ml-1">/ course</span>
                        </div>
                        <span className="text-green-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                          View <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">© 2024 The Core Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
