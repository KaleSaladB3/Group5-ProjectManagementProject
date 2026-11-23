
import "./App.css";
import GeneralPage from "./pages/GeneralPage";
import RequirementsPage from "./pages/RequirementsPage";
import EffortTrackingPage from "./pages/EffortTrackingPage";

import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("Connecting to backend...");
  const [activeSection, setActiveSection] = useState("general");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    axios
      .get("/api/projects")
      .then(() => {
        setConnected(true);
        setMessage("Backend connected");
      })
      .catch((err) => {
        setConnected(false);
        setMessage("Backend unavailable: " + err.message);
      });
  }, []);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">PM</div>
          <div>
            <h1>Project Management</h1>
          </div>
        </div>

        <div className={`connection-status ${connected ? "connected" : ""}`}>
          <span className="status-dot" aria-hidden="true"></span>
          {message}
        </div>
      </header>

      <nav className="section-nav" aria-label="Project sections">
        <button
          className={activeSection === "general" ? "active" : ""}
          onClick={() => setActiveSection("general")}
        >
          General
        </button>
        <button
          className={activeSection === "requirements" ? "active" : ""}
          onClick={() => setActiveSection("requirements")}
        >
          Requirements
        </button>
        <button
          className={activeSection === "effort" ? "active" : ""}
          onClick={() => setActiveSection("effort")}
        >
          Effort Tracking
        </button>
      </nav>

      <main className="app-content">
        {activeSection === "general" && <GeneralPage />}
        {activeSection === "requirements" && <RequirementsPage />}
        {activeSection === "effort" && <EffortTrackingPage />}
      </main>
    </div>
  );
}

export default App;
