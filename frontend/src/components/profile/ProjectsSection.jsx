import { useState } from "react";
import { ArrowUpRight, Blocks, CodeXml, FolderPlus, Rocket, Trash } from "lucide-react";

function safeExternalUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export default function ProjectsSection({ projects, canEdit, onSave }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function addProject(event) {
    event.preventDefault();
    setErrorMessage("");

    const project = {
      title: title.trim(),
      description: description.trim(),
      technologies: technologies.split(",").map((item) => item.trim()).filter(Boolean),
      projectUrl: projectUrl.trim(),
      repositoryUrl: repositoryUrl.trim(),
    };

    try {
      await onSave({ projects: [...projects, project] });
      setTitle("");
      setDescription("");
      setTechnologies("");
      setProjectUrl("");
      setRepositoryUrl("");
      setIsAdding(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Could not save this project.");
    }
  }

  async function removeProject(index) {
    setErrorMessage("");
    try {
      await onSave({ projects: projects.filter((_, itemIndex) => itemIndex !== index) });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Could not remove this project.");
    }
  }

  return (
    <section className="card gap-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-indigo/10 text-brand-indigo">
            <Blocks size={20} fill="currentColor" fillOpacity={0.16} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink-primary">Projects</h2>
            <p className="text-sm text-ink-secondary">Classwork, side projects, and things you’ve built</p>
          </div>
        </div>
        {canEdit && !isAdding && (
          <button className="btn btn-outline btn-sm group" onClick={() => setIsAdding(true)}>
            <FolderPlus size={16} className="transition-transform group-hover:fill-current" /> Add project
          </button>
        )}
      </div>

      {projects.map((project, index) => {
        const demoLink = safeExternalUrl(project.projectUrl);
        const sourceLink = safeExternalUrl(project.repositoryUrl);

        return (
          <article key={project._id || `${project.title}-${index}`} className="rounded-xl border border-border-subtle p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-ink-primary">{project.title}</h3>
                {project.description && (
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-ink-secondary">
                    {project.description}
                  </p>
                )}
              </div>
              {canEdit && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm group"
                  aria-label={`Remove ${project.title}`}
                  onClick={() => removeProject(index)}
                >
                  <Trash size={16} className="text-rose-500 transition-colors group-hover:fill-current group-hover:text-rose-600" />
                </button>
              )}
            </div>
            {project.technologies?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((technology) => (
                  <span key={technology} className="badge badge-outline">{technology}</span>
                ))}
              </div>
            )}
            {(demoLink || sourceLink) && (
              <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium">
                {demoLink && (
                  <a href={demoLink} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 text-brand-indigo hover:text-brand-purple">
                    <Rocket size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:fill-current" /> Live project
                  </a>
                )}
                {sourceLink && (
                  <a href={sourceLink} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 text-brand-purple hover:text-brand-indigo">
                    <CodeXml size={15} className="transition-colors group-hover:fill-current" /> Source code
                  </a>
                )}
              </div>
            )}
          </article>
        );
      })}

      {projects.length === 0 && !isAdding && (
        <p className="rounded-xl bg-surface-bg p-4 text-sm text-ink-secondary">
          {canEdit ? "Add a project you’re proud of—coursework counts too." : "No projects shared yet."}
        </p>
      )}

      {errorMessage && <p role="alert" className="text-sm text-red-600">{errorMessage}</p>}

      {canEdit && isAdding && (
        <form onSubmit={addProject} className="grid gap-3 rounded-xl bg-surface-bg p-4">
          <input
            className="input input-bordered auth-input w-full"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Project name"
            maxLength="100"
            required
          />
          <textarea
            className="textarea textarea-bordered auth-input w-full"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What did you build or learn?"
            maxLength="1000"
          />
          <input
            className="input input-bordered auth-input w-full"
            value={technologies}
            onChange={(event) => setTechnologies(event.target.value)}
            placeholder="Tools or skills, separated by commas"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="input input-bordered auth-input w-full"
              type="url"
              value={projectUrl}
              onChange={(event) => setProjectUrl(event.target.value)}
              placeholder="Live project URL"
            />
            <input
              className="input input-bordered auth-input w-full"
              type="url"
              value={repositoryUrl}
              onChange={(event) => setRepositoryUrl(event.target.value)}
              placeholder="Source code URL"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary btn-sm" type="submit">Save project</button>
            <button className="btn btn-ghost btn-sm" type="button" onClick={() => setIsAdding(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
