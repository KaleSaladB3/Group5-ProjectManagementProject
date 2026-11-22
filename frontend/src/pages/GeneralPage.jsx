// Section A: General project info, team members, and risks
import { useState } from "react";
import "./pages.css";

export default function GeneralPage() {
  // Project info
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");

  // Team members
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");

  // Risks
  const [risks, setRisks] = useState([]);
  const [riskText, setRiskText] = useState("");
  const [riskStatus, setRiskStatus] = useState("Open");

  function addMember() {
    if (memberName === "") return;
    setMembers([...members, memberName]);
    setMemberName("");
  }

  function addRisk() {
    if (riskText === "") return;
    setRisks([...risks, { text: riskText, status: riskStatus }]);
    setRiskText("");
  }

  return (
    <div className="page">
      <h1>Section A: General</h1>

      <div className="card">
        <h2>Project Info</h2>
        <label className="field">
          Owner / Project Manager
          <input value={owner} onChange={(e) => setOwner(e.target.value)} />
        </label>
        <label className="field">
          Project Description
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>

      <div className="card">
        <h2>Team Members</h2>
        <div className="form-row">
          <input
            placeholder="Member name"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
          />
          <button onClick={addMember}>Add Member</button>
        </div>

        {members.length === 0 && <p className="empty">No team members yet.</p>}
        <ul className="list">
          {members.map((name, i) => (
            <li key={i}>{name}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>Risks</h2>
        <div className="form-row">
          <input
            placeholder="Describe the risk"
            value={riskText}
            onChange={(e) => setRiskText(e.target.value)}
          />
          <select value={riskStatus} onChange={(e) => setRiskStatus(e.target.value)}>
            <option>Open</option>
            <option>Monitoring</option>
            <option>Closed</option>
          </select>
          <button onClick={addRisk}>Add Risk</button>
        </div>

        {risks.length === 0 ? (
          <p className="empty">No risks added yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Risk</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((risk, i) => (
                <tr key={i}>
                  <td>{risk.text}</td>
                  <td>
                    <span className={"status status-" + risk.status}>{risk.status}</span>
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
