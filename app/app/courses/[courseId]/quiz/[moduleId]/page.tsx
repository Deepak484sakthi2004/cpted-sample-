"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCourseById } from "@/lib/actions/courses";
import { submitQuizAttempt } from "@/lib/actions/progress";
import { getGradeColor } from "@/lib/utils";
import { CheckCircle, XCircle, Trophy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function QuizPage() {
  const params = useParams<{ courseId: string; moduleId: string }>();
  const { courseId, moduleId } = params;
  const { data: session } = useSession();
  const router = useRouter();

  const [quiz, setQuiz] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCourseById(courseId).then((c) => {
      const mod = c?.modules.find((m: any) => m.id === moduleId);
      setQuiz(mod?.quiz ?? null);
    });
  }, [courseId, moduleId]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!session?.user.id || !quiz) return;
    setSubmitting(true);

    const answerList = quiz.questions.map((q: any) => ({
      questionId: q.id,
      selectedAnswer: answers[q.id] ?? "",
    }));

    const res = await submitQuizAttempt({
      userId: session.user.id,
      quizId: quiz.id,
      courseId,
      moduleId,
      answers: answerList,
    });

    if (res.success) {
      setResult(res);
      setSubmitted(true);
      if (res.passed) {
        toast.success(`Quiz passed! Grade ${res.grade}`);
      }
    } else {
      toast.error("Failed to submit quiz");
    }
    setSubmitting(false);
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrent(0);
    setSubmitted(false);
    setResult(null);
  };

  if (!quiz) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const questions = quiz.questions;
  const currentQ = questions[current];

  if (submitted && result) {
    return (
      <div className="p-6 max-w-3xl">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className={`flex h-20 w-20 items-center justify-center rounded-full ${result.passed ? "bg-green-100" : "bg-red-100"}`}>
              <Trophy className={`h-10 w-10 ${result.passed ? "text-green-600" : "text-red-400"}`} />
            </div>
          </div>
          <p className="text-5xl font-bold text-gray-900 mb-2">{result.score}%</p>
          <span className={`inline-block px-4 py-2 rounded-full text-2xl font-bold ${getGradeColor(result.grade)}`}>
            Grade {result.grade}
          </span>
          <p className="mt-4 text-gray-600">
            {result.grade === "A" ? "Excellent!" : result.grade === "B" ? "Good job!" : result.grade === "C" ? "You passed!" : "Keep practicing!"}
          </p>
        </div>

        {/* Per-question review */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">Question Review</h2>
        <div className="space-y-4 mb-6">
          {result.attempt.answers.map((a: any, i: number) => (
            <div key={a.questionId} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="font-medium text-gray-900 mb-3">
                {i + 1}. {a.question.text}
              </p>
              {["A", "B", "C", "D"].map((opt) => {
                const text = a.question[`option${opt}`];
                const isSelected = a.selectedAnswer === opt;
                const isCorrect = a.question.correctAnswer === opt;
                return (
                  <div
                    key={opt}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 text-sm ${
                      isCorrect ? "bg-green-50 text-green-800" : isSelected && !isCorrect ? "bg-red-50 text-red-800" : "text-gray-600"
                    }`}
                  >
                    {isCorrect ? <CheckCircle className="h-4 w-4 text-green-600" /> : isSelected ? <XCircle className="h-4 w-4 text-red-500" /> : <span className="h-4 w-4" />}
                    <span className="font-medium mr-1">{opt}.</span> {text}
                  </div>
                );
              })}
              {a.question.explanation && (
                <div className="mt-2 px-3 py-2 bg-gray-50 rounded-lg text-xs text-gray-500">
                  💡 {a.question.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Link href={`/app/courses/${courseId}`}>
            <Button variant="outline">Back to Course</Button>
          </Link>
          {!result.passed && (
            <Button onClick={handleRetake} className="bg-blue-700 hover:bg-blue-800 flex items-center gap-2">
              <RefreshCw className="h-4 w-4" /> Retake Quiz
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
        <span className="text-sm text-gray-500">Question {current + 1} of {questions.length}</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full mb-6">
        <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <p className="text-lg font-semibold text-gray-900 mb-6">{currentQ.text}</p>

        <div className="space-y-3">
          {["A", "B", "C", "D"].map((opt) => {
            const text = currentQ[`option${opt}`];
            const selected = answers[currentQ.id] === opt;
            return (
              <button
                key={opt}
                onClick={() => handleAnswer(currentQ.id, opt)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                  selected
                    ? "border-blue-600 bg-blue-50 text-blue-800"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <span className={`flex-shrink-0 h-7 w-7 rounded-full border-2 flex items-center justify-center text-xs font-bold ${selected ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 text-gray-400"}`}>
                  {opt}
                </span>
                {text}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
          ← Previous
        </Button>

        {current < questions.length - 1 ? (
          <Button
            className="bg-blue-700 hover:bg-blue-800"
            onClick={() => setCurrent((c) => c + 1)}
            disabled={!answers[currentQ.id]}
          >
            Next Question →
          </Button>
        ) : (
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleSubmit}
            disabled={submitting || !answers[currentQ.id]}
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        )}
      </div>
    </div>
  );
}
