import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle, AlertTriangle, Lightbulb, Target,
  Award, Briefcase, GraduationCap, Wrench, LayoutPanelLeft, TrendingUp
} from 'lucide-react';
import ScoreCircle from '../components/ScoreCircle';
import FeedbackCard from '../components/FeedbackCard';

export default function ResultsPage({ resumeData, analysis }) {
  const navigate = useNavigate();

  if (!resumeData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Resume Uploaded</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Upload a resume first to see the analysis results.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Upload Resume
        </button>
      </div>
    );
  }

  const { structured, completeness } = resumeData;

  const sectionIcons = {
    contactInfo: Target,
    experience: Briefcase,
    education: GraduationCap,
    skills: Wrench,
    formatting: LayoutPanelLeft,
    impact: TrendingUp,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis Results</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{resumeData.fileName}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/job-match" className="btn-secondary text-sm">
            Job Match
          </Link>
          <Link to="/chat" className="btn-primary text-sm">
            AI Chat
          </Link>
        </div>
      </div>

      {/* Scores Row */}
      <div className="card mb-8">
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
          {analysis?.overallScore != null && (
            <ScoreCircle score={analysis.overallScore} size={140} label="AI Score" />
          )}
          <ScoreCircle score={completeness.score} size={140} label="Completeness" />
          {analysis?.sectionScores && Object.keys(analysis.sectionScores).length > 0 && (
            <>
              {Object.entries(analysis.sectionScores).slice(0, 3).map(([key, val]) => (
                <ScoreCircle key={key} score={val.score} size={100} label={key.replace(/([A-Z])/g, ' $1').trim()} />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {analysis?.summary && (
        <div className="card mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-100 dark:border-indigo-900">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            AI Summary
          </h3>
          <p className="text-gray-700 dark:text-gray-300">{analysis.summary}</p>
          {analysis.industryFit && (
            <p className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium">
              Target Industry: {analysis.industryFit}
            </p>
          )}
        </div>
      )}

      {/* Completeness Checklist */}
      <div className="card mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Resume Completeness
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {completeness.checks.map((check, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <CheckCircle className={`w-5 h-5 ${check.passed ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
              <span className={`text-sm ${check.passed ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                {check.name}
              </span>
              <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">{check.weight}pts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Extracted Skills */}
      {structured.skills.length > 0 && (
        <div className="card mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Detected Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {structured.skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Feedback Cards */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FeedbackCard title="Strengths" items={analysis.strengths} type="success" icon={CheckCircle} />
          <FeedbackCard title="Weaknesses" items={analysis.weaknesses} type="error" icon={AlertTriangle} />
          <FeedbackCard title="Suggestions" items={analysis.suggestions} type="info" icon={Lightbulb} />
          <FeedbackCard title="Missing Elements" items={analysis.missingElements} type="warning" icon={AlertTriangle} />
        </div>
      )}

      {/* Section Scores */}
      {analysis?.sectionScores && Object.keys(analysis.sectionScores).length > 0 && (
        <div className="card mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Section-by-Section Feedback</h3>
          <div className="space-y-4">
            {Object.entries(analysis.sectionScores).map(([key, val]) => {
              const Icon = sectionIcons[key] || Target;
              return (
                <div key={key} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <span className={`text-sm font-bold ${
                      val.score >= 80 ? 'text-green-600' :
                      val.score >= 60 ? 'text-yellow-600' :
                      val.score >= 40 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {val.score}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        val.score >= 80 ? 'bg-green-500' :
                        val.score >= 60 ? 'bg-yellow-500' :
                        val.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${val.score}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{val.feedback}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Contact Info */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Extracted Contact Info
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Emails:</span>{' '}
            <span className="text-gray-900 dark:text-gray-200">{structured.contactInfo.emails.join(', ') || 'Not found'}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Phone:</span>{' '}
            <span className="text-gray-900 dark:text-gray-200">{structured.contactInfo.phones.join(', ') || 'Not found'}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">LinkedIn:</span>{' '}
            <span className="text-gray-900 dark:text-gray-200">{structured.contactInfo.linkedin.join(', ') || 'Not found'}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">GitHub:</span>{' '}
            <span className="text-gray-900 dark:text-gray-200">{structured.contactInfo.github.join(', ') || 'Not found'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
