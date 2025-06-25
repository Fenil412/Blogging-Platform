import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../components/ui/use-toast"
import { Users, Trash2, Shield } from "lucide-react"
import axios from "axios"

const AdminPage = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState([])
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deletingUserId, setDeletingUserId] = useState(null)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      const [usersResponse, dashboardResponse] = await Promise.all([
        axios.get(`/api/v1/admin/users`),
        axios.get(`/api/v1/admin/dashboard`),
      ])
      setUsers(usersResponse.data.data)
      setDashboardData(dashboardResponse.data)
    } catch (error) {
      console.error("Failed to fetch admin data:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load admin data. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (userId === user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You cannot delete your own account.",
      })
      return
    }
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }
    try {
      setDeletingUserId(userId)
      await axios.delete(`/api/v1/admin/users/${userId}`)
      setUsers(users.filter((u) => u._id !== userId))
      toast({
        title: "Success",
        description: "User deleted successfully.",
      })
    } catch (error) {
      console.error("Failed to delete user:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to delete user. Please try again.",
      })
    } finally {
      setDeletingUserId(null)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-blue-600 dark:border-t-blue-400 border-gray-200 dark:border-gray-700 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading admin dashboard...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center text-gray-900 dark:text-white">
              <Shield className="h-8 w-8 mr-3 text-blue-600 dark:text-blue-400" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Manage users and system settings</p>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Users</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{users.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Users</h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{users.filter((u) => u.role === "admin").length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Regular Users</h3>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{users.filter((u) => u.role === "user").length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Watch History
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Updated At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((userItem) => (
                    <tr key={userItem._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                              {userItem.fullName ? userItem.fullName.charAt(0).toUpperCase() : userItem.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{userItem.fullName || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{userItem.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{userItem.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            userItem.role === "admin" 
                              ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300" 
                              : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          }`}
                        >
                          {userItem.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{userItem.watchHistory?.length || 0} items</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{formatDate(userItem.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{formatDate(userItem.updatedAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteUser(userItem._id)}
                          disabled={deletingUserId === userItem._id || userItem._id === user?.id}
                          className={`inline-flex items-center px-3 py-1 rounded-md text-sm transition-colors ${
                            deletingUserId === userItem._id || userItem._id === user?.id
                              ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50"
                          }`}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {deletingUserId === userItem._id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No users found.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminPage