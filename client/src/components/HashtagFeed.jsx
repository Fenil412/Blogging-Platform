
/*
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Hash, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePost } from "../contexts/PostContext"

const HashtagFeed = () => {
  const { hashtag } = useParams()
  const { posts, loading, getPostsByHashtag } = usePost()
  const [trendingHashtags, setTrendingHashtags] = useState([])

  useEffect(() => {
    if (hashtag) {
      fetchHashtagPosts()
      fetchTrendingHashtags()
    }
  }, [hashtag])

  const fetchHashtagPosts = async () => {
    try {
      await getPostsByHashtag(hashtag)
    } catch (error) {
      console.error("Error fetching hashtag posts:", error)
    }
  }

  const fetchTrendingHashtags = async () => {
    try {
      // This would be a separate API endpoint to get trending hashtags
      // For now, we'll use mock data
      setTrendingHashtags([
        { tag: "technology", count: 1234 },
        { tag: "programming", count: 987 },
        { tag: "webdev", count: 756 },
        { tag: "react", count: 543 },
        { tag: "javascript", count: 432 },
      ])
    } catch (error) {
      console.error("Error fetching trending hashtags:", error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="flex items-center gap-3 mb-8">
            <Hash className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold">#{hashtag}</h1>
            <Badge variant="secondary">{posts.length} posts</Badge>
          </div>

          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post._id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={post.owner?.avatar || "/placeholder.svg?height=40&width=40"}
                        alt={post.owner?.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{post.owner?.name}</span>
                          <span className="text-sm text-gray-500">@{post.owner?.username}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>

                        <p className="text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</p>

                        {post.media && (
                          <img
                            src={post.media || "/placeholder.svg"}
                            alt="Post media"
                            className="w-full max-h-64 object-cover rounded-lg mb-3"
                          />
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{post.likesCount || 0} likes</span>
                          <span>{post.commentCount || 0} comments</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Hash className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                <p className="text-gray-600">Be the first to post with #{hashtag}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Trending Hashtags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trendingHashtags.map((item, index) => (
                  <div key={item.tag} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">#{item.tag}</p>
                      <p className="text-xs text-gray-500">{item.count} posts</p>
                    </div>
                    <span className="text-xs text-gray-400">#{index + 1}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default HashtagFeed

*/

import { useState, useEffect } from "react"
import { Hash, TrendingUp } from "lucide-react"

const HashtagFeed = () => {
  // Mock hashtag from URL params
  const hashtag = "technology"
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [trendingHashtags, setTrendingHashtags] = useState([])

  // Mock posts data
  const mockPosts = [
    {
      _id: "1",
      content: "Just discovered this amazing new #technology that's revolutionizing web development! The future is here and it's incredibly exciting. Can't wait to implement this in my next project.",
      owner: {
        name: "John Doe",
        username: "johndoe",
        avatar: null
      },
      createdAt: new Date().toISOString(),
      media: null,
      likesCount: 42,
      commentCount: 8
    },
    {
      _id: "2",
      content: "Working on a new project with cutting-edge #technology. The possibilities are endless when you combine creativity with modern tools!",
      owner: {
        name: "Jane Smith",
        username: "janesmith",
        avatar: null
      },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      media: null,
      likesCount: 24,
      commentCount: 5
    },
    {
      _id: "3",
      content: "AI and machine learning are transforming how we think about #technology. What an exciting time to be in tech!",
      owner: {
        name: "Mike Johnson",
        username: "mikejohnson",
        avatar: null
      },
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      media: null,
      likesCount: 67,
      commentCount: 12
    }
  ]

  useEffect(() => {
    fetchHashtagPosts()
    fetchTrendingHashtags()
  }, [hashtag])

  const fetchHashtagPosts = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPosts(mockPosts)
    } catch (error) {
      console.error("Error fetching hashtag posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTrendingHashtags = async () => {
    try {
      setTrendingHashtags([
        { tag: "technology", count: 1234 },
        { tag: "programming", count: 987 },
        { tag: "webdev", count: 756 },
        { tag: "react", count: 543 },
        { tag: "javascript", count: 432 },
      ])
    } catch (error) {
      console.error("Error fetching trending hashtags:", error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="flex items-center gap-3 mb-8">
            <Hash className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">#{hashtag}</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {posts.length} posts
            </span>
          </div>

          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">
                        {post.owner?.avatar ? (
                          <img src={post.owner.avatar} alt={post.owner.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          post.owner?.name?.charAt(0) || "U"
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{post.owner?.name}</span>
                          <span className="text-sm text-gray-500">@{post.owner?.username}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>

                        <p className="text-gray-800 mb-3 whitespace-pre-wrap leading-relaxed">{post.content}</p>

                        {post.media && (
                          <img
                            src={post.media}
                            alt="Post media"
                            className="w-full max-h-64 object-cover rounded-lg mb-3"
                          />
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="hover:text-gray-700 cursor-pointer transition-colors">
                            {post.likesCount || 0} likes
                          </span>
                          <span className="hover:text-gray-700 cursor-pointer transition-colors">
                            {post.commentCount || 0} comments
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-8 text-center">
                <Hash className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">No posts found</h3>
                <p className="text-gray-600">Be the first to post with #{hashtag}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-700" />
                Trending Hashtags
              </h2>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="space-y-3">
                {trendingHashtags.map((item, index) => (
                  <div key={item.tag} className="flex items-center justify-between hover:bg-gray-50 -mx-2 px-2 py-1 rounded-md cursor-pointer transition-colors">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">#{item.tag}</p>
                      <p className="text-xs text-gray-500">{item.count.toLocaleString()} posts</p>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">#{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HashtagFeed
