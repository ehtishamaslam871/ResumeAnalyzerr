import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Loader2, CheckCircle, XCircle, Zap } from 'lucide-react';
import ScoreCircle from '../components/ScoreCircle';
import { matchWithJobDescription } from '../services/aiService';
import { quickKeywordMatch } from '../services/keywordService';

export default function JobMatchPage({ resumeData }) {
  const [jobDesc, setJobDesc] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [quickResult, setQuickResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!resumeData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Resume Uploaded</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Upload a resume first to use job matching.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Upload Resume</button>
      </div>
    );
  }

  const handleMatch = async () => {
    if (!jobDesc.trim()) return;
    setError('');
    setIsLoading(true);
    setMatchResult(null);

    const quick = quickKeywordMatch(resumeData.rawText, jobDesc);
    setQuickResult(quick);

    try {
      const aiResult = await matchWithJobDescription(resumeData.rawText, jobDesc);
      setMatchResult(aiResult);
    } catch (err) {
      setError('AI matching failed: ' + err.message);
    }

    setIsLoading(false);
  };

  const result = matchResult || null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/results')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Description Match</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Compare your resume against a job posting</p>
        </div>
      </div>

      {/* Input */}
      <div className="card mb-8">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Paste Job Description</h3>
        <textarea
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          placeholder="Paste the full job description here..."
          rows={8}
          className="input-field resize-none mb-4"
        />
        <button
          onClick={handleMatch}
          disabled={!jobDesc.trim() || isLoading}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          {isLoading ? 'Analyzing...' : 'Analyze Match'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Quick Match Results */}
      {quickResult && (
        <div className="card mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Quick Keyword Scan</h3>
          </div>
          <div className="flex flex-wrap items-center gap-8 mb-6">
            <ScoreCircle score={quickResult.score} size={100} label="Keyword Match" />
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p><strong>{quickResult.matched.length}</strong> keywords matched</p>
              <p><strong>{quickResult.missing.length}</strong> keywords missing</p>
              <p><strong>{quickResult.totalKeywords}</strong> total job keywords</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Matched Keywords
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {quickResult.matched.slice(0, 30).map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> Missing Keywords
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {quickResult.missing.slice(0, 30).map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 rounded text-xs font-medium">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Match Results */}
      {result && (
        <>
          <div className="card mb-8">
            <div className="flex flex-wrap items-center gap-8 mb-6">
              <ScoreCircle score={result.matchScore} size={140} label="AI Match Score" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Analysis Summary</h3>
                <p className="text-gray-600 dark:text-gray-400">{result.summary}</p>
              </div>
            </div>

            {/* Category Breakdown */}
            {result.categoryBreakdown && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {Object.entries(result.categoryBreakdown).map(([cat, data]) => (
                  <div key={cat} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white capitalize mb-2">
                      {cat.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    {data.matched?.length > 0 && (
                      <div className="mb-2">
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Matched: </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{data.matched.join(', ')}</span>
                      </div>
                    )}
                    {data.missing?.length > 0 && (
                      <div>
                        <span className="text-xs text-red-600 dark:text-red-400 font-medium">Missing: </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{data.missing.join(', ')}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommendations */}
          {result.recommendations?.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recommendations</h3>
              <ul className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-950 rounded-xl">
                    <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
