import { Suspense, useState } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Dashboard from "./pages/dashboard";
import AICallingAgents from "./pages/AICallingAgents";
import VoipCalling from "./pages/VoipCalling";
import AuthModal from "./components/auth/AuthModal";
import routes from "tempo-routes";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route
            path="/"
            element={<Home onAuthClick={() => setShowAuthModal(true)} />}
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard />
              ) : (
                <Home onAuthClick={() => setShowAuthModal(true)} />
              )
            }
          />
          <Route
            path="/ai-agents"
            element={
              isAuthenticated ? (
                <AICallingAgents />
              ) : (
                <Home onAuthClick={() => setShowAuthModal(true)} />
              )
            }
          />
          <Route
            path="/voip-calling"
            element={
              isAuthenticated ? (
                <VoipCalling />
              ) : (
                <Home onAuthClick={() => setShowAuthModal(true)} />
              )
            }
          />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <AuthModal
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthenticated={() => {
            setIsAuthenticated(true);
            setShowAuthModal(false);
          }}
        />
      </>
    </Suspense>
  );
}

export default App;
