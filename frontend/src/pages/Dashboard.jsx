import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Flame, Target, TrendingUp, Plus } from 'lucide-react';
import { tasksAPI, habitsAPI, analyticsAPI } from '../services/api';
import Button from '../components/Button';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [todayTasks, setTodayTasks] = useState([]);
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, tasksRes, habitsRes] = await Promise.all([
                analyticsAPI.getStats(),
                tasksAPI.getToday(),
                habitsAPI.getAll({ active: true }),
            ]);

            setStats(statsRes.data);
            setTodayTasks(tasksRes.data);
            setHabits(habitsRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleTask = async (taskId) => {
        try {
            await tasksAPI.toggleComplete(taskId);
            fetchDashboardData();
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    };

    const handleCheckInHabit = async (habitId) => {
        try {
            await habitsAPI.checkIn(habitId);
            fetchDashboardData();
        } catch (error) {
            console.error('Error checking in habit:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Tasks Today',
            value: stats?.tasks?.completedToday || 0,
            total: todayTasks.length,
            icon: CheckCircle2,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Active Tasks',
            value: stats?.tasks?.active || 0,
            icon: Clock,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Active Streaks',
            value: stats?.habits?.activeStreaks || 0,
            icon: Flame,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
        {
            title: 'Focus Time',
            value: `${stats?.focus?.hoursThisWeek || 0}h`,
            subtitle: 'This week',
            icon: Target,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <div>
                <h1 className="text-4xl font-bold text-teal-900 mb-2">
                    Welcome Back Geek!
                </h1>
                <p className="text-gray-600 text-lg">
                    Here's what's happening with your tasks today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            {stat.total && (
                                <span className="text-sm text-gray-500">/ {stat.total}</span>
                            )}
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
                            {stat.subtitle && (
                                <p className="text-xs text-gray-500 mt-0.5">{stat.subtitle}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Today's Tasks */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Today's Tasks</h2>
                    <Button variant="ghost" size="sm" icon={Plus}>
                        Add Task
                    </Button>
                </div>

                {todayTasks.length === 0 ? (
                    <div className="text-center py-12">
                        <CheckCircle2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No tasks for today</p>
                        <p className="text-gray-400 text-sm">You're all caught up! 🎉</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {todayTasks.slice(0, 5).map((task) => (
                            <div
                                key={task._id}
                                className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                                <button
                                    onClick={() => handleToggleTask(task._id)}
                                    className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all ${task.completed
                                            ? 'bg-primary-600 border-primary-600'
                                            : 'border-gray-300 group-hover:border-primary-500'
                                        }`}
                                >
                                    {task.completed && (
                                        <CheckCircle2 className="h-4 w-4 text-white" />
                                    )}
                                </button>

                                <div className="flex-1">
                                    <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                        {task.title}
                                    </p>
                                    {task.project && (
                                        <p className="text-sm text-gray-500">{task.project.name}</p>
                                    )}
                                </div>

                                {task.priority && (
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium priority-${task.priority}`}>
                                        {task.priority}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Habits Check-in */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Daily Habits</h2>
                    <Button variant="ghost" size="sm" icon={TrendingUp}>
                        View All
                    </Button>
                </div>

                {habits.length === 0 ? (
                    <div className="text-center py-12">
                        <Flame className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No habits yet</p>
                        <p className="text-gray-400 text-sm">Start building good habits today!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {habits.slice(0, 6).map((habit) => {
                            const isCompletedToday = habit.completionHistory?.some(c => {
                                const today = new Date().toISOString().split('T')[0];
                                const completionDate = new Date(c.date).toISOString().split('T')[0];
                                return completionDate === today && c.completed;
                            });

                            return (
                                <div
                                    key={habit._id}
                                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-primary-300 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="font-medium text-gray-900">{habit.name}</p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                <Flame className="h-4 w-4 text-orange-500" />
                                                {habit.currentStreak} day streak
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        variant={isCompletedToday ? 'success' : 'outline'}
                                        size="sm"
                                        fullWidth
                                        onClick={() => !isCompletedToday && handleCheckInHabit(habit._id)}
                                        disabled={isCompletedToday}
                                    >
                                        {isCompletedToday ? '✓ Completed' : 'Check In'}
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
