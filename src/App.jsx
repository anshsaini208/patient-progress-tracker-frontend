import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/layout/Layout";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientDetails from "./pages/PatientDetails";
import Documents from "./pages/Documents";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          element={<Layout />}
        >

          {/* DEFAULT */}

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          {/* DASHBOARD */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* PATIENT LIST */}

          <Route
            path="/patients"
            element={<Patients />}
          />

          {/* PATIENT DETAILS */}

          <Route
            path="/patients/:patientId"
            element={
              <PatientDetails />
            }
          />

          {/* DOCUMENTS */}

          <Route
            path="/documents"
            element={<Documents />}
          />

          {/* ANALYTICS */}

          <Route
            path="/analytics"
            element={
              <div>
                Analytics
              </div>
            }
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;