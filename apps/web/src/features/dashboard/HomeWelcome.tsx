import { useEffect, useState, type ReactNode } from "react";
import { Lightbulb } from "@phosphor-icons/react";
import { ProfileAvatar } from "../../ui/ProfileAvatar";
import { homeTipStorageKey, nextHomeTip, readHomeTipRotation, saveHomeTipRotation, type TipStorage } from "./homeTips";

function browserStorage(): TipStorage | undefined {
  try { return typeof window === "undefined" ? undefined : window.localStorage; } catch { return undefined; }
}

/** One draw per mounted visit, no timer and no changes while the learner is reading. */
function HomeTipStrip({ userId, levelId }: { userId: string; levelId: string }) {
  const key = homeTipStorageKey(userId, levelId);
  const [selection] = useState(() => nextHomeTip(levelId, readHomeTipRotation(browserStorage(), key)));
  useEffect(() => { saveHomeTipRotation(browserStorage(), key, selection.rotation); }, [key, selection]);
  return <aside className="home-learning-tip" aria-labelledby="home-tip-title" data-tip-id={selection.tip.id}>
    <Lightbulb size={34} weight="duotone" aria-hidden="true" />
    <div><h2 id="home-tip-title">Astuce à retenir</h2><p>{selection.tip.text}</p></div>
  </aside>;
}

export function HomeWelcome({ userId, levelId, visitKey = 0, name, photoUrl, onOpenSpace, children }: {
  userId: string; levelId: string; visitKey?: number;
  name: string; photoUrl?: string; onOpenSpace: () => void; children: ReactNode;
}) {
  const firstName = name.trim().split(/\s+/)[0];
  return <main className="dashboard home-simple home-focused">
    <div className="home-focused-content">
      <header className="dashboard-header">
        <h1>Bienvenue{firstName ? `, ${firstName}` : ""} !</h1>
        <button className="home-profile-link" type="button" onClick={onOpenSpace} aria-label="Ouvrir mon espace personnel"><ProfileAvatar name={name} photoUrl={photoUrl} /></button>
      </header>
      <HomeTipStrip key={`${userId}:${levelId}:${visitKey}`} userId={userId} levelId={levelId} />
      {children}
    </div>
  </main>;
}
