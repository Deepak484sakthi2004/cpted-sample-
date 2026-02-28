"use client";

import { useState, useEffect } from "react";
import { getEmailTemplates, updateEmailTemplate } from "@/lib/actions/admin";
import TipTapEditor from "@/components/TipTapEditor";
import TipTapContent from "@/components/TipTapContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Eye, Edit3, Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const TOKEN_VARIABLES = [
  { key: "student_name", label: "Student Name" },
  { key: "course_name", label: "Course Name" },
  { key: "certificate_number", label: "Certificate Number" },
  { key: "issued_date", label: "Issued Date" },
];

const SAMPLE_VALUES: Record<string, string> = {
  student_name: "Rahul Sharma",
  course_name: "Python Programming Fundamentals",
  certificate_number: "CPTE-1234567890-ABC123",
  issued_date: new Date().toLocaleDateString("en-IN"),
};

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const [previewing, setPreviewing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    getEmailTemplates().then((data) => {
      setTemplates(data);
      if (data.length > 0) {
        selectTemplate(data[0]);
      }
    });
  }, []);

  const selectTemplate = (t: any) => {
    setSelected(t);
    setEditSubject(t.subject);
    setEditBody(t.body);
    setPreviewing(false);
    setDirty(false);
  };

  const getPreviewHtml = () => {
    if (!editBody) return "";
    let body = editBody;
    for (const [key, value] of Object.entries(SAMPLE_VALUES)) {
      body = body.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
    }
    return body;
  };

  const getPreviewSubject = () => {
    if (!editSubject) return "";
    let subject = editSubject;
    for (const [key, value] of Object.entries(SAMPLE_VALUES)) {
      subject = subject.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
    }
    return subject;
  };

  const insertVariable = (key: string) => {
    setEditBody((prev) => prev + ` {{${key}}}`);
    setDirty(true);
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    const result = await updateEmailTemplate(selected.id, {
      subject: editSubject,
      body: editBody,
    });
    if (result.success) {
      toast.success("Template saved!");
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === selected.id
            ? { ...t, subject: editSubject, body: editBody }
            : t
        )
      );
      setSelected((prev: any) => ({ ...prev, subject: editSubject, body: editBody }));
      setDirty(false);
    } else {
      toast.error(result.error ?? "Save failed");
    }
    setSaving(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Email Templates</h1>

      <div className="flex gap-6">
        {/* Left panel — template list */}
        <div className="w-64 flex-shrink-0 space-y-2">
          {templates.length === 0 && (
            <p className="text-sm text-gray-400 py-4 text-center">
              No templates found.
            </p>
          )}
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTemplate(t)}
              className={`w-full text-left rounded-xl border p-4 transition-all ${
                selected?.id === t.id
                  ? "border-blue-300 bg-blue-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                    selected?.id === t.id ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  <Mail
                    className={`h-4 w-4 ${
                      selected?.id === t.id ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${
                      selected?.id === t.id ? "text-blue-900" : "text-gray-900"
                    }`}
                  >
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {t.subject}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Right panel — editor */}
        {selected ? (
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Editor header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
              <div>
                <h2 className="font-bold text-gray-900">{selected.name}</h2>
                {dirty && (
                  <p className="text-xs text-amber-600 mt-0.5">Unsaved changes</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPreviewing(!previewing)}
                  className="flex items-center gap-1 text-xs"
                >
                  <Eye className="h-3.5 w-3.5" />
                  {previewing ? "Edit" : "Preview"}
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving || !dirty}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1 text-xs disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Save className="h-3.5 w-3.5" /> Saving...
                    </>
                  ) : !dirty ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Saved
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" /> Save Template
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="p-5">
              {previewing ? (
                /* Preview mode */
                <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Subject (Preview)
                  </p>
                  <p className="text-sm font-medium text-gray-800 mb-4">
                    {getPreviewSubject()}
                  </p>
                  <hr className="border-gray-200 mb-4" />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Body (Preview)
                  </p>
                  <div className="bg-white rounded-lg border border-gray-100 p-4">
                    <TipTapContent content={getPreviewHtml()} />
                  </div>
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    Sample values used for preview
                  </p>
                </div>
              ) : (
                /* Edit mode */
                <div className="space-y-5">
                  {/* Subject */}
                  <div>
                    <Label>Subject Line</Label>
                    <Input
                      value={editSubject}
                      onChange={(e) => {
                        setEditSubject(e.target.value);
                        setDirty(true);
                      }}
                      className="mt-1"
                      placeholder="Enter email subject..."
                    />
                  </div>

                  {/* Variable token chips */}
                  <div>
                    <Label>
                      Variable Tokens{" "}
                      <span className="text-xs text-gray-400 font-normal ml-1">
                        Click to insert into body
                      </span>
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {TOKEN_VARIABLES.map(({ key, label }) => (
                        <button
                          key={key}
                          onClick={() => insertVariable(key)}
                          title={`Insert {{${key}}}`}
                          className="px-3 py-1 text-xs bg-blue-50 border border-blue-200 text-blue-700 rounded-full hover:bg-blue-100 active:bg-blue-200 transition-colors font-mono"
                        >
                          {`{{${key}}}`}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 gap-x-4 mt-2">
                      {TOKEN_VARIABLES.map(({ key, label }) => (
                        <p key={key} className="text-xs text-gray-400">
                          <span className="font-mono text-blue-600">{`{{${key}}}`}</span>
                          {" → "}
                          {label}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Body editor */}
                  <div>
                    <Label>Email Body</Label>
                    <div className="mt-1">
                      <TipTapEditor
                        content={editBody}
                        onChange={(html) => {
                          setEditBody(html);
                          setDirty(true);
                        }}
                        placeholder="Write email body content..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white rounded-xl border border-gray-200 shadow-sm py-20">
            <div className="text-center">
              <Mail className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">
                Select a template to edit
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
