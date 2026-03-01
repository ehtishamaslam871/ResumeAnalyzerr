import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';

// Set up PDF.js worker (loaded locally from node_modules via Vite)
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Extract text from a PDF file
 */
export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText.trim();
}

/**
 * Extract text from a Word document
 */
export async function extractTextFromWord(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

/**
 * Main parser: detects file type and extracts text
 */
export async function parseResume(file) {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.pdf')) {
    return await extractTextFromPDF(file);
  } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    return await extractTextFromWord(file);
  } else if (fileName.endsWith('.txt')) {
    return await file.text();
  } else {
    throw new Error('Unsupported file format. Please upload a PDF, Word, or TXT file.');
  }
}

/**
 * Extract structured data from resume text
 */
export function extractStructuredData(text) {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const linkedinRegex = /linkedin\.com\/in\/[\w-]+/gi;
  const githubRegex = /github\.com\/[\w-]+/gi;

  const emails = text.match(emailRegex) || [];
  const phones = text.match(phoneRegex) || [];
  const linkedin = text.match(linkedinRegex) || [];
  const github = text.match(githubRegex) || [];

  // Extract sections
  const sections = extractSections(text);

  // Extract skills
  const skills = extractSkills(text);

  return {
    contactInfo: {
      emails,
      phones,
      linkedin,
      github,
    },
    sections,
    skills,
    rawText: text,
  };
}

function extractSections(text) {
  const sectionHeaders = [
    'education', 'experience', 'work experience', 'projects',
    'skills', 'technical skills', 'certifications', 'achievements',
    'summary', 'objective', 'profile', 'languages', 'interests',
    'volunteer', 'publications', 'awards', 'references'
  ];

  const lines = text.split('\n');
  const sections = {};
  let currentSection = 'header';
  sections[currentSection] = [];

  for (const line of lines) {
    const trimmedLine = line.trim().toLowerCase();
    const matchedHeader = sectionHeaders.find(
      (header) =>
        trimmedLine === header ||
        trimmedLine === header + ':' ||
        trimmedLine.startsWith(header + ' ')
    );

    if (matchedHeader) {
      currentSection = matchedHeader;
      sections[currentSection] = [];
    } else if (line.trim()) {
      if (!sections[currentSection]) sections[currentSection] = [];
      sections[currentSection].push(line.trim());
    }
  }

  return sections;
}

function extractSkills(text) {
  const commonSkills = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby',
    'go', 'rust', 'swift', 'kotlin', 'php', 'html', 'css', 'sql',
    'react', 'angular', 'vue', 'next.js', 'node.js', 'express',
    'django', 'flask', 'spring', 'laravel', 'rails',
    'mongodb', 'postgresql', 'mysql', 'redis', 'firebase',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes',
    'git', 'github', 'gitlab', 'ci/cd', 'jenkins',
    'figma', 'sketch', 'adobe', 'photoshop', 'illustrator',
    'machine learning', 'deep learning', 'ai', 'nlp', 'tensorflow',
    'pytorch', 'pandas', 'numpy', 'scikit-learn',
    'agile', 'scrum', 'jira', 'trello',
    'rest api', 'graphql', 'microservices', 'serverless',
    'tailwind', 'bootstrap', 'sass', 'less',
    'linux', 'bash', 'powershell', 'windows',
  ];

  const lowerText = text.toLowerCase();
  return commonSkills.filter((skill) => lowerText.includes(skill));
}
