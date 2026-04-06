"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Moon,
  Heart,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Shared Types
// ─────────────────────────────────────────────────────────────────────────────

export interface Question {
  id: number;
  text: string;
  subText?: string;
  /**
   * "radio"   – standard 0-3 option buttons  (default)
   * "time"    – HH:MM time picker (bedtime / wake time)
   * "number"  – numeric input (minutes / hours)
   */
  inputType?: "radio" | "time" | "number";
  /** Labels for radio options (overrides the assessment-level default) */
  optionLabels?: string[];
  numberUnit?: string;   // e.g. "minutes" or "hours"
  numberMin?: number;
  numberMax?: number;
}

export interface AssessmentConfig {
  id: string;
  title: string;
  description: string;
  icon: "brain" | "moon" | "heart";
  duration: string;
  scoring: {
    min: number;
    max: number;
    severityThresholds: {
      label: string;
      min: number;
      max: number;
      color: string;
    }[];
  };
  instructions: string[];
  questions: Question[];
  /**
   * Optional custom scorer. Receives raw answers array (numbers).
   * For time questions the value is minutes-since-midnight.
   * For number questions the value is the number entered.
   * Must return the final 0-max score.
   */
  computeScore?: (answers: number[]) => number;
  onComplete?: (score: number, answers: number[]) => void;
}

interface AssessmentTemplateProps {
  assessment: AssessmentConfig;
  onBack: () => void;
  onComplete?: (score: number, answers: number[]) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper utilities
// ─────────────────────────────────────────────────────────────────────────────

/** Convert "HH:MM" string to minutes since midnight */
function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
}

/** Convert minutes-since-midnight to "HH:MM" */
function minutesToTime(mins: number): string {
  const h = Math.floor(((mins % 1440) + 1440) % 1440 / 60);
  const m = ((mins % 1440) + 1440) % 1440 % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// AssessmentTemplate Component
// ─────────────────────────────────────────────────────────────────────────────

export default function AssessmentTemplate({
  assessment,
  onBack,
  onComplete,
}: AssessmentTemplateProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // answers array – each element is a number:
  //   radio   → 0-3
  //   time    → minutes-since-midnight  (-1 = unanswered)
  //   number  → actual number           (-1 = unanswered)
  const [answers, setAnswers] = useState<number[]>(
    new Array(assessment.questions.length).fill(-1)
  );
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / assessment.questions.length) * 100;

  // ── Score computation ──────────────────────────────────────────────────────
  const computeScore = () => {
    if (assessment.computeScore) return assessment.computeScore(answers);
    return answers.reduce((sum, ans) => sum + Math.max(0, ans), 0);
  };

  const totalScore = computeScore();

  // ── Icon ───────────────────────────────────────────────────────────────────
  const getIcon = (iconName: string) => {
    if (iconName === "brain") return Brain;
    if (iconName === "moon") return Moon;
    if (iconName === "heart") return Heart;
    return Brain;
  };
  const IconComponent = getIcon(assessment.icon);

  // ── Answer handler ─────────────────────────────────────────────────────────
  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const finalScore = computeScore();
      setShowResults(true);
      onComplete?.(finalScore, answers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const canProceed = answers[currentQuestionIndex] >= 0;

  // ── Severity ───────────────────────────────────────────────────────────────
  const getSeverity = () => {
    const score = totalScore;
    return (
      assessment.scoring.severityThresholds.find(
        (t) => score >= t.min && score <= t.max
      ) || assessment.scoring.severityThresholds[assessment.scoring.severityThresholds.length - 1]
    );
  };

  const getProgressMessage = () => {
    const answered = answers.filter((a) => a >= 0).length;
    const remaining = assessment.questions.length - answered;
    if (remaining === 1 && answers[currentQuestionIndex] < 0)
      return "Please answer to continue";
    return `${remaining} question${remaining !== 1 ? "s" : ""} remaining`;
  };

  // ── Results screen ─────────────────────────────────────────────────────────
  if (showResults) {
    const severity = getSeverity();
    const maxScore = assessment.scoring.max;
    return (
      <div className="p-4 sm:p-6 max-w-2xl mx-auto">
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${severity.color} flex items-center justify-center`}
            >
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl mb-2">{assessment.title}</CardTitle>
            <CardDescription className="text-base">
              Assessment Complete
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-text-secondary mb-4">Your Score</p>
              <div className="text-5xl font-bold mb-2">
                <span
                  className={severity.color
                    .replace("from-", "text-")
                    .split(" ")[0]}
                >
                  {totalScore}
                </span>
                <span className="text-muted-foreground text-2xl">/{maxScore}</span>
              </div>
              <Badge
                className={`text-sm px-4 py-1 bg-gradient-to-r ${severity.color} text-white border-0`}
              >
                {severity.label}
              </Badge>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                What this means
              </h4>
              <p className="text-text-secondary text-sm">
                {assessment.id === "psqi" ? (
                  <>
                    {totalScore <= 5 &&
                      "Your sleep quality appears good. Keep up the healthy sleep habits."}
                    {totalScore >= 6 &&
                      totalScore <= 10 &&
                      "Your sleep quality is fair. Minor adjustments to your sleep routine may help."}
                    {totalScore >= 11 &&
                      totalScore <= 15 &&
                      "Your sleep quality is poor. Consider talking to a healthcare provider about your sleep."}
                    {totalScore >= 16 &&
                      "Your sleep quality is very poor. We recommend consulting a healthcare provider."}
                  </>
                ) : (
                  <>
                    {totalScore <= 4 &&
                      "Your symptoms in this area appear minimal or well-managed. Keep up with your healthy habits."}
                    {totalScore >= 5 &&
                      totalScore <= 9 &&
                      "You may be experiencing some symptoms that could benefit from attention. Consider discussing with a counselor."}
                    {totalScore >= 10 &&
                      totalScore <= 14 &&
                      "Your scores suggest moderate symptoms. We recommend reaching out to a counselor for support."}
                    {totalScore >= 15 &&
                      "Your scores suggest significant symptoms. Please consider speaking with a counselor soon."}
                  </>
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-blue-50 rounded-lg p-3">
                <Clock className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <p className="text-xs text-text-secondary">Duration</p>
                <p className="font-semibold text-gray-800">
                  {assessment.duration}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-green-600" />
                <p className="text-xs text-text-secondary">Questions</p>
                <p className="font-semibold text-gray-800">
                  {assessment.questions.length}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowResults(false);
                  setCurrentQuestionIndex(0);
                  setAnswers(
                    new Array(assessment.questions.length).fill(-1)
                  );
                }}
              >
                Retake Assessment
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                onClick={onBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Assessments
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Question screen ────────────────────────────────────────────────────────
  const inputType = currentQuestion.inputType ?? "radio";

  // Resolve option labels for radio questions
  const optionLabels: string[] = (() => {
    if (currentQuestion.optionLabels) return currentQuestion.optionLabels;
    // PHQ-9 / GAD-7 default
    if (assessment.id === "phq9" || assessment.id === "gad7") {
      return [
        "Not at all",
        "Several days",
        "More than half the days",
        "Nearly every day",
      ];
    }
    // PSQI fallback (shouldn't reach here since all PSQI questions declare optionLabels)
    return [
      "Not during the past month",
      "Less than once a week",
      "Once or twice a week",
      "Three or more times a week",
    ];
  })();

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Assessments
        </Button>
      </div>

      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500">
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{assessment.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{getProgressMessage()}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-sm text-black">
              {currentQuestionIndex + 1} / {assessment.questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {/* Question text */}
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-900">
              {currentQuestion.text}
            </h3>
            {currentQuestion.subText && (
              <p className="text-sm text-muted-foreground">{currentQuestion.subText}</p>
            )}
          </div>

          {/* ── Time input ── */}
          {inputType === "time" && (
            <div className="space-y-2">
              <input
                type="time"
                className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg focus:border-purple-400 focus:outline-none"
                value={
                  answers[currentQuestionIndex] >= 0
                    ? minutesToTime(answers[currentQuestionIndex])
                    : ""
                }
                onChange={(e) => {
                  if (e.target.value) {
                    handleAnswer(timeToMinutes(e.target.value));
                  }
                }}
              />
            </div>
          )}

          {/* ── Number input ── */}
          {inputType === "number" && (
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={currentQuestion.numberMin ?? 0}
                max={currentQuestion.numberMax ?? 999}
                className="w-36 border-2 border-gray-200 rounded-lg p-3 text-lg focus:border-purple-400 focus:outline-none"
                value={
                  answers[currentQuestionIndex] >= 0
                    ? answers[currentQuestionIndex]
                    : ""
                }
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) handleAnswer(val);
                  else if (e.target.value === "") handleAnswer(-1);
                }}
              />
              {currentQuestion.numberUnit && (
                <span className="text-muted-foreground text-sm">
                  {currentQuestion.numberUnit}
                </span>
              )}
            </div>
          )}

          {/* ── Radio options ── */}
          {inputType === "radio" && (
            <div className="space-y-3">
              {optionLabels.map((label, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    answers[currentQuestionIndex] === index
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestionIndex] === index
                          ? "border-purple-500 bg-purple-500"
                          : "border-gray-300"
                      }`}
                    >
                      {answers[currentQuestionIndex] === index && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span
                      className={`font-medium ${
                        answers[currentQuestionIndex] === index
                          ? "text-purple-700"
                          : "text-gray-700"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              {currentQuestionIndex === assessment.questions.length - 1 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Complete
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions reminder */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2 flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          Before you begin
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          {assessment.instructions.map((instruction, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              {instruction}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHQ-9  (Patient Health Questionnaire-9)
// Source: Kroenke K, Spitzer RL, Williams JB. JGIM 2001.
// Scoring: 9 items × 0-3 = 0-27
// ─────────────────────────────────────────────────────────────────────────────

export const PHQ9_CONFIG: AssessmentConfig = {
  id: "phq9",
  title: "PHQ-9 Depression Screening",
  description:
    "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
  icon: "brain",
  duration: "5-7 minutes",
  scoring: {
    min: 0,
    max: 27,
    severityThresholds: [
      {
        label: "Minimal Depression",
        min: 0,
        max: 4,
        color: "from-green-400 to-emerald-500",
      },
      {
        label: "Mild Depression",
        min: 5,
        max: 9,
        color: "from-yellow-400 to-orange-400",
      },
      {
        label: "Moderate Depression",
        min: 10,
        max: 14,
        color: "from-orange-400 to-red-400",
      },
      {
        label: "Moderately Severe Depression",
        min: 15,
        max: 19,
        color: "from-red-400 to-rose-500",
      },
      {
        label: "Severe Depression",
        min: 20,
        max: 27,
        color: "from-rose-500 to-red-700",
      },
    ],
  },
  instructions: [
    "Answer based on how you've felt over the past 2 weeks",
    "Select the option that best describes your experience",
    "There are no right or wrong answers",
  ],
  // PHQ-9 uses the standard 0-3 frequency scale for all 9 items
  questions: [
    { id: 1, text: "Little interest or pleasure in doing things" },
    { id: 2, text: "Feeling down, depressed, or hopeless" },
    {
      id: 3,
      text: "Trouble falling or staying asleep, or sleeping too much",
    },
    { id: 4, text: "Feeling tired or having little energy" },
    { id: 5, text: "Poor appetite or overeating" },
    {
      id: 6,
      text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
    },
    {
      id: 7,
      text: "Trouble concentrating on things, such as reading the newspaper or watching television",
    },
    {
      id: 8,
      text: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
    },
    {
      id: 9,
      text: "Thoughts that you would be better off dead, or of hurting yourself in some way",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// GAD-7  (Generalized Anxiety Disorder-7)
// Source: Spitzer RL, et al. Arch Intern Med 2006.
// Scoring: 7 items × 0-3 = 0-21
// ─────────────────────────────────────────────────────────────────────────────

export const GAD7_CONFIG: AssessmentConfig = {
  id: "gad7",
  title: "GAD-7 Anxiety Screening",
  description:
    "Over the last 2 weeks, how often have you been bothered by the following problems?",
  icon: "heart",
  duration: "3-5 minutes",
  scoring: {
    min: 0,
    max: 21,
    severityThresholds: [
      {
        label: "Minimal Anxiety",
        min: 0,
        max: 4,
        color: "from-green-400 to-emerald-500",
      },
      {
        label: "Mild Anxiety",
        min: 5,
        max: 9,
        color: "from-yellow-400 to-orange-400",
      },
      {
        label: "Moderate Anxiety",
        min: 10,
        max: 14,
        color: "from-orange-400 to-red-400",
      },
      {
        label: "Severe Anxiety",
        min: 15,
        max: 21,
        color: "from-red-500 to-rose-600",
      },
    ],
  },
  instructions: [
    "Answer based on how you've felt over the past 2 weeks",
    "Select the option that best describes your experience",
    "There are no right or wrong answers",
  ],
  questions: [
    { id: 1, text: "Feeling nervous, anxious, or on edge" },
    { id: 2, text: "Not being able to stop or control worrying" },
    { id: 3, text: "Worrying too much about different things" },
    { id: 4, text: "Trouble relaxing" },
    { id: 5, text: "Being so restless that it is hard to sit still" },
    { id: 6, text: "Becoming easily annoyed or irritable" },
    { id: 7, text: "Feeling afraid as if something awful might happen" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// PSQI  (Pittsburgh Sleep Quality Index)
// Source: Buysse DJ, et al. Psychiatry Res 1989;28:193-213.
//
// 7 components, each scored 0-3. Global score = sum of 7 components (0-21).
// Higher scores = worse sleep quality. Cutpoint > 5 = poor sleeper.
//
// Question index map (0-based) used in computeScore:
//   [0]  Q1  – bedtime                (time input → minutes since midnight)
//   [1]  Q2  – sleep latency          (number input → minutes)
//   [2]  Q3  – wake time              (time input → minutes since midnight)
//   [3]  Q4  – hours of actual sleep  (number input → hours, e.g. 6.5)
//   [4]  Q5a – can't sleep in 30 min  (radio 0-3)
//   [5]  Q5b – wake during night      (radio 0-3)
//   [6]  Q5c – bathroom               (radio 0-3)
//   [7]  Q5d – can't breathe          (radio 0-3)
//   [8]  Q5e – cough/snore            (radio 0-3)
//   [9]  Q5f – too cold               (radio 0-3)
//   [10] Q5g – too hot                (radio 0-3)
//   [11] Q5h – bad dreams             (radio 0-3)
//   [12] Q5i – pain                   (radio 0-3)
//   [13] Q6  – sleep medication       (radio 0-3)
//   [14] Q7  – daytime dysfunction – trouble staying awake (radio 0-3)
//   [15] Q8  – daytime dysfunction – enthusiasm           (radio 0-3)
//   [16] Q9  – overall sleep quality  (radio 0-3)
// ─────────────────────────────────────────────────────────────────────────────

const FREQ_LABELS = [
  "Not during the past month",
  "Less than once a week",
  "Once or twice a week",
  "Three or more times a week",
];

const SLEEP_QUALITY_LABELS = ["Very good", "Fairly good", "Fairly bad", "Very bad"];

const ENTHUSIASM_LABELS = [
  "No problem at all",
  "Only a very slight problem",
  "Somewhat of a problem",
  "A very big problem",
];

/**
 * PSQI 7-component scorer.
 * Indices correspond to the question array order defined in PSQI_CONFIG.questions.
 */
function computePSQIScore(answers: number[]): number {
  // ── Component 1: Subjective sleep quality (Q9 → index 16) ────────────────
  const c1 = Math.max(0, answers[16] ?? 0);

  // ── Component 2: Sleep latency (Q2 + Q5a) ────────────────────────────────
  const latencyMins = answers[1] >= 0 ? answers[1] : 0;
  const latencySub =
    latencyMins < 15 ? 0
    : latencyMins <= 30 ? 1
    : latencyMins <= 60 ? 2
    : 3;
  const q5aSub = Math.max(0, answers[4] ?? 0);
  const latencySum = latencySub + q5aSub;
  const c2 =
    latencySum === 0 ? 0
    : latencySum <= 2 ? 1
    : latencySum <= 4 ? 2
    : 3;

  // ── Component 3: Sleep duration (Q4 → index 3) ───────────────────────────
  const sleepHours = answers[3] >= 0 ? answers[3] : 0;
  const c3 =
    sleepHours > 7 ? 0
    : sleepHours >= 6 ? 1
    : sleepHours >= 5 ? 2
    : 3;

  // ── Component 4: Sleep efficiency (Q1, Q3, Q4) ───────────────────────────
  // Bedtime and wake-time are stored as minutes-since-midnight.
  const bedMins = answers[0] >= 0 ? answers[0] : 0;
  const wakeMins = answers[2] >= 0 ? answers[2] : 0;
  // Hours in bed: if wake < bed (crosses midnight), add 1440
  let hoursInBed = ((wakeMins - bedMins + 1440) % 1440) / 60;
  if (hoursInBed === 0) hoursInBed = 8; // fallback
  const efficiency = hoursInBed > 0 ? (sleepHours / hoursInBed) * 100 : 0;
  const c4 =
    efficiency > 85 ? 0
    : efficiency >= 75 ? 1
    : efficiency >= 65 ? 2
    : 3;

  // ── Component 5: Sleep disturbances (Q5b–Q5i → indices 5-12) ────────────
  const disturbSum = [5, 6, 7, 8, 9, 10, 11, 12].reduce(
    (s, i) => s + Math.max(0, answers[i] ?? 0),
    0
  );
  const c5 =
    disturbSum === 0 ? 0
    : disturbSum <= 9 ? 1
    : disturbSum <= 18 ? 2
    : 3;

  // ── Component 6: Sleep medication (Q6 → index 13) ────────────────────────
  const c6 = Math.max(0, answers[13] ?? 0);

  // ── Component 7: Daytime dysfunction (Q7 + Q8 → indices 14, 15) ──────────
  const q7sub = Math.max(0, answers[14] ?? 0);
  const q8sub = Math.max(0, answers[15] ?? 0);
  const dxSum = q7sub + q8sub;
  const c7 =
    dxSum === 0 ? 0
    : dxSum <= 2 ? 1
    : dxSum <= 4 ? 2
    : 3;

  return c1 + c2 + c3 + c4 + c5 + c6 + c7;
}

export const PSQI_CONFIG: AssessmentConfig = {
  id: "psqi",
  title: "PSQI Sleep Quality Index",
  description:
    "Evaluate your sleep quality over the past month with the Pittsburgh Sleep Quality Index",
  icon: "moon",
  duration: "6-8 minutes",
  scoring: {
    min: 0,
    max: 21,
    severityThresholds: [
      {
        label: "Good Sleep Quality",
        min: 0,
        max: 5,
        color: "from-green-400 to-emerald-500",
      },
      {
        label: "Fair Sleep Quality",
        min: 6,
        max: 10,
        color: "from-yellow-400 to-orange-400",
      },
      {
        label: "Poor Sleep Quality",
        min: 11,
        max: 15,
        color: "from-orange-400 to-red-400",
      },
      {
        label: "Very Poor Sleep Quality",
        min: 16,
        max: 21,
        color: "from-red-500 to-rose-600",
      },
    ],
  },
  instructions: [
    "Answer based on your usual sleep habits during the past month",
    "Questions 1-4 require entering times or numbers",
    "For questions with options, choose what happened most nights",
  ],
  computeScore: computePSQIScore,
  questions: [
    // ── Numeric / time inputs ─────────────────────────────────────────────
    {
      id: 1,
      text: "During the past month, what time have you usually gone to bed at night?",
      subText: "Enter your usual bedtime (e.g. 10:30 PM → 22:30)",
      inputType: "time",
    },
    {
      id: 2,
      text: "During the past month, how long (in minutes) has it usually taken you to fall asleep each night?",
      subText: "Enter the number of minutes",
      inputType: "number",
      numberUnit: "minutes",
      numberMin: 0,
      numberMax: 240,
    },
    {
      id: 3,
      text: "During the past month, what time have you usually gotten up in the morning?",
      subText: "Enter your usual wake time (e.g. 7:00 AM → 07:00)",
      inputType: "time",
    },
    {
      id: 4,
      text: "During the past month, how many hours of actual sleep did you get at night?",
      subText:
        "This may differ from the number of hours you spent in bed. Decimals OK (e.g. 6.5)",
      inputType: "number",
      numberUnit: "hours",
      numberMin: 0,
      numberMax: 24,
    },

    // ── Q5a: Sleep latency disturbance ────────────────────────────────────
    {
      id: 5,
      text: "During the past month, how often have you had trouble sleeping because you…",
      subText: "Cannot get to sleep within 30 minutes",
      inputType: "radio",
      optionLabels: FREQ_LABELS,
    },

    // ── Q5b–Q5i: Sleep disturbances ───────────────────────────────────────
    {
      id: 6,
      text: "During the past month, how often have you had trouble sleeping because you…",
      subText: "Wake up in the middle of the night or early morning",
      inputType: "radio",
      optionLabels: FREQ_LABELS,
    },
    {
      id: 7,
      text: "During the past month, how often have you had trouble sleeping because you…",
      subText: "Have to get up to use the bathroom",
      inputType: "radio",
      optionLabels: FREQ_LABELS,
    },
    {
      id: 8,
      text: "During the past month, how often have you had trouble sleeping because you…",
      subText: "Cannot breathe comfortably",
      inputType: "radio",
      optionLabels: FREQ_LABELS,
    },
    {
      id: 9,
      text: "During the past month, how often have you had trouble sleeping because you…",
      subText: "Cough or snore loudly",
      inputType: "radio",
      optionLabels: FREQ_LABELS,
    },
    {
      id: 10,
      text: "During the past month, how often have you had trouble sleeping because you…",
      subText: "Feel too cold",
      inputType: "radio",
      optionLabels: FREQ_LABELS,
    },
    {
      id: 11,
      text: "During the past month, how often have you had trouble sleeping because you…",
      subText: "Feel too hot",
      inputType: "radio",
      optionLabels: FREQ_LABELS,
    },
    {
      id: 12,
      text: "During the past month, how often have you had trouble sleeping because you…",
      subText: "Have bad dreams",
      inputType: "radio",
      optionLabels: FREQ_LABELS,
    },
    {
      id: 13,
      text: "During the past month, how often have you had trouble sleeping because you…",
      subText: "Have pain",
      inputType: "radio",
      optionLabels: FREQ_LABELS,
    },

    // ── Q6: Sleep medication ──────────────────────────────────────────────
    {
      id: 14,
      text: "During the past month, how often have you taken medicine to help you sleep?",
      subText: "(Prescribed or over-the-counter)",
      inputType: "radio",
      optionLabels: FREQ_LABELS,
    },

    // ── Q7: Daytime dysfunction – staying awake ───────────────────────────
    {
      id: 15,
      text: "During the past month, how often have you had trouble staying awake while driving, eating meals, or engaging in social activity?",
      inputType: "radio",
      optionLabels: FREQ_LABELS,
    },

    // ── Q8: Daytime dysfunction – enthusiasm ─────────────────────────────
    {
      id: 16,
      text: "During the past month, how much of a problem has it been for you to keep up enough enthusiasm to get things done?",
      inputType: "radio",
      optionLabels: ENTHUSIASM_LABELS,
    },

    // ── Q9: Overall sleep quality ─────────────────────────────────────────
    {
      id: 17,
      text: "During the past month, how would you rate your sleep quality overall?",
      inputType: "radio",
      optionLabels: SLEEP_QUALITY_LABELS,
    },
  ],
};