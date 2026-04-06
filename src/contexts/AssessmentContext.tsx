"use client";

import { createContext, useContext, ReactNode } from "react";
import { useAssessmentResults, AssessmentResult } from "@/hooks/useAssessmentResults";

interface AssessmentContextValue {
  results: AssessmentResult[];
  addResult: (result: Omit<AssessmentResult, "id" | "date">) => void;
  getLatestResult: (assessmentId: string) => AssessmentResult | null;
  clearResults: () => void;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const assessmentHook = useAssessmentResults();

  return (
    <AssessmentContext.Provider value={assessmentHook}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessmentContext() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessmentContext must be used within AssessmentProvider");
  }
  return context;
}
