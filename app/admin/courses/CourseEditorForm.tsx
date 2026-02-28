"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import TipTapEditor from "@/components/TipTapEditor";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  createCourse,
  updateCourseMeta,
  createModule,
  updateModule,
  deleteModule,
  reorderModules,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
  upsertQuiz,
} from "@/lib/actions/courses";
import { slugify } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  FileQuestion,
  X,
  Save,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type QuestionData = {
  id?: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
};

type QuizData = {
  id?: string;
  title: string;
  questions: QuestionData[];
} | null;

type LessonData = {
  id: string;
  title: string;
  content: string;
  order: number;
};

type ModuleData = {
  id: string;
  title: string;
  order: number;
  lessons: LessonData[];
  quiz: QuizData;
};

type MetaData = {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  level: string;
  estimatedDuration: string;
  tags: string[];
  thumbnail: string;
  featured: boolean;
  published: boolean;
};

type Props = {
  courseId?: string;
  initialMeta?: MetaData;
  initialModules?: ModuleData[];
};

// ─── Sortable Lesson ──────────────────────────────────────────────────────────

function SortableLesson({
  lesson,
  isEditing,
  onEditToggle,
  onSave,
  onDelete,
}: {
  lesson: LessonData;
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: (lessonId: string, data: { title: string; content: string }) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lesson.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const [title, setTitle] = useState(lesson.title);
  const [content, setContent] = useState(lesson.content ?? "");

  return (
    <div ref={setNodeRef} style={style} className="mb-2">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-300 hover:text-gray-500 touch-none"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="flex-1 text-sm text-gray-700 truncate">{lesson.title}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={onEditToggle}
          className="text-xs text-blue-600 h-7 px-2"
        >
          {isEditing ? "Close" : "Edit Content"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className="text-xs text-red-400 h-7 px-2"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {isEditing && (
        <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg">
          <div className="mb-3">
            <Label className="text-xs font-medium">Lesson Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 text-sm"
            />
          </div>
          <div className="mb-3">
            <Label className="text-xs font-medium">Lesson Content</Label>
            <div className="mt-1">
              <TipTapEditor
                content={content}
                onChange={setContent}
                placeholder="Write lesson content..."
              />
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => onSave(lesson.id, { title, content })}
            className="bg-blue-600 hover:bg-blue-700 text-xs"
          >
            <Save className="h-3.5 w-3.5 mr-1" /> Save Lesson
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Sortable Module ──────────────────────────────────────────────────────────

function SortableModule({
  module,
  onModuleDeleted,
}: {
  module: ModuleData;
  onModuleDeleted: (moduleId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: module.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [expanded, setExpanded] = useState(true);
  const [title, setTitle] = useState(module.title);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizTitle, setQuizTitle] = useState(module.quiz?.title ?? "Module Quiz");
  const [questions, setQuestions] = useState<QuestionData[]>(
    module.quiz?.questions ?? []
  );
  const [lessons, setLessons] = useState<LessonData[]>(module.lessons ?? []);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "module" | "lesson";
    id: string;
    title: string;
  } | null>(null);
  const [savingQuiz, setSavingQuiz] = useState(false);

  const lessonSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleTitleBlur = async () => {
    if (title !== module.title) {
      const result = await updateModule(module.id, title);
      if (!result.success) toast.error("Failed to update module title");
    }
  };

  const handleAddLesson = async () => {
    const res = await createLesson(module.id, "New Lesson");
    if (res.success && res.lesson) {
      setLessons((prev) => [
        ...prev,
        { id: res.lesson!.id, title: res.lesson!.title, content: "", order: res.lesson!.order },
      ]);
      setEditingLesson(res.lesson.id);
    } else {
      toast.error("Failed to create lesson");
    }
  };

  const handleSaveLesson = async (
    lessonId: string,
    data: { title: string; content: string }
  ) => {
    const result = await updateLesson(lessonId, data);
    if (result.success) {
      setLessons((prev) =>
        prev.map((l) => (l.id === lessonId ? { ...l, ...data } : l))
      );
      toast.success("Lesson saved");
    } else {
      toast.error("Failed to save lesson");
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    const result = await deleteLesson(lessonId);
    if (result.success) {
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
      toast.success("Lesson deleted");
    } else {
      toast.error("Failed to delete lesson");
    }
    setDeleteTarget(null);
  };

  const handleDeleteModule = async () => {
    const result = await deleteModule(module.id);
    if (result.success) {
      onModuleDeleted(module.id);
      toast.success("Module deleted");
    } else {
      toast.error("Failed to delete module");
    }
    setDeleteTarget(null);
  };

  const handleLessonDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = lessons.findIndex((l) => l.id === active.id);
    const newIdx = lessons.findIndex((l) => l.id === over.id);
    const reordered = arrayMove(lessons, oldIdx, newIdx);
    setLessons(reordered);
    await reorderLessons(
      module.id,
      reordered.map((l) => l.id)
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        text: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "A",
        explanation: "",
      },
    ]);
  };

  const handleSaveQuiz = async () => {
    setSavingQuiz(true);
    const result = await upsertQuiz(module.id, { title: quizTitle, questions });
    if (result.success) {
      toast.success("Quiz saved");
      setShowQuiz(false);
    } else {
      toast.error("Failed to save quiz");
    }
    setSavingQuiz(false);
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Module header */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-100">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-400 hover:text-gray-600 touch-none"
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          className="flex-1 border-0 shadow-none p-0 text-sm font-semibold focus:ring-0 h-auto"
          placeholder="Module title"
        />
        <div className="flex items-center gap-1 ml-auto">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowQuiz(!showQuiz)}
            className="text-xs text-blue-600"
          >
            <FileQuestion className="h-4 w-4 mr-1" />
            {module.quiz ? "Edit Quiz" : "Add Quiz"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-red-600"
            onClick={() =>
              setDeleteTarget({ type: "module", id: module.id, title })
            }
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Quiz editor */}
      {showQuiz && (
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <h4 className="text-sm font-bold text-blue-800 mb-3">Quiz Editor</h4>
          <div className="mb-3">
            <Label className="text-xs">Quiz Title</Label>
            <Input
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="mt-1 text-sm"
            />
          </div>
          {questions.map((q, qi) => (
            <div
              key={qi}
              className="bg-white rounded-lg border border-gray-200 p-3 mb-3"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <Label className="text-xs text-gray-500">
                  Question {qi + 1}
                </Label>
                <button
                  onClick={() =>
                    setQuestions((prev) => prev.filter((_, i) => i !== qi))
                  }
                  className="text-red-400 hover:text-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <Textarea
                value={q.text}
                onChange={(e) =>
                  setQuestions((prev) =>
                    prev.map((item, i) =>
                      i === qi ? { ...item, text: e.target.value } : item
                    )
                  )
                }
                placeholder="Question text"
                className="mb-2 text-sm resize-none"
                rows={2}
              />
              <div className="grid grid-cols-2 gap-2 mb-2">
                {(["A", "B", "C", "D"] as const).map((opt) => (
                  <div key={opt} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${module.id}-${qi}`}
                      value={opt}
                      checked={q.correctAnswer === opt}
                      onChange={() =>
                        setQuestions((prev) =>
                          prev.map((item, i) =>
                            i === qi ? { ...item, correctAnswer: opt } : item
                          )
                        )
                      }
                      className="text-blue-600"
                    />
                    <Input
                      value={q[`option${opt}` as keyof QuestionData] as string}
                      onChange={(e) =>
                        setQuestions((prev) =>
                          prev.map((item, i) =>
                            i === qi
                              ? { ...item, [`option${opt}`]: e.target.value }
                              : item
                          )
                        )
                      }
                      placeholder={`Option ${opt}`}
                      className="text-xs h-8"
                    />
                  </div>
                ))}
              </div>
              <Input
                value={q.explanation ?? ""}
                onChange={(e) =>
                  setQuestions((prev) =>
                    prev.map((item, i) =>
                      i === qi
                        ? { ...item, explanation: e.target.value }
                        : item
                    )
                  )
                }
                placeholder="Explanation (shown after answer)"
                className="text-xs h-8"
              />
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={addQuestion}
              className="text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Question
            </Button>
            <Button
              size="sm"
              onClick={handleSaveQuiz}
              disabled={savingQuiz}
              className="text-xs bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-3.5 w-3.5 mr-1" />
              {savingQuiz ? "Saving..." : "Save Quiz"}
            </Button>
          </div>
        </div>
      )}

      {/* Lessons */}
      {expanded && (
        <div className="p-3">
          <DndContext
            sensors={lessonSensors}
            collisionDetection={closestCenter}
            onDragEnd={handleLessonDragEnd}
          >
            <SortableContext
              items={lessons.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              {lessons.map((lesson) => (
                <SortableLesson
                  key={lesson.id}
                  lesson={lesson}
                  isEditing={editingLesson === lesson.id}
                  onEditToggle={() =>
                    setEditingLesson(
                      editingLesson === lesson.id ? null : lesson.id
                    )
                  }
                  onSave={handleSaveLesson}
                  onDelete={() =>
                    setDeleteTarget({
                      type: "lesson",
                      id: lesson.id,
                      title: lesson.title,
                    })
                  }
                />
              ))}
            </SortableContext>
          </DndContext>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddLesson}
            className="mt-2 text-xs w-full border-dashed"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Lesson
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          if (deleteTarget.type === "module") {
            await handleDeleteModule();
          } else {
            await handleDeleteLesson(deleteTarget.id);
          }
        }}
        title={
          deleteTarget?.type === "module" ? "Delete Module" : "Delete Lesson"
        }
        description={`Are you sure you want to delete "${deleteTarget?.title ?? ""}"? This cannot be undone.`}
        confirmLabel={
          deleteTarget?.type === "module" ? "Delete Module" : "Delete Lesson"
        }
      />
    </div>
  );
}

// ─── Main CourseEditorForm ────────────────────────────────────────────────────

const DEFAULT_META: MetaData = {
  title: "",
  slug: "",
  shortDescription: "",
  fullDescription: "",
  price: 0,
  level: "BEGINNER",
  estimatedDuration: "",
  tags: [],
  thumbnail: "",
  featured: false,
  published: false,
};

export default function CourseEditorForm({
  courseId: initialCourseId,
  initialMeta,
  initialModules,
}: Props) {
  const router = useRouter();
  const [courseId, setCourseId] = useState<string | undefined>(initialCourseId);
  const [meta, setMeta] = useState<MetaData>(initialMeta ?? DEFAULT_META);
  const [tagInput, setTagInput] = useState("");
  const [modules, setModules] = useState<ModuleData[]>(initialModules ?? []);
  const [savingMeta, setSavingMeta] = useState(false);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);

  const moduleSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleTitleChange = (value: string) => {
    setMeta((m) => ({
      ...m,
      title: value,
      slug: !courseId ? slugify(value) : m.slug,
    }));
  };

  const handleSaveMeta = async () => {
    if (!meta.title.trim()) {
      toast.error("Course title is required");
      return;
    }
    setSavingMeta(true);
    const data = {
      ...meta,
      price: Number(meta.price),
    };

    if (courseId) {
      const result = await updateCourseMeta(courseId, data);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Course meta saved!");
      }
    } else {
      const result = await createCourse(data);
      if (result.error) {
        toast.error(result.error);
      } else if (result.courseId) {
        setCourseId(result.courseId);
        toast.success("Course created!");
        router.push(`/admin/courses/${result.courseId}/edit`);
      }
    }
    setSavingMeta(false);
  };

  const handleAddModule = async () => {
    if (!courseId) {
      toast.error("Save course meta first to add modules");
      return;
    }
    const res = await createModule(courseId, "New Module");
    if (res.success && res.module) {
      setModules((prev) => [
        ...prev,
        {
          id: res.module!.id,
          title: res.module!.title,
          order: res.module!.order,
          lessons: [],
          quiz: null,
        },
      ]);
      toast.success("Module added");
    } else {
      toast.error("Failed to add module");
    }
  };

  const handleModuleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = modules.findIndex((m) => m.id === active.id);
    const newIdx = modules.findIndex((m) => m.id === over.id);
    const reordered = arrayMove(modules, oldIdx, newIdx);
    setModules(reordered);
    if (courseId) {
      await reorderModules(
        courseId,
        reordered.map((m) => m.id)
      );
    }
  };

  const handleThumbnailUpload = async (file: File) => {
    setThumbnailUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setMeta((m) => ({ ...m, thumbnail: data.url }));
    } catch {
      toast.error("Upload failed");
    }
    setThumbnailUploading(false);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!meta.tags.includes(newTag)) {
        setMeta((m) => ({ ...m, tags: [...m.tags, newTag] }));
      }
      setTagInput("");
    }
  };

  return (
    <div>
      <Tabs defaultValue="meta">
        <TabsList className="mb-6">
          <TabsTrigger value="meta">Meta</TabsTrigger>
          <TabsTrigger value="curriculum" disabled={!courseId}>
            Modules &amp; Lessons
          </TabsTrigger>
        </TabsList>

        {/* ─── META TAB ─── */}
        <TabsContent value="meta" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Course Title *</Label>
              <Input
                value={meta.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="mt-1"
                placeholder="e.g. Python for Beginners"
              />
            </div>
            <div>
              <Label>
                Slug (URL){" "}
                {!courseId && (
                  <span className="text-xs text-gray-400 font-normal ml-1">
                    Auto-generated from title
                  </span>
                )}
              </Label>
              <Input
                value={meta.slug}
                onChange={(e) => setMeta((m) => ({ ...m, slug: e.target.value }))}
                className="mt-1 font-mono text-sm"
                placeholder="python-for-beginners"
              />
            </div>
          </div>

          <div>
            <Label>Short Description (~200 characters)</Label>
            <Textarea
              value={meta.shortDescription}
              onChange={(e) =>
                setMeta((m) => ({ ...m, shortDescription: e.target.value }))
              }
              rows={2}
              className="mt-1 resize-none"
              placeholder="Brief course summary shown on cards"
            />
          </div>

          <div>
            <Label>Full Description (Rich Text)</Label>
            <div className="mt-1">
              <TipTapEditor
                content={meta.fullDescription}
                onChange={(html) =>
                  setMeta((m) => ({ ...m, fullDescription: html }))
                }
                placeholder="Write the full course description..."
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Price (₹)</Label>
              <Input
                type="number"
                value={meta.price}
                onChange={(e) =>
                  setMeta((m) => ({ ...m, price: Number(e.target.value) }))
                }
                className="mt-1"
                min={0}
              />
            </div>
            <div>
              <Label>Level</Label>
              <select
                value={meta.level}
                onChange={(e) =>
                  setMeta((m) => ({ ...m, level: e.target.value }))
                }
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
            <div>
              <Label>Estimated Duration</Label>
              <Input
                value={meta.estimatedDuration}
                onChange={(e) =>
                  setMeta((m) => ({ ...m, estimatedDuration: e.target.value }))
                }
                className="mt-1"
                placeholder="e.g. 12 hours"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mt-1 mb-1 min-h-[2rem]">
              {meta.tags.map((tag) => (
                <Badge
                  key={tag}
                  className="bg-blue-100 text-blue-800 flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() =>
                      setMeta((m) => ({
                        ...m,
                        tags: m.tags.filter((t) => t !== tag),
                      }))
                    }
                    className="ml-1 hover:text-blue-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Type a tag and press Enter"
              className="mt-1"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <Label>Thumbnail URL</Label>
            <Input
              value={meta.thumbnail}
              onChange={(e) =>
                setMeta((m) => ({ ...m, thumbnail: e.target.value }))
              }
              className="mt-1"
              placeholder="https://example.com/image.jpg"
            />
            {meta.thumbnail && (
              <div className="mt-2">
                <img
                  src={meta.thumbnail}
                  alt="Thumbnail preview"
                  className="h-32 rounded-lg object-cover border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <div
              className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => document.getElementById("thumb-upload")?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleThumbnailUpload(file);
              }}
            >
              <p className="text-xs text-gray-400">
                {thumbnailUploading
                  ? "Uploading..."
                  : "Or drop/click to upload image file"}
              </p>
            </div>
            <input
              id="thumb-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleThumbnailUpload(f);
              }}
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={meta.featured}
                onCheckedChange={(val) =>
                  setMeta((m) => ({ ...m, featured: val }))
                }
                id="featured"
              />
              <Label htmlFor="featured">Featured on homepage</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={meta.published}
                onCheckedChange={(val) =>
                  setMeta((m) => ({ ...m, published: val }))
                }
                id="published"
              />
              <Label htmlFor="published">Published (visible to students)</Label>
            </div>
          </div>

          <Button
            onClick={handleSaveMeta}
            disabled={savingMeta}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {savingMeta
              ? "Saving..."
              : courseId
              ? "Save Meta"
              : "Create Course"}
          </Button>
        </TabsContent>

        {/* ─── CURRICULUM TAB ─── */}
        <TabsContent value="curriculum">
          {!courseId ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 mb-4">
                <BookOpen className="h-7 w-7 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">
                Save course meta first to add modules.
              </p>
            </div>
          ) : (
            <>
              <DndContext
                sensors={moduleSensors}
                collisionDetection={closestCenter}
                onDragEnd={handleModuleDragEnd}
              >
                <SortableContext
                  items={modules.map((m) => m.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {modules.map((mod) => (
                      <SortableModule
                        key={mod.id}
                        module={mod}
                        onModuleDeleted={(id) =>
                          setModules((prev) =>
                            prev.filter((m) => m.id !== id)
                          )
                        }
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <Button
                onClick={handleAddModule}
                variant="outline"
                className="mt-4 w-full border-dashed border-2 text-blue-600 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Module
              </Button>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
