import { useState } from "react";
import { ImagePlus, Send } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../lib/axios.js";

export default function PostCreator() {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState("");
  const queryClient = useQueryClient();
  const createPost = useMutation({
    mutationFn: () => api.post("/posts", { text, image }),
    onSuccess: () => {
      setText("");
      setImage("");
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  function chooseImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setImageError("Please choose an image smaller than 3 MB.");
      event.target.value = "";
      return;
    }

    setImageError("");
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (text.trim() || image) createPost.mutate();
  }

  return (
    <form onSubmit={handleSubmit} className="card gap-4 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        {user?.profileImage ? (
          <img src={user.profileImage} alt="" className="h-11 w-11 rounded-full object-cover" />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-indigo/10 font-semibold text-brand-indigo">
            {user?.name?.[0]?.toUpperCase()}
          </div>
        )}
        <textarea
          className="textarea textarea-bordered auth-input min-h-20 w-full resize-y bg-surface-bg text-ink-primary placeholder:text-ink-secondary focus:bg-white"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Share an update with your network..."
          aria-label="Write a post"
        />
      </div>
      {image && <img src={image} alt="Post preview" className="max-h-72 w-full rounded-xl object-cover" />}
      {imageError && <p className="text-sm text-red-600">{imageError}</p>}
      {createPost.isError && (
        <p role="alert" className="text-sm text-red-600">
          {createPost.error.response?.data?.message || "Could not create post. Please try again."}
        </p>
      )}
      <div className="flex items-center justify-between border-t border-border-subtle pt-3">
        <label className="btn btn-ghost btn-sm group cursor-pointer gap-2 text-brand-indigo hover:text-brand-purple">
          <ImagePlus size={18} className="transition-colors group-hover:fill-current" /> Add photo
          <input type="file" accept="image/*" className="hidden" onChange={chooseImage} />
        </label>
        <button className="btn btn-primary btn-sm min-w-24 rounded-full group" disabled={createPost.isPending || (!text.trim() && !image)}>
          <Send size={16} className="transition-transform group-hover:translate-x-0.5" /> {createPost.isPending ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
