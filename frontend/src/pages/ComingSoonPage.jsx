import { useLocation } from "react-router-dom";

export default function ComingSoonPage() {
  const { pathname } = useLocation();
  const pageName = pathname.slice(1).replace("-", " ");

  return (
    <section className="card p-6">
      <h1 className="text-2xl font-bold capitalize text-ink-primary">
        {pageName}
      </h1>
      <p className="mt-2 text-ink-secondary">
        This ProConnect page is coming in the next phase.
      </p>
    </section>
  );
}
