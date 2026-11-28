import { useState } from "react";

export default function EducationSection({ education, canEdit, onSave }) {
  const [school, setSchool] = useState("");
  const [degree, setDegree] = useState("");

  async function addEducation(event) {
    event.preventDefault();
    if (!school.trim() || !degree.trim()) return;

    await onSave({
      education: [
        ...education,
        {
          school,
          degree,
          field: "",
          startYear: "",
          endYear: "",
        },
      ],
    });
    setSchool("");
    setDegree("");
  }

  return (
    <section className="card min-w-0 gap-3 p-4 sm:p-5">
      <h2 className="text-lg font-bold text-ink-primary">Education</h2>
      {education.map((item, index) => (
        <article
          className="border-b border-border-subtle pb-3 last:border-0"
          key={`${item.school}-${index}`}
        >
          <h3 className="font-semibold text-ink-primary">
            {item.school}
          </h3>
          <p className="text-sm text-ink-secondary">
            {item.degree}
            {item.field && ` · ${item.field}`}
          </p>
          <p className="text-xs text-ink-secondary">
            {item.startYear} {item.endYear && `– ${item.endYear}`}
          </p>
        </article>
      ))}
      {education.length === 0 && (
        <p className="text-sm text-ink-secondary">
          No education added yet.
        </p>
      )}
      {canEdit && (
        <form onSubmit={addEducation} className="grid gap-2 sm:grid-cols-2">
          <input
            className="input input-bordered auth-input input-sm"
            value={school}
            onChange={(event) => setSchool(event.target.value)}
            placeholder="School"
          />
          <input
            className="input input-bordered auth-input input-sm"
            value={degree}
            onChange={(event) => setDegree(event.target.value)}
            placeholder="Degree"
          />
          <button className="btn btn-primary btn-sm sm:col-span-2">Add education</button>
        </form>
      )}
    </section>
  );
}
