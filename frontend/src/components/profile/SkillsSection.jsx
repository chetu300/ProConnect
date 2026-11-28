import { useState } from "react";

export default function SkillsSection({ skills, canEdit, onSave }) {
  const [skillText, setSkillText] = useState(skills.join(", "));

  async function saveSkills(event) {
    event.preventDefault();
    const skillList = skillText
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    await onSave({ skills: skillList });
  }

  return (
    <section className="card min-w-0 gap-3 p-4 sm:p-5">
      <h2 className="text-lg font-bold text-ink-primary">Skills</h2>
      {canEdit ? (
        <form onSubmit={saveSkills} className="flex flex-col gap-3">
          <input
            className="input input-bordered auth-input w-full"
            value={skillText}
            onChange={(event) => setSkillText(event.target.value)}
            placeholder="Add skills separated by commas"
          />
          <button className="btn btn-primary btn-sm self-start">Save skills</button>
        </form>
      ) : (
        <div className="flex w-full min-w-0 flex-row flex-wrap items-start justify-start gap-2 text-left">
          {skills.map((skill) => (
            <span
              className="block max-w-full whitespace-normal break-words rounded-full bg-surface-bg px-3 py-2 text-left text-sm leading-5 text-ink-primary"
              key={skill}
            >
              {skill}
            </span>
          ))}
          {skills.length === 0 && (
            <p className="text-sm text-ink-secondary">
              No skills added yet.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
