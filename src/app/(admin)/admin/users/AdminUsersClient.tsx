"use client";

// ============================================
// Admin Users — Professional customer management
// Card-based, search, role management, create modal
// ============================================

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatDate, formatCurrency } from "@/lib/utils";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "RETAIL" | "WHOLESALE" | "ADMIN";
  createdAt: string;
  _count: { orders: number };
  totalSpent: number;
};

const roleConfig: Record<string, { label: string; color: string; bg: string }> = {
  ADMIN: { label: "Admin", color: "text-red-700", bg: "bg-red-50 border-red-200" },
  WHOLESALE: { label: "Wholesale", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  RETAIL: { label: "Retail", color: "text-gray-600", bg: "bg-gray-50 border-gray-200" },
};

export default function AdminUsersClient({ users }: { users: UserRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("RETAIL");
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("RETAIL");

  const filtered = useMemo(() => {
    let result = roleFilter === "ALL" ? users : users.filter((u) => u.role === roleFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    return result;
  }, [users, search, roleFilter]);

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: users.length };
    users.forEach((u) => { counts[u.role] = (counts[u.role] || 0) + 1; });
    return counts;
  }, [users]);

  function openEdit(u: UserRow) {
    setEditUser(u);
    setEditName(u.name);
    setEditRole(u.role);
  }

  async function handleUpdate() {
    if (!editUser) return;
    setLoading(true);
    await fetch(`/api/users/${editUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, role: editRole }),
    });
    setLoading(false);
    setEditUser(null);
    router.refresh();
  }

  async function handleCreate() {
    setLoading(true);
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, email: newEmail, role: newRole }),
    });
    setLoading(false);
    setCreateOpen(false);
    setNewName("");
    setNewEmail("");
    setNewRole("RETAIL");
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this user and all their orders?")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{filtered.length} customer{filtered.length !== 1 ? "s" : ""}</p>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="w-56 pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all"
            />
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-sm shadow-amber-500/25 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Customer
          </button>
        </div>
      </div>

      {/* Role filter */}
      <div className="flex gap-2 flex-wrap">
        {["ALL", "RETAIL", "WHOLESALE", "ADMIN"].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
              roleFilter === r
                ? "bg-[#1a1a2e] text-white shadow-sm"
                : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
            }`}
          >
            {r === "ALL" ? "All" : roleConfig[r]?.label || r}
            {roleCounts[r] ? (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                roleFilter === r ? "bg-white/20" : "bg-gray-100"
              }`}>
                {roleCounts[r]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Users list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No customers found</h3>
          <p className="text-sm text-gray-400">{search ? "Try adjusting your search" : "Customers will appear here"}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {filtered.map((u, i) => {
            const config = roleConfig[u.role] || roleConfig.RETAIL;
            const initials = u.name
              .split(" ")
              .map((w) => w.charAt(0))
              .join("")
              .toUpperCase()
              .substring(0, 2);

            const gradients = [
              "from-amber-400 to-orange-500",
              "from-blue-400 to-indigo-500",
              "from-green-400 to-emerald-500",
              "from-purple-400 to-violet-500",
              "from-pink-400 to-rose-500",
              "from-teal-400 to-cyan-500",
            ];
            const gradient = gradients[u.name.charCodeAt(0) % gradients.length];

            return (
              <div
                key={u.id}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors ${
                  i < filtered.length - 1 ? "border-b border-gray-50" : ""
                }`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                  <span className="text-xs font-bold text-white">{initials}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">{u.name}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">{u.email}</p>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-6 shrink-0">
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-900">{u._count.orders}</p>
                    <p className="text-[10px] text-gray-400">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(u.totalSpent)}</p>
                    <p className="text-[10px] text-gray-400">Spent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] text-gray-500">{formatDate(u.createdAt)}</p>
                    <p className="text-[10px] text-gray-400">Joined</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => openEdit(u)}
                    className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit user modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditUser(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-slide-in-up">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Customer</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["RETAIL", "WHOLESALE", "ADMIN"] as const).map((r) => {
                    const c = roleConfig[r];
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setEditRole(r)}
                        className={`px-3 py-2 text-sm font-medium rounded-xl border transition-all ${
                          editRole === r
                            ? "bg-amber-50 border-amber-300 text-amber-700"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setEditUser(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="px-5 py-2 text-sm font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create user modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCreateOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-slide-in-up">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Customer</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["RETAIL", "WHOLESALE", "ADMIN"] as const).map((r) => {
                    const c = roleConfig[r];
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setNewRole(r)}
                        className={`px-3 py-2 text-sm font-medium rounded-xl border transition-all ${
                          newRole === r
                            ? "bg-amber-50 border-amber-300 text-amber-700"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={loading || !newName || !newEmail}
                  className="px-5 py-2 text-sm font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Add Customer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
