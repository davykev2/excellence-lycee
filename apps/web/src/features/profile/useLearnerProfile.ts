import { useEffect, useState } from "react";
import type { LearnerProfile } from "../../domain/learning";
import { initialDashboard, schoolLevels } from "../../data/programme";

const storageKey = "excellence-learner-profile-v1";

const initialProfile: LearnerProfile = {
  name: initialDashboard.learnerName,
  photoUrl: initialDashboard.learnerPhotoUrl,
  levelId: initialDashboard.levelId,
};

function loadProfile() {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return initialProfile;
    const parsed = JSON.parse(stored) as LearnerProfile;
    const validLevel = schoolLevels.some((level) => level.id === parsed.levelId);
    return parsed.name && validLevel ? parsed : initialProfile;
  } catch {
    return initialProfile;
  }
}

export function useLearnerProfile() {
  const [profile, setProfile] = useState<LearnerProfile>(loadProfile);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(profile));
  }, [profile]);

  return { profile, setProfile };
}
