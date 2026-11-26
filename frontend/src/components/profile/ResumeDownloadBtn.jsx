import { useState } from "react";
import { Download } from "lucide-react";

export default function ResumeDownloadBtn({ user }) {
  const [downloadError, setDownloadError] = useState("");

  async function downloadResume() {
    setDownloadError("");

    try {
      const { generateResumePDF } = await import(
        "../../utils/generateResumePDF.js"
      );
      generateResumePDF(user);
    } catch (error) {
      console.error("Could not create resume PDF:", error.message);
      setDownloadError("Could not create the PDF. Please try again.");
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={downloadResume}
      >
        <Download size={16} />
        Download PDF Resume
      </button>
      {downloadError && (
        <p className="text-xs text-red-600">
          {downloadError}
        </p>
      )}
    </div>
  );
}
