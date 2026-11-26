import { useState } from "react";
import ResumeDownloadBtn from "./ResumeDownloadBtn.jsx";
import ProfileEditForm from "./ProfileEditForm.jsx";

export default function ProfileHeader({ user, canEdit, onSave }) {
  const [isEditing, setIsEditing] = useState(false);

  async function saveProfile(updates) {
    await onSave(updates);
    setIsEditing(false);
  }

  return (
    <section className="card overflow-hidden">
      <div className="h-36 bg-gradient-to-r from-slate-200 via-slate-100 to-indigo-50">
        {user.bannerImage && (
          <img
            src={user.bannerImage}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="p-5">
        <div className="-mt-14 flex flex-wrap items-end justify-between gap-4">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt=""
              className="
                relative z-10 h-24 w-24 rounded-full border-4 border-white
                bg-surface-bg object-cover shadow-sm
              "
            />
          ) : (
            <div
              className="
                relative z-10 flex h-24 w-24 items-center justify-center
                rounded-full border-4 border-white bg-indigo-50 shadow-sm
                text-3xl font-bold text-brand-indigo
              "
            >
              {user.name?.[0]}
            </div>
          )}
          <div className="flex gap-2">
            <ResumeDownloadBtn user={user} />
            {canEdit && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit profile"}
              </button>
            )}
          </div>
        </div>
        {isEditing ? (
          <ProfileEditForm user={user} onSave={saveProfile} />
        ) : (
          <div className="mt-3">
            <h1 className="text-2xl font-bold text-ink-primary">
              {user.name}
            </h1>
            <p className="text-ink-secondary">
              {user.headline || `@${user.username}`}
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm text-ink-primary">
              {user.about || "Add a short introduction to your profile."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
