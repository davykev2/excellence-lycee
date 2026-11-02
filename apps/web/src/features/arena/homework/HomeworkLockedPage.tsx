import { ArrowLeft, LockKey } from "@phosphor-icons/react";

export function HomeworkLockedPage({ onBack }: { onBack: () => void }) {
  return <main className="training-page homework-locked-page">
    <button className="path-back-button" type="button" onClick={onBack}><ArrowLeft size={20} aria-hidden="true" />M’entraîner</button>
    <section className="homework-lock-panel" aria-labelledby="homework-lock-title"><LockKey size={38} weight="duotone" aria-hidden="true" /><h1 id="homework-lock-title">Devoirs temporairement verrouillés</h1><p>Cette rubrique sera de nouveau accessible prochainement.</p></section>
  </main>;
}
