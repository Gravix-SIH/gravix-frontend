"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Moon,
  Heart,
  Play,
  Calendar,
  BarChart3,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  Target,
  Activity,
  Award,
  Zap
} from "lucide-react";
import AssessmentTemplate, {
  AssessmentConfig,
  PHQ9_CONFIG,
  GAD7_CONFIG,
  PSQI_CONFIG
} from "@/components/AssessmentTemplate";
import { assessmentService, AssessmentResultPayload, AssessmentResultResponse } from "@/services/studentService";

const ASSESSMENTS = [
  {
    id: "phq9",
    title: "PHQ-9 Depression Screening",
    description: "Evaluate depression symptoms over the past 2 weeks with the standard PHQ-9 questionnaire",
    icon: Brain,
    duration: "5-7 minutes",
    questions: 9,
    difficulty: "Easy",
    color: "from-red-400 to-pink-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    category: "Mental Health",
    config: PHQ9_CONFIG
  },
  {
    id: "gad7",
    title: "GAD-7 Anxiety Screening",
    description: "Evaluate anxiety symptoms over the past 2 weeks with the standard GAD-7 questionnaire",
    icon: Heart,
    duration: "3-5 minutes",
    questions: 7,
    difficulty: "Easy",
    color: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    category: "Mental Health",
    config: GAD7_CONFIG
  },
  {
    id: "psqi",
    title: "PSQI Sleep Quality Index",
    description: "Analyze your sleep quality over the past month with the Pittsburgh Sleep Quality Index",
    icon: Moon,
    duration: "6-8 minutes",
    questions: 17,
    difficulty: "Easy",
    color: "from-purple-400 to-violet-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    category: "Sleep Health",
    config: PSQI_CONFIG
  }
];

export default function StudentAssessment() {
  const [results, setResults] = useState<AssessmentResultResponse[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentConfig | null>(null);

  // Load assessments from API
  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    const data = await assessmentService.getAssessments();
    setResults(data);
  };

  const handleAssessmentComplete = async (
    assessmentId: string,
    score: number,
    answers: number[]
  ) => {
    const payload: AssessmentResultPayload = {
      assessment_type: assessmentId as "phq9" | "gad7" | "psqi",
      score,
      answers
    };

    await assessmentService.submitAssessment(payload);
    await loadAssessments();
  };

  const getLatestResult = (assessmentId: string) => {
    return results.find(r => r.assessment_type === assessmentId) || null;
  };

  const getTrend = (assessmentId: string) => {
    const result = getLatestResult(assessmentId);
    if (!result) return "not-taken";
    const percentage = (result.score / result.max_score) * 100;
    if (percentage < 30) return "good";
    if (percentage < 60) return "moderate";
    return "concerning";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return <Badge variant="success-soft">Good</Badge>;
      case "moderate":
        return <Badge variant="warning-soft">Moderate</Badge>;
      case "concerning":
        return <Badge variant="error-soft">Needs Attention</Badge>;
      default:
        return <Badge variant="secondary">Not Taken</Badge>;
    }
  };

  const getSeverityColor = (severity: string) => {
    const colorMap: Record<string, string> = {
      "Minimal Depression": "text-green-600",
      "Mild Depression": "text-yellow-600",
      "Moderate Depression": "text-orange-600",
      "Moderately Severe Depression": "text-red-600",
      "Severe Depression": "text-red-700",
      "Minimal Anxiety": "text-green-600",
      "Mild Anxiety": "text-yellow-600",
      "Moderate Anxiety": "text-orange-600",
      "Severe Anxiety": "text-red-700",
      "Good Sleep Quality": "text-green-600",
      "Fair Sleep Quality": "text-yellow-600",
      "Poor Sleep Quality": "text-orange-600",
      "Very Poor Sleep Quality": "text-red-700",
    };
    return colorMap[severity] || "text-text-secondary";
  };

  const assessmentsCompleted = results.length;
  const totalAssessments = ASSESSMENTS.length;

  const wellnessScore = results.length > 0
    ? Math.round(
        results.reduce((acc, r) => {
          const percentage = (r.score / r.max_score) * 100;
          // Lower score = better for these assessments
          const inverted = 100 - percentage;
          return acc + inverted;
        }, 0) / results.length
      )
    : 0;

  if (selectedAssessment) {
    return (
      <AssessmentTemplate
        assessment={selectedAssessment}
        onBack={() => setSelectedAssessment(null)}
        onComplete={(score, answers) => {
          handleAssessmentComplete(selectedAssessment.id, score, answers);
        }}
      />
    );
  }

  return (
    <div className="p-4 sm:p-6 h-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Health Assessments</h1>
            <p className="text-purple-700 text-sm sm:text-base">Track your wellness journey with personalized assessments</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="soft">
              <Activity className="w-3 h-3 mr-1" />
              {assessmentsCompleted}/{totalAssessments} Completed
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 text-xs sm:text-sm">Assessments Completed</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{assessmentsCompleted}</p>
                </div>
                <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 text-xs sm:text-sm">Overall Wellness Score</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{wellnessScore || "--"}</p>
                </div>
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm sm:col-span-2 md:col-span-1">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 text-xs sm:text-sm">Progress</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {assessmentsCompleted > 0 ? Math.round((assessmentsCompleted / totalAssessments) * 100) : 0}%
                  </p>
                </div>
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
        {/* Main Assessment Cards */}
        <div className="lg:col-span-8">
          <div className="space-y-4 sm:space-y-6">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl text-gray-800 flex items-center">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-600" />
                  Available Assessments
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="space-y-4 sm:space-y-6">
                  {ASSESSMENTS.map((assessment) => {
                    const IconComponent = assessment.icon;
                    const latestResult = getLatestResult(assessment.id);
                    const trend = getTrend(assessment.id);

                    return (
                      <div key={assessment.id} className="group">
                        <Card className={`border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer ${assessment.borderColor} ${assessment.bgColor} hover:border-opacity-60`}>
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col lg:flex-row items-start gap-4">
                              <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${assessment.color} shadow-lg mx-auto lg:mx-0`}>
                                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                              </div>

                              <div className="flex-1 w-full">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
                                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{assessment.title}</h3>
                                  <Badge variant={assessment.category === "Mental Health" ? "info" : "soft"}>
                                    {assessment.category}
                                  </Badge>
                                </div>

                                <p className="text-text-secondary text-sm mb-3 sm:mb-4 leading-relaxed">{assessment.description}</p>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-4">
                                  <div className="flex items-center text-xs sm:text-sm text-text-secondary">
                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                    {assessment.duration}
                                  </div>
                                  <div className="flex items-center text-xs sm:text-sm text-text-secondary">
                                    <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                    {assessment.questions} Qs
                                  </div>
                                  <div className="flex items-center text-xs sm:text-sm text-text-secondary">
                                    <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                    {assessment.difficulty}
                                  </div>
                                  <div className="flex items-center text-xs sm:text-sm text-text-secondary">
                                    {getStatusBadge(trend)}
                                  </div>
                                </div>

                                {latestResult && (
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs sm:text-sm text-text-secondary">Last Score:</span>
                                      <span className="font-bold text-lg text-gray-800">
                                        {latestResult.score}/{latestResult.max_score}
                                      </span>
                                      <span className={`text-sm font-medium ${getSeverityColor(latestResult.severity)}`}>
                                        ({latestResult.severity})
                                      </span>
                                    </div>
                                    <Progress
                                      value={(latestResult.score / latestResult.max_score) * 100}
                                      className="w-full sm:max-w-32"
                                    />
                                  </div>
                                )}

                                <Button
                                  className={`w-full sm:w-auto bg-gradient-to-r hover:scale-105 transition-all duration-200 text-white shadow-lg text-sm sm:text-base ${
                                    latestResult
                                      ? "from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                                      : "from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                  }`}
                                  onClick={() => setSelectedAssessment(assessment.config)}
                                >
                                  <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                  {latestResult ? "Retake Assessment" : "Start Assessment"}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          {/* Recent Results */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg text-gray-800 flex items-center">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600" />
                Recent Results
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              {results.length === 0 ? (
                <div className="text-center py-6">
                  <Activity className="w-10 h-10 mx-auto mb-3 text-text-secondary/50" />
                  <p className="text-text-secondary text-sm">No assessments completed yet</p>
                  <p className="text-text-secondary text-xs mt-1">Start an assessment to see your results here</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {results.slice(0, 5).map((result) => {
                    const assessment = ASSESSMENTS.find(a => a.id === result.assessment_type);
                    return (
                    <div key={result.id} className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-xs sm:text-sm">{assessment?.title || result.assessment_type}</h4>
                        <Badge variant={((result.severity || "").toLowerCase().replace(/\s+/g, "-")) as Parameters<typeof Badge>[0]['variant']}>
                          {result.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <span className={`text-xl sm:text-2xl font-bold ${getSeverityColor(result.severity)}`}>
                            {result.score}
                          </span>
                          <span className="text-sm text-text-secondary">/{result.max_score}</span>
                        </div>
                        <div className="text-xs text-text-secondary">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {new Date(result.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Progress
                        value={(result.score / result.max_score) * 100}
                        className="w-full mt-2 h-1.5"
                      />
                    </div>
                  );
                })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg text-gray-800 flex items-center">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />
                Assessment Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-text-secondary">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Take assessments in a quiet, comfortable environment</p>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Answer honestly for the most accurate results</p>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Regular assessments help track your progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}