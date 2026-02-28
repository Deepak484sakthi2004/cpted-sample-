import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStudentOrders } from "@/lib/actions/enrollments";
import EmptyState from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order History" };

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  const orders = await getStudentOrders(session!.user.id);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order History</h1>

      {orders.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="No orders yet" description="Your order history will appear here." />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-sm text-gray-900">{order.course.title}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order.amount === 0 ? "₹0.00" : formatCurrency(order.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className="bg-green-100 text-green-800 text-xs">Provisioned</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
