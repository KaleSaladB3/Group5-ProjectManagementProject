import { useEffect, useState } from "react";
import axios from "axios";
import "./pages.css";

const PHASES = [
  { label: "Requirements Analysis", value: "REQUIREMENTS_ANALYSIS" },
  { label: "Design", value: "DESIGNING" },
  { label: "Coding", value: "CODING" },
  { label: "Testing", value: "TESTING" },
  { label: "Project Management", value: "PROJECT_MANAGEMENT" },
];

export default function EffortTrackingPage() {
  const [projectId, setProjectId] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [entries, setEntries] = useState([]);
  const [period, setPeriod] = useState("Daily");
  const [date, setDate] = useState("");
  const [requirementId, setRequirementId] = useState("");
  const [phase, setPhase] = useState(PHASES[0].value);
  const [hours, setHours] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/api/projects")
      .then(async (response) => {
        if (response.data.length === 0) return;
        const id = response.data[0].id;
        setProjectId(id);
        const [requirementsResponse, effortResponse] = await Promise.all([
          axios.get(`/api/projects/${id}/requirements`),
          axios.get(`/api/projects/${id}/effort-logs`),
        ]);
        setRequirements(requirementsResponse.data);
        setEntries(effortResponse.data.map((entry) => ({
          id: entry.id,
          date: entry.logDate,
          period: entry.period === "WEEKLY" ? "Weekly" : "Daily",
          requirementId: entry.requirementId,
          requirementCode: entry.requirementCode,
          phase: entry.phase,
          hours: entry.hours,
        })));
        if (requirementsResponse.data.length > 0) {
          setRequirementId(String(requirementsResponse.data[0].id));
        }
      })
      .catch((loadError) => setError(
        loadError.response?.data?.message || loadError.message
      ));
  }, []);

  async function addEntry() {
    if (!projectId) {
      setError("Save a project in Section A before logging effort.");
      return;
    }
    if (date === "" || hours === "" || requirementId === "") {
      setError("Please fill in every field.");
      return;
    }
    if (Number(hours) <= 0) {
      setError("Hours must be more than 0.");
      return;
    }
    const limit = period === "Weekly" ? 168 : 24;
    if (Number(hours) > limit) {
      setError(period + " hours can't be more than " + limit + ".");
      return;
    }

    try {
      const response = await axios.post(
        `/api/projects/${projectId}/effort-logs`,
        {
          logDate: date,
          period: period.toUpperCase(),
          phase,
          hours: Number(hours),
          requirementId: Number(requirementId),
        }
      );
      setEntries((current) => [...current, {
        id: response.data.id,
        date: response.data.logDate,
        period: response.data.period === "WEEKLY" ? "Weekly" : "Daily",
        requirementId: response.data.requirementId,
        requirementCode: response.data.requirementCode,
        phase: response.data.phase,
        hours: response.data.hours,
      }]);
      setHours("");
      setError("");
    } catch (saveError) {
      setError(saveError.response?.data?.message || saveError.message);
    }
  }

  async function updateHours(index, newHours) {
    const entry = entries[index];
    const limit = entry.period === "Weekly" ? 168 : 24;
    if (Number(newHours) < 0 || Number(newHours) > limit) return;

    setEntries((current) => current.map((item, i) =>
      i === index ? { ...item, hours: Number(newHours) } : item
    ));
    try {
      await axios.put(
        `/api/projects/${projectId}/effort-logs/${entry.id}`,
        {
          logDate: entry.date,
          period: entry.period.toUpperCase(),
          phase: entry.phase,
          hours: Number(newHours),
          requirementId: entry.requirementId,
        }
      );
    } catch (saveError) {
      setError(saveError.response?.data?.message || saveError.message);
    }
  }

  async function deleteEntry(index) {
    const entry = entries[index];
    try {
      await axios.delete(
        `/api/projects/${projectId}/effort-logs/${entry.id}`
      );
      setEntries((current) => current.filter((_, i) => i !== index));
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || deleteError.message);
    }
  }

  function getTotal(reqId, phaseValue) {
    return entries
      .filter((entry) =>
        entry.requirementId === reqId && entry.phase === phaseValue
      )
      .reduce((total, entry) => total + Number(entry.hours), 0);
  }

  function getRequirementTotal(reqId) {
    return PHASES.reduce(
      (total, phaseOption) => total + getTotal(reqId, phaseOption.value),
      0
    );
  }

  function getPhaseTotal(phaseValue) {
    return requirements.reduce(
      (total, requirement) =>
        total + getTotal(requirement.id, phaseValue),
      0
    );
  }

  function getProjectTotal() {
    return requirements.reduce(
      (total, requirement) => total + getRequirementTotal(requirement.id),
      0
    );
  }

  function getPhaseLabel(phaseValue) {
    return PHASES.find((phaseOption) => phaseOption.value === phaseValue)?.label
      || phaseValue;
  }

  return (
    <div className="page">
      <h1>Section C: Effort Tracking</h1>

      <div className="card">
        <h2>Log Hours</h2>
        <div className="form-row">
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option>Daily</option>
            <option>Weekly</option>
          </select>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <select
            value={requirementId}
            onChange={(e) => setRequirementId(e.target.value)}
          >
            {requirements.map((req) => (
              <option key={req.id} value={req.id}>
                {req.code}: {req.title}
              </option>
            ))}
          </select>
          <select value={phase} onChange={(e) => setPhase(e.target.value)}>
            {PHASES.map((phaseOption) => (
              <option key={phaseOption.value} value={phaseOption.value}>
                {phaseOption.label}
              </option>
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
                {PHASES.map((phaseOption) => (
                  <th key={phaseOption.value}>{phaseOption.label}</th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((req) => (
                <tr key={req.id}>
                  <td>{req.code}</td>
                  {PHASES.map((phaseOption) => (
                    <td key={phaseOption.value}>
                      {getTotal(req.id, phaseOption.value)}
                    </td>
                  ))}
                  <td className="total">{getRequirementTotal(req.id)}</td>
                </tr>
              ))}
              <tr className="total">
                <td>Project Total</td>
                {PHASES.map((phaseOption) => (
                  <td key={phaseOption.value}>
                    {getPhaseTotal(phaseOption.value)}
                  </td>
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
                <th>Period</th>
                <th>Requirement</th>
                <th>Phase</th>
                <th>Hours</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>{entry.period}</td>
                  <td>{entry.requirementCode}</td>
                  <td>{getPhaseLabel(entry.phase)}</td>
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
