import "./App.css";
import React from "react";
import "antd/dist/reset.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CreateAppointment from "./pages/Appointments/create";
import NotFound from "./pages/Errors/404";
import "./App.css";
import Success from "./pages/Success/Success";

// Configuración del enrutador
function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal para /transporte */}
        <Route path="/transport" element={<CreateAppointment />} />
        <Route path="/success" element={<Success />} />
        {/* Redirigir la ruta raíz a /transporte */}
        <Route path="/" element={<Navigate to="/transporte" replace />} />
        {/* Ruta para manejar errores 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
