"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BookOpen, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { signupAction, checkUsernameAvailability } from "@/lib/actions/auth";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [usernameTimer, setUsernameTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleUsernameChange = useCallback(
    (value: string) => {
      setForm((f) => ({ ...f, username: value }));
      if (usernameTimer) clearTimeout(usernameTimer);

      if (value.length < 3) {
        setUsernameStatus("idle");
        return;
      }

      setUsernameStatus("checking");
      const timer = setTimeout(async () => {
        const result = await checkUsernameAvailability(value);
        setUsernameStatus(result.available ? "available" : "taken");
      }, 600);
      setUsernameTimer(timer);
    },
    [usernameTimer]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameStatus === "taken") {
      toast.error("Please choose an available username");
      return;
    }
    setLoading(true);
    try {
      const result = await signupAction(form);
      if (result.error) {
        toast.error(result.error);
      } else {
        // Auto sign in
        const signInResult = await signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: false,
        });
        if (signInResult?.ok) {
          toast.success("Account created! Welcome to CPTEDINDIA.");
          router.push("/app/dashboard");
        }
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-800">CPTEDINDIA</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Create Account</h1>
          <p className="text-gray-500 text-center text-sm mb-6">Join CPTEDINDIA and start learning today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <div className="relative mt-1">
                <Input
                  id="username"
                  placeholder="Choose a username (letters, numbers, _)"
                  value={form.username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  required
                  className={`pr-8 ${usernameStatus === "taken" ? "border-red-400 focus:ring-red-400" : usernameStatus === "available" ? "border-green-400 focus:ring-green-400" : ""}`}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  {usernameStatus === "checking" && <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />}
                  {usernameStatus === "available" && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {usernameStatus === "taken" && <XCircle className="h-4 w-4 text-red-500" />}
                </div>
              </div>
              {usernameStatus === "taken" && <p className="mt-1 text-xs text-red-600">Username already taken</p>}
              {usernameStatus === "available" && <p className="mt-1 text-xs text-green-600">Username available</p>}
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required
                  className="pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                required
                className="mt-1"
              />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 font-semibold mt-2"
              disabled={loading || usernameStatus === "taken"}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-700 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
