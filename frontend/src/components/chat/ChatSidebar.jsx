import { Search } from "lucide-react";

export default function ChatSidebar({
  people,
  selectedUser,
  onSelect,
  search,
  onSearch,
}) {
  const visiblePeople = people.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="card h-fit gap-3 p-4">
      <h1 className="text-lg font-bold text-ink-primary">Messages</h1>
      <label
        className="
          input input-bordered auth-input input-sm
          flex items-center gap-2
        "
      >
        <Search size={16} />
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Find a connection"
        />
      </label>
      <div className="max-h-[60vh] space-y-1 overflow-y-auto">
        {visiblePeople.map((person) => (
          <button
            key={person._id}
            className={`
              flex w-full items-center gap-3 rounded-lg p-2
              text-left text-ink-primary transition-colors hover:bg-surface-bg
              ${selectedUser?._id === person._id ? "bg-brand-indigo/10 text-brand-indigo" : ""}
            `}
            onClick={() => onSelect(person)}
          >
            {person.profileImage ? (
              <img
                src={person.profileImage}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-full bg-brand-indigo/10 font-semibold text-brand-indigo
                "
              >
                {person.name?.[0]}
              </span>
            )}
            <span className="truncate font-medium text-ink-primary">
              {person.name}
            </span>
          </button>
        ))}
        {visiblePeople.length === 0 && (
          <p className="p-2 text-sm text-ink-secondary">
            No connections found.
          </p>
        )}
      </div>
    </aside>
  );
}
