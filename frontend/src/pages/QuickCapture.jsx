import { Lightbulb } from 'lucide-react';

const QuickCapture = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Quick Capture</h1>
                <p className="text-gray-600 mt-1">Capture ideas and notes instantly</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <Lightbulb className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Capture Coming Soon</h3>
                <p className="text-gray-600">Quickly capture ideas and convert them to tasks.</p>
            </div>
        </div>
    );
};

export default QuickCapture;
