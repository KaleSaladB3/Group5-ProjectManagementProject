// Section B: Functional and non-functional requirements
import { useState } from "react";
import "./pages.css";

export default function RequirementsPage() {
  const [requirements, setRequirements] = useState([]);
  const [text, setText] = useState("");
  const [type, setType] = useState("Functional");

  function addRequirement() {
    if (text === "") return;
    setRequirements([...requirements, { text: text, type: type }]);
    setText("");
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
                <th>#</th>
                <th>Type</th>
                <th>Requirement</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((req, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{req.type}</td>
                  <td>{req.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
