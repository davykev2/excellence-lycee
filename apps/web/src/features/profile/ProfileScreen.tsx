import {
  ArrowLeft,
  BookOpenText,
  Camera,
  CalendarBlank,
  CheckCircle,
  CircleNotch,
  GraduationCap,
  ShieldCheck,
  SignOut,
  SpeakerHigh,
  Student,
  Trash,
} from "@phosphor-icons/react";
import { ChangePasswordSection } from "./ChangePasswordSection";
import { useRef, useState, type ChangeEvent } from "react";
import type { AuthUser } from "../../domain/auth";
import type { LearnerProfile, SchoolLevel } from "../../domain/learning";
import { apiRequest } from "../../lib/api";
import { ProfileAvatar } from "../../ui/ProfileAvatar";

const stageLabels: Record<SchoolLevel["stage"], string> = {
  seconde: "Seconde",
  premiere: "Première",
  terminale: "Terminale",
};

interface ProfileScreenProps {
  profile: LearnerProfile;
  currentLevel: SchoolLevel;
  onBackHome: () => void;
  email: string;
  roleLabel: string;
  onLogout: () => void;
  onReplayDavyTour: () => void;
  onProfileUpdated: (user: AuthUser) => void;
}

const allowedPhotoTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function optimizeProfilePhoto(file: File) {
  return new Promise<string>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const outputSize = 640;
      const cropSize = Math.min(image.naturalWidth, image.naturalHeight);
      const cropX = Math.round((image.naturalWidth - cropSize) / 2);
      const cropY = Math.round((image.naturalHeight - cropSize) / 2);
      canvas.width = outputSize;
      canvas.height = outputSize;
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Cette image ne peut pas être préparée."));
        return;
      }
      context.drawImage(image, cropX, cropY, cropSize, cropSize, 0, 0, outputSize, outputSize);
      const dataUrl = canvas.toDataURL("image/webp", 0.86);
      URL.revokeObjectURL(objectUrl);
      resolve(dataUrl);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Le fichier sélectionné n’est pas une image valide."));
    };
    image.src = objectUrl;
  });
}

export function ProfileScreen({ profile, currentLevel, onBackHome, email, roleLabel, onLogout, onReplayDavyTour, onProfileUpdated }: ProfileScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoNotice, setPhotoNotice] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);

  const selectPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setPhotoError(null);
    setPhotoNotice(null);
    if (!allowedPhotoTypes.has(file.type)) {
      setPhotoError("Choisis une image JPG, PNG ou WebP.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError("L’image d’origine ne doit pas dépasser 10 Mo.");
      return;
    }
    try {
      setPendingPhoto(await optimizeProfilePhoto(file));
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : "Cette image ne peut pas être utilisée.");
    }
  };

  const savePhoto = async () => {
    if (!pendingPhoto || photoBusy) return;
    setPhotoBusy(true);
    setPhotoError(null);
    setPhotoNotice(null);
    try {
      const response = await apiRequest<{ user: AuthUser }>("/users/me/photo", {
        method: "POST",
        body: JSON.stringify({ dataUrl: pendingPhoto }),
      });
      onProfileUpdated(response.user);
      setPendingPhoto(null);
      setPhotoNotice("Ta photo de profil est enregistrée.");
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : "La photo n’a pas pu être enregistrée.");
    } finally {
      setPhotoBusy(false);
    }
  };

  const removePhoto = async () => {
    if (photoBusy) return;
    if (pendingPhoto) {
      setPendingPhoto(null);
      setPhotoError(null);
      return;
    }
    if (!profile.photoUrl) return;
    setPhotoBusy(true);
    setPhotoError(null);
    setPhotoNotice(null);
    try {
      const response = await apiRequest<{ user: AuthUser }>("/users/me/photo", { method: "DELETE" });
      onProfileUpdated(response.user);
      setPhotoNotice("Ta photo a été retirée.");
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : "La photo n’a pas pu être retirée.");
    } finally {
      setPhotoBusy(false);
    }
  };

  return (
    <main className="profile-page">
      <header className="profile-page-header">
        <button className="path-back-button" type="button" onClick={onBackHome}>
          <ArrowLeft size={20} weight="bold" />
          Accueil
        </button>
        <span className="profile-save-state"><CheckCircle size={19} weight="fill" /> Profil mémorisé</span>
      </header>

      <section className="profile-hero">
        <div className="profile-identity">
          <div className="profile-photo-control">
            <ProfileAvatar name={profile.name} photoUrl={pendingPhoto ?? profile.photoUrl} />
            <button type="button" onClick={() => fileInputRef.current?.click()} aria-label={profile.photoUrl ? "Remplacer ma photo de profil" : "Ajouter ma photo de profil"} disabled={photoBusy}>
              <Camera size={19} weight="fill" />
            </button>
            <input ref={fileInputRef} className="profile-photo-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void selectPhoto(event)} />
          </div>
          <div className="profile-identity-copy">
            <p className="path-kicker">Profil scolaire</p><h1>{profile.name}</h1><span>Ton niveau détermine automatiquement les programmes et parcours disponibles.</span>
            <div className="profile-photo-actions">
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={photoBusy}>{profile.photoUrl ? "Changer ma photo" : "Ajouter ma photo"}</button>
              {pendingPhoto && <button className="is-primary" type="button" onClick={() => void savePhoto()} disabled={photoBusy}>{photoBusy ? <CircleNotch className="profile-photo-spinner" size={17} /> : <CheckCircle size={17} weight="fill" />} Enregistrer</button>}
              {(pendingPhoto || profile.photoUrl) && <button className="is-danger" type="button" onClick={() => void removePhoto()} disabled={photoBusy}><Trash size={17} /> {pendingPhoto ? "Annuler" : "Retirer"}</button>}
            </div>
            {photoError && <small className="profile-photo-feedback is-error" role="alert">{photoError}</small>}
            {photoNotice && <small className="profile-photo-feedback is-success" role="status">{photoNotice}</small>}
            <small className="profile-photo-hint">JPG, PNG ou WebP · cadrage carré automatique</small>
          </div>
        </div>
        <div className="profile-current-level">
          <Student size={25} weight="duotone" />
          <div><span>Niveau actuel</span><strong>{currentLevel.label}</strong></div>
        </div>
      </section>

      <section className="profile-school-grid">
        <article className="profile-level-editor is-read-only">
          <div className="profile-section-heading">
            <span><GraduationCap size={25} weight="duotone" /></span>
            <div><p className="path-kicker">Contexte scolaire</p><h2>Niveau et série</h2><p>Ces informations sont définies à l’inscription et restent verrouillées pendant l’année académique.</p></div>
          </div>

          <div className="profile-locked-level" aria-label={`Niveau et série : ${currentLevel.label}`}>
            <span className="profile-locked-level-icon"><Student size={34} weight="duotone" /></span>
            <div className="profile-locked-level-main">
              <small>Classe actuellement enregistrée</small>
              <strong>{currentLevel.label}</strong>
            </div>
            <div className="profile-level-facts">
              <span><small>Niveau</small><strong>{stageLabels[currentLevel.stage]}</strong></span>
              <span><small>Série</small><strong>{currentLevel.series}</strong></span>
            </div>
          </div>

          <div className="profile-admin-policy">
            <ShieldCheck size={28} weight="duotone" />
            <div>
              <strong>Modification réservée à l’administration</strong>
              <p>À la fin de l’année académique, adresse-toi à un administrateur pour faire enregistrer ta nouvelle classe. Cette règle évite les changements accidentels et protège ta progression.</p>
            </div>
          </div>
        </article>

        <aside className="profile-impact-card">
          <span className="profile-impact-icon"><BookOpenText size={27} weight="duotone" /></span>
          <p className="path-kicker">Adaptation automatique</p>
          <h2>Ton espace suit {currentLevel.label}</h2>
          <ul>
            <li><CheckCircle size={20} weight="fill" /><span>Les chapitres correspondent au programme de cette classe.</span></li>
            <li><CheckCircle size={20} weight="fill" /><span>Ta progression déjà acquise reste conservée pour chaque parcours.</span></li>
            <li><CheckCircle size={20} weight="fill" /><span>Les exercices et les défis de l’Arène utilisent le bon niveau de difficulté.</span></li>
          </ul>
          <div className="profile-availability">
            <CalendarBlank size={21} weight="duotone" />
            <span><strong>Changement de classe</strong>Demande la mise à jour à l’administration lorsque l’année académique est terminée.</span>
          </div>
          <button className="profile-davy-tour-button" type="button" onClick={onReplayDavyTour}>
            <SpeakerHigh size={23} weight="duotone" />
            <span><strong>Refaire la visite avec Davy</strong><small>Réécouter la présentation des espaces de la plateforme.</small></span>
          </button>
          <div className="profile-account-card">
            <span>Compte connecté</span>
            <strong>{email}</strong>
            <small>{roleLabel}</small>
            <button type="button" onClick={onLogout}><SignOut size={18} weight="bold" /> Se déconnecter</button>
          </div>
        </aside>
      </section>

      <section className="profile-school-grid">
        <ChangePasswordSection onPasswordChanged={onLogout} />
      </section>
    </main>
  );
}
