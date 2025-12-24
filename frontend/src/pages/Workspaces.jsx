import { Briefcase } from 'lucide-react';

const Workspaces = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Workspaces</h1>
                <p className="text-gray-600 mt-1">Organize tasks by different contexts</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Workspaces Coming Soon</h3>
                <p className="text-gray-600">Separate your work, personal, and study tasks into different workspaces.</p>
            </div>
        </div>
    );
};

export default Workspaces;
