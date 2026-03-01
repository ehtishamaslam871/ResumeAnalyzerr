import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import JobMatchPage from './pages/JobMatchPage';
import ChatPage from './pages/ChatPage';

export default function App() {
  const [resumeData, setResumeData] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <UploadPage
              setResumeData={setResumeData}
              setAnalysis={setAnalysis}
            />
          }
        />
        <Route
          path="/results"
          element={<ResultsPage resumeData={resumeData} analysis={analysis} />}
        />
        <Route
          path="/job-match"
          element={<JobMatchPage resumeData={resumeData} />}
        />
        <Route
          path="/chat"
          element={<ChatPage resumeData={resumeData} />}
        />
      </Routes>
    </div>
  );
}
