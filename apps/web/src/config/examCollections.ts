import { getBacExamBySlug } from "../data/bacExamCatalog";

/** Temporary product lock, including previews/admin reading. Content and submissions are preserved.
 * This is a Web display gate, not authorization for the API or public source assets.
 */
export const INP_HB_COLLECTION_LOCKED = true;

/** All subjects in the current catalog belong to the existing first collection.
 * Future official BAC subjects must use their own collection, not this legacy catalog.
 */
export function isCurrentExamSubjectLocked(slug: string | undefined) {
  return INP_HB_COLLECTION_LOCKED && Boolean(getBacExamBySlug(slug));
}
