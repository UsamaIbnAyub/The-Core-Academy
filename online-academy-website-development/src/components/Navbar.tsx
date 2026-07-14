"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Menu,
  X,
  GraduationCap,
  LogOut,
  User,
  LayoutDashboard,
  BookOpen,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
    setDropdownOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin";
    return "/dashboard";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-green-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-green-500 group-hover:ring-green-400 transition-all">
              <Image src="/images/logo.png" alt="TCA Logo" fill className="object-cover" />
            </div>
            <div>
              <span className="text-white font-bold text-lg leading-none block">The Core Academy</span>
              <span className="text-green-400 text-xs font-semibold tracking-widest">TCA</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-slate-300 hover:text-green-400 text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/courses"
              className="text-slate-300 hover:text-green-400 text-sm font-medium transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/#about"
              className="text-slate-300 hover:text-green-400 text-sm font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="/#contact"
              className="text-slate-300 hover:text-green-400 text-sm font-medium transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-green-700/20 hover:bg-green-700/30 border border-green-700/40 rounded-full px-4 py-2 text-white text-sm transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-24 truncate">{user.name}</span>
                  <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-700">
                      <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                      <p className="text-slate-400 text-xs truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-green-900/50 text-green-400 text-xs rounded-full capitalize">
                        {user.role}
                      </span>
                    </div>
                    <div className="p-2">
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg text-sm transition-colors"
                      >
                        <LayoutDashboard size={15} />
                        Dashboard
                      </Link>
                      <Link
                        href="/courses"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg text-sm transition-colors"
                      >
                        <BookOpen size={15} />
                        Browse Courses
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg text-sm transition-colors"
                      >
                        <LogOut size={15} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-slate-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-500 transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all shine"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-slate-300 hover:text-white p-2"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4">
          <div className="space-y-2">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="block text-slate-300 hover:text-green-400 py-2 text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/courses"
              onClick={() => setMenuOpen(false)}
              className="block text-slate-300 hover:text-green-400 py-2 text-sm font-medium"
            >
              Courses
            </Link>
            <Link
              href="/#about"
              onClick={() => setMenuOpen(false)}
              className="block text-slate-300 hover:text-green-400 py-2 text-sm font-medium"
            >
              About
            </Link>
            <Link
              href="/#contact"
              onClick={() => setMenuOpen(false)}
              className="block text-slate-300 hover:text-green-400 py-2 text-sm font-medium"
            >
              Contact
            </Link>
            {user ? (
              <>
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMenuOpen(false)}
                  className="block text-slate-300 hover:text-green-400 py-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="block text-red-400 py-2 text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center text-slate-300 border border-slate-700 py-2 rounded-lg text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center bg-green-600 text-white py-2 rounded-lg text-sm font-semibold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
