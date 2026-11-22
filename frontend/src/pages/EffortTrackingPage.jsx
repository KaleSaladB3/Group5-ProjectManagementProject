// Section C: Log hours worked and see the totals
import { useState } from "react";
import "./pages.css";

const PHASES = [
  "Requirements Analysis",
  "Design",
  "Coding",
  "Testing",
  "Project Management",
];

// Sample requirements for the prototype (later these will come from the backend)
const requirements = [
  { id: "FR-1", text: "Enter project info" },
  { id: "FR-2", text: "Enter requirements" },
  { id: "FR-3", text: "Log effort hours" },
  { id: "NFR-1", text: "Pages load in under 2 seconds" },
];

export default function EffortTrackingPage() {
  const [entries, setEntries] = useState([]);

  // Form fields (FR-7)
  const [date, setDate] = useState("");
  const [requirementId, setRequirementId] = useState(requirements[0].id);
  const [phase, setPhase] = useState(PHASES[0]);
  const [hours, setHours] = useState("");
  const [error, setError] = useState("");

  function addEntry() {
    // Data validation (NFR-3)
    if (date === "" || hours === "") {
      setError("Please fill in every field.");
      return;
    }
    if (Number(hours) <= 0) {
      setError("Hours must be more than 0.");
      return;
    }
    setEntries([...entries, { date, requirementId, phase, hours: Number(hours) }]);
    setHours("");
    setError("");
  }

  // Edit or delete hours already logged (FR-8)
  function updateHours(index, newHours) {
    if (Number(newHours) < 0) return;
    const updated = [...entries];
    updated[index] = { ...updated[index], hours: Number(newHours) };
    setEntries(updated);
  }

  function deleteEntry(index) {
    setEntries(entries.filter((_, i) => i !== index));
  }

  // Totals (FR-9)
  function getTotal(reqId, ph) {
    let total = 0;
    for (const entry of entries) {
      if (entry.requirementId === reqId && entry.phase === ph) {
        total += entry.hours;
      }
    }
    return total;
  }

  function getRequirementTotal(reqId) {
    let total = 0;
    for (const ph of PHASES) total += getTotal(reqId, ph);
    return total;
  }

  function getPhaseTotal(ph) {
    let total = 0;
    for (const req of requirements) total += getTotal(req.id, ph);
    return total;
  }

  function getProjectTotal() {
    let total = 0;
    for (const req of requirements) total += getRequirementTotal(req.id);
    return total;
  }

  return (
    <div className="page">
      <h1>Section C: Effort Tracking</h1>

      <div className="card">
        <h2>Log Hours</h2>
        <div className="form-row">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <select
            value={requirementId}
            onChange={(e) => setRequirementId(e.target.value)}
          >
            {requirements.map((req) => (
              <option key={req.id} value={req.id}>
                {req.id}: {req.text}
              </option>
            ))}
          </select>
          <select value={phase} onChange={(e) => setPhase(e.target.value)}>
            {PHASES.map((ph) => (
              <option key={ph}>{ph}</option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            placeholder="Hours"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
          <button onClick={addEntry}>Add Hours</button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="card">
        <h2>Total Hours</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Requirement</th>
                {PHASES.map((ph) => (
                  <th key={ph}>{ph}</th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((req) => (
                <tr key={req.id}>
                  <td>{req.id}</td>
                  {PHASES.map((ph) => (
                    <td key={ph}>{getTotal(req.id, ph)}</td>
                  ))}
                  <td className="total">{getRequirementTotal(req.id)}</td>
                </tr>
              ))}
              <tr className="total">
                <td>Project Total</td>
                {PHASES.map((ph) => (
                  <td key={ph}>{getPhaseTotal(ph)}</td>
                ))}
                <td>{getProjectTotal()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Hours Log</h2>
        {entries.length === 0 ? (
          <p className="empty">No hours logged yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Requirement</th>
                <th>Phase</th>
                <th>Hours</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={i}>
                  <td>{entry.date}</td>
                  <td>{entry.requirementId}</td>
                  <td>{entry.phase}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      className="hours-input"
                      value={entry.hours}
                      onChange={(e) => updateHours(i, e.target.value)}
                    />
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteEntry(i)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
