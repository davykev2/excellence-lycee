import { jsPDF } from "jspdf";
import { bacExamZoneLabel, type BacExamParticipantResult } from "../../domain/bacExam";

const navy = [8, 38, 90] as const;
const green = [45, 145, 55] as const;
const gold = [194, 137, 25] as const;
const ink = [36, 54, 78] as const;
const muted = [104, 121, 143] as const;
const pale = [244, 247, 244] as const;

function roundedAverage(values: number[]) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length * 10) / 10;
}

function fitText(doc: jsPDF, value: string, maxWidth: number) {
  const source = value.trim() || "Élève";
  if (doc.getTextWidth(source) <= maxWidth) return source;
  let shortened = source;
  while (shortened.length > 1 && doc.getTextWidth(`${shortened}…`) > maxWidth) {
    shortened = shortened.slice(0, -1);
  }
  return `${shortened.trimEnd()}…`;
}

function drawPageFooter(doc: jsPDF, pageNumber: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(219, 225, 231);
  doc.line(12, pageHeight - 10, pageWidth - 12, pageHeight - 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...muted);
  doc.text("Document administratif privé — Excellence Lycée", 12, pageHeight - 5);
  doc.text(`Page ${pageNumber}`, pageWidth - 12, pageHeight - 5, { align: "right" });
}

function drawTableHeader(doc: jsPDF, y: number, sectionLabels: readonly [string, string, string]) {
  const columns = [
    { label: "Rang", x: 12, width: 12, align: "center" as const },
    { label: "Élève", x: 24, width: 48, align: "left" as const },
    { label: "Classe", x: 72, width: 25, align: "left" as const },
    { label: "Zone", x: 97, width: 32, align: "left" as const },
    { label: sectionLabels[0], x: 129, width: 22, align: "center" as const },
    { label: sectionLabels[1], x: 151, width: 24, align: "center" as const },
    { label: sectionLabels[2], x: 175, width: 24, align: "center" as const },
    { label: "Total", x: 199, width: 24, align: "center" as const },
    { label: "Appréciation", x: 223, width: 62, align: "left" as const },
  ];

  doc.setFillColor(...navy);
  doc.roundedRect(12, y, 273, 9, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.4);
  doc.setTextColor(255, 255, 255);
  columns.forEach((column) => {
    const textX = column.align === "center" ? column.x + column.width / 2 : column.x + 2;
    doc.text(fitText(doc, column.label, column.width - 4), textX, y + 5.8, { align: column.align });
  });
  return y + 9;
}

function drawSummaryCard(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  label: string,
  value: string,
  color: readonly [number, number, number],
) {
  doc.setFillColor(249, 250, 248);
  doc.setDrawColor(226, 231, 226);
  doc.roundedRect(x, y, width, 19, 2.5, 2.5, "FD");
  doc.setFillColor(...color);
  doc.roundedRect(x + 4, y + 4, 3, 11, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12.5);
  doc.setTextColor(...navy);
  doc.text(value, x + 11, y + 9);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...muted);
  doc.text(fitText(doc, label, width - 15), x + 11, y + 14);
}

export function exportBacExamResultsPdf(
  participants: BacExamParticipantResult[],
  getLevelLabel: (levelId: string) => string,
  options: {
    title: string;
    sectionLabels: readonly [string, string, string];
    fileName: string;
  },
) {
  const ranked = [...participants].sort((left, right) => (
    right.correctAnswers - left.correctAnswers
    || left.name.localeCompare(right.name, "fr", { sensitivity: "base" })
    || left.userId.localeCompare(right.userId)
  ));

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  const generatedAt = new Intl.DateTimeFormat("fr-CI", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());

  doc.setFillColor(...navy);
  doc.rect(0, 0, 297, 27, "F");
  doc.setFillColor(...green);
  doc.rect(0, 27, 297, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(255, 255, 255);
  doc.text("EXCELLENCE LYCÉE", 12, 11);
  doc.setFontSize(11);
  doc.text(fitText(doc, `Classement — ${options.title}`, 190), 12, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(219, 230, 243);
  doc.text(`Généré le ${generatedAt}`, 285, 20, { align: "right" });

  const overallAverage = roundedAverage(ranked.map((item) => item.correctAnswers));
  const englishAverage = roundedAverage(ranked.map((item) => item.sectionScores.english.correctAnswers));
  const generalAverage = roundedAverage(ranked.map((item) => item.sectionScores.generalKnowledge.correctAnswers));
  const scientificAverage = roundedAverage(ranked.map((item) => item.sectionScores.scientificKnowledge.correctAnswers));

  drawSummaryCard(doc, 12, 34, 49, "participants classés", String(ranked.length), green);
  const firstResult = ranked[0];
  drawSummaryCard(doc, 66, 34, 49, "moyenne globale", `${overallAverage}/${firstResult?.scoreMax ?? 0}`, navy);
  drawSummaryCard(doc, 120, 34, 49, `moyenne ${options.sectionLabels[0]}`, `${englishAverage}/${firstResult?.sectionScores.english.scoreMax ?? 0}`, gold);
  drawSummaryCard(doc, 174, 34, 49, `moyenne ${options.sectionLabels[1]}`, `${generalAverage}/${firstResult?.sectionScores.generalKnowledge.scoreMax ?? 0}`, green);
  drawSummaryCard(doc, 228, 34, 57, `moyenne ${options.sectionLabels[2]}`, `${scientificAverage}/${firstResult?.sectionScores.scientificKnowledge.scoreMax ?? 0}`, navy);

  let pageNumber = 1;
  let y = drawTableHeader(doc, 58, options.sectionLabels);
  const rowHeight = 9;

  ranked.forEach((participant, index) => {
    if (y + rowHeight > 195) {
      drawPageFooter(doc, pageNumber);
      doc.addPage("a4", "landscape");
      pageNumber += 1;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...navy);
      doc.text(fitText(doc, `Classement — ${options.title}`, 190), 12, 13);
      y = drawTableHeader(doc, 18, options.sectionLabels);
    }

    if (index % 2 === 0) {
      doc.setFillColor(...pale);
      doc.rect(12, y, 273, rowHeight, "F");
    }
    doc.setDrawColor(230, 234, 230);
    doc.line(12, y + rowHeight, 285, y + rowHeight);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.4);
    doc.setTextColor(...ink);
    doc.text(String(index + 1), 18, y + 5.8, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.text(fitText(doc, participant.name, 44), 26, y + 5.8);
    doc.setFont("helvetica", "normal");
    doc.text(fitText(doc, getLevelLabel(participant.levelId), 21), 74, y + 5.8);
    doc.text(fitText(doc, bacExamZoneLabel(participant.candidateZone), 28), 99, y + 5.8);
    doc.text(
      `${participant.sectionScores.english.correctAnswers}/${participant.sectionScores.english.scoreMax}`,
      140,
      y + 5.8,
      { align: "center" },
    );
    doc.text(
      `${participant.sectionScores.generalKnowledge.correctAnswers}/${participant.sectionScores.generalKnowledge.scoreMax}`,
      163,
      y + 5.8,
      { align: "center" },
    );
    doc.text(
      `${participant.sectionScores.scientificKnowledge.correctAnswers}/${participant.sectionScores.scientificKnowledge.scoreMax}`,
      187,
      y + 5.8,
      { align: "center" },
    );
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...navy);
    doc.text(`${participant.correctAnswers}/${participant.scoreMax}`, 211, y + 5.8, { align: "center" });
    doc.setTextColor(...ink);
    doc.text(fitText(doc, participant.appreciation.label, 58), 225, y + 5.8);
    y += rowHeight;
  });

  drawPageFooter(doc, pageNumber);
  doc.save(options.fileName);
}
