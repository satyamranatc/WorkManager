import { useEffect, useState } from 'react';
import { Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { projectsAPI, tasksAPI } from '../services/api';
import Button from '../components/Button';
import ProjectModal from '../components/ProjectModal';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await projectsAPI.getAll();
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = () => {
        setSelectedProject(null);
        setIsModalOpen(true);
    };

    const handleEditProject = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleDeleteProject = async (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await projectsAPI.delete(projectId);
                fetchProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    const handleModalClose = (shouldRefresh) => {
        setIsModalOpen(false);
        setSelectedProject(null);
        if (shouldRefresh) {
            fetchProjects();
        }
    };

    const groupedProjects = {
        planning: projects.filter(p => p.status === 'planning'),
        active: projects.filter(p => p.status === 'active'),
        completed: projects.filter(p => p.status === 'completed'),
    };

    const ProjectCard = ({ project }) => {
        const [showMenu, setShowMenu] = useState(false);

        return (
            <div
                className="bg-white rounded-lg border-2 border-gray-200 p-5 hover:shadow-lg transition-all duration-200 hover:border-primary-300"
                style={{ borderLeftColor: project.color, borderLeftWidth: '4px' }}
            >
                <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{project.name}</h3>

                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                            <MoreVertical className="h-4 w-4 text-gray-400" />
                        </button>

                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowMenu(false)}
                                />
                                <div className="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]">
                                    <button
                                        onClick={() => {
                                            handleEditProject(project);
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <Edit className="h-4 w-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleDeleteProject(project._id);
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {project.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                )}

                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium text-gray-900">{project.progress || 0}%</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                                width: `${project.progress || 0}%`,
                                backgroundColor: project.color,
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{project.taskCount || 0} tasks</span>
                        <span>{project.completedCount || 0} completed</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                    <p className="text-gray-600 mt-1">Organize your work into projects</p>
                </div>

                <Button
                    variant="primary"
                    icon={Plus}
                    onClick={handleCreateProject}
                >
                    New Project
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Planning Column */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Planning <span className="text-gray-500">({groupedProjects.planning.length})</span>
                        </h2>
                        <div className="space-y-3">
                            {groupedProjects.planning.map(project => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                            {groupedProjects.planning.length === 0 && (
                                <p className="text-gray-400 text-center py-8">No projects</p>
                            )}
                        </div>
                    </div>

                    {/* Active Column */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Active <span className="text-gray-500">({groupedProjects.active.length})</span>
                        </h2>
                        <div className="space-y-3">
                            {groupedProjects.active.map(project => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                            {groupedProjects.active.length === 0 && (
                                <p className="text-gray-400 text-center py-8">No projects</p>
                            )}
                        </div>
                    </div>

                    {/* Completed Column */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Completed <span className="text-gray-500">({groupedProjects.completed.length})</span>
                        </h2>
                        <div className="space-y-3">
                            {groupedProjects.completed.map(project => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                            {groupedProjects.completed.length === 0 && (
                                <p className="text-gray-400 text-center py-8">No projects</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <ProjectModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                project={selectedProject}
            />
        </div>
    );
};

export default Projects;
