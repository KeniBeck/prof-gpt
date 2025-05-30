import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./views/Login";
import Home from "./views/Home";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./middleware/ProtectedRoute";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
