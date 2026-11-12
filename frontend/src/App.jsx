import { useState } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";

import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("Connecting to backend...");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/health")
      .then((res) => setMessage(res.data))
      .catch((err) => setMessage("Backend not connected: " + err.message));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Project Management System</h1>
      <p>
        <strong>Backend Status:</strong> {message}
      </p>
    </div>
  );
}

export default App;
