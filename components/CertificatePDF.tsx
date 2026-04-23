"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
  },
  outerBorder: {
    flex: 1,
    border: "8px solid #1E40AF",
    padding: 4,
  },
  innerBorder: {
    flex: 1,
    border: "2px solid #3B82F6",
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  orgName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E40AF",
    letterSpacing: 3,
    marginBottom: 8,
    textAlign: "center",
  },
  tagline: {
    fontSize: 11,
    color: "#6B7280",
    letterSpacing: 2,
    marginBottom: 28,
    textAlign: "center",
  },
  divider: {
    width: 80,
    height: 2,
    backgroundColor: "#1E40AF",
    marginBottom: 28,
  },
  certTitle: {
    fontSize: 20,
    color: "#374151",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 1,
  },
  certifyText: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
    textAlign: "center",
  },
  studentName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  completedText: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
    textAlign: "center",
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 20,
    textAlign: "center",
  },
  dateRow: {
    flexDirection: "row",
    gap: 24,
    marginTop: 8,
    marginBottom: 24,
  },
  dateText: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
  },
  certNumber: {
    fontSize: 9,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 16,
    letterSpacing: 1,
  },
});

interface CertificatePDFProps {
  studentName: string;
  courseTitle: string;
  completionDate: string;
  certificateNumber: string;
}

export default function CertificatePDF({
  studentName,
  courseTitle,
  completionDate,
  certificateNumber,
}: CertificatePDFProps) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.outerBorder}>
          <View style={styles.innerBorder}>
            <Text style={styles.orgName}>CPTEDINDIA</Text>
            <Text style={styles.tagline}>CENTRE FOR PROFESSIONAL TRAINING & EDUCATION IN INDIA</Text>

            <View style={styles.divider} />

            <Text style={styles.certTitle}>CERTIFICATE OF COMPLETION</Text>
            <Text style={styles.certifyText}>This is to certify that</Text>
            <Text style={styles.studentName}>{studentName}</Text>
            <Text style={styles.completedText}>has successfully completed the course</Text>
            <Text style={styles.courseTitle}>{courseTitle}</Text>

            <View style={styles.dateRow}>
              <Text style={styles.dateText}>Date of Completion: {completionDate}</Text>
            </View>

            <Text style={styles.certNumber}>
              Certificate No: {certificateNumber}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
