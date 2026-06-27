"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function ScoreRing({ score, hasJd }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Color based on score
  let colorStart, colorEnd, glowColor;
  if (score >= 75) {
    colorStart = "#00d4aa";
    colorEnd = "#00f5c8";
    glowColor = "rgba(0, 212, 170, 0.4)";
  } else if (score >= 50) {
    colorStart = "#ffa726";
    colorEnd = "#ffcc02";
    glowColor = "rgba(255, 167, 38, 0.4)";
  } else {
    colorStart = "#ff6b6b";
    colorEnd = "#ff8e8e";
    glowColor = "rgba(255, 107, 107, 0.4)";
  }

  return (
    <div
      className="score-ring-container"
      style={{
        "--score-color-start": colorStart,
        "--score-color-end": colorEnd,
        "--ring-glow-color": glowColor,
      }}
    >
      <svg className="score-ring" width="180" height="180" viewBox="0 0 180 180">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorStart} />
            <stop offset="100%" stopColor={colorEnd} />
          </linearGradient>
        </defs>
        <circle className="score-ring-track" cx="90" cy="90" r={radius} />
        <circle
          className="score-ring-fill"
          cx="90"
          cy="90"
          r={radius}
          stroke="url(#scoreGradient)"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-label">
        <span className="score-number">{score}</span>
        <span className="score-subtitle">{hasJd ? "Match Score" : "ATS Score"}</span>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const [result, setResult] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("atsResult");
    if (!stored) {
      router.replace("/");
      return;
    }

    try {
      setResult(JSON.parse(stored));
    } catch {
      router.replace("/");
    }
  }, [router]);

  if (!result) {
    return (
      <div className="page-wrapper">
        <div className="spinner" />
      </div>
    );
  }

  const {
    ats_score,
    strong_skills,
    missing_keywords,
    experience_feedback,
    suggestions,
    overall_verdict,
    hasJd,
  } = result;

  return (
    <div className="page-wrapper" style={{ justifyContent: "flex-start", paddingTop: "3rem" }}>
      <div className="w-full max-w-3xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            <span
              style={{
                background: "linear-gradient(135deg, #fff 0%, #a8a3ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Analysis Results
            </span>
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {hasJd
              ? "Here's how your resume matches the target job description"
              : "Here's how your resume performs against ATS systems"}
          </p>
        </div>

        {/* ── Score ── */}
        <div className="flex justify-center mb-10 fade-in fade-in-delay-1">
          <div className="glass-card p-8 sm:p-10 text-center">
            <ScoreRing score={ats_score} hasJd={hasJd} />
            <p
              className="mt-4 text-sm font-medium"
              style={{
                color:
                  ats_score >= 75
                    ? "var(--accent-secondary)"
                    : ats_score >= 50
                    ? "var(--accent-warning)"
                    : "var(--accent-danger)",
              }}
            >
              {ats_score >= 75
                ? hasJd ? "Great — Excellent match for this position!" : "Great — Your resume is well optimized!"
                : ats_score >= 50
                ? hasJd ? "Good — Matches most key requirements, but gaps exist" : "Decent — Some improvements recommended"
                : hasJd ? "Weak — Significant gaps compared to job requirements" : "Needs work — Significant improvements needed"}
            </p>
          </div>
        </div>

        {/* ── Grid: Skills & Keywords ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Strong Skills */}
          <div className="result-section fade-in fade-in-delay-2">
            <div className="section-title">
              <div
                className="section-icon"
                style={{ background: "rgba(0, 212, 170, 0.12)", color: "#00d4aa" }}
              >
                ✓
              </div>
              {hasJd ? "Matched Skills" : "Strong Skills"}
            </div>
            <div className="flex flex-wrap gap-2">
              {strong_skills && strong_skills.length > 0 ? (
                strong_skills.map((skill, i) => (
                  <span key={i} className="badge badge-green">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {hasJd ? "No matching skills detected" : "No strong skills detected"}
                </p>
              )}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="result-section fade-in fade-in-delay-3">
            <div className="section-title">
              <div
                className="section-icon"
                style={{ background: "rgba(255, 107, 107, 0.12)", color: "#ff6b6b" }}
              >
                ✗
              </div>
              {hasJd ? "Missing JD Keywords" : "Missing Keywords"}
            </div>
            <div className="flex flex-wrap gap-2">
              {missing_keywords && missing_keywords.length > 0 ? (
                missing_keywords.map((kw, i) => (
                  <span key={i} className="badge badge-red">
                    {kw}
                  </span>
                ))
              ) : (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {hasJd ? "All critical JD keywords match! Great coverage!" : "No missing keywords — great coverage!"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Experience Feedback ── */}
        <div className="result-section mb-4 fade-in fade-in-delay-4">
          <div className="section-title">
            <div
              className="section-icon"
              style={{ background: "rgba(108, 99, 255, 0.12)", color: "#6c63ff" }}
            >
              💼
            </div>
            Experience Feedback
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {experience_feedback || "No feedback available."}
          </p>
        </div>

        {/* ── Suggestions ── */}
        <div className="result-section mb-4 fade-in fade-in-delay-5">
          <div className="section-title">
            <div
              className="section-icon"
              style={{ background: "rgba(255, 167, 38, 0.12)", color: "#ffa726" }}
            >
              💡
            </div>
            Suggestions
          </div>
          <div className="flex flex-col gap-1">
            {suggestions && suggestions.length > 0 ? (
              suggestions.map((suggestion, i) => (
                <div key={i} className="suggestion-item">
                  <span className="suggestion-number">{i + 1}</span>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {suggestion}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No suggestions available.
              </p>
            )}
          </div>
        </div>

        {/* ── Overall Verdict ── */}
        <div className="verdict-card mb-8 fade-in fade-in-delay-6">
          <div className="section-title">
            <div
              className="section-icon"
              style={{
                background: "linear-gradient(135deg, rgba(108, 99, 255, 0.15), rgba(0, 212, 170, 0.15))",
                color: "#a8a3ff",
              }}
            >
              ⚖
            </div>
            Overall Verdict
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.85 }}>
            {overall_verdict || "No verdict available."}
          </p>
        </div>

        {/* ── Actions ── */}
        <div className="flex justify-center gap-4 mb-10 fade-in fade-in-delay-6">
          <button
            id="analyze-another-btn"
            className="btn-primary"
            onClick={() => {
              sessionStorage.removeItem("atsResult");
              router.push("/");
            }}
          >
            <span className="flex items-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Analyze Another
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
