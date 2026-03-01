import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles, FileText, Zap, MessageCircle } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import { parseResume, extractStructuredData } from '../services/parserService';
import { analyzeResume } from '../services/aiService';
import { calculateCompletenessScore } from '../services/keywordService';

export default function UploadPage({ setResumeData, setAnalysis }) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileSelect = async (file) => {
    setError('');
    setIsLoading(true);

    try {
      setStatus('Extracting text from your resume...');
      const rawText = await parseResume(file);

      if (!rawText || rawText.length < 50) {
        throw new Error('Could not extract enough text from the file. Please try a different format.');
      }

      setStatus('Analyzing resume structure...');
      const structured = extractStructuredData(rawText);
      const completeness = calculateCompletenessScore(structured);

      const resumeData = {
        fileName: file.name,
        rawText,
        structured,
        completeness,
      };
      setResumeData(resumeData);

      setStatus('AI is analyzing your resume...');
      try {
        const aiAnalysis = await analyzeResume(rawText);
        setAnalysis(aiAnalysis);
      } catch (aiError) {
        console.error('AI analysis failed:', aiError);
        setAnalysis(null);
        setError('AI analysis failed: ' + aiError.message + '. Results will show without AI insights.');
      }

      setStatus('');
      navigate('/results');
    } catch (err) {
      setError(err.message);
      setStatus('');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: FileText,
      title: 'Smart Parsing',
      desc: 'Extract structured data from PDF, Word, and text files instantly in your browser.',
    },
    {
      icon: Sparkles,
      title: 'AI Analysis',
      desc: 'Get personalized feedback, scores, and improvement suggestions powered by OpenAI.',
    },
    {
      icon: Zap,
      title: 'Keyword Matching',
      desc: 'Compare your resume against job descriptions to optimize for ATS systems.',
    },
    {
      icon: MessageCircle,
      title: 'AI Chatbot',
      desc: 'Get real-time resume improvement suggestions through an interactive chatbot.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          AI-Powered Resume Analysis
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Get Your Resume <span className="text-indigo-600 dark:text-indigo-400">Analyzed</span> in Seconds
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Upload your resume and get instant AI-powered feedback, keyword matching, and personalized improvement suggestions.
        </p>
      </div>

      {/* Upload Area */}
      <div className="mb-8">
        <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
      </div>

      {/* Status */}
      {status && (
        <div className="flex items-center justify-center gap-3 mb-8 text-indigo-600 dark:text-indigo-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">{status}</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16">
        {features.map(({ icon: Icon, title, desc }, i) => (
          <div key={i} className="card hover:shadow-xl transition-shadow group">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 transition-colors">
              <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
