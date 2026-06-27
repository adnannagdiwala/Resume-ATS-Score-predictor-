"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleFile = useCallback((selectedFile) => {
    setError("");
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be under 10 MB.");
      return;
    }

    setFile(selectedFile);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const extractTextFromPDF = async (pdfFile) => {
    // Dynamic import to avoid SSR issues — pdf.js needs browser APIs
    const pdfjsLib = await import("pdfjs-dist/build/pdf.mjs");

    // Use the CDN-hosted worker to avoid bundler issues with Turbopack
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.7.284/build/pdf.worker.min.mjs";

    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }

    return fullText.trim();
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      // 1. Extract text client-side
      const resumeText = await extractTextFromPDF(file);

      if (!resumeText || resumeText.trim().length < 50) {
        throw new Error(
          "Could not extract enough text from the PDF. Ensure the resume is not scanned/image-based."
        );
      }

      // 2. Send text to API
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed.");
      }

      const data = await response.json();

      // 3. Store result and navigate
      sessionStorage.setItem("atsResult", JSON.stringify(data));
      router.push("/results");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="w-full max-w-xl mx-auto fade-in">
        {/* ── Header ── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6"
            style={{
              background: "rgba(108, 99, 255, 0.1)",
              border: "1px solid rgba(108, 99, 255, 0.2)",
              color: "var(--accent-primary)",
            }}
          >
            <span className="pulse-dot" />
            AI-Powered Analysis
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
            <span
              style={{
                background: "linear-gradient(135deg, #fff 0%, #a8a3ff 50%, #00d4aa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ATS Resume
            </span>
            <br />
            <span style={{ color: "var(--foreground)" }}>Analyzer</span>
          </h1>
          <p style={{ color: "var(--text-muted)" }} className="text-base max-w-md mx-auto">
            Upload your resume and get an instant ATS compatibility score with
            actionable feedback powered by Gemini AI.
          </p>
        </div>

        {/* ── Upload card ── */}
        <div className="glass-card p-6 sm:p-8">
          {/* Drop zone */}
          <div
            id="drop-zone"
            className={`drop-zone p-10 sm:p-14 text-center ${
              dragOver ? "drag-over" : ""
            } ${file ? "has-file" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="relative z-10">
              {/* Upload icon */}
              <div
                className="mx-auto mb-4 w-14 h-14 rounded-xl flex items-center justify-center"
                style={{
                  background: file
                    ? "rgba(0, 212, 170, 0.1)"
                    : "rgba(108, 99, 255, 0.1)",
                }}
              >
                {file ? (
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke="#00d4aa"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h.1a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      stroke="#6c63ff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              {file ? (
                <p className="font-semibold" style={{ color: "var(--accent-secondary)" }}>
                  File selected
                </p>
              ) : (
                <>
                  <p className="font-semibold mb-1">
                    Drop your resume here or{" "}
                    <span style={{ color: "var(--accent-primary)" }}>browse</span>
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    PDF files only · Max 10 MB
                  </p>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              id="file-input"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          {/* File info */}
          {file && (
            <div className="file-info fade-in">
              <svg className="file-icon" width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-sm hover:underline"
                style={{ color: "var(--accent-danger)" }}
                id="remove-file"
              >
                Remove
              </button>
            </div>
          )}

          {/* Job Description (JD) Input */}
          <div className="jd-container">
            <label className="jd-label" htmlFor="jd-textarea">
              <span>Target Job Description</span>
              <span className="jd-optional">Optional</span>
            </label>
            <textarea
              id="jd-textarea"
              className="jd-textarea"
              placeholder="Paste the target job description here to get a tailored compatibility score and recommendations..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="error-message mt-4 fade-in">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Analyze button */}
          <button
            id="analyze-btn"
            className="btn-primary w-full mt-6"
            disabled={!file || loading}
            onClick={handleAnalyze}
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="spinner" style={{ width: "1.25rem", height: "1.25rem", borderWidth: "2px" }} />
                  Analyzing…
                </>
              ) : (
                <>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Analyze Resume
                </>
              )}
            </span>
          </button>
        </div>

        {/* Loading overlay text */}
        {loading && (
          <div className="text-center mt-6 fade-in">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Extracting text & running AI analysis…
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)", opacity: 0.6 }}>
              This usually takes 10–30 seconds
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
