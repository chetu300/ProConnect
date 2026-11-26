import { Link } from "react-router-dom";

export default function PersonCard({ person, button }) {
  return (
    <article className="flex items-center gap-3 rounded-xl border border-border-subtle p-3">
      {person.profileImage ? (
        <img src={person.profileImage} alt="" className="h-12 w-12 rounded-full bg-surface-bg object-cover" />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-indigo/10 font-semibold text-brand-indigo">
          {person.name?.[0]?.toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <Link className="font-semibold text-ink-primary hover:text-brand-indigo" to={`/profile/${person.username}`}>
          {person.name}
        </Link>
        <p className="truncate text-sm text-ink-secondary">{person.headline || `@${person.username}`}</p>
      </div>
      {button}
    </article>
  );
}
