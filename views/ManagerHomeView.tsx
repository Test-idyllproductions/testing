import React, { useState } from 'react';
import { useSupabaseStore } from '../lib/supabase-store';
import { TaskStatus, UserRole, UserStatus } from '../types';
import { CheckSquare, Calendar, DollarSign, Users, TrendingUp, Clock, XCircle } from 'lucide-react';
import MagicBento from '../components/MagicBento';

const ManagerHomeView: React.FC = () => {
  const { currentUser, users, taskRecords, meetings, payoutRecords } = useSupabaseStore();
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Filter approved editors for user selection
  const approvedEditors = users.filter(u => u.role === UserRole.EDITOR && u.status === UserStatus.APPROVED);

  // Calculate stats based on selection
  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : null;

  let stats;
  if (selectedUser) {
    // User-specific stats
    const userTasks = taskRecords.filter(t => t.assignedTo === selectedUserId);
    const userMeetings = meetings.filter(m => m.attendees.includes(selectedUserId));
    const userPayouts = payoutRecords.filter(p => p.assignedTo === selectedUserId);

    stats = {
      totalTasks: userTasks.length,
      notStarted: userTasks.filter(t => t.status === TaskStatus.NOT_STARTED).length,
      editing: userTasks.filter(t => t.status === TaskStatus.EDITING).length,
      cantDo: userTasks.filter(t => t.status === TaskStatus.CANT_DO).length,
      done: userTasks.filter(t => t.status === TaskStatus.DONE).length,
      meetings: userMeetings.length,
      pendingPayouts: userPayouts.filter(p => p.status === 'Pending').length,
      completedPayouts: userPayouts.filter(p => p.status === 'Done').length,
    };
  } else {
    // System-wide stats
    stats = {
      totalUsers: users.filter(u => u.status === UserStatus.APPROVED).length,
      totalTasks: taskRecords.length,
      notStarted: taskRecords.filter(t => t.status === TaskStatus.NOT_STARTED).length,
      editing: taskRecords.filter(t => t.status === TaskStatus.EDITING).length,
      cantDo: taskRecords.filter(t => t.status === TaskStatus.CANT_DO).length,
      done: taskRecords.filter(t => t.status === TaskStatus.DONE).length,
      meetings: meetings.length,
      pendingPayouts: payoutRecords.filter(p => p.status === 'Pending').length,
      completedPayouts: payoutRecords.filter(p => p.status === 'Done').length,
    };
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">
          {getGreeting()}, {currentUser?.username}
        </h1>
        <p className="text-secondary text-lg">
          {selectedUser ? `Viewing ${selectedUser.username}'s overview` : 'System-wide overview'}
        </p>
      </div>

      {/* User Selection */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <label className="block text-sm font-medium text-secondary mb-3">
          Select User to View Details
        </label>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="w-full md:w-96 px-4 py-3 bg-input border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
        >
          <option value="">All Users (System Overview)</option>
          {approvedEditors.map(user => (
            <option key={user.id} value={user.id}>
              {user.username} ({user.email})
            </option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      {!selectedUser ? (
        // System-wide view
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MagicBento
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            spotlightRadius={200}
            particleCount={8}
            glowColor="139, 92, 246"
            className="p-6 bg-card border border-border rounded-2xl text-center transition-colors"
          >
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
            <p className="text-xs text-secondary mt-1 font-medium">Total Users</p>
          </MagicBento>

          <MagicBento
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            spotlightRadius={200}
            particleCount={8}
            glowColor="59, 130, 246"
            className="p-6 bg-card border border-border rounded-2xl text-center transition-colors"
          >
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-500/10 flex items-center justify-center">
              <CheckSquare className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-primary">{stats.totalTasks}</p>
            <p className="text-xs text-secondary mt-1 font-medium">Total Tasks</p>
          </MagicBento>

          <MagicBento
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            spotlightRadius={200}
            particleCount={8}
            glowColor="99, 102, 241"
            className="p-6 bg-card border border-border rounded-2xl text-center transition-colors"
          >
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-indigo-400" />
            </div>
            <p className="text-3xl font-bold text-primary">{stats.meetings}</p>
            <p className="text-xs text-secondary mt-1 font-medium">Total Meetings</p>
          </MagicBento>

          <MagicBento
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            spotlightRadius={200}
            particleCount={8}
            glowColor="234, 179, 8"
            className="p-6 bg-card border border-border rounded-2xl text-center transition-colors"
          >
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-primary">{stats.pendingPayouts}</p>
            <p className="text-xs text-secondary mt-1 font-medium">Pending Payouts</p>
          </MagicBento>

          {/* Task Status Breakdown */}
          <MagicBento
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            spotlightRadius={200}
            particleCount={8}
            glowColor="239, 68, 68"
            className="p-6 bg-card border border-border rounded-2xl text-center transition-colors"
          >
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-500/10 flex items-center justify-center">
              <Clock className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-primary">{stats.notStarted}</p>
            <p className="text-xs text-secondary mt-1 font-medium">Not Started</p>
          </MagicBento>

          <MagicBento
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            spotlightRadius={200}
            particleCount={8}
            glowColor="6, 182, 212"
            className="p-6 bg-card border border-border rounded-2xl text-center transition-colors"
          >
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold text-primary">{stats.editing}</p>
            <p className="text-xs text-secondary mt-1 font-medium">Editing</p>
          </MagicBento>

          <MagicBento
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            spotlightRadius={200}
            particleCount={8}
            glowColor="245, 158, 11"
            className="p-6 bg-card border border-border rounded-2xl text-center transition-colors"
          >
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-500/10 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-amber-400" />
            </div>
            <p className="text-3xl font-bold text-primary">{stats.cantDo}</p>
            <p className="text-xs text-secondary mt-1 font-medium">Can't Do</p>
          </MagicBento>

          <MagicBento
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            spotlightRadius={200}
            particleCount={8}
            glowColor="16, 185, 129"
            className="p-6 bg-card border border-border rounded-2xl text-center transition-colors"
          >
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckSquare className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-primary">{stats.done}</p>
            <p className="text-xs text-secondary mt-1 font-medium">Completed</p>
          </MagicBento>
        </div>
      ) : (
        // User-specific view
        <div>
          <h2 className="text-2xl font-bold text-primary mb-4">{selectedUser.username}'s Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MagicBento
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              spotlightRadius={200}
              particleCount={8}
              glowColor="59, 130, 246"
              className="p-6 bg-card border border-border rounded-2xl text-center transition-colors"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-500/10 flex items-center justify-center">
                <CheckSquare className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-primary">{stats.totalTasks}</p>
              <p className="text-xs text-secondary mt-1 font-medium">Total Tasks</p>
            </MagicBento>

            <MagicBento
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              spotlightRadius={200}
              particleCount={8}
              glowColor="239, 68, 68"
              className="p-6 bg-card border border-border rounded-2xl text-center transition-colors"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-500/10 flex items-center justify-center">
                <Clock className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-3xl font-bold text-primary">{stats.notStarted}</p>
              <p className="text-xs text-secondary mt-1 font-medium">Not Started</p>
            </MagicBento>

            <MagicBento
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              spotlightRadius={200}
              particleCount={8}
              glowColor="6, 182, 212"
              className="p-6 bg-card border border-border rounded-2xl text-center transition-colors"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-cyan-400" />
              </div>
              <p className="text-3xl font-bold text-primary">{stats.editing}</p>
              <p className="text-xs text-secondary mt-1 font-medium">Editing</p>
            </MagicBento>

            <MagicBento
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              spotlightRadius={200}
              particleCount={8}
              glowColor="245, 158, 11"
              className="p-6 bg-card border border-border rounded-2xl text-center transition-colors"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-500/10 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-amber-400" />
              </div>
              <p className="text-3xl font-bold text-primary">{stats.cantDo}</p>
              <p className="text-xs text-secondary mt-1 font-medium">Can't Do</p>
            </MagicBento>

            <MagicBento
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              spotlightRadius={200}
              particleCount={8}
              glowColor="16, 185, 129"
              className="p-6 bg-card border border-border rounded-2xl text-center transition-colors"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckSquare className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-primary">{stats.done}</p>
              <p className="text-xs text-secondary mt-1 font-medium">Completed</p>
            </MagicBento>

            <MagicBento
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              spotlightRadius={200}
              particleCount={8}
              glowColor="99, 102, 241"
              className="p-6 bg-card border border-border rounded-2xl text-center transition-colors"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-indigo-400" />
              </div>
              <p className="text-3xl font-bold text-primary">{stats.meetings}</p>
              <p className="text-xs text-secondary mt-1 font-medium">Meetings</p>
            </MagicBento>

            <MagicBento
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              spotlightRadius={200}
              particleCount={8}
              glowColor="234, 179, 8"
              className="p-6 bg-card border border-border rounded-2xl text-center transition-colors"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-primary">{stats.pendingPayouts}</p>
              <p className="text-xs text-secondary mt-1 font-medium">Pending Payouts</p>
            </MagicBento>

            <MagicBento
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              spotlightRadius={200}
              particleCount={8}
              glowColor="34, 197, 94"
              className="p-6 bg-card border border-border rounded-2xl text-center transition-colors"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-primary">{stats.completedPayouts}</p>
              <p className="text-xs text-secondary mt-1 font-medium">Completed Payouts</p>
            </MagicBento>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerHomeView;
