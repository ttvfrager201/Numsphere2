import { useState, useEffect } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  credits: number;
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "inactive";
  type: "sales" | "support" | "lead-qualifier" | "custom";
  configuration: {
    voice: string;
    language: string;
    personality: string;
    instructions: string;
  };
  stats: {
    totalCalls: number;
    successfulCalls: number;
    averageDuration: number;
    conversionRate: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CallRecord {
  id: string;
  agentId: string;
  agentName: string;
  contactName: string;
  contactNumber: string;
  duration: number;
  status: "completed" | "missed" | "failed";
  transcript?: string;
  recording?: string;
  outcome: "converted" | "follow-up" | "not-interested" | "no-answer";
  createdAt: Timestamp;
}

export const useFirebase = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gumroad integration
  const verifyGumroadSubscription = async (email: string, name: string) => {
    try {
      // This would require your Gumroad API key
      // For now, returning a mock response
      console.log("Verifying Gumroad subscription for:", { email, name });
      return { isValid: true, subscriptionActive: true };
    } catch (err) {
      console.error("Gumroad verification failed:", err);
      return { isValid: false, subscriptionActive: false };
    }
  };

  useEffect(() => {
    if (!auth) {
      console.error("Firebase auth not initialized");
      setError(
        "Firebase authentication not configured. Please check your environment variables.",
      );
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await loadUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
      }
    } catch (err) {
      console.error("Error loading user profile:", err);
      setError("Failed to load user profile");
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      const error = "Firebase authentication not configured";
      setError(error);
      throw new Error(error);
    }

    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Update last login and load user profile
      if (db) {
        await updateDoc(doc(db, "users", result.user.uid), {
          lastLogin: Timestamp.now(),
        });
        await loadUserProfile(result.user.uid);
      }

      // Ensure user state is updated
      setUser(result.user);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    if (!auth) {
      const error = "Firebase authentication not configured";
      setError(error);
      throw new Error(error);
    }

    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Create user profile
      const userProfile: UserProfile = {
        uid: result.user.uid,
        email: result.user.email!,
        displayName,
        credits: 1000, // Starting credits
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now(),
      };

      if (db) {
        await setDoc(doc(db, "users", result.user.uid), userProfile);
        setUserProfile(userProfile);
      }

      // Ensure user state is updated
      setUser(result.user);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    if (!auth) {
      const error = "Firebase authentication not configured";
      setError(error);
      throw new Error(error);
    }

    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // AI Agents functions
  const createAIAgent = async (
    agentData: Omit<AIAgent, "id" | "createdAt" | "updatedAt">,
  ) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const agent: Omit<AIAgent, "id"> = {
        ...agentData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(
        collection(db, "users", user.uid, "agents"),
        agent,
      );
      return { id: docRef.id, ...agent };
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const getAIAgents = async (): Promise<AIAgent[]> => {
    if (!user) return [];

    try {
      const q = query(
        collection(db, "users", user.uid, "agents"),
        orderBy("createdAt", "desc"),
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as AIAgent,
      );
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  const updateAIAgent = async (agentId: string, updates: Partial<AIAgent>) => {
    if (!user) throw new Error("User not authenticated");

    try {
      await updateDoc(doc(db, "users", user.uid, "agents", agentId), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteAIAgent = async (agentId: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      await deleteDoc(doc(db, "users", user.uid, "agents", agentId));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Call Records functions
  const addCallRecord = async (
    callData: Omit<CallRecord, "id" | "createdAt">,
  ) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const call: Omit<CallRecord, "id"> = {
        ...callData,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(
        collection(db, "users", user.uid, "calls"),
        call,
      );
      return { id: docRef.id, ...call };
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const getCallRecords = async (
    limitCount: number = 50,
  ): Promise<CallRecord[]> => {
    if (!user) return [];

    try {
      const q = query(
        collection(db, "users", user.uid, "calls"),
        orderBy("createdAt", "desc"),
        limit(limitCount),
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as CallRecord,
      );
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  const updateUserCredits = async (newCredits: number) => {
    if (!user) throw new Error("User not authenticated");

    try {
      await updateDoc(doc(db, "users", user.uid), {
        credits: newCredits,
      });

      if (userProfile) {
        setUserProfile({ ...userProfile, credits: newCredits });
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signUp,
    resetPassword,
    logout,
    createAIAgent,
    getAIAgents,
    updateAIAgent,
    deleteAIAgent,
    addCallRecord,
    getCallRecords,
    updateUserCredits,
    verifyGumroadSubscription,
  };
};
