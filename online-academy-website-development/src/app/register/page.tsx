"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, UserPlus, GraduationCap, Users } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      role: form.role,
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Account created successfully! Welcome to TCA!");
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="TCA Logo"
              width={80}
              height={80}
              className="rounded-full ring-4 ring-green-500/50"
            />
            <div>
              <p className="text-white font-black text-xl">The Core Academy</p>
              <p className="text-green-400 text-xs tracking-widest">TCA</p>
            </div>
          </Link>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-white text-2xl font-black mb-1">Create Account</h1>
          <p className="text-slate-400 text-sm mb-6">Join The Core Academy today</p>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "student" })}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                form.role === "student"
                  ? "border-green-500 bg-green-900/30 text-green-400"
                  : "border-slate-600 text-slate-400 hover:border-slate-500"
              }`}
            >
              <GraduationCap size={18} />
              Student
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "teacher" })}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                form.role === "teacher"
                  ? "border-green-500 bg-green-900/30 text-green-400"
                  : "border-slate-600 text-slate-400 hover:border-slate-500"
              }`}
            >
              <Users size={18} />
              Teacher
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-xs font-medium mb-1.5">Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Muhammad Ali"
                required
                className="w-full bg-slate-900/50 border border-slate-600 focus:border-green-500 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-medium mb-1.5">Email Address *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                required
                className="w-full bg-slate-900/50 border border-slate-600 focus:border-green-500 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-medium mb-1.5">Phone (Optional)</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+92-300-0000000"
                className="w-full bg-slate-900/50 border border-slate-600 focus:border-green-500 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-medium mb-1.5">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters"
                  required
                  className="w-full bg-slate-900/50 border border-slate-600 focus:border-green-500 text-white placeholder-slate-500 rounded-xl px-4 py-3 pr-12 text-sm outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-medium mb-1.5">Confirm Password *</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Re-enter password"
                required
                className="w-full bg-slate-900/50 border border-slate-600 focus:border-green-500 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all text-sm shine mt-2"
            >
              <UserPlus size={16} />
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-sm text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-green-400 hover:text-green-300 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
