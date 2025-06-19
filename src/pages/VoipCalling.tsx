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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Clock,
  User,
  History,
  Settings,
  ArrowLeft,
  Plus,
  Search,
} from "lucide-react";
import { useFirebase, CallRecord } from "@/hooks/useFirebase";
import { useNavigate } from "react-router-dom";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  lastCalled?: Date;
}

const VoipCalling = () => {
  const navigate = useNavigate();
  const { user, addCallRecord, getCallRecords, error } = useFirebase();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [currentCall, setCurrentCall] = useState<{
    contact: string;
    number: string;
  } | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callHistory, setCallHistory] = useState<CallRecord[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "John Smith",
      phone: "+1-555-0123",
      email: "john@example.com",
      company: "TechCorp",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      phone: "+1-555-0124",
      email: "sarah@example.com",
      company: "InnovateLab",
    },
    {
      id: "3",
      name: "Mike Wilson",
      phone: "+1-555-0125",
      email: "mike@example.com",
      company: "GrowthCo",
    },
    {
      id: "4",
      name: "Emma Davis",
      phone: "+1-555-0126",
      email: "emma@example.com",
      company: "StartupXYZ",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
  });

  useEffect(() => {
    loadCallHistory();
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const loadCallHistory = async () => {
    if (!user) return;

    try {
      const history = await getCallRecords(20);
      setCallHistory(history);
    } catch (err) {
      console.error("Error loading call history:", err);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCall = async (contact: string, number: string) => {
    if (isCallActive) return;

    setCurrentCall({ contact, number });
    setIsCallActive(true);
    setCallDuration(0);

    // Simulate call connection
    setTimeout(() => {
      console.log(`Calling ${contact} at ${number}...`);
    }, 1000);
  };

  const handleEndCall = async () => {
    if (!isCallActive || !currentCall) return;

    setIsCallActive(false);

    // Record the call
    try {
      await addCallRecord({
        agentId: "manual-call",
        agentName: "Manual VoIP Call",
        contactName: currentCall.contact,
        contactNumber: currentCall.number,
        duration: callDuration,
        status: "completed",
        outcome: "follow-up",
      });

      // Refresh call history
      loadCallHistory();
    } catch (err) {
      console.error("Error recording call:", err);
    }

    setCurrentCall(null);
    setCallDuration(0);
    setIsMuted(false);
    setIsSpeakerOn(false);
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) return;

    const contact: Contact = {
      id: Date.now().toString(),
      ...newContact,
    };

    setContacts([contact, ...contacts]);
    setNewContact({ name: "", phone: "", email: "", company: "" });
    setShowAddContact(false);
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      (contact.company &&
        contact.company.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const formatPhoneNumber = (phone: string) => {
    // Simple phone number formatting
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">
              Please sign in to access VoIP Calling.
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
              <Phone className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  VoIP Calling
                </h1>
                <p className="text-gray-600">
                  Make and manage your voice calls
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={isCallActive ? "default" : "secondary"}>
                {isCallActive ? "Call Active" : "Ready"}
              </Badge>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Call Interface */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Call Interface</CardTitle>
                <CardDescription>
                  {isCallActive
                    ? "Call in progress"
                    : "Enter a phone number or select a contact"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isCallActive && currentCall ? (
                  /* Active Call UI */
                  <div className="text-center space-y-6">
                    <div className="space-y-2">
                      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <User className="h-12 w-12 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold">
                        {currentCall.contact}
                      </h3>
                      <p className="text-gray-500">
                        {formatPhoneNumber(currentCall.number)}
                      </p>
                      <div className="flex items-center justify-center text-lg font-mono">
                        <Clock className="h-4 w-4 mr-2" />
                        {formatDuration(callDuration)}
                      </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                      <Button
                        variant={isMuted ? "default" : "outline"}
                        size="lg"
                        onClick={() => setIsMuted(!isMuted)}
                        className="w-16 h-16 rounded-full"
                      >
                        {isMuted ? (
                          <MicOff className="h-6 w-6" />
                        ) : (
                          <Mic className="h-6 w-6" />
                        )}
                      </Button>

                      <Button
                        variant="destructive"
                        size="lg"
                        onClick={handleEndCall}
                        className="w-16 h-16 rounded-full"
                      >
                        <PhoneOff className="h-6 w-6" />
                      </Button>

                      <Button
                        variant={isSpeakerOn ? "default" : "outline"}
                        size="lg"
                        onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                        className="w-16 h-16 rounded-full"
                      >
                        {isSpeakerOn ? (
                          <Volume2 className="h-6 w-6" />
                        ) : (
                          <VolumeX className="h-6 w-6" />
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Dialer UI */
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={() =>
                            handleCall("Unknown Contact", phoneNumber)
                          }
                          disabled={!phoneNumber.trim()}
                          className="px-8"
                        >
                          <PhoneCall className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                      </div>
                    </div>

                    {/* Quick Dial Pad */}
                    <div>
                      <h4 className="font-medium mb-3">Quick Dial</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                          "*",
                          "0",
                          "#",
                        ].map((digit) => (
                          <Button
                            key={digit}
                            variant="outline"
                            className="h-12 text-lg"
                            onClick={() =>
                              setPhoneNumber((prev) => prev + digit)
                            }
                          >
                            {digit}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contacts & History */}
          <div>
            <Tabs defaultValue="contacts" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="contacts">Contacts</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="contacts">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Contacts</CardTitle>
                      <Dialog
                        open={showAddContact}
                        onOpenChange={setShowAddContact}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white">
                          <DialogHeader>
                            <DialogTitle>Add New Contact</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="contactName">Name</Label>
                              <Input
                                id="contactName"
                                value={newContact.name}
                                onChange={(e) =>
                                  setNewContact({
                                    ...newContact,
                                    name: e.target.value,
                                  })
                                }
                                placeholder="Contact name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactPhone">Phone</Label>
                              <Input
                                id="contactPhone"
                                type="tel"
                                value={newContact.phone}
                                onChange={(e) =>
                                  setNewContact({
                                    ...newContact,
                                    phone: e.target.value,
                                  })
                                }
                                placeholder="Phone number"
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactEmail">
                                Email (Optional)
                              </Label>
                              <Input
                                id="contactEmail"
                                type="email"
                                value={newContact.email}
                                onChange={(e) =>
                                  setNewContact({
                                    ...newContact,
                                    email: e.target.value,
                                  })
                                }
                                placeholder="Email address"
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactCompany">
                                Company (Optional)
                              </Label>
                              <Input
                                id="contactCompany"
                                value={newContact.company}
                                onChange={(e) =>
                                  setNewContact({
                                    ...newContact,
                                    company: e.target.value,
                                  })
                                }
                                placeholder="Company name"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setShowAddContact(false)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleAddContact}>
                                Add Contact
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-gray-500">
                              {formatPhoneNumber(contact.phone)}
                            </p>
                            {contact.company && (
                              <p className="text-xs text-gray-400">
                                {contact.company}
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleCall(contact.name, contact.phone)
                            }
                            disabled={isCallActive}
                          >
                            <PhoneCall className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Call History</CardTitle>
                    <CardDescription>
                      Recent calls and their details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {callHistory.length === 0 ? (
                        <div className="text-center py-8">
                          <History className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">No call history yet</p>
                        </div>
                      ) : (
                        callHistory.map((call) => (
                          <div
                            key={call.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{call.contactName}</p>
                              <p className="text-sm text-gray-500">
                                {call.contactNumber}
                              </p>
                              <p className="text-xs text-gray-400">
                                {call.createdAt &&
                                  new Date(
                                    call.createdAt.seconds * 1000,
                                  ).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={
                                  call.status === "completed"
                                    ? "default"
                                    : "secondary"
                                }
                                className="mb-1"
                              >
                                {call.status}
                              </Badge>
                              <p className="text-xs text-gray-500">
                                {formatDuration(call.duration)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoipCalling;
