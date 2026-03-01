const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

function getApiKey() {
  return import.meta.env.VITE_OPENAI_API_KEY || '';
}

/**
 * Call OpenAI API with a prompt
 */
async function callOpenAI(prompt) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('OpenAI API key not configured.');

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `API request failed with status ${response.status}`
    );
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response generated.';
}

/**
 * Analyze resume and provide comprehensive feedback
 */
export async function analyzeResume(resumeText) {
  const prompt = `You are an expert resume reviewer and career coach. Analyze the following resume and provide a comprehensive evaluation.

RESUME TEXT:
"""
${resumeText}
"""

Provide your analysis in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "overallScore": <number 0-100>,
  "summary": "<brief 2-3 sentence summary of the resume>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "weaknesses": ["<weakness 1>", "<weakness 2>", ...],
  "suggestions": ["<actionable suggestion 1>", "<actionable suggestion 2>", ...],
  "sectionScores": {
    "contactInfo": { "score": <0-100>, "feedback": "<feedback>" },
    "experience": { "score": <0-100>, "feedback": "<feedback>" },
    "education": { "score": <0-100>, "feedback": "<feedback>" },
    "skills": { "score": <0-100>, "feedback": "<feedback>" },
    "formatting": { "score": <0-100>, "feedback": "<feedback>" },
    "impact": { "score": <0-100>, "feedback": "<feedback>" }
  },
  "missingElements": ["<missing element 1>", ...],
  "industryFit": "<which industry/role this resume seems targeted for>"
}`;

  const responseText = await callOpenAI(prompt);

  try {
    const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      overallScore: 0,
      summary: responseText,
      strengths: [],
      weaknesses: [],
      suggestions: [],
      sectionScores: {},
      missingElements: [],
      industryFit: 'Unknown',
      rawResponse: responseText,
    };
  }
}

/**
 * Compare resume against a job description
 */
export async function matchWithJobDescription(resumeText, jobDescription) {
  const prompt = `You are an ATS (Applicant Tracking System) expert. Compare the following resume against the job description and provide a detailed keyword matching analysis.

RESUME:
"""
${resumeText}
"""

JOB DESCRIPTION:
"""
${jobDescription}
"""

Respond ONLY with valid JSON (no markdown):
{
  "matchScore": <number 0-100>,
  "matchedKeywords": ["<keyword 1>", "<keyword 2>", ...],
  "missingKeywords": ["<missing keyword 1>", "<missing keyword 2>", ...],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", ...],
  "summary": "<2-3 sentence summary of the match>",
  "categoryBreakdown": {
    "technicalSkills": { "matched": [], "missing": [] },
    "softSkills": { "matched": [], "missing": [] },
    "experience": { "matched": [], "missing": [] },
    "education": { "matched": [], "missing": [] }
  }
}`;

  const responseText = await callOpenAI(prompt);

  try {
    const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      matchScore: 0,
      matchedKeywords: [],
      missingKeywords: [],
      recommendations: [],
      summary: responseText,
      categoryBreakdown: {},
      rawResponse: responseText,
    };
  }
}

/**
 * Chat with AI about the resume
 */
export async function chatAboutResume(resumeText, chatHistory, userMessage) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('OpenAI API key not configured.');

  const messages = [
    {
      role: 'system',
      content: `You are a helpful resume improvement assistant. You have access to the user's resume and are helping them improve it. Be concise, friendly, and actionable in your responses. If they ask about specific sections, reference the actual content from their resume. Give specific, actionable advice.

RESUME:
"""
${resumeText}
"""`
    },
    ...chatHistory.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    })),
    { role: 'user', content: userMessage },
  ];

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response generated.';
}
