import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Network, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import PostCreator from "../components/post/PostCreator.jsx";
import PostCard from "../components/post/PostCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../lib/axios.js";

export default function HomePage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["feed"],
    queryFn: async () => (await api.get("/posts")).data,
  });

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_250px]">
      <section className="min-w-0 space-y-4">
        <div className="card relative isolate overflow-hidden p-5 sm:p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-brand-violet/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand-indigo to-brand-purple"
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-indigo">
              Campus · Careers · Community
            </p>
            <h1 className="mt-2 text-xl font-bold text-ink-primary sm:text-2xl">
              Hey, <span className="capitalize">{user?.name?.split(" ")[0]}</span>!
            </h1>
            <p className="mt-1 text-sm text-ink-secondary">
              Share what you’re learning, celebrate the little wins, and meet people who get it.
            </p>
          </div>
        </div>

        <PostCreator />
        {isLoading && (
          <div className="card p-6 text-center text-sm text-ink-secondary">
            Loading your feed...
          </div>
        )}
        {isError && (
          <div role="alert" className="card p-6 text-center text-sm text-red-600">
            Could not load the feed. Please try again.
          </div>
        )}
        {data?.posts.length === 0 && (
          <div className="card p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-indigo/10 text-brand-indigo">
              <Network size={22} />
            </div>
            <h2 className="mt-3 font-semibold text-ink-primary">Your feed starts here</h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-ink-secondary">
              Share a professional update or connect with people to get conversations started.
            </p>
            <Link to="/network" className="btn btn-outline btn-sm mt-4">
              Explore your network <ArrowRight size={16} />
            </Link>
          </div>
        )}
        {data?.posts.map((post) => <PostCard key={post._id} post={post} />)}
      </section>

      <aside className="hidden space-y-4 xl:block">
        <section className="card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-indigo/10 text-brand-indigo">
            <Network size={20} />
          </div>
          <h2 className="mt-3 font-semibold text-ink-primary">Grow your network</h2>
          <p className="mt-1 text-sm leading-6 text-ink-secondary">
            Find professionals, send connection requests, and build meaningful relationships.
          </p>
          <Link to="/network" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-indigo hover:text-brand-purple">
            Discover people <ArrowRight size={15} />
          </Link>
        </section>
        <section className="card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-indigo/10 text-brand-indigo">
            <UserRound size={20} />
          </div>
          <h2 className="mt-3 font-semibold text-ink-primary">Make your profile yours</h2>
          <p className="mt-1 text-sm leading-6 text-ink-secondary">
            Add your experience, skills, and a short introduction to help others get to know you.
          </p>
          <Link to={`/profile/${user?.username}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-indigo hover:text-brand-purple">
            Edit your profile <ArrowRight size={15} />
          </Link>
        </section>
        <p className="px-2 text-xs leading-5 text-ink-secondary">
          ProConnect · Build your professional community.
        </p>
      </aside>
    </div>
  );
}
