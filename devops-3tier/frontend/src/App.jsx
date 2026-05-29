import { useState, useEffect } from "react";

export default function App() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("checking...");
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((r) => r.json())
      .then((d) => setStatus(d.status))
      .catch(() => setStatus("offline"));

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      console.error("Failed to fetch users", e);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) return;
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ name: "", email: "" });
      fetchUsers();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", background: "#0a0e1a", minHeight: "100vh", color: "#e2e8f0", padding: "2rem" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: status === "ok" ? "#22c55e" : "#ef4444", boxShadow: `0 0 8px ${status === "ok" ? "#22c55e" : "#ef4444"}` }} />
          <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#7dd3fc" }}>3-Tier DevOps App</h1>
          <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "#64748b" }}>API: {status}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
          {[
            { label: "Frontend", tech: "React + Nginx", tier: "Tier 1", color: "#7dd3fc" },
            { label: "Backend", tech: "Node.js + Express", tier: "Tier 2", color: "#a78bfa" },
            { label: "Database", tech: "PostgreSQL", tier: "Tier 3", color: "#34d399" },
            { label: "Infra", tech: "Terraform + K8s", tier: "IaC", color: "#fb923c" },
          ].map((t) => (
            <div key={t.label} style={{ background: "#111827", border: `1px solid ${t.color}22`, borderRadius: 8, padding: "1rem" }}>
              <div style={{ fontSize: "0.65rem", color: t.color, letterSpacing: 2, marginBottom: 4 }}>{t.tier}</div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{t.label}</div>
              <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{t.tech}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#111827", borderRadius: 8, padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid #1e293b" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1rem", color: "#94a3b8" }}>Add User</h2>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name"
              style={{ flex: 1, background: "#0a0e1a", border: "1px solid #1e293b", borderRadius: 6, padding: "0.5rem 0.75rem", color: "#e2e8f0", fontFamily: "inherit", minWidth: 140 }} />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email"
              style={{ flex: 2, background: "#0a0e1a", border: "1px solid #1e293b", borderRadius: 6, padding: "0.5rem 0.75rem", color: "#e2e8f0", fontFamily: "inherit", minWidth: 180 }} />
            <button onClick={handleSubmit} disabled={loading}
              style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: 6, padding: "0.5rem 1.25rem", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
              {loading ? "..." : "Add"}
            </button>
          </div>
        </div>

        <div style={{ background: "#111827", borderRadius: 8, padding: "1.5rem", border: "1px solid #1e293b" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1rem", color: "#94a3b8" }}>Users ({users.length})</h2>
          {users.length === 0 ? <div style={{ color: "#475569", fontSize: "0.85rem" }}>No users yet.</div> :
            users.map((u) => (
              <div key={u.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #1e293b", fontSize: "0.875rem" }}>
                <span>{u.name}</span><span style={{ color: "#64748b" }}>{u.email}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
