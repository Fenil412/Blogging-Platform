import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBlog } from '../contexts/BlogContext';
import { useToast } from '../components/ui/use-toast';
import QuillEditor from '../components/editor/QuillEditor';
import ImageUploader from '../components/common/ImageUploader';

const BlogEditor = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    currentBlog,
    getBlogById,
    publishBlog,
    updateBlog,
    loading
  } = useBlog();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    tags: '',
    thumbnail: null
  });

  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const isEditing = !!blogId;

  useEffect(() => {
    if (blogId) {
      getBlogById(blogId);
    }
  }, [blogId, getBlogById]);

  useEffect(() => {
    if (isEditing && currentBlog) {
      setFormData({
        title: currentBlog.title || '',
        description: currentBlog.description || '',
        content: currentBlog.content || '',
        tags: currentBlog.tags?.join(', ') || '',
        thumbnail: null
      });
      setThumbnailPreview(currentBlog.thumbnail || '');
    }
  }, [currentBlog, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleThumbnailChange = (file) => {
    setFormData(prev => ({ ...prev, thumbnail: file }));
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({ variant: 'destructive', title: 'Title is required' });
      return;
    }

    if (!formData.content.trim()) {
      toast({ variant: 'destructive', title: 'Content is required' });
      return;
    }

    const blogData = new FormData();
    blogData.append('title', formData.title);
    blogData.append('description', formData.description);
    blogData.append('content', formData.content);
    blogData.append('tags', formData.tags);

    if (formData.thumbnail) {
      blogData.append('thumbnail', formData.thumbnail);
    }

    try {
      if (isEditing) {
        await updateBlog(blogId, blogData);
        toast({ variant: 'success', title: 'Blog updated successfully' });
      } else {
        await publishBlog(blogData);
        toast({ variant: 'success', title: 'Blog published successfully' });
      }
      navigate('/dashboard/blogs');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: isEditing ? 'Failed to update blog' : 'Failed to publish blog',
        description: error.message
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Edit Blog' : 'Create New Blog'}
        </h1>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isEditing ? 'Update Blog' : 'Publish Blog'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <label htmlFor="title" className="block font-medium">
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                className="mt-2 w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="description" className="block font-medium">
                Short Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief preview of your blog"
                className="mt-2 w-full border border-gray-300 rounded px-3 py-2 min-h-[100px]"
              />
            </div>

            <div>
              <label htmlFor="content" className="block font-medium">
                Content *
              </label>
              <QuillEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Write your blog content here..."
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="thumbnail" className="block font-medium">
                Thumbnail *
              </label>
              <ImageUploader
                id="thumbnail"
                onFileChange={handleThumbnailChange}
                previewUrl={thumbnailPreview}
              />
              <p className="text-sm text-gray-500 mt-2">
                Recommended size: 1200x630 pixels
              </p>
            </div>

            <div>
              <label htmlFor="tags" className="block font-medium">
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                placeholder="tag1, tag2, tag3"
                className="mt-2 w-full border border-gray-300 rounded px-3 py-2"
              />
              <p className="text-sm text-gray-500 mt-2">
                Separate tags with commas
              </p>
            </div>

            <div className="bg-gray-100 border rounded-lg p-4">
              <h3 className="font-medium mb-2">Publishing Options</h3>
              <div className="space-y-3">
                {/* Placeholder for future publishing options */}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;
