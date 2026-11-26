import { useState } from "react";
import { Save } from "lucide-react";
import ProfileImagePicker from "./ProfileImagePicker.jsx";

export default function ProfileEditForm({ user, onSave }) {
  const [form, setForm] = useState({
    name: user.name,
    headline: user.headline || "",
    about: user.about || "",
  });
  const [profileImage, setProfileImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    try {
      await onSave({ ...form, profileImage, bannerImage });
    } catch (error) {
      const message =
        error.response?.data?.message || "Could not save profile.";
      setErrorMessage(message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
      <ProfileImagePicker
        label="Choose banner image"
        onImageReady={setBannerImage}
        onError={setErrorMessage}
      />
      <ProfileImagePicker
        label="Choose profile image"
        onImageReady={setProfileImage}
        onError={setErrorMessage}
      />
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
