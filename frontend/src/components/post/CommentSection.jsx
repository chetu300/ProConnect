import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios.js";

export default function CommentSection({ post }) {
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();
  const addComment = useMutation({
    mutationFn: () =>
      api.post(`/posts/${post._id}/comments`, { text: commentText }),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  function handleSubmit(event) {
    event.preventDefault();
    if (commentText.trim()) addComment.mutate();
  }

  return (
    <div className="mt-4 border-t border-border-subtle pt-3">
      <div className="space-y-3">
        {post.comments.map((comment) => (
          <div key={comment._id} className="text-sm">
            <span className="font-semibold text-ink-primary">
              {comment.user?.name || "ProConnect member"}
            </span>
            <span className="ml-2 text-ink-secondary">{comment.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          className="input input-bordered auth-input input-sm w-full"
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          placeholder="Write a comment..."
          aria-label="Write a comment"
        />
        <button className="btn btn-primary btn-sm" disabled={!commentText.trim() || addComment.isPending}>
          Send
        </button>
      </form>
      {addComment.isError && (
        <p className="mt-2 text-sm text-red-600">Could not add comment.</p>
      )}
    </div>
  );
}
