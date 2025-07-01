import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import ResetPass from "./pages/ResetPass";
import EmailVerification from "./pages/EmailVerification";
import Login from "./pages/Login";
import Consent from "./pages/Consent";
import Pretest from "./pages/Pretest";
import Prediction from "./pages/Prediction";
import Evaluation from "./pages/Evaluation";
import Unsatisfactory from "./components/Unsatisfactory";
import Satisfactory from "./components/Satisfactory";
import PatientProfile from "./pages/PatientProfile";
import PatientHistory from "./pages/PatientHistory";
import DoctorLogbook from "./pages/DoctorLogbook";
import { AuthProvider } from "./components/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resetpass" element={<ResetPass />} />
          <Route path="/emailverification" element={<EmailVerification />} />

          <Route path="/" element={<Navigate to="/login" />} />

          <Route
            path="/consent"
            element={
              <PrivateRoute>
                <Consent />
              </PrivateRoute>
            }
          />
          <Route
            path="/pretest"
            element={
              <PrivateRoute>
                <Pretest />
              </PrivateRoute>
            }
          />
          <Route
            path="/prediction"
            element={
              <PrivateRoute>
                <Prediction />
              </PrivateRoute>
            }
          />
          <Route
            path="/evaluation"
            element={
              <PrivateRoute>
                <Evaluation />
              </PrivateRoute>
            }
          />
          <Route
            path="/unsatisfactory"
            element={
              <PrivateRoute>
                <Unsatisfactory />
              </PrivateRoute>
            }
          />
          <Route
            path="/satisfactory"
            element={
              <PrivateRoute>
                <Satisfactory />
              </PrivateRoute>
            }
          />
          <Route
            path="/patientprofile/:patientID"
            element={
              <PrivateRoute>
                <PatientProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/patienthistory"
            element={
              <PrivateRoute>
                <PatientHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/doctorlogbook"
            element={
              <PrivateRoute>
                <DoctorLogbook />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
