"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UserAvatar from "@/components/UserAvatar";
import { updateProfile, updatePassword, checkUsernameAvailability } from "@/lib/actions/auth";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [profileForm, setProfileForm] = useState({ name: "", username: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "available" | "taken">("idle");

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name ?? "", username: user.username ?? "", email: user.email ?? "" });
    }
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setProfileLoading(true);
    const result = await updateProfile(user.id, profileForm);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Profile updated!");
      await update({ name: profileForm.name });
    }
    setProfileLoading(false);
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setPasswordLoading(true);
    const result = await updatePassword(user.id, passwordForm);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Password updated!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
    setPasswordLoading(false);
  };

  const handleUsernameBlur = async () => {
    if (profileForm.username === user?.username) {
      setUsernameStatus("idle");
      return;
    }
    const result = await checkUsernameAvailability(profileForm.username);
    setUsernameStatus(result.available ? "available" : "taken");
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

      {/* Avatar */}
      {user && (
        <div className="flex items-center gap-4 mb-8">
          <UserAvatar name={user.name ?? "User"} size="xl" />
          <div>
            <p className="font-bold text-gray-900 text-lg">{user.name}</p>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>
      )}

      {/* Personal info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h2>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <Label>Display Name</Label>
            <Input
              value={profileForm.name}
              onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label>Username</Label>
            <Input
              value={profileForm.username}
              onChange={(e) => setProfileForm((f) => ({ ...f, username: e.target.value }))}
              onBlur={handleUsernameBlur}
              className={`mt-1 ${usernameStatus === "taken" ? "border-red-400" : ""}`}
              required
            />
            {usernameStatus === "taken" && <p className="mt-1 text-xs text-red-600">Username already taken</p>}
          </div>
          <div>
            <Label>Email Address</Label>
            <Input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
              className="mt-1"
              required
            />
          </div>
          <Button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800"
            disabled={profileLoading || usernameStatus === "taken"}
          >
            {profileLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Change Password</h2>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div>
            <Label>Current Password</Label>
            <Input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
              className="mt-1"
              required
            />
            {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
            )}
          </div>
          <Button
            type="submit"
            variant="outline"
            disabled={passwordLoading}
          >
            {passwordLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
