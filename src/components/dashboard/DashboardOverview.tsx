import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Phone,
  Bot,
  BarChart3,
  Plus,
  Play,
  Pause,
  Settings,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
} from "lucide-react";

const DashboardOverview = () => {
  const stats = {
    credits: 2450,
    totalCredits: 5000,
    callsToday: 127,
    activeAgents: 8,
    totalAgents: 12,
    conversionRate: 24.5,
  };

  const recentCalls = [
    {
      id: 1,
      contact: "John Smith",
      duration: "3:45",
      status: "completed",
      agent: "Sales Agent",
      time: "2 min ago",
    },
    {
      id: 2,
      contact: "Sarah Johnson",
      duration: "2:12",
      status: "completed",
      agent: "Support Agent",
      time: "5 min ago",
    },
    {
      id: 3,
      contact: "Mike Wilson",
      duration: "1:33",
      status: "missed",
      agent: "Lead Qualifier",
      time: "8 min ago",
    },
    {
      id: 4,
      contact: "Emma Davis",
      duration: "4:21",
      status: "completed",
      agent: "Sales Agent",
      time: "12 min ago",
    },
  ];

  const agents = [
    {
      id: 1,
      name: "Sales Agent Pro",
      status: "active",
      calls: 45,
      success: 89,
    },
    { id: 2, name: "Support Helper", status: "active", calls: 32, success: 94 },
    { id: 3, name: "Lead Qualifier", status: "paused", calls: 28, success: 76 },
    { id: 4, name: "Customer Care", status: "active", calls: 22, success: 91 },
  ];

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your AI agents.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Agent
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Credits
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.credits.toLocaleString()}
            </div>
            <div className="mt-2">
              <Progress
                value={(stats.credits / stats.totalCredits) * 100}
                className="h-2"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.credits} of {stats.totalCredits.toLocaleString()} credits
              remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls Today</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.callsToday}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.activeAgents}/{stats.totalAgents}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalAgents - stats.activeAgents} agents paused
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2.1% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Calls */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
            <CardDescription>
              Latest activity from your AI agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCalls.map((call) => (
                <div
                  key={call.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div>
                      <p className="font-medium">{call.contact}</p>
                      <p className="text-sm text-gray-500">{call.agent}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          call.status === "completed" ? "default" : "secondary"
                        }
                      >
                        {call.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {call.duration}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{call.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Calls
            </Button>
          </CardContent>
        </Card>

        {/* AI Agents */}
        <Card>
          <CardHeader>
            <CardTitle>AI Agents</CardTitle>
            <CardDescription>Manage and monitor your AI agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        agent.status === "active"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-gray-500">
                        {agent.calls} calls • {agent.success}% success
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        agent.status === "active" ? "outline" : "default"
                      }
                    >
                      {agent.status === "active" ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create New Agent
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex-col gap-2">
              <CreditCard className="h-6 w-6" />
              <span>Buy Credits</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Bot className="h-6 w-6" />
              <span>Test Agent</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
