// src/components/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function AdminPanel() {
  const { user: me } = useAuth(); // current admin info
  const myId = me?.id || me?._id || null;

  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeRole = async (userId, newRole) => {
    setActionLoadingId(userId);
    try {
      const res = await api.post(`/admin/role/${userId}`, { role: newRole });
      await fetchUsers(); // refresh list
    } catch (err) {
      console.error("changeRole error", err);
      alert(err.response?.data?.message || "Role change failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const toggleBlock = async (userId, block) => {
    setActionLoadingId(userId);
    try {
      if (block) {
        await api.post(`/admin/block/${userId}`, {});
      } else {
        await api.post(`/admin/unblock/${userId}`, {});
      }
      await fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const setTempBlock = async (userId) => {
    const minutes = prompt("Block for how many minutes? Enter a number (e.g. 60):");
    if (!minutes) return;
    const mins = parseInt(minutes, 10);
    if (Number.isNaN(mins) || mins <= 0) return alert("Invalid minutes");
    setActionLoadingId(userId);
    try {
      await api.post(`/admin/block/${userId}`, { minutes: mins });
      await fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to block");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filtered = users.filter((u) =>
    `${u.userName || ""} ${u.email || ""}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="admin-panel">
      <div className="admin-controls">
        <div>
          <h2 style={{ margin: 0 }}>Users</h2>
          <div className="small-muted">Manage registered users — search, block/unblock, set temporary block, change role.</div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="admin-search"
            placeholder="Search users by name or email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button onClick={fetchUsers} className="user-action-btn" style={{ background: "#111", color: "#fff" }}>
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 20 }}>Loading users...</div>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Blocked Until</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 20 }}>
                  No users found.
                </td>
              </tr>
            )}
            {filtered.map((u) => (
              <tr key={u._id}>
                <td>{u.userName || "-"}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isBlocked ? <span style={{ color: "#ef4444" }}>Blocked</span> : <span style={{ color: "#10b981" }}>Active</span>}</td>
                <td>{u.blockedUntil ? new Date(u.blockedUntil).toLocaleString() : "-"}</td>

                {/* ===== Actions column (role buttons + block controls) ===== */}
                <td className="actions-cell">
                  <div className="action-buttons" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {/* Role change: do not allow current admin to change own role */}
                    {u._id !== myId && (
                      <>
                        {u.role === "user" ? (
                          <button
                            className="user-action-btn role-btn"
                            onClick={() => changeRole(u._id, "admin")}
                            disabled={actionLoadingId === u._id}
                            title="Promote to admin"
                          >
                            {actionLoadingId === u._id ? "Working..." : "Promote"}
                          </button>
                        ) : (
                          <button
                            className="user-action-btn role-btn"
                            onClick={() => {
                              if (!window.confirm("Demote this admin to user?")) return;
                              changeRole(u._id, "user");
                            }}
                            disabled={actionLoadingId === u._id}
                            title="Demote to user"
                          >
                            {actionLoadingId === u._id ? "Working..." : "Demote"}
                          </button>
                        )}
                      </>
                    )}

                    {/* Block / Unblock controls */}
                    {u.isBlocked ? (
                      <button
                        className="user-action-btn unblock-btn"
                        onClick={() => toggleBlock(u._id, false)}
                        disabled={actionLoadingId === u._id}
                      >
                        {actionLoadingId === u._id ? "Working..." : "Unblock"}
                      </button>
                    ) : (
                      <>
                        <button
                          className="user-action-btn block-btn"
                          onClick={() => {
                            if (!window.confirm("Block this user indefinitely?")) return;
                            toggleBlock(u._id, true);
                          }}
                          disabled={actionLoadingId === u._id}
                        >
                          {actionLoadingId === u._id ? "Working..." : "Block"}
                        </button>

                        <button
                          className="user-action-btn role-btn"
                          onClick={() => setTempBlock(u._id)}
                          disabled={actionLoadingId === u._id}
                        >
                          Set Temp Block
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
