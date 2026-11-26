import { jsPDF } from "jspdf";

function addSection(pdf, heading, lines, position) {
  if (!lines.length) return position;
  pdf.setFont("helvetica", "bold");
  pdf.text(heading, 18, position);
  position += 8;
  pdf.setFont("helvetica", "normal");

  for (const line of lines) {
    const wrappedLines = pdf.splitTextToSize(line, 174);
    if (position + wrappedLines.length * 6 > 280) {
      pdf.addPage();
      position = 20;
    }
    pdf.text(wrappedLines, 18, position);
    position += wrappedLines.length * 6;
  }

  return position + 5;
}

export function generateResumePDF(user) {
  const pdf = new jsPDF();
  let position = 20;

  pdf.setTextColor(37, 99, 235);
  pdf.setFontSize(22);
  pdf.text("ProConnect", 18, position);
  position += 12;

  pdf.setTextColor(30, 41, 59);
  pdf.setFontSize(18);
  pdf.text(user.name || "Professional Profile", 18, position);
  position += 8;

  pdf.setFontSize(11);
  const contactLine = [user.headline, `@${user.username}`]
    .filter(Boolean)
    .join(" | ");
  pdf.text(pdf.splitTextToSize(contactLine, 174), 18, position);
  position += 12;

  position = addSection(pdf, "About", user.about ? [user.about] : [], position);
  position = addSection(pdf, "Skills", user.skills || [], position);
  position = addSection(
    pdf,
    "Experience",
    (user.experience || []).map((item) =>
      [item.title, item.company, item.startDate, item.endDate, item.description]
        .filter(Boolean)
        .join(" | ")
    ),
    position
  );
  addSection(
    pdf,
    "Education",
    (user.education || []).map((item) =>
      [item.degree, item.field, item.school, item.startYear, item.endYear]
        .filter(Boolean)
        .join(" | ")
    ),
    position
  );

  const fileName = `${(user.name || "proconnect-resume")
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase()}-resume.pdf`;
  pdf.save(fileName);
}
