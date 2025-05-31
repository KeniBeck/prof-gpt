import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./views/Login";
import Home from "./views/Home";
import Chat from "./views/Chat";
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
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
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