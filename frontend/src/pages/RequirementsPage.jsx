// Section B: Functional and non-functional requirements
import { useState } from "react";
import "./pages.css";

export default function RequirementsPage() {
  // Requirements list (FR-5)
  const [requirements, setRequirements] = useState([]);
  const [text, setText] = useState("");
  const [type, setType] = useState("Functional");

  // Keeps count so every requirement gets a new ID (FR-6)
  const [counts, setCounts] = useState({
    Functional: 0,
    "Non-Functional": 0,
  });

  function addRequirement() {
    if (text.trim() === "") return;
    const number = counts[type] + 1;
    const prefix = type === "Functional" ? "FR" : "NFR";
    const id = prefix + "-" + number;

    setCounts({ ...counts, [type]: number });
    setRequirements([...requirements, { id, type, text: text.trim() }]);
    setText("");
  }

  function updateText(index, newText) {
    const updated = [...requirements];
    updated[index] = { ...updated[index], text: newText };
    setRequirements(updated);
  }

  function deleteRequirement(index) {
    setRequirements(requirements.filter((_, i) => i !== index));
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
                  <td>{req.id}</td>
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
