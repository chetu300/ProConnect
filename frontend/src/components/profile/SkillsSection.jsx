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
    <section className="card gap-3 p-5">
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
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span className="badge badge-outline p-3" key={skill}>
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
