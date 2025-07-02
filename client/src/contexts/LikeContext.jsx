// LikeContext.jsx
import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useToast } from "../components/ui/use-toast";

const LikeContext = createContext();

export function LikeProvider({ children }) {
  const [likedBlogs, setLikedBlogs] = useState([]);
  const [likedComments, setLikedComments] = useState([]);
  const [likeStatus, setLikeStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const toggleBlogLike = async (blogId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`/api/v1/likes/blog/${blogId}`);
      
      // Update like status for this blog
      setLikeStatus(prev => ({
        ...prev,
        [blogId]: response.data.data.isLiked
      }));
      
      toast({
        variant: "success",
        title: "Success",
        description: response.data.message || "Like status updated",
      });
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to toggle like");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to toggle like",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleCommentLike = async (commentId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`/api/v1/likes/comment/${commentId}`);
      
      // Update like status for this comment
      setLikeStatus(prev => ({
        ...prev,
        [commentId]: response.data.data.isLiked
      }));
      
      toast({
        variant: "success",
        title: "Success",
        description: response.data.message || "Like status updated",
      });
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to toggle like");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to toggle like",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getLikedBlogs = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get("/api/v1/likes/blogs", {
        params: { page, limit }
      });

      setLikedBlogs(response.data.data.docs || []);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch liked blogs");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch liked blogs",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getLikedComments = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get("/api/v1/likes/comments", {
        params: { page, limit }
      });

      setLikedComments(response.data.data.docs || []);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch liked comments");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch liked comments",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkLikeStatus = async (targetId, type) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/api/v1/likes/status/${type}/${targetId}`);
      
      // Update like status for this target
      setLikeStatus(prev => ({
        ...prev,
        [targetId]: response.data.data.isLiked
      }));
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to check like status");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    likedBlogs,
    likedComments,
    likeStatus,
    loading,
    error,
    toggleBlogLike,
    toggleCommentLike,
    getLikedBlogs,
    getLikedComments,
    checkLikeStatus
  };

  return (
    <LikeContext.Provider value={value}>
      {children}
    </LikeContext.Provider>
  );
}

export function useLike() {
  const context = useContext(LikeContext);
  if (context === undefined) {
    throw new Error("useLike must be used within a LikeProvider");
  }
  return context;
}