import { Suspense, useState } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Dashboard from "./pages/dashboard";
import AICallingAgents from "./pages/AICallingAgents";
import VoipCalling from "./pages/VoipCalling";
import AuthModal from "./components/auth/AuthModal";
import { useFirebase } from "./hooks/useFirebase";
import routes from "tempo-routes";

function App() {
  const { user, loading } = useFirebase();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
              user ? (
                <Dashboard />
              ) : (
                <Home onAuthClick={() => setShowAuthModal(true)} />
              )
            }
          />
          <Route
            path="/ai-agents"
            element={
              user ? (
                <AICallingAgents />
              ) : (
                <Home onAuthClick={() => setShowAuthModal(true)} />
              )
            }
          />
          <Route
            path="/voip-calling"
            element={
              user ? (
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
            setShowAuthModal(false);
          }}
        />
      </>
    </Suspense>
  );
}

export default App;
