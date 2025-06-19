import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Bot,
  Plus,
  Settings,
  Play,
  Pause,
  Trash2,
  Phone,
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import { useFirebase, AIAgent } from "@/hooks/useFirebase";
import { useNavigate } from "react-router-dom";

const AICallingAgents = () => {
  const navigate = useNavigate();
  const {
    user,
    createAIAgent,
    getAIAgents,
    updateAIAgent,
    deleteAIAgent,
    error,
  } = useFirebase();
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "sales" as "sales" | "support" | "lead-qualifier" | "custom",
    voice: "alloy",
    language: "en-US",
    personality: "professional",
    instructions: "",
  });

  useEffect(() => {
    loadAgents();
  }, [user]);

  const loadAgents = async () => {
    if (!user) return;

    try {
      const agentsList = await getAIAgents();
      setAgents(agentsList);
    } catch (err) {
      console.error("Error loading agents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newAgent = await createAIAgent({
        name: formData.name,
        description: formData.description,
        status: "inactive",
        type: formData.type,
        configuration: {
          voice: formData.voice,
          language: formData.language,
          personality: formData.personality,
          instructions: formData.instructions,
        },
        stats: {
          totalCalls: 0,
          successfulCalls: 0,
          averageDuration: 0,
          conversionRate: 0,
        },
      });

      setAgents([newAgent, ...agents]);
      setShowCreateDialog(false);
      resetForm();
    } catch (err) {
      console.error("Error creating agent:", err);
    }
  };

  const handleToggleAgent = async (agent: AIAgent) => {
    const newStatus = agent.status === "active" ? "paused" : "active";

    try {
      await updateAIAgent(agent.id, { status: newStatus });
      setAgents(
        agents.map((a) =>
          a.id === agent.id ? { ...a, status: newStatus } : a,
        ),
      );
    } catch (err) {
      console.error("Error updating agent:", err);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return;

    try {
      await deleteAIAgent(agentId);
      setAgents(agents.filter((a) => a.id !== agentId));
    } catch (err) {
      console.error("Error deleting agent:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "sales",
      voice: "alloy",
      language: "en-US",
      personality: "professional",
      instructions: "",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "paused":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sales":
        return "💼";
      case "support":
        return "🎧";
      case "lead-qualifier":
        return "🎯";
      default:
        return "🤖";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">
              Please sign in to access AI Calling Agents.
            </p>
            <Button
              className="w-full mt-4"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Bot className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  AI Calling Agents
                </h1>
                <p className="text-gray-600">
                  Manage your intelligent calling agents
                </p>
              </div>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Agent
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white">
                <DialogHeader>
                  <DialogTitle>Create New AI Agent</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateAgent} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Agent Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="e.g., Sales Pro Agent"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Agent Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: any) =>
                          setFormData({ ...formData, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales">Sales Agent</SelectItem>
                          <SelectItem value="support">Support Agent</SelectItem>
                          <SelectItem value="lead-qualifier">
                            Lead Qualifier
                          </SelectItem>
                          <SelectItem value="custom">Custom Agent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Brief description of the agent's purpose"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="voice">Voice</Label>
                      <Select
                        value={formData.voice}
                        onValueChange={(value) =>
                          setFormData({ ...formData, voice: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alloy">Alloy (Neutral)</SelectItem>
                          <SelectItem value="echo">Echo (Male)</SelectItem>
                          <SelectItem value="fable">Fable (British)</SelectItem>
                          <SelectItem value="onyx">Onyx (Deep)</SelectItem>
                          <SelectItem value="nova">Nova (Female)</SelectItem>
                          <SelectItem value="shimmer">
                            Shimmer (Soft)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={formData.language}
                        onValueChange={(value) =>
                          setFormData({ ...formData, language: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="en-GB">English (UK)</SelectItem>
                          <SelectItem value="es-ES">Spanish</SelectItem>
                          <SelectItem value="fr-FR">French</SelectItem>
                          <SelectItem value="de-DE">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="personality">Personality</Label>
                      <Select
                        value={formData.personality}
                        onValueChange={(value) =>
                          setFormData({ ...formData, personality: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">
                            Professional
                          </SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="enthusiastic">
                            Enthusiastic
                          </SelectItem>
                          <SelectItem value="calm">Calm</SelectItem>
                          <SelectItem value="authoritative">
                            Authoritative
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="instructions">Custom Instructions</Label>
                    <Textarea
                      id="instructions"
                      value={formData.instructions}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instructions: e.target.value,
                        })
                      }
                      placeholder="Specific instructions for how the agent should behave during calls..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Agent</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Agents
              </CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agents.length}</div>
              <p className="text-xs text-muted-foreground">
                {agents.filter((a) => a.status === "active").length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {agents.reduce((sum, agent) => sum + agent.stats.totalCalls, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Success Rate
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {agents.length > 0
                  ? Math.round(
                      agents.reduce(
                        (sum, agent) => sum + agent.stats.conversionRate,
                        0,
                      ) / agents.length,
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Average across all agents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Duration
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {agents.length > 0
                  ? Math.round(
                      agents.reduce(
                        (sum, agent) => sum + agent.stats.averageDuration,
                        0,
                      ) / agents.length,
                    )
                  : 0}
                s
              </div>
              <p className="text-xs text-muted-foreground">
                Per successful call
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Agents List */}
        <Card>
          <CardHeader>
            <CardTitle>Your AI Agents</CardTitle>
            <CardDescription>
              Manage and configure your AI calling agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading agents...</p>
              </div>
            ) : agents.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No agents yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first AI calling agent to get started.
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Agent
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <Card
                    key={agent.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">
                            {getTypeIcon(agent.type)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {agent.name}
                            </CardTitle>
                            <CardDescription>
                              {agent.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div
                          className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Status:</span>
                          <Badge
                            variant={
                              agent.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {agent.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Total Calls:</span>
                            <div className="font-medium">
                              {agent.stats.totalCalls}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Success Rate:</span>
                            <div className="font-medium">
                              {agent.stats.conversionRate}%
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleAgent(agent)}
                            className="flex-1"
                          >
                            {agent.status === "active" ? (
                              <>
                                <Pause className="h-3 w-3 mr-1" /> Pause
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3 mr-1" /> Start
                              </>
                            )}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAgent(agent.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AICallingAgents;
