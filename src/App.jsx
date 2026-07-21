import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [form, setForm] = useState({ major: "", requirements: "", interests: "", workload: "balanced" });
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/generate-schedule`, form);
      setSchedule(res.data);
    } catch (err) {
      alert("Something went wrong generating the schedule.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 650, margin: "40px auto", fontFamily: "sans-serif", padding: "0 20px" }}>
      <h1>AI Course Planner</h1>

      <label style={{ display: "block", marginTop: 12 }}>Major</label>
      <input style={{ width: "100%", padding: 8 }} value={form.major}
        onChange={(e) => setForm({ ...form, major: e.target.value })} />

      <label style={{ display: "block", marginTop: 12 }}>Remaining requirements</label>
      <textarea style={{ width: "100%" }} rows={3} value={form.requirements}
        onChange={(e) => setForm({ ...form, requirements: e.target.value })} />

      <label style={{ display: "block", marginTop: 12 }}>Interests</label>
      <input style={{ width: "100%", padding: 8 }} value={form.interests}
        onChange={(e) => setForm({ ...form, interests: e.target.value })} />

      <label style={{ display: "block", marginTop: 12 }}>Workload preference</label>
      <select style={{ width: "100%", padding: 8 }} value={form.workload}
        onChange={(e) => setForm({ ...form, workload: e.target.value })}>
        <option value="light">Light</option>
        <option value="balanced">Balanced</option>
        <option value="heavy">Heavy</option>
      </select>

      <button style={{ marginTop: 16, padding: "8px 16px" }} onClick={generate} disabled={loading || !form.major}>
        {loading ? "Building schedule..." : "Generate Schedule"}
      </button>

      {schedule && (
        <div style={{ marginTop: 24, border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <h3>{schedule.total_credits} total credits</h3>
          {schedule.courses.map((c, i) => (
            <div key={i} style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
              <strong>{c.name}</strong> ({c.credits} credits) — <em>{c.fulfills}</em>
              <p style={{ color: "#555", margin: "4px 0 0" }}>{c.why}</p>
            </div>
          ))}
          <p style={{ marginTop: 12, fontStyle: "italic" }}>{schedule.workload_note}</p>
        </div>
      )}
    </div>
  );
}