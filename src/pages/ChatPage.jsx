import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ChatBot from '../components/ChatBot';

export default function ChatPage({ resumeData }) {
  const navigate = useNavigate();

  if (!resumeData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Resume Uploaded</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Upload a resume first to chat with the AI assistant.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Upload Resume</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/results')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Resume Chat</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Get real-time improvement suggestions</p>
        </div>
      </div>

      <ChatBot resumeText={resumeData.rawText} />
    </div>
  );
}
