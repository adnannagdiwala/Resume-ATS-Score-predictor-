# 📄 Resume ATS Score Predictor

An AI-powered web application that analyzes your resume against **Applicant Tracking Systems (ATS)** and provides an instant compatibility score with actionable feedback. Built with **Next.js 14** and **Google Gemini AI**.

---

## ✨ Features

- **🎯 Job Description Matcher (Optional)** — Paste a target Job Description (JD) to get a custom **Job Match Score** and tailored suggestions specifically synced to the role's requirements.
- **📊 ATS Score (0–100)** — Get a clear numeric score showing how well your resume performs generally with ATS systems.
- **✅ Match/Strong Skills Detection** — See which matching skills in your resume stand out to employers or align with the job description.
- **❌ Missing Keywords** — Discover critical keywords or job requirements your resume is currently lacking.
- **💼 Experience Feedback** — Get personalized feedback on how well your work history and project impact align with target role expectations.
- **💡 Actionable Suggestions** — Receive 3–5 specific suggestions to tailor your resume bullet points and layout to boost your match rating.
- **⚖️ Overall Verdict** — A comprehensive summary of your resume's compatibility and readiness for application.
- **🎨 Modern Dark UI** — Sleek glassmorphic design with smooth animations.
- **📱 Fully Responsive** — Works seamlessly on desktop, tablet, and mobile.
- **⚡ Client-Side PDF Parsing** — Your resume is processed directly in the browser for faster performance and maximum privacy.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Frontend** | React 19, Tailwind CSS 4 |
| **AI Model** | [Google Gemini 1.5 Flash](https://ai.google.dev/) |
| **PDF Parsing** | [pdf.js](https://mozilla.github.io/pdf.js/) (client-side) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ installed
- A **Google Gemini API key** — [Get one free here](https://aistudio.google.com/apikey)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/adnannagdiwala/Resume-ATS-Score-predictor-.git
   cd Resume-ATS-Score-predictor-
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000) in your browser

---

## 📁 Project Structure

```
ats-analyzer/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.js        # Gemini AI API endpoint
│   ├── results/
│   │   └── page.js             # Results page with score ring & feedback
│   ├── globals.css             # Global styles & dark theme
│   ├── layout.js               # Root layout with metadata
│   └── page.js                 # Upload page with drag & drop
├── lib/
│   └── gemini.js               # Gemini AI client initialization
├── public/                     # Static assets
├── .env.local                  # API keys (not committed)
├── next.config.mjs             # Next.js configuration
├── package.json                # Dependencies & scripts
└── README.md
```

---

## 🔄 How It Works

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Upload PDF  │ ──▶ │ Extract Text │ ──▶ │  Gemini AI   │ ──▶ │   Display    │
│  (Browser)   │     │  (pdf.js)    │     │  Analysis    │     │   Results    │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

1. **Upload & Input** — Drag & drop or browse to select your resume PDF (max 10 MB). Optionally, paste the target Job Description in the provided field.
2. **Extract** — Text is extracted client-side using pdf.js (no server-side file upload needed).
3. **Analyze** — Extracted text and optional Job Description are sent to the Gemini API for tailored match and ATS analysis.
4. **Results** — Structured JSON response is displayed with an animated Match/ATS score ring, matched/missing skill badges, and detailed tailoring feedback.

---

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add the environment variable:
   - `GEMINI_API_KEY` = your API key
5. Click **Deploy**

---

## ⚠️ Notes

- **PDF format only** — Scanned/image-based PDFs won't work since text extraction relies on embedded text
- **API rate limits** — The app includes automatic retry logic (up to 3 retries with exponential backoff) for Gemini API rate limits
- **Privacy** — Your resume text is sent to Google's Gemini API for analysis but is not stored anywhere

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/adnannagdiwala">Adnan Nagdiwala</a>
</p>
