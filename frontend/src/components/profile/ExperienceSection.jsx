import { useState } from "react";

export default function ExperienceSection({ experience, canEdit, onSave }) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");

  async function addExperience(event) {
    event.preventDefault();
    if (!title.trim() || !company.trim()) return;

    await onSave({
      experience: [
        ...experience,
        {
          title,
          company,
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    });
    setTitle("");
    setCompany("");
  }

  return (
    <section className="card gap-3 p-5">
      <h2 className="text-lg font-bold text-ink-primary">Experience</h2>
      {experience.map((item, index) => (
        <article
          className="border-b border-border-subtle pb-3 last:border-0"
          key={`${item.company}-${index}`}
        >
          <h3 className="font-semibold text-ink-primary">
            {item.title}
          </h3>
          <p className="text-sm text-ink-secondary">
            {item.company}
            {item.location && ` · ${item.location}`}
          </p>
          <p className="text-xs text-ink-secondary">
            {item.startDate} {item.endDate && `– ${item.endDate}`}
          </p>
          {item.description && (
            <p className="mt-2 text-sm text-ink-secondary">
              {item.description}
            </p>
          )}
        </article>
      ))}
      {experience.length === 0 && (
        <p className="text-sm text-ink-secondary">
          No experience added yet.
        </p>
      )}
      {canEdit && (
        <form onSubmit={addExperience} className="grid gap-2 sm:grid-cols-2">
          <input
            className="input input-bordered auth-input input-sm"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Job title"
          />
          <input
            className="input input-bordered auth-input input-sm"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            placeholder="Company"
          />
          <button className="btn btn-primary btn-sm sm:col-span-2">Add experience</button>
        </form>
      )}
    </section>
  );
}
