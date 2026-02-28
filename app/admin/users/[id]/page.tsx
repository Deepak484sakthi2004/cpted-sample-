"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getUserById, updateUser, revokeCertificate } from "@/lib/actions/users";
import { getAllCourses } from "@/lib/actions/courses";
import {
  provisionAccess,
  revokeEnrollment,
  restoreEnrollment,
} from "@/lib/actions/enrollments";
import { overrideProgressComplete } from "@/lib/actions/progress";
import UserAvatar from "@/components/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, formatCurrency, getGradeColor } from "@/lib/utils";
import { toast } from "sonner";
import {
  Award,
  BookOpen,
  FileQuestion,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);

  // Grant access state
  const [selectedCourse, setSelectedCourse] = useState("");
  const [provisionAmount, setProvisionAmount] = useState(0);
  const [provisionNotes, setProvisionNotes] = useState("");
  const [provisioning, setProvisioning] = useState(false);

  // Override state
  const [overrideCourseId, setOverrideCourseId] = useState("");
  const [overriding, setOverriding] = useState(false);
  const [overrideConfirm, setOverrideConfirm] = useState(false);

  // Edit user state
  const [editUser, setEditUser] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "STUDENT",
    password: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const load = () => getUserById(params.id).then(setUser);

  useEffect(() => {
    load();
    getAllCourses().then(setAllCourses);
  }, [params.id]);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name,
        email: user.email,
        role: user.role,
        password: "",
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const activeEnrollmentCourseIds = user.enrollments
    .filter((e: any) => e.status === "ACTIVE")
    .map((e: any) => e.courseId);

  const availableCoursesForGrant = allCourses.filter(
    (c) => !activeEnrollmentCourseIds.includes(c.id)
  );

  const handleProvision = async () => {
    if (!selectedCourse || !session?.user.id) return;
    setProvisioning(true);
    const result = await provisionAccess({
      userId: params.id,
      courseId: selectedCourse,
      amount: provisionAmount,
      notes: provisionNotes,
      grantedById: session.user.id,
    });
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Course access granted!");
      setSelectedCourse("");
      setProvisionAmount(0);
      setProvisionNotes("");
      load();
    }
    setProvisioning(false);
  };

  const handleOverride = async () => {
    if (!overrideCourseId) return;
    setOverriding(true);
    const result = await overrideProgressComplete(params.id, overrideCourseId);
    if (result.success) {
      toast.success("Course marked complete! Certificate generated.");
      setOverrideCourseId("");
      load();
    } else {
      toast.error(result.error ?? "Failed to override progress");
    }
    setOverriding(false);
    setOverrideConfirm(false);
  };

  const handleSaveEdit = async () => {
    setSavingEdit(true);
    const result = await updateUser(user.id, editForm as any);
    if (result.success) {
      toast.success("User updated");
      setEditUser(false);
      load();
    } else {
      toast.error(result.error ?? "Update failed");
    }
    setSavingEdit(false);
  };

  return (
    <div className="p-6 max-w-5xl space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-500">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <UserAvatar name={user.name} size="xl" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500 text-sm">
                @{user.username} · {user.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  className={
                    user.role === "ADMIN"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }
                >
                  {user.role}
                </Badge>
                <span className="text-xs text-gray-400">
                  Joined {formatDate(user.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditUser(true)}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Enrollments */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-500" />
          <h2 className="font-bold text-gray-900">Enrollments</h2>
          <span className="text-xs text-gray-400 ml-1">
            ({user.enrollments.length})
          </span>
        </div>
        {user.enrollments.length === 0 ? (
          <p className="p-5 text-sm text-gray-400">No enrollments yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Course
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Granted By
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {user.enrollments.map((e: any) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">
                    {e.course.title}
                  </td>
                  <td className="px-5 py-3">
                    <Badge
                      className={
                        e.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {e.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500">
                    {e.grantedBy?.name ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500">
                    {formatDate(e.createdAt)}
                  </td>
                  <td className="px-5 py-3">
                    {e.status === "ACTIVE" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 text-xs"
                        onClick={async () => {
                          await revokeEnrollment(e.id);
                          toast.success("Access revoked");
                          load();
                        }}
                      >
                        Revoke
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-200 text-xs"
                        onClick={async () => {
                          await restoreEnrollment(e.id);
                          toast.success("Access restored");
                          load();
                        }}
                      >
                        Restore
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Grant Course Access */}
        <div className="p-5 border-t border-gray-200 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            Grant Course Access
          </h3>
          <div className="flex gap-3 flex-wrap">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 min-w-[200px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a course...</option>
              {availableCoursesForGrant.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <Input
              type="number"
              value={provisionAmount}
              onChange={(e) => setProvisionAmount(Number(e.target.value))}
              placeholder="Amount (₹)"
              className="w-32"
              min={0}
            />
            <Input
              value={provisionNotes}
              onChange={(e) => setProvisionNotes(e.target.value)}
              placeholder="Notes (optional)"
              className="flex-1 min-w-[150px]"
            />
            <Button
              onClick={handleProvision}
              disabled={!selectedCourse || provisioning}
              className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
            >
              {provisioning ? "Granting..." : "Grant Access"}
            </Button>
          </div>
        </div>
      </div>

      {/* Certificates */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          <h2 className="font-bold text-gray-900">Certificates</h2>
          <span className="text-xs text-gray-400 ml-1">
            ({user.certificates.length})
          </span>
        </div>
        {user.certificates.length === 0 ? (
          <p className="p-5 text-sm text-gray-400">No certificates yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Course
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Certificate #
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Issued
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {user.certificates.map((c: any) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">
                    {c.course.title}
                  </td>
                  <td className="px-5 py-3 text-xs font-mono text-gray-500">
                    {c.certificateNumber}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">
                    {formatDate(c.issuedAt)}
                  </td>
                  <td className="px-5 py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 text-xs"
                      onClick={async () => {
                        await revokeCertificate(c.id);
                        toast.success("Certificate revoked");
                        load();
                      }}
                    >
                      Revoke
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quiz Attempts */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center gap-2">
          <FileQuestion className="h-5 w-5 text-blue-500" />
          <h2 className="font-bold text-gray-900">Quiz Attempts</h2>
          <span className="text-xs text-gray-400 ml-1">
            ({user.quizAttempts.length})
          </span>
        </div>
        {user.quizAttempts.length === 0 ? (
          <p className="p-5 text-sm text-gray-400">No quiz attempts yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Course
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Module
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Score
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Grade
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Passed
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {user.quizAttempts.map((a: any) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm text-gray-700">
                    {a.quiz.module?.course?.title ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700">
                    {a.quiz.module?.title ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold text-gray-900">
                    {a.score.toFixed(0)}%
                  </td>
                  <td className="px-5 py-3">
                    <Badge className={`text-xs ${getGradeColor(a.grade)}`}>
                      Grade {a.grade}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge
                      className={
                        a.passed
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {a.passed ? "Passed" : "Failed"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">
                    {formatDate(a.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Override Progress */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 mb-1">Override Progress</h2>
        <div className="flex items-start gap-2 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            This marks all lessons complete and creates passing quiz attempts,
            then issues a certificate. Use only for data migration or manual corrections.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <select
            value={overrideCourseId}
            onChange={(e) => setOverrideCourseId(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 min-w-[200px] focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Select enrolled course...</option>
            {user.enrollments
              .filter((e: any) => e.status === "ACTIVE")
              .map((e: any) => (
                <option key={e.courseId} value={e.courseId}>
                  {e.course.title}
                </option>
              ))}
          </select>
          <Button
            onClick={() => overrideCourseId && setOverrideConfirm(true)}
            disabled={!overrideCourseId || overriding}
            className="bg-orange-500 hover:bg-orange-600 whitespace-nowrap"
          >
            {overriding ? "Processing..." : "Override Complete"}
          </Button>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editUser} onOpenChange={setEditUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <Label>Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, name: e.target.value }))
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, email: e.target.value }))
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>Role</Label>
              <select
                value={editForm.role}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, role: e.target.value }))
                }
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="STUDENT">Student</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                value={editForm.password}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, password: e.target.value }))
                }
                className="mt-1"
                placeholder="Leave blank to keep current password"
              />
            </div>
            <Button
              onClick={handleSaveEdit}
              disabled={savingEdit}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {savingEdit ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Override Confirm Dialog */}
      <ConfirmDialog
        open={overrideConfirm}
        onClose={() => setOverrideConfirm(false)}
        onConfirm={handleOverride}
        title="Override Course Progress"
        description="This will mark all lessons complete and create passing quiz attempts, then issue a certificate. This action cannot be undone."
        confirmLabel="Override Progress"
        confirmVariant="default"
        loading={overriding}
      />
    </div>
  );
}
