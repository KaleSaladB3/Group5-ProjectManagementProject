import { useEffect, useState } from "react";
import axios from "axios";
import "./pages.css";

export default function GeneralPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");
  const [projectId, setProjectId] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    axios

      .get("/api/projects")
      .then((response) => {
        if (response.data.length > 0) {
          const project = response.data[0];
          setProjectId(project.id);
          setName(project.name ?? "");
          setDescription(project.description ?? "");
          setOwner(project.ownerName ?? "");
        }
      })
      .catch((error) => {
        setSaveStatus(
          "Could not load project: " +
            (error.response?.data?.message || error.message)
        );
      });
  }, []);

  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");

  const [risks, setRisks] = useState([]);
  const [riskText, setRiskText] = useState("");
  const [riskStatus, setRiskStatus] = useState("OPEN");

  useEffect(() => {
    if (!projectId) return;

    axios
      .get(`/api/projects/${projectId}/team-members`)
      .then((response) => setMembers(response.data))
      .catch((error) => {
        setSaveStatus(
          "Could not load team members: " +
            (error.response?.data?.message || error.message)
        );
      });

    axios
      .get(`/api/projects/${projectId}/risks`)
      .then((response) => setRisks(response.data))
      .catch((error) => {
        setSaveStatus(
          "Could not load risks: " +
            (error.response?.data?.message || error.message)
        );
      });
  }, [projectId]);

  async function addMember() {
    if (memberName.trim() === "") return;
    if (!projectId) {
      setSaveStatus("Save the project before adding team members.");
      return;
    }

    try {
      const response = await axios.post(
        `/api/projects/${projectId}/team-members`,
        { name: memberName.trim(), role: null }
      );
      setMembers((current) => [...current, response.data]);
      setMemberName("");
    } catch (error) {
      setSaveStatus(
        "Could not add team member: " +
          (error.response?.data?.message || error.message)
      );
    }
  }

  async function deleteMember(memberId) {
    try {
      await axios.delete(
        `/api/projects/${projectId}/team-members/${memberId}`
      );
      setMembers((current) => current.filter((member) => member.id !== memberId));
    } catch (error) {
      setSaveStatus(
        "Could not remove team member: " +
          (error.response?.data?.message || error.message)
      );
    }
  }

  async function addRisk() {
    if (riskText.trim() === "") return;
    if (!projectId) {
      setSaveStatus("Save the project before adding risks.");
      return;
    }

    try {
      const response = await axios.post(
        `/api/projects/${projectId}/risks`,
        { description: riskText.trim() }
      );
      if (riskStatus !== "OPEN") {
        const statusResponse = await axios.patch(
          `/api/projects/${projectId}/risks/${response.data.id}/status`,
          { status: riskStatus }
        );
        setRisks((current) => [...current, statusResponse.data]);
      } else {
        setRisks((current) => [...current, response.data]);
      }
      setRiskText("");
    } catch (error) {
      setSaveStatus(
        "Could not add risk: " +
          (error.response?.data?.message || error.message)
      );
    }
  }

  function updateRisk(index, field, value) {
    const updated = [...risks];
    updated[index] = { ...updated[index], [field]: value };
    setRisks(updated);
  }

  async function saveRiskDescription(risk) {
    try {
      await axios.put(
        `/api/projects/${projectId}/risks/${risk.id}`,
        { description: risk.description }
      );
    } catch (error) {
      setSaveStatus(
        "Could not save risk: " +
          (error.response?.data?.message || error.message)
      );
    }
  }

  async function updateRiskStatus(riskId, status) {
    try {
      const response = await axios.patch(
        `/api/projects/${projectId}/risks/${riskId}/status`,
        { status }
      );
      setRisks((current) =>
        current.map((risk) => (risk.id === riskId ? response.data : risk))
      );
    } catch (error) {
      setSaveStatus(
        "Could not update risk status: " +
          (error.response?.data?.message || error.message)
      );
    }
  }

  async function deleteRisk(riskId) {
    try {
      await axios.delete(`/api/projects/${projectId}/risks/${riskId}`);
      setRisks((current) => current.filter((risk) => risk.id !== riskId));
    } catch (error) {
      setSaveStatus(
        "Could not delete risk: " +
          (error.response?.data?.message || error.message)
      );
    }
  }

  async function saveProject() {
    if (!name.trim()) {
      setSaveStatus("Project name is required.");
      return;
    }
    if (!owner.trim()) {
      setSaveStatus("Owner / Project Manager is required.");
      return;
    }

    const project = {
      name: name.trim(),
      description: description.trim(),
      ownerName: owner.trim(),
    };

    try {
      if (projectId) {
        const response = await axios.put(
          `/api/projects/${projectId}`,
          project
        );
        setName(response.data.name);
        setDescription(response.data.description ?? "");
        setOwner(response.data.ownerName);
        setSaveStatus("Project saved.");
      } else {
        const response = await axios.post("/api/projects", project);
        setProjectId(response.data.id);
        setSaveStatus("Project created.");
      }
    } catch (error) {
      setSaveStatus(
        "Could not save project: " +
          (error.response?.data?.message || error.message)
      );
    }
  }

  return (
    <div className="page">
      <h1>Section A: General</h1>

      <div className="card">
        <h2>Project Info</h2>
        <label className="field">
          Project Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
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
        <button onClick={saveProject}>Save Project</button>
        {saveStatus && <p role="status">{saveStatus}</p>}
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
          {members.map((member) => (
            <li key={member.id}>
              {member.name}
              <button className="delete-btn" onClick={() => deleteMember(member.id)}>
                Remove
              </button>
            </li>
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
            <option value="OPEN">Open</option>
            <option value="MITIGATED">Monitoring</option>
            <option value="CLOSED">Closed</option>
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {risks.map((risk, i) => (
                <tr key={risk.id}>
                  <td>
                    <input
                      value={risk.description}
                      onChange={(e) => updateRisk(i, "description", e.target.value)}
                      onBlur={() => saveRiskDescription(risk)}
                    />
                  </td>
                  <td>
                    <select
                      className={"status status-" + risk.status.toLowerCase()}
                      value={risk.status}
                      onChange={(e) => updateRiskStatus(risk.id, e.target.value)}
                    >
                      <option value="OPEN">Open</option>
                      <option value="MITIGATED">Monitoring</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteRisk(risk.id)}>
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
