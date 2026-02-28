"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import TipTapContent from "@/components/TipTapContent";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Circle, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, FileQuestion } from "lucide-react";
import { markLessonComplete } from "@/lib/actions/progress";
import { upsertNote, getNote } from "@/lib/actions/notes";
import { getCourseById } from "@/lib/actions/courses";
import { getEnrollmentWithProgress } from "@/lib/actions/enrollments";
import { getCompletedLessonIds } from "@/lib/actions/progress";
import { toast } from "sonner";

export default function LessonReaderPage() {
  const params = useParams<{ courseId: string; lessonId: string }>();
  const { courseId, lessonId } = params;
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [course, setCourse] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [marking, setMarking] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [noteSaveStatus, setNoteSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentLesson = course?.modules
    .flatMap((m: any) => m.lessons)
    .find((l: any) => l.id === lessonId);

  const currentModule = course?.modules.find((m: any) =>
    m.lessons.some((l: any) => l.id === lessonId)
  );

  const allLessons = course?.modules.flatMap((m: any) => m.lessons) ?? [];
  const currentIndex = allLessons.findIndex((l: any) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const allModuleLessonsDone = currentModule
    ? currentModule.lessons.every((l: any) => completedLessonIds.includes(l.id))
    : false;

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      getCourseById(courseId),
      getEnrollmentWithProgress(userId, courseId),
      getNote(userId, courseId),
    ]).then(([c, e, note]) => {
      setCourse(c);
      setEnrollment(e);
      setNoteContent(note?.content ?? "");
      if (c) {
        const allIds = c.modules.flatMap((m: any) => m.lessons.map((l: any) => l.id));
        getCompletedLessonIds(userId, allIds).then(setCompletedLessonIds);
      }
    });
  }, [userId, courseId, lessonId]);

  useEffect(() => {
    setIsComplete(completedLessonIds.includes(lessonId));
  }, [completedLessonIds, lessonId]);

  const handleMarkComplete = async () => {
    if (!userId || isComplete) return;
    setMarking(true);
    const result = await markLessonComplete(userId, lessonId, courseId);
    if (result.success) {
      setIsComplete(true);
      setCompletedLessonIds((prev) => [...prev, lessonId]);
      toast.success("Lesson marked as complete!");
    }
    setMarking(false);
  };

  const handleNoteChange = useCallback(
    (value: string) => {
      setNoteContent(value);
      setNoteSaveStatus("saving");
      if (noteTimer.current) clearTimeout(noteTimer.current);
      noteTimer.current = setTimeout(async () => {
        if (userId) {
          await upsertNote(userId, courseId, value);
          setNoteSaveStatus("saved");
          setTimeout(() => setNoteSaveStatus("idle"), 2000);
        }
      }, 1000);
    },
    [userId, courseId]
  );

  if (!course || !currentLesson) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left sidebar — navigation */}
      <div className={`${leftOpen ? "w-64" : "w-0"} transition-all duration-300 overflow-hidden border-r border-gray-200 bg-white flex-shrink-0`}>
        <div className="h-full overflow-y-auto p-3">
          <div className="mb-3">
            <Link href={`/app/courses/${courseId}`} className="text-xs text-blue-600 hover:underline">← Back to Course</Link>
            <h2 className="text-sm font-bold text-gray-900 mt-2 truncate">{course.title}</h2>
          </div>
          {course.modules.map((module: any) => (
            <div key={module.id} className="mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 px-2">{module.title}</p>
              {module.lessons.map((lesson: any) => {
                const done = completedLessonIds.includes(lesson.id);
                const active = lesson.id === lessonId;
                return (
                  <Link
                    key={lesson.id}
                    href={`/app/courses/${courseId}/lessons/${lesson.id}`}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${active ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    {done ? (
                      <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
                    )}
                    <span className="truncate">{lesson.title}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white border-b border-gray-200 px-4 py-2">
          <button onClick={() => setLeftOpen(!leftOpen)} className="p-1.5 rounded hover:bg-gray-100">
            {leftOpen ? <PanelLeftClose className="h-4 w-4 text-gray-600" /> : <PanelLeftOpen className="h-4 w-4 text-gray-600" />}
          </button>
          <span className="text-sm font-medium text-gray-700 truncate max-w-xs">{currentLesson.title}</span>
          <button onClick={() => setRightOpen(!rightOpen)} className="p-1.5 rounded hover:bg-gray-100">
            {rightOpen ? <PanelRightClose className="h-4 w-4 text-gray-600" /> : <PanelRightOpen className="h-4 w-4 text-gray-600" />}
          </button>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{currentLesson.title}</h1>

          {currentLesson.content ? (
            <TipTapContent content={currentLesson.content} />
          ) : (
            <p className="text-gray-400 italic">No content for this lesson yet.</p>
          )}

          {/* Module quiz prompt */}
          {isComplete && allModuleLessonsDone && currentModule?.quiz && (
            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <FileQuestion className="h-5 w-5" />
                You've completed all lessons in this module!
              </p>
              <p className="text-sm text-blue-700 mb-3">Take the Module Quiz to complete this module.</p>
              <Link href={`/app/courses/${courseId}/quiz/${currentModule.id}`}>
                <Button size="sm" className="bg-blue-700 hover:bg-blue-800">Take Module Quiz</Button>
              </Link>
            </div>
          )}

          {/* Mark complete button */}
          <div className="mt-10 py-6 border-t border-gray-200">
            {isComplete ? (
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <CheckCircle className="h-6 w-6" />
                Completed ✓
              </div>
            ) : (
              <Button
                onClick={handleMarkComplete}
                disabled={marking}
                size="lg"
                className="bg-blue-700 hover:bg-blue-800"
              >
                {marking ? "Saving..." : "Mark as Complete"}
              </Button>
            )}
          </div>

          {/* Prev / Next navigation */}
          <div className="flex justify-between pt-4">
            {prevLesson ? (
              <Link href={`/app/courses/${courseId}/lessons/${prevLesson.id}`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
              </Link>
            ) : <div />}
            {nextLesson ? (
              <Link href={`/app/courses/${courseId}/lessons/${nextLesson.id}`}>
                <Button className="bg-blue-700 hover:bg-blue-800 flex items-center gap-2">
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : <div />}
          </div>
        </div>
      </div>

      {/* Right sidebar — notes */}
      <div className={`${rightOpen ? "w-72" : "w-0"} transition-all duration-300 overflow-hidden border-l border-gray-200 bg-white flex-shrink-0`}>
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900">My Notes</h3>
            <span className="text-xs text-gray-400">
              {noteSaveStatus === "saving" ? "Saving..." : noteSaveStatus === "saved" ? "Saved ✓" : ""}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-2">Notes are saved per course and visible from all lessons.</p>
          <Textarea
            value={noteContent}
            onChange={(e) => handleNoteChange(e.target.value)}
            placeholder="Write your notes here..."
            className="flex-1 resize-none text-sm border-gray-200 min-h-[200px]"
          />
        </div>
      </div>
    </div>
  );
}
