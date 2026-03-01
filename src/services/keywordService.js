/**
 * Client-side keyword matching engine
 */

/**
 * Simple keyword matching without AI
 */
export function quickKeywordMatch(resumeText, jobDescription) {
  const resumeWords = tokenize(resumeText);
  const jobWords = tokenize(jobDescription);

  // Extract meaningful keywords from job description (2+ chars, not common words)
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'must',
    'this', 'that', 'these', 'those', 'it', 'its', 'we', 'our', 'you',
    'your', 'they', 'them', 'their', 'he', 'she', 'his', 'her', 'who',
    'which', 'what', 'where', 'when', 'how', 'all', 'each', 'every',
    'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not',
    'only', 'same', 'than', 'too', 'very', 'just', 'about', 'above',
    'after', 'again', 'also', 'any', 'as', 'because', 'before', 'between',
    'during', 'into', 'through', 'under', 'until', 'up', 'while',
  ]);

  const jobKeywords = [...new Set(jobWords.filter((w) => w.length > 2 && !stopWords.has(w)))];
  const resumeWordSet = new Set(resumeWords);

  const matched = jobKeywords.filter((kw) => resumeWordSet.has(kw));
  const missing = jobKeywords.filter((kw) => !resumeWordSet.has(kw));

  const score = jobKeywords.length > 0
    ? Math.round((matched.length / jobKeywords.length) * 100)
    : 0;

  return {
    score,
    matched,
    missing,
    totalKeywords: jobKeywords.length,
  };
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

/**
 * Calculate resume completeness score
 */
export function calculateCompletenessScore(structuredData) {
  const checks = [
    { name: 'Email', passed: structuredData.contactInfo.emails.length > 0, weight: 10 },
    { name: 'Phone', passed: structuredData.contactInfo.phones.length > 0, weight: 5 },
    { name: 'LinkedIn', passed: structuredData.contactInfo.linkedin.length > 0, weight: 5 },
    { name: 'Skills Section', passed: structuredData.skills.length > 0, weight: 15 },
    { name: 'Experience Section', passed: !!structuredData.sections['experience'] || !!structuredData.sections['work experience'], weight: 25 },
    { name: 'Education Section', passed: !!structuredData.sections['education'], weight: 15 },
    { name: 'Summary/Objective', passed: !!structuredData.sections['summary'] || !!structuredData.sections['objective'] || !!structuredData.sections['profile'], weight: 10 },
    { name: 'Projects', passed: !!structuredData.sections['projects'], weight: 10 },
    { name: 'Sufficient Length', passed: structuredData.rawText.length > 300, weight: 5 },
  ];

  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const earnedWeight = checks.filter((c) => c.passed).reduce((sum, c) => sum + c.weight, 0);
  const score = Math.round((earnedWeight / totalWeight) * 100);

  return { score, checks };
}
