"use client";

import { useState, useCallback } from "react";

export interface AssessmentResult {
  id: string;
  assessmentId: "phq9" | "gad7" | "psqi";
  title: string;
  score: number;
  maxScore: number;
  severity: string;
  severityColor: string;
  date: string;
  answers: number[];
}

const STORAGE_KEY = "gravix_assessment_results";

const getStoredResults = (): AssessmentResult[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveResults = (results: AssessmentResult[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch {
    // Storage full or unavailable
  }
};

export function useAssessmentResults() {
  const [results, setResults] = useState<AssessmentResult[]>(getStoredResults);

  const addResult = useCallback((result: Omit<AssessmentResult, "id" | "date">) => {
    const newResult: AssessmentResult = {
      ...result,
      id: `${result.assessmentId}_${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    };

    setResults(prev => {
      // Replace existing result for same assessment, or add new
      const filtered = prev.filter(r => r.assessmentId !== result.assessmentId);
      const updated = [newResult, ...filtered];
      saveResults(updated);
      return updated;
    });
  }, []);

  const getLatestResult = useCallback((assessmentId: string) => {
    return results.find(r => r.assessmentId === assessmentId) || null;
  }, [results]);

  const clearResults = useCallback(() => {
    setResults([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return { results, addResult, getLatestResult, clearResults };
}
