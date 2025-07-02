// DashboardContext.jsx
import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useToast } from "../components/ui/use-toast";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [authorStats, setAuthorStats] = useState(null);
  const [authorBlogs, setAuthorBlogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const getAuthorStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get("/api/v1/dashboard/stats");
      
      setAuthorStats(response.data.data);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch author stats");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch author stats",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAuthorBlogs = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const { 
        page = 1, 
        limit = 10, 
        status, 
        sortBy = "createdAt", 
        sortOrder = -1 
      } = params;

      const response = await axios.get("/api/v1/dashboard/blogs", {
        params: {
          page,
          limit,
          status,
          sortBy,
          sortOrder
        }
      });

      setAuthorBlogs(response.data.data.docs || []);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch author blogs");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch author blogs",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAnalytics = async (period = "30d") => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get("/api/v1/dashboard/analytics", {
        params: { period }
      });
      
      setAnalytics(response.data.data);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch analytics");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch analytics",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    authorStats,
    authorBlogs,
    analytics,
    loading,
    error,
    getAuthorStats,
    getAuthorBlogs,
    getAnalytics
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}