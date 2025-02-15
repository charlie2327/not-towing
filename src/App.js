import "./App.css";
import React from "react";
import "antd/dist/reset.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import TransportPage from "./pages/Transport/TransportPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";

// Configuración del enrutador
function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal para /transporte */}
        <Route path="/transport" element={<TransportPage />} />
        <Route path="/not-found" element={<NotFoundPage />} />
        {/* Redirigir la ruta raíz a /transporte */}
        <Route path="/" element={<Navigate to="/transport" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
