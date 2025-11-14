import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPanel() {
  const { user: me } = useAuth();
  const myId = me?.id || me?._id || null;

  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUserId, setModalUserId] = useState(null);
  const [selectedDatetime, setSelectedDatetime] = useState("");
  const inputRef = useRef(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (userId, newRole) => {
    setActionLoadingId(userId);
    try {
      const res = await api.post(`/admin/role/${userId}`, { role: newRole });
      await fetchUsers();
      toast.success(res.data?.message || `User role set to ${newRole}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Role change failed");
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
        await api.post(`/admin/unblock/${userId}`);
      }
      await fetchUsers();
      toast.success(block ? "User blocked" : "User unblocked");
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const openTempBlockModal = (userId) => {
    setModalUserId(userId);
    setSelectedDatetime("");
    setIsModalOpen(true);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalUserId(null);
    setSelectedDatetime("");
    document.body.classList.remove("modal-open");
  };

  const submitTempBlock = async () => {
    if (!selectedDatetime) return toast.error("Please select a date and time.");

    const target = new Date(selectedDatetime);
    const now = new Date();

    if (isNaN(target.getTime()) || target <= now)
      return toast.error("Please choose a valid future date/time.");

    const minutes = Math.ceil((target - now) / 60000);

    setActionLoadingId(modalUserId);
    try {
      const res = await api.post(`/admin/block/${modalUserId}`, { minutes });
      toast.success(res.data?.message || `User blocked until ${target.toLocaleString()}`);
      await fetchUsers();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to set block");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filtered = users.filter((u) =>
    `${u.userName || ""} ${u.email || ""}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="admin-panel">

      {/* Controls */}
      <div className="admin-controls">
        <div>
          <h2>Users</h2>
          <div className="small-muted">
            Manage registered users — search, block/unblock, set temporary block, change role.
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="admin-search"
            placeholder="Search users by name or email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            onClick={fetchUsers}
            className="user-action-btn"
            style={{ background: "#111", color: "#fff" }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ padding: 20 }}>Loading users...</div>
      ) : (
        <div className="table-scroll">
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
                <td colSpan={6} style={{ padding: 20 }}>No users found.</td>
              </tr>
            )}

            {filtered.map((u) => (
              <tr key={u._id}>
                <td>{u.userName || "-"}</td>
                <td>{u.email}</td>

                <td>
                  <span
                    className="status-badge"
                    style={{
                      background:
                        u.role === "admin" ? "rgba(99,102,241,0.15)" : "rgba(59,130,246,0.15)",
                      color: u.role === "admin" ? "#4f46e5" : "#3b82f6",
                    }}
                  >
                    {u.role}
                  </span>
                </td>

                <td>
                  {u.isBlocked ? (
                    <span className="status-badge blocked-badge">Blocked</span>
                  ) : (
                    <span className="status-badge active-badge">Active</span>
                  )}
                </td>

                <td>{u.blockedUntil ? new Date(u.blockedUntil).toLocaleString() : "-"}</td>

                <td>
                  <div className="action-buttons" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {u._id !== myId && (
                      <>
                        {u.role === "user" ? (
                          <button
                            className="user-action-btn role-btn"
                            disabled={actionLoadingId === u._id}
                            onClick={() => changeRole(u._id, "admin")}
                          >
                            Promote
                          </button>
                        ) : (
                          <button
                            className="user-action-btn role-btn"
                            disabled={actionLoadingId === u._id}
                            onClick={() => changeRole(u._id, "user")}
                          >
                            Demote
                          </button>
                        )}
                      </>
                    )}

                    {u.isBlocked ? (
                      <button
                        className="user-action-btn unblock-btn"
                        disabled={actionLoadingId === u._id}
                        onClick={() => toggleBlock(u._id, false)}
                      >
                        Unblock
                      </button>
                    ) : (
                      <>
                        <button
                          className="user-action-btn block-btn"
                          disabled={actionLoadingId === u._id}
                          onClick={() => toggleBlock(u._id, true)}
                        >
                          Block
                        </button>

                          <button
                            className="user-action-btn role-btn"
                            disabled={actionLoadingId === u._id}
                            onClick={() => openTempBlockModal(u._id)}
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
</div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal-container"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="modal-title">Set Temporary Block</h3>
              <p className="modal-subtext">
                Choose the date & time when this user’s block should end.
              </p>

              <label className="modal-label">End date & time</label>
              <input
                ref={inputRef}
                type="datetime-local"
                className="modal-input"
                value={selectedDatetime}
                onChange={(e) => setSelectedDatetime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />

              <div className="modal-actions">
                <button className="btn ghost" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn primary" onClick={submitTempBlock}>
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
