
/*
import { useState, useEffect } from "react"
import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useFollower } from "../contexts/FollowerContext"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"

const FollowersModal = ({ isOpen, onClose, userId, type = "followers" }) => {
  const { user } = useAuth()
  const { followers, following, loading, getFollowers, getFollowing, toggleFollow, followStatus } = useFollower()

  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (isOpen && userId) {
      if (type === "followers") {
        fetchFollowers()
      } else {
        fetchFollowing()
      }
    }
  }, [isOpen, userId, type])

  const fetchFollowers = async (page = 1) => {
    try {
      const response = await getFollowers(userId, page)
      setHasMore(response.data.hasNextPage)
    } catch (error) {
      console.error("Error fetching followers:", error)
    }
  }

  const fetchFollowing = async (page = 1) => {
    try {
      const response = await getFollowing(userId, page)
      setHasMore(response.data.hasNextPage)
    } catch (error) {
      console.error("Error fetching following:", error)
    }
  }

  const handleFollow = async (targetUserId) => {
    if (!user || user._id === targetUserId) return
    await toggleFollow(targetUserId)
  }

  const loadMore = () => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)

    if (type === "followers") {
      fetchFollowers(nextPage)
    } else {
      fetchFollowing(nextPage)
    }
  }

  const data = type === "followers" ? followers : following
  const title = type === "followers" ? "Followers" : "Following"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {loading && data.length === 0 ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-16 h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : data.length > 0 ? (
            <div className="space-y-2">
              {data.map((item) => {
                const targetUser = type === "followers" ? item.follower : item.author
                return (
                  <div key={item._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                    <Avatar>
                      <AvatarImage src={targetUser.avatar || "/placeholder.svg"} alt={targetUser.name} />
                      <AvatarFallback>{targetUser.name?.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <Link to={`/profile/${targetUser._id}`} className="block hover:underline" onClick={onClose}>
                        <p className="font-semibold text-sm truncate">{targetUser.name}</p>
                        <p className="text-xs text-gray-500 truncate">@{targetUser.username}</p>
                      </Link>
                    </div>

                    {user && user._id !== targetUser._id && (
                      <Button
                        size="sm"
                        variant={followStatus[targetUser._id] ? "outline" : "default"}
                        onClick={() => handleFollow(targetUser._id)}
                        className="shrink-0"
                      >
                        {followStatus[targetUser._id] ? "Following" : "Follow"}
                      </Button>
                    )}
                  </div>
                )
              })}

              {hasMore && (
                <div className="text-center p-4">
                  <Button variant="outline" onClick={loadMore} disabled={loading}>
                    {loading ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">{type === "followers" ? "No followers yet" : "Not following anyone yet"}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FollowersModal


*/







import { useState, useEffect } from "react"
import { Users } from "lucide-react"

const FollowersModal = ({ isOpen, onClose, userId, type = "followers" }) => {
  // Mock data and functions since we don't have the contexts
  const user = { _id: "currentUser", name: "Current User" }
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [loading, setLoading] = useState(false)
  const [followStatus, setFollowStatus] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Mock data for demonstration
  const mockUsers = [
    { _id: "1", name: "John Doe", username: "johndoe", avatar: null },
    { _id: "2", name: "Jane Smith", username: "janesmith", avatar: null },
    { _id: "3", name: "Mike Johnson", username: "mikejohnson", avatar: null },
    { _id: "4", name: "Sarah Wilson", username: "sarahwilson", avatar: null },
    { _id: "5", name: "David Brown", username: "davidbrown", avatar: null },
  ]

  useEffect(() => {
    if (isOpen && userId) {
      if (type === "followers") {
        fetchFollowers()
      } else {
        fetchFollowing()
      }
    }
  }, [isOpen, userId, type])

  const fetchFollowers = async (page = 1) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      const mockFollowers = mockUsers.map(user => ({
        _id: `follower-${user._id}`,
        follower: user
      }))
      setFollowers(mockFollowers)
      setHasMore(false)
    } catch (error) {
      console.error("Error fetching followers:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFollowing = async (page = 1) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      const mockFollowing = mockUsers.map(user => ({
        _id: `following-${user._id}`,
        author: user
      }))
      setFollowing(mockFollowing)
      setHasMore(false)
    } catch (error) {
      console.error("Error fetching following:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async (targetUserId) => {
    if (!user || user._id === targetUserId) return
    
    setFollowStatus(prev => ({
      ...prev,
      [targetUserId]: !prev[targetUserId]
    }))
  }

  const loadMore = () => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)

    if (type === "followers") {
      fetchFollowers(nextPage)
    } else {
      fetchFollowing(nextPage)
    }
  }

  const data = type === "followers" ? followers : following
  const title = type === "followers" ? "Followers" : "Following"

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading && data.length === 0 ? (
            <div className="space-y-4 p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-16 h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : data.length > 0 ? (
            <div className="space-y-1 p-2">
              {data.map((item) => {
                const targetUser = type === "followers" ? item.follower : item.author
                return (
                  <div key={item._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">
                      {targetUser.avatar ? (
                        <img src={targetUser.avatar} alt={targetUser.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        targetUser.name?.charAt(0) || "U"
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <button 
                        onClick={onClose}
                        className="block text-left hover:underline w-full"
                      >
                        <p className="font-semibold text-sm truncate text-gray-900">{targetUser.name}</p>
                        <p className="text-xs text-gray-500 truncate">@{targetUser.username}</p>
                      </button>
                    </div>

                    {user && user._id !== targetUser._id && (
                      <button
                        onClick={() => handleFollow(targetUser._id)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex-shrink-0 ${
                          followStatus[targetUser._id]
                            ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        {followStatus[targetUser._id] ? "Following" : "Follow"}
                      </button>
                    )}
                  </div>
                )
              })}

              {hasMore && (
                <div className="text-center p-4">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {type === "followers" ? "No followers yet" : "Not following anyone yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FollowersModal
