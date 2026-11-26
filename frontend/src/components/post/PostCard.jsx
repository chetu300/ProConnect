import { useState } from "react";
import { Heart, MessageSquare, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../lib/axios.js";
import CommentSection from "./CommentSection.jsx";

export default function PostCard({ post }) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const queryClient = useQueryClient();
  const liked = post.likes.some((person) => person._id === user?._id);
  const updateFeed = () => queryClient.invalidateQueries({ queryKey: ["feed"] });
  const likePost = useMutation({
    mutationFn: () => api.post(`/posts/${post._id}/like`),
    onSuccess: updateFeed,
  });
  const deletePost = useMutation({
    mutationFn: () => api.delete(`/posts/${post._id}`),
    onSuccess: updateFeed,
  });

  return (
    <article className="card overflow-hidden p-4 sm:p-5">
      <div className="flex items-center gap-3">
        {post.author.profileImage ? (
          <img src={post.author.profileImage} alt="" className="h-11 w-11 rounded-full bg-surface-bg object-cover" />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-indigo/10 font-semibold text-brand-indigo">
            {post.author.name?.[0]?.toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <Link
            to={`/profile/${post.author.username}`}
            className="block truncate font-semibold text-ink-primary hover:text-brand-indigo"
          >
            {post.author.name}
          </Link>
          <p className="truncate text-xs text-ink-secondary">{post.author.headline || `@${post.author.username}`}</p>
          <p className="mt-0.5 text-xs text-ink-secondary">
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        {post.author._id === user?._id && (
          <button
            className="btn btn-ghost btn-sm text-ink-secondary hover:text-rose-600"
            aria-label="Delete post"
            onClick={() => deletePost.mutate()}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      {post.text && <p className="my-4 whitespace-pre-wrap text-[15px] leading-6 text-ink-primary">{post.text}</p>}
      {post.image && <img src={post.image} alt="Post" className="max-h-[480px] w-full rounded-xl object-cover" />}
      <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-2 text-sm text-ink-secondary">
        <button
          aria-pressed={liked}
          className={`btn btn-ghost btn-sm flex-1 font-semibold ${liked ? "text-rose-700" : "text-rose-600"} hover:text-rose-700`}
          onClick={() => likePost.mutate()}
        >
          <Heart
            size={16}
            className={liked ? "text-rose-700" : "text-rose-600"}
            fill={liked ? "currentColor" : "none"}
          />{" "}
          {post.likes.length} Like
        </button>
        <button
          className="btn btn-ghost btn-sm flex-1 group font-semibold text-brand-indigo hover:text-brand-purple"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageSquare
            size={16}
            className="transition-colors group-hover:fill-current"
          />{" "}
          {post.comments.length} Comment
        </button>
      </div>
      {showComments && <CommentSection post={post} />}
      {(likePost.isError || deletePost.isError) && (
        <p className="text-sm text-red-600">Could not update this post.</p>
      )}
    </article>
  );
}
