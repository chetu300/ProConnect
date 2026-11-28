import { useState } from "react";
import { RotateCcw, Save, Trash2 } from "lucide-react";
import ProfileImagePicker from "./ProfileImagePicker.jsx";

export default function ProfileEditForm({ user, onSave }) {
  const [form, setForm] = useState({
    name: user.name,
    headline: user.headline || "",
    about: user.about || "",
  });
  const [profileImage, setProfileImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [removeProfileImage, setRemoveProfileImage] = useState(false);
  const [removeBannerImage, setRemoveBannerImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    try {
      const updates = { ...form };
      if (profileImage) updates.profileImage = profileImage;
      else if (removeProfileImage) updates.profileImage = "";
      if (bannerImage) updates.bannerImage = bannerImage;
      else if (removeBannerImage) updates.bannerImage = "";
      await onSave(updates);
    } catch (error) {
      const message =
        error.response?.data?.message || "Could not save profile.";
      setErrorMessage(message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
      <div className="grid gap-2">
        <p className="text-sm font-medium text-ink-primary">Banner image</p>
        <div className="flex flex-wrap items-center gap-2">
          <ProfileImagePicker
            label="Choose banner image"
            onImageReady={(image) => {
              setBannerImage(image);
              setRemoveBannerImage(false);
            }}
            onError={setErrorMessage}
          />
          {(bannerImage || (user.bannerImage && !removeBannerImage)) && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                setBannerImage("");
                setRemoveBannerImage(true);
              }}
            >
              <Trash2 size={15} />
              Remove banner
            </button>
          )}
          {removeBannerImage && (
            <>
              <span className="text-sm text-ink-secondary">Banner will be removed on save.</span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setRemoveBannerImage(false)}
              >
                <RotateCcw size={15} />
                Undo
              </button>
            </>
          )}
        </div>
      </div>
      <div className="grid gap-2">
        <p className="text-sm font-medium text-ink-primary">Profile picture</p>
        <div className="flex flex-wrap items-center gap-2">
          <ProfileImagePicker
            label="Choose profile picture"
            onImageReady={(image) => {
              setProfileImage(image);
              setRemoveProfileImage(false);
            }}
            onError={setErrorMessage}
          />
          {(profileImage || (user.profileImage && !removeProfileImage)) && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                setProfileImage("");
                setRemoveProfileImage(true);
              }}
            >
              <Trash2 size={15} />
              Remove picture
            </button>
          )}
          {removeProfileImage && (
            <>
              <span className="text-sm text-ink-secondary">Picture will be removed on save.</span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setRemoveProfileImage(false)}
              >
                <RotateCcw size={15} />
                Undo
              </button>
            </>
          )}
        </div>
      </div>
      <input
        className="input input-bordered auth-input"
        value={form.name}
        onChange={(event) =>
          setForm({ ...form, name: event.target.value })
        }
        placeholder="Name"
        required
      />
      <input
        className="input input-bordered auth-input"
        value={form.headline}
        onChange={(event) =>
          setForm({ ...form, headline: event.target.value })
        }
        placeholder="Professional headline"
      />
      <textarea
        className="textarea textarea-bordered auth-input"
        value={form.about}
        onChange={(event) =>
          setForm({ ...form, about: event.target.value })
        }
        placeholder="About you"
      />
      {errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}
      <button className="btn btn-primary btn-sm justify-self-start">
        <Save size={16} />
        Save changes
      </button>
    </form>
  );
}
