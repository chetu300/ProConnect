import { Camera } from "lucide-react";

export default function ProfileImagePicker({ label, onImageReady, onError }) {
  function chooseImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      onError("Choose an image smaller than 1.5 MB.");
      return;
    }

    onError("");
    const reader = new FileReader();
    reader.onload = () => onImageReady(reader.result);
    reader.onerror = () => onError("Could not read the selected image.");
    reader.readAsDataURL(file);
  }

  return (
    <label className="btn btn-sm justify-self-start">
      <Camera size={15} />
      {label}
      <input
        className="hidden"
        type="file"
        accept="image/*"
        onChange={chooseImage}
      />
    </label>
  );
}
