import React from "react";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import { Button } from "@/components/ui/button";
import { Phone, LogOut, User, CreditCard, Bot, BarChart3 } from "lucide-react";

const Dashboard = () => {
  const handleLogout = () => {
    // In a real app, this would clear auth state and redirect
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">
                NumSphere
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <DashboardOverview />
    </div>
  );
};

export default Dashboard;
