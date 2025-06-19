import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import OtpVerification from "./OtpVerification";

interface AuthModalProps {
  open?: boolean;
  onClose?: () => void;
  onAuthenticated?: () => void;
}

type AuthMode = "login" | "signup" | "forgot" | "otp";

const AuthModal = ({
  open = true,
  onClose = () => {},
  onAuthenticated = () => {},
}: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        // Simulate login
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (email === "demo@numsphere.com" && password === "demo123") {
          onAuthenticated();
        } else {
          setError("Invalid credentials. Try demo@numsphere.com / demo123");
        }
      } else if (mode === "signup") {
        // Simulate signup with OTP
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setMode("otp");
      } else if (mode === "forgot") {
        // Simulate forgot password
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setError("Password reset link sent to your email!");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerified = () => {
    onAuthenticated();
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
    setLoading(false);
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  if (mode === "otp") {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-4 p-0 h-8 w-8"
              onClick={() => setMode("signup")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-center">Verify Your Email</DialogTitle>
          </DialogHeader>
          <OtpVerification
            email={email}
            onVerified={handleOtpVerified}
            onResend={() => console.log("Resending OTP...")}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-center">
            {mode === "login" && "Welcome Back"}
            {mode === "signup" && "Create Account"}
            {mode === "forgot" && "Reset Password"}
          </DialogTitle>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardHeader className="pb-4">
            <CardDescription className="text-center">
              {mode === "login" && "Sign in to your NumSphere account"}
              {mode === "signup" && "Get started with NumSphere today"}
              {mode === "forgot" && "Enter your email to reset your password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {mode !== "forgot" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              {error && (
                <Alert
                  variant={error.includes("sent") ? "default" : "destructive"}
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? "Please wait..."
                  : mode === "login"
                    ? "Sign In"
                    : mode === "signup"
                      ? "Create Account"
                      : "Send Reset Link"}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              {mode === "login" && (
                <>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => switchMode("forgot")}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot your password?
                    </button>
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("signup")}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Sign up
                    </button>
                  </div>
                </>
              )}

              {mode === "signup" && (
                <div className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </div>
              )}

              {mode === "forgot" && (
                <div className="text-center text-sm text-gray-600">
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>

            {mode === "login" && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Demo Account:</strong>
                  <br />
                  Email: demo@numsphere.com
                  <br />
                  Password: demo123
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
