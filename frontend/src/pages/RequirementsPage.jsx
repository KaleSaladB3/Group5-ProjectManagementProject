import { useEffect, useState } from "react";
import axios from "axios";
import "./pages.css";

export default function RequirementsPage() {
  const [requirements, setRequirements] = useState([]);
  const [text, setText] = useState("");
  const [type, setType] = useState("Functional");

  const [projectId, setProjectId] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    axios
      .get("/api/projects")
      .then(async (response) => {
        if (response.data.length === 0) return;
        const id = response.data[0].id;
        setProjectId(id);
        const requirementsResponse = await axios.get(
          `/api/projects/${id}/requirements`
        );
        setRequirements(requirementsResponse.data.map((requirement) => ({
          id: requirement.id,
          code: requirement.code,
          type: requirement.type === "FUNCTIONAL"
            ? "Functional"
            : "Non-Functional",
          text: requirement.title,
        })));
      })
      .catch((error) => setStatus(error.response?.data?.message || error.message));
  }, []);

  async function addRequirement() {
    if (text.trim() === "") return;
    if (!projectId) {
      setStatus("Save a project in Section A before adding requirements.");
      return;
    }
    try {
      const response = await axios.post(
        `/api/projects/${projectId}/requirements`,
        {
          title: text.trim(),
          description: text.trim(),
          type: type === "Functional" ? "FUNCTIONAL" : "NON_FUNCTIONAL",
        }
      );
      const requirement = response.data;
      setRequirements((current) => [...current, {
        id: requirement.id,
        code: requirement.code,
        type: type,
        text: requirement.title,
      }]);
      setText("");
      setStatus("");
    } catch (error) {
      setStatus(error.response?.data?.message || error.message);
    }
  }

  async function updateText(index, newText) {
    const requirement = requirements[index];
    setRequirements((current) => current.map((item, i) =>
      i === index ? { ...item, text: newText } : item
    ));
    if (requirement.id) {
      try {
        await axios.put(
          `/api/projects/${projectId}/requirements/${requirement.id}`,
          {
            title: newText,
            description: newText,
            type: requirement.type === "Functional"
              ? "FUNCTIONAL"
              : "NON_FUNCTIONAL",
          }
        );
      } catch (error) {
        setStatus(error.response?.data?.message || error.message);
      }
    }
  }

  async function deleteRequirement(index) {
    const requirement = requirements[index];
    try {
      await axios.delete(
        `/api/projects/${projectId}/requirements/${requirement.id}`
      );
      setRequirements((current) => current.filter((_, i) => i !== index));
    } catch (error) {
      setStatus(error.response?.data?.message || error.message);
    }
  }

  return (
    <div className="page">
      <h1>Section B: Requirements</h1>

      <div className="card">
        <h2>Add a Requirement</h2>
        <div className="form-row">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>Functional</option>
            <option>Non-Functional</option>
          </select>
          <input
            placeholder="Describe the requirement"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={addRequirement}>Add Requirement</button>
        </div>
        {status && <p className="error">{status}</p>}
      </div>

      <div className="card">
        <h2>Requirements List</h2>
        {requirements.length === 0 ? (
          <p className="empty">No requirements added yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Requirement</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((req, i) => (
                <tr key={req.id}>
                  <td>{req.code}</td>
                  <td>{req.type}</td>
                  <td>
                    <input
                      value={req.text}
                      onChange={(e) => updateText(i, e.target.value)}
                    />
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteRequirement(i)}>
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
