"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getAllNotes, upsertNote } from "@/lib/actions/notes";
import EmptyState from "@/components/EmptyState";
import { Textarea } from "@/components/ui/textarea";
import { FileText, ExternalLink } from "lucide-react";

export default function NotesPage() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<any[]>([]);
  const [saveStatuses, setSaveStatuses] = useState<Record<string, "idle" | "saving" | "saved">>({});
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    if (session?.user.id) {
      getAllNotes(session.user.id).then(setNotes);
    }
  }, [session?.user.id]);

  const handleChange = (noteId: string, courseId: string, value: string) => {
    setNotes((prev) => prev.map((n) => n.id === noteId ? { ...n, content: value } : n));
    setSaveStatuses((prev) => ({ ...prev, [noteId]: "saving" }));

    if (timers.current[noteId]) clearTimeout(timers.current[noteId]);
    timers.current[noteId] = setTimeout(async () => {
      if (session?.user.id) {
        await upsertNote(session.user.id, courseId, value);
        setSaveStatuses((prev) => ({ ...prev, [noteId]: "saved" }));
        setTimeout(() => setSaveStatuses((prev) => ({ ...prev, [noteId]: "idle" })), 2000);
      }
    }, 1000);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Notes</h1>

      {notes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No notes yet"
          description="Your notes appear here. Start writing notes while studying lessons."
          actionLabel="Go to My Courses"
          actionHref="/app/courses"
        />
      ) : (
        <div className="space-y-6">
          {notes.map((note) => (
            <div key={note.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">{note.course.title}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {saveStatuses[note.id] === "saving" ? "Saving..." : saveStatuses[note.id] === "saved" ? "Saved ✓" : ""}
                  </span>
                  <Link href={`/app/courses/${note.courseId}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                    <ExternalLink className="h-3 w-3" />
                    Go to Course
                  </Link>
                </div>
              </div>
              <Textarea
                value={note.content ?? ""}
                onChange={(e) => handleChange(note.id, note.courseId, e.target.value)}
                placeholder="Write your notes..."
                className="min-h-[120px] resize-none text-sm"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
