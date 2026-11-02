import { CaretDown, Student } from "@phosphor-icons/react";
import type { SchoolLevel, SubjectDefinition, SubjectId } from "../../domain/learning";
import { ProfileAvatar } from "../../ui/ProfileAvatar";

export function DocumentHomeHeader({ name, photoUrl, level, subject, subjects, onSubjectChange, onOpenSpace }: {
  name: string; photoUrl?: string; level: SchoolLevel; subject: SubjectDefinition; subjects: SubjectDefinition[];
  onSubjectChange: (subjectId: SubjectId) => void; onOpenSpace: () => void;
}) {
  const firstName = name.trim().split(/\s+/)[0];
  return <header className="document-home-header">
    <div className="document-home-greeting"><p>Heureux de te revoir</p><div><h1>Bonjour{firstName ? `, ${firstName}` : ""}</h1><button className="document-home-profile" type="button" onClick={onOpenSpace} aria-label="Ouvrir mon espace personnel"><ProfileAvatar name={name} photoUrl={photoUrl} /></button></div></div>
    <div className="document-home-context" aria-label="Contexte scolaire">
      <div className="document-home-context-field"><span>Niveau et série</span><div className="document-home-level"><Student size={20} weight="duotone" aria-hidden="true" /><strong>{level.label}</strong></div></div>
      <label className="document-home-context-field document-home-subject"><span>Matière</span><span className="document-home-select"><select aria-label="Matière" value={subject.id} onChange={event => onSubjectChange(event.target.value as SubjectId)}>{subjects.map(item => <option key={item.id} value={item.id} disabled={!item.enabled}>{item.label}{item.enabled ? "" : " — bientôt"}</option>)}</select><CaretDown size={17} aria-hidden="true" /></span></label>
    </div>
  </header>;
}
