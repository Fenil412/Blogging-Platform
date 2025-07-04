// BlogContext.jsx
import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useToast } from "../components/ui/use-toast";

const BlogContext = createContext();

export function BlogProvider({ children }) {
  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const getAllBlogs = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const {
        page = 1,
        limit = 10,
        query,
        sortBy = "createdAt",
        sortType = "desc",
        userId,
      } = params;

      const response = await axios.get("/api/v1/blogs", {
        params: {
          page,
          limit,
          query,
          sortBy,
          sortType,
          userId,
        },
      });

      // Handle different response structures
      const responseData = response.data.data;
      let blogsArray = [];

      if (Array.isArray(responseData)) {
        blogsArray = responseData;
      } else if (responseData.blogs) {
        blogsArray = responseData.blogs;
      } else if (responseData.docs) {
        blogsArray = responseData.docs;
      } else {
        blogsArray = [];
      }

      setBlogs(blogsArray);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch blogs");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch blogs",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getBlogById = async (blogId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`/api/v1/blogs/${blogId}`);
      setCurrentBlog(response.data.data);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Blog not found");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Blog not found",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const publishBlog = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post("/api/v1/blogs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        variant: "success",
        title: "Success",
        description: response.data.message || "Blog published successfully",
      });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to publish blog");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to publish blog",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateBlog = async (blogId, formData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.patch(`/api/v1/blogs/${blogId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update current blog if it's the one being edited
      if (currentBlog?._id === blogId) {
        setCurrentBlog(response.data.data);
      }

      toast({
        variant: "success",
        title: "Success",
        description: response.data.message || "Blog updated successfully",
      });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update blog");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to update blog",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (blogId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.delete(`/api/v1/blogs/${blogId}`);

      // Update blogs list
      setBlogs((prev) => prev.filter((blog) => blog._id !== blogId));

      // Clear current blog if it's the one being deleted
      if (currentBlog?._id === blogId) {
        setCurrentBlog(null);
      }

      toast({
        variant: "success",
        title: "Success",
        description: response.data.message || "Blog deleted successfully",
      });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete blog");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to delete blog",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const togglePublishStatus = async (blogId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.patch(
        `/api/v1/blogs/toggle/publish/${blogId}`
      );

      // Update blogs list
      setBlogs((prev) =>
        prev.map((blog) =>
          blog._id === blogId
            ? { ...blog, isPublished: !blog.isPublished }
            : blog
        )
      );

      // Update current blog if it's the one being toggled
      if (currentBlog?._id === blogId) {
        setCurrentBlog((prev) => ({
          ...prev,
          isPublished: !prev.isPublished,
        }));
      }

      // Update blogs list
      setBlogs((prev) =>
        prev.map((blog) =>
          blog._id === blogId
            ? { ...blog, isPublished: !blog.isPublished }
            : blog
        )
      );

      toast({
        variant: "success",
        title: "Success",
        description: response.data.message || "Publish status updated",
      });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to publish blog");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to publish blog",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    blogs,
    currentBlog,
    loading,
    error,
    getAllBlogs,
    getBlogById,
    publishBlog,
    updateBlog,
    deleteBlog,
    togglePublishStatus,
    setCurrentBlog,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
}
