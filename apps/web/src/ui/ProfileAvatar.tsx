import { User } from "@phosphor-icons/react";

interface ProfileAvatarProps {
  name: string;
  photoUrl?: string;
}

export function ProfileAvatar({ name, photoUrl }: ProfileAvatarProps) {
  const accessibleLabel = photoUrl
    ? `Photo de profil de ${name}`
    : `Photo de profil de ${name} non renseignée`;

  return (
    <span className="profile-avatar" role="img" aria-label={accessibleLabel}>
      {photoUrl ? (
        <img src={photoUrl} alt="" />
      ) : (
        <User size={30} weight="duotone" aria-hidden="true" />
      )}
    </span>
  );
}
