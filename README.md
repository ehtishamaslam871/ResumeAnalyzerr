# 🤖 AI-Powered Resume Analyzer

An intelligent, frontend-only resume analysis tool that leverages **OpenAI's GPT-4o Mini** to provide instant, actionable feedback on your resume. Upload your resume, get a detailed score, match it against job descriptions, and chat with an AI assistant — all from your browser.

Built as part of a **Frontend Development Internship at [Internee.pk](https://internee.pk)**.

---

## ✨ Features

- **📄 Resume Upload & Parsing** — Supports PDF, Word (.docx), and plain text files. All parsing happens client-side for privacy.
- **📊 AI-Powered Analysis** — Get a comprehensive score with detailed feedback on content, formatting, and completeness.
- **🎯 Job Description Matching** — Paste a job description and see how well your resume matches, with skill gap analysis.
- **💬 AI Chat Assistant** — Ask follow-up questions about your resume and get personalized improvement tips.
- **🌗 Dark / Light Theme** — Toggle between dark and light mode with system preference detection.
- **📱 Responsive Design** — Fully responsive UI that works on desktop, tablet, and mobile.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 7** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **OpenAI API** | AI-powered resume analysis (GPT-4o Mini) |
| **pdfjs-dist** | Client-side PDF text extraction |
| **Mammoth.js** | Client-side Word document parsing |
| **React Router v7** | Client-side routing |
| **Lucide React** | Icon library |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ChatBot.jsx          # AI chat interface
│   ├── FeedbackCard.jsx     # Color-coded feedback display
│   ├── FileUpload.jsx       # Drag & drop file upload
│   ├── Navbar.jsx           # Navigation bar with theme toggle
│   └── ScoreCircle.jsx      # SVG circular score indicator
├── context/
│   └── ThemeContext.jsx      # Dark/light theme management
├── pages/
│   ├── UploadPage.jsx       # Main upload & analysis page
│   ├── ResultsPage.jsx      # Detailed results dashboard
│   ├── JobMatchPage.jsx     # Job description matching
│   └── ChatPage.jsx         # AI chat assistant page
├── services/
│   ├── aiService.js         # OpenAI API integration
│   ├── parserService.js     # PDF/Word/TXT file parsing
│   └── keywordService.js    # Keyword matching & scoring
├── App.jsx                  # Root component with routing
├── main.jsx                 # Entry point
└── index.css                # Global styles & Tailwind config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- An **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ehtishamaslam871/ResumeAnalyzerr.git
   cd ResumeAnalyzerr
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. Open **http://localhost:5173** in your browser.

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---

## 🔑 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_OPENAI_API_KEY` | Your OpenAI API key | ✅ Yes |

> ⚠️ **Note:** The API key is used client-side via Vite's `import.meta.env`. Never commit your `.env` file to version control.

---

## 🖥️ Pages Overview

| Page | Route | Description |
|---|---|---|
| **Upload** | `/` | Upload your resume and trigger AI analysis |
| **Results** | `/results` | View detailed scores, strengths, and improvement areas |
| **Job Match** | `/job-match` | Match resume against a specific job description |
| **Chat** | `/chat` | Chat with AI about your resume for personalized tips |

---

## 🌗 Theme Support

The app supports **dark and light themes** with:
- System preference auto-detection
- Manual toggle via the Sun/Moon button in the navbar
- Preference saved to `localStorage` for persistence

---

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for the GPT-4o Mini API
- [Internee.pk](https://internee.pk) for the internship opportunity
- [Tailwind CSS](https://tailwindcss.com) for the styling framework
- [Lucide](https://lucide.dev) for the beautiful icons

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
