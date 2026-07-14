"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Welcome back!");
      // Get user role and redirect accordingly
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const data = await meRes.json();
        if (data.user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 flex items-center justify-center px-4">
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
          <h1 className="text-white text-2xl font-black mb-1">Welcome Back</h1>
          <p className="text-slate-400 text-sm mb-8">Sign in to your TCA account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-slate-900/50 border border-slate-600 focus:border-green-500 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all text-sm shine"
            >
              <LogIn size={16} />
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-sm text-center">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-green-400 hover:text-green-300 font-semibold">
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-4 bg-slate-900/50 rounded-xl p-4">
            <p className="text-slate-400 text-xs font-semibold mb-2">Demo Credentials:</p>
            <div className="space-y-1">
              <p className="text-slate-500 text-xs">Admin: <span className="text-green-400">admin@tca.edu</span> / <span className="text-green-400">admin123</span></p>
              <p className="text-slate-500 text-xs">Teacher: <span className="text-green-400">ahmed@tca.edu</span> / <span className="text-green-400">teacher123</span></p>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          © 2024 The Core Academy. All rights reserved.
        </p>
      </div>
    </div>
  );
}
