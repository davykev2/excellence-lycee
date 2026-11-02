import { ArrowClockwise, WarningCircle } from "@phosphor-icons/react";
export interface DashboardSyncIssue { message: string; onRetry: () => void; }
export function HomeSyncNotice({ issue }: { issue?: DashboardSyncIssue | null }) {
  return issue ? <section className="home-sync-error" role="alert"><WarningCircle size={22} /><span>{issue.message}</span><button type="button" onClick={issue.onRetry}><ArrowClockwise size={17} /> Réessayer</button></section> : null;
}
