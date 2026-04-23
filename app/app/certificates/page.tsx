"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import CertificatePDF from "@/components/CertificatePDF";
import { Award, Download } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getCertificates } from "@/lib/actions/certificates";

export default function CertificatesPage() {
  const { data: session } = useSession();
  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    if (session?.user.id) {
      getCertificates(session.user.id).then(setCertificates);
    }
  }, [session?.user.id]);

  const handleDownload = async (cert: any) => {
    const doc = (
      <CertificatePDF
        studentName={session?.user.name ?? "Student"}
        courseTitle={cert.course.title}
        completionDate={formatDate(cert.issuedAt)}
        certificateNumber={cert.certificateNumber}
      />
    );
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `certificate-${cert.certificateNumber}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Certificates</h1>

      {certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates yet"
          description="Complete all lessons and pass all module quizzes in a course to earn your certificate."
          actionLabel="Go to My Courses"
          actionHref="/app/courses"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 mb-4">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{cert.course.title}</h3>
              <p className="text-xs text-gray-500 mb-1">Certificate of Completion</p>
              <p className="text-xs text-gray-400 mb-1">Issued: {formatDate(cert.issuedAt)}</p>
              <p className="text-xs text-gray-400 font-mono mb-4">{cert.certificateNumber}</p>
              <Button
                size="sm"
                onClick={() => handleDownload(cert)}
                className="w-full bg-blue-700 hover:bg-blue-800 flex items-center gap-2"
              >
                <Download className="h-3.5 w-3.5" />
                Download Certificate
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
