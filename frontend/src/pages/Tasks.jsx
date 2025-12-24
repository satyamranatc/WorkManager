import { useEffect, useState } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import { tasksAPI } from '../services/api';
import Button from '../components/Button';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        search: '',
    });

    useEffect(() => {
        fetchTasks();
    }, [filters]);

    // Listen for Quick Add event from Header
    useEffect(() => {
        const handleQuickAdd = () => {
            handleCreateTask();
        };

        window.addEventListener('openTaskModal', handleQuickAdd);
        return () => window.removeEventListener('openTaskModal', handleQuickAdd);
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filters.status) params.status = filters.status;
            if (filters.priority) params.priority = filters.priority;

            const response = await tasksAPI.getAll(params);
            let filteredTasks = response.data;

            if (filters.search) {
                filteredTasks = filteredTasks.filter(task =>
                    task.title.toLowerCase().includes(filters.search.toLowerCase())
                );
            }

            setTasks(filteredTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = () => {
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await tasksAPI.delete(taskId);
                fetchTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const handleToggleComplete = async (taskId) => {
        try {
            await tasksAPI.toggleComplete(taskId);
            fetchTasks();
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    };

    const handleModalClose = (shouldRefresh) => {
        setIsModalOpen(false);
        setSelectedTask(null);
        if (shouldRefresh) {
            fetchTasks();
        }
    };

    const groupedTasks = {
        todo: tasks.filter(t => t.status === 'todo'),
        'in-progress': tasks.filter(t => t.status === 'in-progress'),
        completed: tasks.filter(t => t.status === 'completed'),
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
                    <p className="text-gray-600 mt-1">Manage and organize your tasks</p>
                </div>

                <Button
                    variant="primary"
                    icon={Plus}
                    onClick={handleCreateTask}
                >
                    New Task
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="">All Status</option>
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>

                    <select
                        value={filters.priority}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>

                    <Button
                        variant="ghost"
                        icon={Filter}
                        onClick={() => setFilters({ status: '', priority: '', search: '' })}
                    >
                        Clear Filters
                    </Button>
                </div>
            </div>

            {/* Tasks Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* To Do Column */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                To Do <span className="text-gray-500">({groupedTasks.todo.length})</span>
                            </h2>
                        </div>
                        <div className="space-y-3">
                            {groupedTasks.todo.map(task => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onEdit={handleEditTask}
                                    onDelete={handleDeleteTask}
                                    onToggleComplete={handleToggleComplete}
                                />
                            ))}
                            {groupedTasks.todo.length === 0 && (
                                <p className="text-gray-400 text-center py-8">No tasks</p>
                            )}
                        </div>
                    </div>

                    {/* In Progress Column */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                In Progress <span className="text-gray-500">({groupedTasks['in-progress'].length})</span>
                            </h2>
                        </div>
                        <div className="space-y-3">
                            {groupedTasks['in-progress'].map(task => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onEdit={handleEditTask}
                                    onDelete={handleDeleteTask}
                                    onToggleComplete={handleToggleComplete}
                                />
                            ))}
                            {groupedTasks['in-progress'].length === 0 && (
                                <p className="text-gray-400 text-center py-8">No tasks</p>
                            )}
                        </div>
                    </div>

                    {/* Completed Column */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Completed <span className="text-gray-500">({groupedTasks.completed.length})</span>
                            </h2>
                        </div>
                        <div className="space-y-3">
                            {groupedTasks.completed.map(task => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onEdit={handleEditTask}
                                    onDelete={handleDeleteTask}
                                    onToggleComplete={handleToggleComplete}
                                />
                            ))}
                            {groupedTasks.completed.length === 0 && (
                                <p className="text-gray-400 text-center py-8">No tasks</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Task Modal */}
            <TaskModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                task={selectedTask}
            />
        </div>
    );
};

export default Tasks;
