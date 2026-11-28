import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../lib/axios.js";
import ProfileHeader from "../components/profile/ProfileHeader.jsx";
import ExperienceSection from "../components/profile/ExperienceSection.jsx";
import EducationSection from "../components/profile/EducationSection.jsx";
import SkillsSection from "../components/profile/SkillsSection.jsx";
import ProjectsSection from "../components/profile/ProjectsSection.jsx";

export default function ProfilePage() {
  const { username } = useParams();
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();

  const profile = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const response = await api.get(`/users/${username}`);
      return response.data;
    },
  });

  const updateProfile = useMutation({
    mutationFn: (updates) => api.patch("/users/me", updates),
    onSuccess: (response) => {
      queryClient.setQueryData(["profile", username], response.data);
      setUser(response.data);
    },
  });

  if (profile.isLoading) {
    return <p className="p-6 text-ink-secondary">Loading profile...</p>;
  }

  if (profile.isError) {
    return <p className="p-6 text-red-600">Could not load this profile.</p>;
  }

  const profileUser = profile.data;
  const canEdit = user?._id === profileUser._id;
  const saveChanges = (updates) => updateProfile.mutateAsync(updates);

  return (
    <div className="min-w-0 space-y-3 sm:space-y-4">
      {updateProfile.isError && (
        <p className="text-sm text-red-600">
          Could not save your profile.
        </p>
      )}
      <ProfileHeader
        user={profileUser}
        canEdit={canEdit}
        onSave={saveChanges}
      />
      <SkillsSection
        skills={profileUser.skills || []}
        canEdit={canEdit}
        onSave={saveChanges}
      />
      <ExperienceSection
        experience={profileUser.experience || []}
        canEdit={canEdit}
        onSave={saveChanges}
      />
      <EducationSection
        education={profileUser.education || []}
        canEdit={canEdit}
        onSave={saveChanges}
      />
      <ProjectsSection
        projects={profileUser.projects || []}
        canEdit={canEdit}
        onSave={saveChanges}
      />
    </div>
  );
}
