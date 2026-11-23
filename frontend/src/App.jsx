
import "./App.css";
import GeneralPage from "./pages/GeneralPage";
import RequirementsPage from "./pages/RequirementsPage";
import EffortTrackingPage from "./pages/EffortTrackingPage";

import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("Connecting to backend...");

  useEffect(() => {
    axios
      .get("/api/projects")
      .then(() => setMessage("Connected"))
      .catch((err) => setMessage("Backend not connected: " + err.message));
  }, []);

  return (
    <>
        <div style={{ padding: "2rem" }}>
          <h1>Project Management System</h1>
          <p>
            <strong>Backend Status:</strong> {message}
          </p>
        </div>
  
        {/* Prototype of each page */}
        <GeneralPage />
        <RequirementsPage />
        <EffortTrackingPage />
      </>
  );
}

export default App;
