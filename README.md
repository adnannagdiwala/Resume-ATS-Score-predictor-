# 📄 Resume ATS Score Predictor

An AI-powered web application that analyzes your resume against **Applicant Tracking Systems (ATS)** and provides an instant compatibility score with actionable feedback. Built with **Next.js 14** and **Google Gemini AI**.

---

## ✨ Features

- **📊 ATS Score (0–100)** — Get a clear numeric score showing how well your resume will perform with ATS systems
- **✅ Strong Skills Detection** — See which skills in your resume stand out to employers
- **❌ Missing Keywords** — Discover critical keywords your resume is lacking
- **💼 Experience Feedback** — Get personalized feedback on how your experience is presented
- **💡 Actionable Suggestions** — Receive 3–5 specific improvements to boost your score
- **⚖️ Overall Verdict** — A comprehensive summary of your resume's strengths and weaknesses
- **🎨 Modern Dark UI** — Sleek glassmorphism design with smooth animations
- **📱 Fully Responsive** — Works seamlessly on desktop, tablet, and mobile
- **⚡ Client-Side PDF Parsing** — Your resume is processed in the browser for faster performance

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

1. **Upload** — Drag & drop or browse to select your resume PDF (max 10 MB)
2. **Extract** — Text is extracted client-side using pdf.js (no server upload needed)
3. **Analyze** — Extracted text is sent to the Gemini 1.5 Flash API for ATS analysis
4. **Results** — Structured JSON response is displayed with an animated score ring, skill badges, and detailed feedback

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
