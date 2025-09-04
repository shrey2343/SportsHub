import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Layout } from "../components/ui/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { AuthContext } from "../context/AuthContext";
import api from "../api.jsx";
import { 
  Users, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  Star,
  Activity,
  Target,
  Award,
  User,
  Edit,
  Camera,
  Brain,
  CreditCard,
  ChartLine,
  MapPin,
  DollarSign,
  Shield,
  Settings,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';
import { useToast } from '../components/ui/use-toast';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const [players, setPlayers] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reports, setReports] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Currency formatter for Indian Rupees
  const formatINR = (value) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value || 0);

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(() => {
      fetchAdminData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [playersRes, coachesRes, clubsRes, paymentsRes, reportsRes, approvalsRes] = await Promise.all([
        api.get('/admins/players').catch(() => ({ data: { players: [] } })),
        api.get('/admins/coaches').catch(() => ({ data: { coaches: [] } })),
        api.get('/admins/clubs').catch(() => ({ data: { clubs: [] } })),
        api.get('/admins/payments').catch(() => ({ data: { payments: [] } })),
        api.get('/admins/reports').catch(() => ({ data: { reports: [] } })),
        api.get('/admins/approvals').catch(() => ({ data: { approvals: [] } }))
      ]);
      
      // Normalize players/coaches to a flat shape used by the table (name/email/status at root)
      const normalizedPlayers = (playersRes.data.players || []).map((p) => ({
        ...p,
        _id: p._id,
        name: p.user?.name || p.name || 'Unknown',
        email: p.user?.email || p.email || 'N/A',
        status: p.user?.status || p.status || 'active',
      }));

      const normalizedCoaches = (coachesRes.data.coaches || []).map((c) => ({
        ...c,
        _id: c._id,
        name: c.user?.name || c.name || 'Unknown',
        email: c.user?.email || c.email || 'N/A',
        status: c.user?.status || c.status || 'active',
      }));

      setPlayers(normalizedPlayers);
      setCoaches(normalizedCoaches);
      setClubs(clubsRes.data.clubs || []);
      const normalizedPayments = (paymentsRes.data.payments || []).map((p) => ({
        ...p,
        payerName: p.user?.name || p.metadata?.payerName || p.user?.email || 'N/A',
      }));
      setPayments(normalizedPayments);
      setReports(reportsRes.data.reports || []);
      setPendingApprovals(approvalsRes.data.approvals || []);
      
      // Calculate comprehensive stats
      setStats({
        totalUsers: normalizedPlayers.length + normalizedCoaches.length,
        totalPlayers: normalizedPlayers.length,
        totalCoaches: normalizedCoaches.length,
        totalClubs: clubsRes.data.clubs?.length || 0,
        totalPayments: normalizedPayments.length,
        totalRevenue: normalizedPayments.reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
        pendingApprovals: approvalsRes.data.approvals?.length || 0,
        activeUsers: (normalizedPlayers.filter(p => p.status === 'active').length) + 
                    (normalizedCoaches.filter(c => c.status === 'active').length)
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userType, userId) => {
    if (!confirm(`Are you sure you want to delete this ${userType.slice(0, -1)}? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setLoading(true);
      await api.delete(`/admins/${userType}/${userId}`);
      
      // Update local state
      if (userType === 'players') {
        setPlayers(prev => prev.filter(p => p._id !== userId));
      } else if (userType === 'coaches') {
        setCoaches(prev => prev.filter(c => c._id !== userId));
      }
      
      toast({
        title: "User Deleted Successfully",
        description: `${userType.slice(0, -1)} has been removed from the system.`,
        duration: 3000,
      });
      
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error(`Error deleting ${userType.slice(0, -1)}:`, error);
      
      let errorMessage = `Failed to delete ${userType.slice(0, -1)}`;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        title: "Failed to Delete User",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, userType, currentStatus) => {
    try {
      setLoading(true);
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      
      await api.put(`/admins/${userType}/${userId}/status`, { status: newStatus });
      
      // Update local state
      if (userType === 'players') {
        setPlayers(prev => prev.map(p => 
          p._id === userId ? { ...p, status: newStatus } : p
        ));
      } else if (userType === 'coaches') {
        setCoaches(prev => prev.map(c => 
          c._id === userId ? { ...c, status: newStatus } : c
        ));
      }
      
      toast({
        title: "Status Updated",
        description: `User status updated to ${newStatus} successfully.`,
        duration: 3000,
      });
    } catch (error) {
      console.error(`Error updating user status:`, error);
      
      let errorMessage = `Failed to update user status`;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        title: "Failed to Update Status",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClub = async (clubId) => {
    try {
      setLoading(true);
      await api.put(`/admins/clubs/${clubId}/approve`);
      
      // Update local state
      setClubs(prev => prev.map(c => 
        c._id === clubId ? { ...c, status: 'approved' } : c
      ));
      
      setPendingApprovals(prev => prev.filter(a => a.clubId !== clubId));
      toast({
        title: "Club Approved",
        description: "Club approved successfully.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error approving club:', error);
      
      let errorMessage = `Failed to approve club`;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        title: "Failed to Approve Club",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectClub = async (clubId) => {
    try {
      setLoading(true);
      await api.put(`/admins/clubs/${clubId}/reject`);
      
      // Update local state
      setClubs(prev => prev.map(c => 
        c._id === clubId ? { ...c, status: 'rejected' } : c
      ));
      
      setPendingApprovals(prev => prev.filter(a => a.clubId !== clubId));
      toast({
        title: "Club Rejected",
        description: "Club rejected successfully.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error rejecting club:', error);
      
      let errorMessage = `Failed to reject club`;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        title: "Failed to Reject Club",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setModalType('');
  };

  const filteredData = () => {
    let data = [];
    
    if (selectedView === 'players') {
      data = players;
    } else if (selectedView === 'coaches') {
      data = coaches;
    } else if (selectedView === 'clubs') {
      data = clubs;
    }
    
    // Apply search filter
    if (searchTerm) {
      data = data.filter(item => 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply role filter
    if (filterRole !== 'all') {
      data = data.filter(item => item.status === filterRole);
    }
    
    return data;
  };

  const renderNavigationTabs = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {[
        { id: 'overview', label: 'Overview', icon: Activity },
        { id: 'players', label: 'Players', icon: Users },
        { id: 'coaches', label: 'Coaches', icon: Shield },
        { id: 'clubs', label: 'Clubs', icon: Trophy },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'reports', label: 'Reports', icon: ChartLine },
        { id: 'approvals', label: 'Approvals', icon: CheckCircle }
      ].map((tab) => (
        <Button
          key={tab.id}
          variant={selectedView === tab.id ? "default" : "outline"}
          onClick={() => setSelectedView(tab.id)}
          className="flex items-center gap-2"
        >
          <tab.icon className="h-4 w-4" />
          {tab.label}
        </Button>
      ))}
    </div>
  );

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="dark-card-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center`}>
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-content-primary">{stats.totalUsers || 0}</p>
              <p className="text-content-secondary">Total Users</p>
        </div>
      </div>
        </CardContent>
      </Card>

      <Card className="dark-card-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center`}>
              <Trophy className="h-6 w-6 text-white" />
          </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-content-primary">{stats.totalClubs || 0}</p>
              <p className="text-content-secondary">Total Clubs</p>
        </div>
      </div>
        </CardContent>
      </Card>

      <Card className="dark-card-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center`}>
              <CreditCard className="h-6 w-6 text-white" />
                  </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-content-primary">{formatINR(payments.reduce((sum, p) => sum + (p.amount || 0), 0))}</p>
              <p className="text-content-secondary">Total Revenue</p>
                </div>
                  </div>
        </CardContent>
      </Card>

      <Card className="dark-card-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center`}>
              <AlertCircle className="h-6 w-6 text-white" />
                  </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-content-primary">{stats.pendingApprovals || 0}</p>
              <p className="text-content-secondary">Pending Approvals</p>
                </div>
              </div>
        </CardContent>
      </Card>
    </div>
  );



  const renderDataTable = () => {
    const data = filteredData();
    
    if (data.length === 0) {
      return (
        <Card className="dark-card-primary">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-content-muted mx-auto mb-4" />
            <p className="text-content-secondary">No {selectedView} found</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="dark-card-primary">
        <CardHeader>
          <CardTitle className="text-content-primary">
            {selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} Management
          </CardTitle>
          <CardDescription className="text-content-secondary">
            Manage {selectedView} accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
                  <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-primary">
                  <th className="text-left p-3 text-content-primary font-semibold">Name</th>
                  <th className="text-left p-3 text-content-primary font-semibold">Email</th>
                  <th className="text-left p-3 text-content-primary font-semibold">Status</th>
                  <th className="text-left p-3 text-content-primary font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                {data.map((item) => (
                  <tr key={item._id} className="border-b border-border-secondary hover:bg-surface-secondary">
                    <td className="p-3 text-content-primary">{item.name}</td>
                    <td className="p-3 text-content-secondary">{item.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        item.status === 'suspended' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {item.status || 'pending'}
                      </span>
                    </td>
                    <td className="p-3">
                              <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openModal('view', item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openModal('edit', item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleUserStatus(item._id, selectedView, item.status)}
                          disabled={loading}
                        >
                          {item.status === 'active' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUser(selectedView, item._id)}
                          disabled={loading}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
        </CardContent>
      </Card>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {renderStatsCards()}
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dark-card-primary hover:bg-surface-secondary transition-colors cursor-pointer">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-content-primary mb-2">Manage Users</h3>
            <p className="text-content-secondary text-sm mb-4">View and manage all users</p>
            <Button onClick={() => setSelectedView('players')}>
              <ArrowRight className="h-4 w-4 mr-2" />
              View Users
            </Button>
          </CardContent>
        </Card>

        <Card className="dark-card-primary hover:bg-surface-secondary transition-colors cursor-pointer">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-content-primary mb-2">Manage Coaches</h3>
            <p className="text-content-secondary text-sm mb-4">View and manage coaches</p>
            <Button onClick={() => setSelectedView('coaches')}>
              <ArrowRight className="h-4 w-4 mr-2" />
              View Coaches
            </Button>
          </CardContent>
        </Card>

        <Card className="dark-card-primary hover:bg-surface-secondary transition-colors cursor-pointer">
          <CardContent className="p-6 text-center">
            <Trophy className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-content-primary mb-2">Manage Clubs</h3>
            <p className="text-content-secondary text-sm mb-4">View and manage sports clubs</p>
            <Button onClick={() => setSelectedView('clubs')}>
              <ArrowRight className="h-4 w-4 mr-2" />
              View Clubs
            </Button>
          </CardContent>
        </Card>

        <Card className="dark-card-primary hover:bg-surface-secondary transition-colors cursor-pointer">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-content-primary mb-2">Pending Approvals</h3>
            <p className="text-content-secondary text-sm mb-4">Review club creation requests</p>
            <Button onClick={() => setSelectedView('approvals')}>
              <ArrowRight className="h-4 w-4 mr-2" />
              View Approvals
            </Button>
          </CardContent>
        </Card>
      </div>

      
    </div>
  );

  const renderContent = () => {
    switch (selectedView) {
      case 'overview':
        return renderOverview();
      case 'players':
      case 'coaches':
      case 'clubs':
        return renderDataTable();
      case 'payments':
        return (
          <Card className="dark-card-primary">
            <CardHeader>
              <CardTitle className="text-content-primary">Payment History</CardTitle>
              <CardDescription className="text-content-secondary">
                Track all payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-content-secondary text-center py-8">No payments found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border-primary">
                        <th className="text-left p-3 text-content-primary font-semibold">Payer</th>
                        <th className="text-left p-3 text-content-primary font-semibold">Club</th>
                        <th className="text-left p-3 text-content-primary font-semibold">Amount</th>
                        <th className="text-left p-3 text-content-primary font-semibold">Status</th>
                        <th className="text-left p-3 text-content-primary font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment._id} className="border-b border-border-secondary hover:bg-surface-secondary">
                          <td className="p-3 text-content-primary">{payment.payerName}</td>
                          <td className="p-3 text-content-secondary">{payment.club?.name || 'N/A'}</td>
                          <td className="p-3 text-content-primary">{`$${(payment.amount || 0).toFixed(2)}`}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${'{'}
                              payment.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              payment.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                              payment.status === 'cancelled' ? 'bg-gray-500/20 text-gray-400' :
                              payment.status === 'refunded' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            {'}'}`}>
                              {payment.status || 'pending'}
                            </span>
                          </td>
                          <td className="p-3 text-content-secondary">{new Date(payment.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'reports':
        return (
          <Card className="dark-card-primary">
            <CardHeader>
              <CardTitle className="text-content-primary">System Reports</CardTitle>
              <CardDescription className="text-content-secondary">
                Generate and view system reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-content-secondary">Reporting system coming soon...</p>
            </CardContent>
          </Card>
        );
      case 'approvals':
        const approvedClubs = (clubs || []).filter((c) => c.status === 'approved');
        const rejectedClubs = (clubs || []).filter((c) => c.status === 'rejected');
        const pendingClubs = pendingApprovals; // already normalized for display

        const Section = ({ title, items, type }) => (
          <Card className="dark-card-primary">
            <CardHeader>
              <CardTitle className="text-content-primary">{title}</CardTitle>
              <CardDescription className="text-content-secondary">
                {type === 'pending' ? 'Requests awaiting review' : type === 'approved' ? 'Approved club requests' : 'Rejected club requests'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <p className="text-content-secondary text-center py-8">No {type} requests</p>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-4 rounded-lg bg-surface-secondary">
                      <div className="flex-1">
                        <p className="text-content-primary font-medium">{type === 'pending' ? item.clubName : item.name}</p>
                        <p className="text-content-secondary text-sm">
                          {type === 'pending'
                            ? `${item.requestType} • ${item.sport} • Coach: ${item.coachName}`
                            : `${item.sport?.name || item.sport || 'Sport N/A'}`}
                        </p>
                        <p className="text-content-muted text-xs mt-1">
                          {type === 'pending'
                            ? `Requested on ${new Date(item.createdAt).toLocaleDateString()}`
                            : `Status: ${type}`}
                        </p>
                      </div>
                      {type === 'pending' ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveClub(item.clubId)}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectClub(item.clubId)}
                            disabled={loading}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${type === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );

        return (
          <div className="space-y-6">
            <Section title={`Pending Approvals (${pendingClubs.length})`} items={pendingClubs} type="pending" />
            <Section title={`Approved Requests (${approvedClubs.length})`} items={approvedClubs} type="approved" />
            <Section title={`Rejected Requests (${rejectedClubs.length})`} items={rejectedClubs} type="rejected" />
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-content-primary mb-2">
              Admin Dashboard
            </h1>
            <p className="text-content-secondary">
              Welcome back, {user?.name}! Manage your sports platform
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={fetchAdminData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => openModal('create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </div>
        </div>
              </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-content-muted" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dark-input-primary pl-10 pr-4 w-full"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="dark-input-primary px-4 py-2"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Navigation Tabs */}
      {renderNavigationTabs()}

      {/* Content */}
                {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
                  </div>
                ) : (
        renderContent()
      )}

      {/* Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="dark-modal rounded-2xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-content-primary">
                {modalType === 'create' ? 'Create New' : modalType === 'edit' ? 'Edit' : 'View'} {selectedView?.slice(0, -1) || 'Item'}
              </h2>
              <Button variant="ghost" onClick={closeModal}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>

            {modalType === 'view' && (
              <div className="space-y-3">
                <div>
                  <p className="text-content-muted text-sm">Name</p>
                  <p className="text-content-primary font-medium">{selectedItem.name}</p>
                </div>
                <div>
                  <p className="text-content-muted text-sm">Email</p>
                  <p className="text-content-primary font-medium">{selectedItem.email}</p>
                </div>
                <div>
                  <p className="text-content-muted text-sm">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${'{'}
                    selectedItem.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    selectedItem.status === 'suspended' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  {'}'}`}>
                    {selectedItem.status || 'pending'}
                  </span>
                </div>
              </div>
            )}

            {modalType === 'edit' && (
              <EditForm
                key={selectedItem._id}
                item={selectedItem}
                userType={selectedView}
                onClose={closeModal}
                onToggleStatus={handleToggleUserStatus}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;

// Inline edit form component for simplicity
const EditForm = ({ item, userType, onClose, onToggleStatus }) => {
  const [name, setName] = React.useState(item.name || '');
  const [email, setEmail] = React.useState(item.email || '');
  const [status, setStatus] = React.useState(item.status || 'active');
  const [saving, setSaving] = React.useState(false);

  const onSave = async () => {
    try {
      setSaving(true);
      // Currently, backend supports toggling status; name/email editing can be implemented later
      if (status !== item.status) {
        await onToggleStatus(item._id, userType, item.status);
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-content-muted mb-1">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="dark-input-primary w-full" />
      </div>
      <div>
        <label className="block text-sm text-content-muted mb-1">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="dark-input-primary w-full" />
      </div>
      <div>
        <label className="block text-sm text-content-muted mb-1">Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="dark-input-primary w-full">
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 rounded-md bg-surface-secondary text-content-primary">Cancel</button>
        <button onClick={onSave} disabled={saving} className="px-4 py-2 rounded-md bg-primary-600 text-white">
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};
