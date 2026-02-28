"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAllEnrollments,
  revokeEnrollment,
  restoreEnrollment,
} from "@/lib/actions/enrollments";
import { getAllCourses } from "@/lib/actions/courses";
import UserAvatar from "@/components/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import { formatDate, formatCurrency } from "@/lib/utils";
import { UserCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [courseFilter, setCourseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const [bulkRevoking, setBulkRevoking] = useState(false);

  const load = () =>
    getAllEnrollments({
      courseId: courseFilter || undefined,
      status: statusFilter,
    }).then(setEnrollments);

  useEffect(() => {
    load();
    getAllCourses().then(setCourses);
  }, []);

  useEffect(() => {
    load();
    setSelected([]);
  }, [courseFilter, statusFilter]);

  const handleBulkRevoke = async () => {
    setBulkRevoking(true);
    await Promise.all(selected.map((id) => revokeEnrollment(id)));
    toast.success(`${selected.length} enrollment(s) revoked`);
    setSelected([]);
    setBulkConfirm(false);
    load();
    setBulkRevoking(false);
  };

  const activeEnrollments = enrollments.filter((e) => e.status === "ACTIVE");
  const allActiveSelected =
    activeEnrollments.length > 0 &&
    activeEnrollments.every((e) => selected.includes(e.id));

  const toggleSelectAll = () => {
    if (allActiveSelected) {
      setSelected([]);
    } else {
      setSelected(activeEnrollments.map((e) => e.id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Enrollments</h1>
        <span className="text-sm text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-lg">
          {enrollments.length} total
        </span>
      </div>

      {/* Filters + Bulk Action */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="REVOKED">Revoked</option>
        </select>
        {selected.length > 0 && (
          <Button
            onClick={() => setBulkConfirm(true)}
            className="bg-red-600 hover:bg-red-700 ml-auto"
          >
            Revoke Selected ({selected.length})
          </Button>
        )}
      </div>

      {enrollments.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No enrollments found"
          description="No enrollments match the selected filters."
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allActiveSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                    title="Select all active"
                  />
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Student
                </th>
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
                  Amount
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
              {enrollments.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    {e.status === "ACTIVE" && (
                      <input
                        type="checkbox"
                        checked={selected.includes(e.id)}
                        onChange={(ev) =>
                          setSelected((prev) =>
                            ev.target.checked
                              ? [...prev, e.id]
                              : prev.filter((id) => id !== e.id)
                          )
                        }
                        className="rounded border-gray-300"
                      />
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <UserAvatar name={e.user.name} size="sm" />
                      <div>
                        <Link
                          href={`/admin/users/${e.user.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600 hover:underline"
                        >
                          {e.user.name}
                        </Link>
                        <p className="text-xs text-gray-400">{e.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700">
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
                  <td className="px-5 py-3 text-sm text-gray-700">
                    {e.orders?.[0]?.amount != null
                      ? formatCurrency(e.orders[0].amount)
                      : "—"}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">
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
                          toast.success("Enrollment revoked");
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
                          toast.success("Enrollment restored");
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
        </div>
      )}

      <ConfirmDialog
        open={bulkConfirm}
        onClose={() => setBulkConfirm(false)}
        onConfirm={handleBulkRevoke}
        title="Revoke Selected Enrollments"
        description={`Are you sure you want to revoke ${selected.length} enrollment(s)? Students will lose access to their courses.`}
        confirmLabel="Revoke All Selected"
        loading={bulkRevoking}
      />
    </div>
  );
}
