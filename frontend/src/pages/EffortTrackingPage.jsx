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

// Sample requirements for the prototype 
const REQUIREMENTS = ["Enter project info", "Enter requirements", "Track effort hours"];

export default function EffortTrackingPage() {
  const [entries, setEntries] = useState([]);
  const [date, setDate] = useState("");
  const [requirement, setRequirement] = useState(REQUIREMENTS[0]);
  const [phase, setPhase] = useState(PHASES[0]);
  const [hours, setHours] = useState("");

  function addEntry() {
    if (date === "" || hours === "") return;
    setEntries([...entries, { date, requirement, phase, hours: Number(hours) }]);
    setHours("");
  }

  // Adds up the hours for one requirement and one phase
  function getTotal(req, ph) {
    let total = 0;
    for (const entry of entries) {
      if (entry.requirement === req && entry.phase === ph) {
        total += entry.hours;
      }
    }
    return total;
  }

  return (
    <div className="page">
      <h1>Section C: Effort Tracking</h1>

      <div className="card">
        <h2>Log Hours</h2>
        <div className="form-row">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <select value={requirement} onChange={(e) => setRequirement(e.target.value)}>
            {REQUIREMENTS.map((req) => (
              <option key={req}>{req}</option>
            ))}
          </select>
          <select value={phase} onChange={(e) => setPhase(e.target.value)}>
            {PHASES.map((ph) => (
              <option key={ph}>{ph}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Hours"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
          <button onClick={addEntry}>Add Hours</button>
        </div>
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
              </tr>
            </thead>
            <tbody>
              {REQUIREMENTS.map((req) => (
                <tr key={req}>
                  <td>{req}</td>
                  {PHASES.map((ph) => (
                    <td key={ph}>{getTotal(req, ph)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Hours Log</h2>
        {entries.length === 0 && <p className="empty">No hours logged yet.</p>}
        <ul className="list">
          {entries.map((entry, i) => (
            <li key={i}>
              {entry.date}: {entry.hours} hrs on {entry.phase} ({entry.requirement})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
