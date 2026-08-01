import { createClient, type User } from "@supabase/supabase-js";
import { config } from "./config.js";
import type { AccountAudience, UserRole } from "./database.js";
import type {
  LessonContentDocument,
  LessonContentPayload,
  LessonContentRevision,
  LessonContentStatus,
  PublishedLessonContent,
} from "./content.js";
import type {
  ArenaExerciseLevelDocument,
  ArenaExerciseLevelPayload,
  ArenaExerciseStatus,
  PublishedArenaExerciseLevel,
} from "./arenaExercises.js";
import type { GlobalMessageSummary, MessageRecipientSummary, MessageThreadSummary, ThreadMessageSummary } from "./messaging.js";
import type {
  AdminFeedbackItem,
  CommentReaction,
  LessonFeedbackSummary,
  LessonReaction,
} from "./lessonFeedback.js";
import {
  getBacExamAppreciation,
  type BacExamAnswers,
  type BacExamParticipantResult,
  type BacExamState,
  type BacExamZone,
} from "./bacExam.js";

export interface PublicAuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  accountType: AccountAudience;
  levelId: string;
  photoUrl?: string;
  emailVerified: boolean;
}

interface ProfileRow {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  account_type: AccountAudience;
  level_id: string;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ProgressRow {
  path_id: string;
  lesson_id: string;
  xp_awarded: number;
  best_score: number;
  attempt_count: number;
  completed_at: string;
}

interface AdminProgressRow extends ProgressRow {
  user_id: string;
}

interface LessonContentRow {
  id: string;
  path_id: string;
  lesson_id: string;
  payload: LessonContentPayload;
  status: LessonContentStatus;
  draft_version: number;
  published_version: number | null;
  published_payload: LessonContentPayload | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

interface LessonContentRevisionRow {
  id: string;
  document_id: string;
  version: number;
  payload: LessonContentPayload;
  note: string | null;
  created_by: string | null;
  created_at: string;
}

interface ArenaExerciseLevelRow {
  id: string;
  level_id: string;
  subject_id: string;
  lesson_key: string;
  difficulty: "easy" | "medium" | "hard";
  stage_number: number;
  payload: ArenaExerciseLevelPayload;
  status: ArenaExerciseStatus;
  draft_version: number;
  published_version: number | null;
  published_payload: ArenaExerciseLevelPayload | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface AdminUserSummary {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  accountType: AccountAudience;
  levelId: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
  completedLessons: number;
  totalXp: number;
}

export type LeaderboardPeriod = "week" | "month" | "all-time";

export interface LeaderboardSummary {
  id: string;
  name: string;
  photoUrl?: string;
  score: number;
  completedLessons: number;
  streakDays: number;
  rank: number;
  isCurrentLearner: boolean;
  levelId: string;
}

export class SupabaseOperationError extends Error {
  constructor(
    message: string,
    public status = 500,
    public code?: string,
  ) {
    super(message);
    this.statusCode = status;
  }

  readonly statusCode: number;
}

export const supabaseConfigured = config.dataProvider === "supabase";

const authClient = supabaseConfigured
  ? createClient(config.supabaseUrl, config.supabasePublishableKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    })
  : null;

function requireAuthClient() {
  if (!authClient) throw new SupabaseOperationError("Supabase n’est pas configuré.", 503, "SUPABASE_NOT_CONFIGURED");
  return authClient;
}

function userDataClient(accessToken: string) {
  return createClient(config.supabaseUrl, config.supabasePublishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

function authFailure(error: { message: string; status?: number; code?: string }) {
  return new SupabaseOperationError(error.message, error.status ?? 400, error.code);
}

function asPublicUser(user: User, profile: ProfileRow): PublicAuthUser {
  return {
    id: user.id,
    email: user.email ?? profile.email,
    name: profile.name,
    role: profile.role,
    accountType: profile.account_type,
    levelId: profile.level_id,
    photoUrl: profile.photo_url ?? undefined,
    emailVerified: Boolean(user.email_confirmed_at),
  };
}

function asLessonContentDocument(row: LessonContentRow): LessonContentDocument {
  return {
    id: row.id,
    pathId: row.path_id,
    lessonId: row.lesson_id,
    ...row.payload,
    status: row.status,
    draftVersion: row.draft_version,
    publishedVersion: row.published_version ?? undefined,
    hasPublishedVersion: Boolean(row.published_payload),
    updatedAt: row.updated_at,
    publishedAt: row.published_at ?? undefined,
  };
}

function asLessonContentRevision(row: LessonContentRevisionRow): LessonContentRevision {
  return {
    id: row.id,
    documentId: row.document_id,
    version: row.version,
    payload: row.payload,
    note: row.note ?? undefined,
    createdAt: row.created_at,
  };
}

function asArenaExerciseLevelDocument(row: ArenaExerciseLevelRow): ArenaExerciseLevelDocument {
  return {
    id: row.id,
    ...row.payload,
    status: row.status,
    draftVersion: row.draft_version,
    publishedVersion: row.published_version ?? undefined,
    hasPublishedVersion: Boolean(row.published_payload),
    createdBy: row.created_by ?? undefined,
    updatedAt: row.updated_at,
    publishedAt: row.published_at ?? undefined,
  };
}

async function loadProfile(accessToken: string, user: User) {
  const client = userDataClient(accessToken);
  const { data, error } = await client
    .from("profiles")
    .select("id,email,name,role,account_type,level_id,photo_url,created_at,updated_at")
    .eq("id", user.id)
    .single();
  if (error) throw new SupabaseOperationError(error.message, 500, error.code);
  return data as ProfileRow;
}

export async function registerWithSupabase(input: {
  name: string;
  email: string;
  password: string;
  levelId: string;
  accountType: AccountAudience;
}) {
  const { data, error } = await requireAuthClient().auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name,
        level_id: input.levelId,
        account_type: input.accountType,
      },
    },
  });
  if (error) throw authFailure(error);
  if (!data.user) throw new SupabaseOperationError("Le compte n’a pas pu être créé.", 500, "SIGNUP_FAILED");
  if (!data.session) return { emailConfirmationRequired: true as const, email: input.email };
  const profile = await loadProfile(data.session.access_token, data.user);
  return {
    emailConfirmationRequired: false as const,
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    user: asPublicUser(data.user, profile),
  };
}

export async function loginWithSupabase(email: string, password: string) {
  const { data, error } = await requireAuthClient().auth.signInWithPassword({ email, password });
  if (error) throw authFailure(error);
  const profile = await loadProfile(data.session.access_token, data.user);
  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    user: asPublicUser(data.user, profile),
  };
}

export async function requestSupabasePasswordReset(email: string) {
  const { error } = await requireAuthClient().auth.resetPasswordForEmail(email, {
    redirectTo: `${config.webOrigin.replace(/\/$/, "")}/?auth=recovery`,
  });
  if (error) throw authFailure(error);
}

export async function confirmSupabasePasswordReset(accessToken: string, password: string) {
  const response = await fetch(`${config.supabaseUrl}/auth/v1/user`, {
    method: "PUT",
    headers: {
      apikey: config.supabasePublishableKey,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as { message?: string; msg?: string; error_code?: string };
    throw new SupabaseOperationError(
      payload.message ?? payload.msg ?? "Le lien de récupération est invalide ou expiré.",
      response.status,
      payload.error_code ?? "PASSWORD_RECOVERY_FAILED",
    );
  }

  // Révoque les anciennes sessions après le changement. L'élève se reconnecte
  // ensuite normalement avec son nouveau mot de passe.
  await fetch(`${config.supabaseUrl}/auth/v1/logout?scope=global`, {
    method: "POST",
    headers: {
      apikey: config.supabasePublishableKey,
      Authorization: `Bearer ${accessToken}`,
    },
  }).catch(() => undefined);
}

export async function refreshWithSupabase(refreshToken: string) {
  const { data, error } = await requireAuthClient().auth.refreshSession({ refresh_token: refreshToken });
  if (error || !data.session || !data.user) {
    throw authFailure(error ?? { message: "La session a expiré.", status: 401, code: "SESSION_EXPIRED" });
  }
  const profile = await loadProfile(data.session.access_token, data.user);
  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    user: asPublicUser(data.user, profile),
  };
}

export async function logoutFromSupabase(accessToken: string | undefined, refreshToken: string | undefined) {
  if (!accessToken || !refreshToken) return;
  const client = userDataClient(accessToken);
  const { error: sessionError } = await client.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (sessionError) return;
  await client.auth.signOut({ scope: "local" });
}

export async function authenticateWithSupabase(accessToken: string) {
  const { data, error } = await requireAuthClient().auth.getUser(accessToken);
  if (error || !data.user) throw authFailure(error ?? { message: "Authentification requise.", status: 401 });
  const profile = await loadProfile(accessToken, data.user);
  return {
    id: data.user.id,
    email: data.user.email ?? profile.email,
    role: profile.role,
    accessToken,
    user: asPublicUser(data.user, profile),
  };
}

export async function getSupabasePublicStats() {
  const { data, error } = await requireAuthClient().rpc("get_public_platform_stats");
  if (error) throw new SupabaseOperationError(error.message, 500, error.code);
  const row = (data as Array<{ registered_users: number | string }> | null)?.[0];
  return { registeredUsers: Number(row?.registered_users ?? 0) };
}

export async function updateSupabaseProfile(
  accessToken: string,
  userId: string,
  input: { name: string; photoUrl?: string | null },
) {
  const client = userDataClient(accessToken);
  const { data, error } = await client
    .from("profiles")
    .update({ name: input.name, photo_url: input.photoUrl ?? null })
    .eq("id", userId)
    .select("id,email,name,role,account_type,level_id,photo_url,created_at,updated_at")
    .single();
  if (error) throw new SupabaseOperationError(error.message, 400, error.code);
  const { data: authData, error: authError } = await requireAuthClient().auth.getUser(accessToken);
  if (authError || !authData.user) throw authFailure(authError ?? { message: "Compte introuvable.", status: 404 });
  return asPublicUser(authData.user, data as ProfileRow);
}

const profilePhotoBucket = "profile-photos";

async function updateSupabaseProfilePhotoUrl(accessToken: string, userId: string, photoUrl: string | null) {
  const client = userDataClient(accessToken);
  const { data, error } = await client
    .from("profiles")
    .update({ photo_url: photoUrl })
    .eq("id", userId)
    .select("id,email,name,role,account_type,level_id,photo_url,created_at,updated_at")
    .single();
  if (error) throw new SupabaseOperationError(error.message, 400, error.code);
  const { data: authData, error: authError } = await requireAuthClient().auth.getUser(accessToken);
  if (authError || !authData.user) throw authFailure(authError ?? { message: "Compte introuvable.", status: 404 });
  return asPublicUser(authData.user, data as ProfileRow);
}

export async function uploadSupabaseProfilePhoto(
  accessToken: string,
  userId: string,
  photo: { bytes: Uint8Array; mimeType: "image/jpeg" | "image/png" | "image/webp" },
) {
  const client = userDataClient(accessToken);
  const objectPath = `${userId}/avatar`;
  const { error: uploadError } = await client.storage
    .from(profilePhotoBucket)
    .upload(objectPath, photo.bytes, {
      contentType: photo.mimeType,
      cacheControl: "3600",
      upsert: true,
    });
  if (uploadError) throw new SupabaseOperationError(uploadError.message, 400, "PROFILE_PHOTO_UPLOAD_FAILED");
  const { data } = client.storage.from(profilePhotoBucket).getPublicUrl(objectPath);
  return updateSupabaseProfilePhotoUrl(accessToken, userId, `${data.publicUrl}?v=${Date.now()}`);
}

export async function deleteSupabaseProfilePhoto(accessToken: string, userId: string) {
  const client = userDataClient(accessToken);
  const { error } = await client.storage.from(profilePhotoBucket).remove([`${userId}/avatar`]);
  if (error) throw new SupabaseOperationError(error.message, 400, "PROFILE_PHOTO_DELETE_FAILED");
  return updateSupabaseProfilePhotoUrl(accessToken, userId, null);
}

export async function listSupabaseAdminUsers(accessToken: string): Promise<AdminUserSummary[]> {
  const client = userDataClient(accessToken);
  const [profilesResult, progressResult] = await Promise.all([
    client
      .from("profiles")
      .select("id,email,name,role,account_type,level_id,photo_url,created_at,updated_at")
      .order("created_at", { ascending: false }),
    client
      .from("lesson_progress")
      .select("user_id,path_id,lesson_id,xp_awarded,best_score,attempt_count,completed_at")
      .order("completed_at", { ascending: false }),
  ]);

  if (profilesResult.error) {
    throw new SupabaseOperationError(profilesResult.error.message, 500, profilesResult.error.code);
  }
  if (progressResult.error) {
    throw new SupabaseOperationError(progressResult.error.message, 500, progressResult.error.code);
  }

  const progressByUser = new Map<string, { completedLessons: number; totalXp: number; lastActiveAt: string }>();
  for (const row of (progressResult.data ?? []) as AdminProgressRow[]) {
    const current = progressByUser.get(row.user_id) ?? {
      completedLessons: 0,
      totalXp: 0,
      lastActiveAt: row.completed_at,
    };
    current.completedLessons += 1;
    current.totalXp += row.xp_awarded;
    if (row.completed_at > current.lastActiveAt) current.lastActiveAt = row.completed_at;
    progressByUser.set(row.user_id, current);
  }

  return ((profilesResult.data ?? []) as ProfileRow[]).map((profile) => {
    const progress = progressByUser.get(profile.id);
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      accountType: profile.account_type,
      levelId: profile.level_id,
      photoUrl: profile.photo_url ?? undefined,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
      lastActiveAt: progress?.lastActiveAt && progress.lastActiveAt > profile.updated_at
        ? progress.lastActiveAt
        : profile.updated_at,
      completedLessons: progress?.completedLessons ?? 0,
      totalXp: progress?.totalXp ?? 0,
    };
  });
}

export async function updateSupabaseAdminProfileLevel(
  accessToken: string,
  userId: string,
  levelId: string,
) {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("admin_update_profile_level", {
    p_user_id: userId,
    p_level_id: levelId,
  });
  if (error) {
    const status = error.code === "42501" ? 403 : error.code === "P0002" ? 404 : 400;
    throw new SupabaseOperationError(error.message, status, error.code);
  }
  const result = (data as Array<{ user_id: string; new_level_id: string; changed_at: string }> | null)?.[0];
  if (!result) throw new SupabaseOperationError("Le niveau n’a pas pu être modifié.", 500);
  return {
    id: result.user_id,
    levelId: result.new_level_id,
    updatedAt: result.changed_at,
  };
}

export async function updateSupabaseAdminProfileRole(
  accessToken: string,
  userId: string,
  role: UserRole,
) {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("admin_update_profile_role", {
    p_user_id: userId,
    p_role: role,
  });
  if (error) {
    const status = error.code === "42501" ? 403 : error.code === "P0002" ? 404 : 400;
    throw new SupabaseOperationError(error.message, status, error.code);
  }
  const result = (data as Array<{ user_id: string; new_role: UserRole; changed_at: string }> | null)?.[0];
  if (!result) throw new SupabaseOperationError("Le rôle n’a pas pu être modifié.", 500);
  return { id: result.user_id, role: result.new_role, updatedAt: result.changed_at };
}

const lessonContentSelect = "id,path_id,lesson_id,payload,status,draft_version,published_version,published_payload,created_by,updated_by,created_at,updated_at,published_at";

export async function listSupabasePublishedLessonContents(accessToken: string): Promise<PublishedLessonContent[]> {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("get_published_lesson_contents");
  if (error) throw new SupabaseOperationError(error.message, 500, error.code);
  return ((data ?? []) as Array<{
    path_id: string;
    lesson_id: string;
    published_payload: LessonContentPayload;
    published_version: number;
    published_at: string;
  }>).map((row) => ({
    pathId: row.path_id,
    lessonId: row.lesson_id,
    ...row.published_payload,
    version: row.published_version,
    publishedAt: row.published_at,
  }));
}

export async function listSupabaseAdminLessonContents(accessToken: string): Promise<LessonContentDocument[]> {
  const client = userDataClient(accessToken);
  const { data, error } = await client
    .from("lesson_contents")
    .select(lessonContentSelect)
    .order("updated_at", { ascending: false });
  if (error) throw new SupabaseOperationError(error.message, 500, error.code);
  return ((data ?? []) as unknown as LessonContentRow[]).map(asLessonContentDocument);
}

export async function saveSupabaseLessonContent(
  accessToken: string,
  actorUserId: string,
  input: { pathId: string; lessonId: string; payload: LessonContentPayload; note?: string },
) {
  const client = userDataClient(accessToken);
  const existingResult = await client
    .from("lesson_contents")
    .select(lessonContentSelect)
    .eq("path_id", input.pathId)
    .eq("lesson_id", input.lessonId)
    .maybeSingle();
  if (existingResult.error) throw new SupabaseOperationError(existingResult.error.message, 400, existingResult.error.code);

  const existing = existingResult.data as unknown as LessonContentRow | null;
  const nextVersion = (existing?.draft_version ?? 0) + 1;
  const now = new Date().toISOString();
  const mutation = existing
    ? client.from("lesson_contents").update({
        payload: input.payload,
        draft_version: nextVersion,
        status: existing.status === "published" ? "draft" : existing.status,
        updated_by: actorUserId,
        updated_at: now,
      }).eq("id", existing.id)
    : client.from("lesson_contents").insert({
        path_id: input.pathId,
        lesson_id: input.lessonId,
        payload: input.payload,
        status: "draft",
        draft_version: nextVersion,
        created_by: actorUserId,
        updated_by: actorUserId,
        created_at: now,
        updated_at: now,
      });

  const { data, error } = await mutation.select(lessonContentSelect).single();
  if (error) throw new SupabaseOperationError(error.message, 400, error.code);
  const document = data as unknown as LessonContentRow;
  const revisionResult = await client.from("lesson_content_revisions").insert({
    document_id: document.id,
    version: nextVersion,
    payload: input.payload,
    note: input.note ?? "Sauvegarde automatique",
    created_by: actorUserId,
    created_at: now,
  });
  if (revisionResult.error) throw new SupabaseOperationError(revisionResult.error.message, 400, revisionResult.error.code);
  return asLessonContentDocument(document);
}

export async function updateSupabaseLessonContentStatus(
  accessToken: string,
  actorUserId: string,
  documentId: string,
  status: LessonContentStatus,
  unpublish = false,
) {
  const client = userDataClient(accessToken);
  const currentResult = await client
    .from("lesson_contents")
    .select(lessonContentSelect)
    .eq("id", documentId)
    .single();
  if (currentResult.error) throw new SupabaseOperationError(currentResult.error.message, currentResult.error.code === "PGRST116" ? 404 : 400, currentResult.error.code);
  const current = currentResult.data as unknown as LessonContentRow;
  const now = new Date().toISOString();
  const patch: Record<string, unknown> = { status, updated_by: actorUserId, updated_at: now };
  if (status === "published") {
    patch.published_payload = current.payload;
    patch.published_version = current.draft_version;
    patch.published_at = now;
  } else if (unpublish) {
    patch.published_payload = null;
    patch.published_version = null;
    patch.published_at = null;
  }
  const { data, error } = await client
    .from("lesson_contents")
    .update(patch)
    .eq("id", documentId)
    .select(lessonContentSelect)
    .single();
  if (error) throw new SupabaseOperationError(error.message, 400, error.code);
  return asLessonContentDocument(data as unknown as LessonContentRow);
}

export async function listSupabaseLessonContentRevisions(accessToken: string, documentId: string) {
  const client = userDataClient(accessToken);
  const { data, error } = await client
    .from("lesson_content_revisions")
    .select("id,document_id,version,payload,note,created_by,created_at")
    .eq("document_id", documentId)
    .order("version", { ascending: false })
    .limit(50);
  if (error) throw new SupabaseOperationError(error.message, 400, error.code);
  return ((data ?? []) as unknown as LessonContentRevisionRow[]).map(asLessonContentRevision);
}

export async function restoreSupabaseLessonContentRevision(
  accessToken: string,
  actorUserId: string,
  documentId: string,
  revisionId: string,
) {
  const client = userDataClient(accessToken);
  const [documentResult, revisionResult] = await Promise.all([
    client.from("lesson_contents").select(lessonContentSelect).eq("id", documentId).single(),
    client.from("lesson_content_revisions").select("id,document_id,version,payload,note,created_by,created_at").eq("id", revisionId).eq("document_id", documentId).single(),
  ]);
  if (documentResult.error || revisionResult.error) {
    const error = documentResult.error ?? revisionResult.error!;
    throw new SupabaseOperationError(error.message, error.code === "PGRST116" ? 404 : 400, error.code);
  }
  const current = documentResult.data as unknown as LessonContentRow;
  const revision = revisionResult.data as unknown as LessonContentRevisionRow;
  const nextVersion = current.draft_version + 1;
  const now = new Date().toISOString();
  const { data, error } = await client
    .from("lesson_contents")
    .update({
      payload: revision.payload,
      draft_version: nextVersion,
      status: "draft",
      updated_by: actorUserId,
      updated_at: now,
    })
    .eq("id", documentId)
    .select(lessonContentSelect)
    .single();
  if (error) throw new SupabaseOperationError(error.message, 400, error.code);
  const historyResult = await client.from("lesson_content_revisions").insert({
    document_id: documentId,
    version: nextVersion,
    payload: revision.payload,
    note: `Restauration de la version ${revision.version}`,
    created_by: actorUserId,
    created_at: now,
  });
  if (historyResult.error) throw new SupabaseOperationError(historyResult.error.message, 400, historyResult.error.code);
  return asLessonContentDocument(data as unknown as LessonContentRow);
}

const arenaExerciseLevelSelect = "id,level_id,subject_id,lesson_key,difficulty,stage_number,payload,status,draft_version,published_version,published_payload,created_by,updated_by,created_at,updated_at,published_at";

export async function listSupabasePublishedArenaExerciseLevels(
  accessToken: string,
  filters: { levelId: string; subjectId: string; lessonKey?: string },
): Promise<PublishedArenaExerciseLevel[]> {
  const client = userDataClient(accessToken);
  let query = client
    .from("arena_exercise_levels")
    .select(arenaExerciseLevelSelect)
    .eq("level_id", filters.levelId)
    .eq("subject_id", filters.subjectId)
    .not("published_payload", "is", null)
    .order("difficulty", { ascending: true })
    .order("stage_number", { ascending: true });
  if (filters.lessonKey) query = query.eq("lesson_key", filters.lessonKey);
  const { data, error } = await query;
  if (error) throw new SupabaseOperationError(error.message, 500, error.code);
  return ((data ?? []) as unknown as ArenaExerciseLevelRow[]).flatMap((row) => row.published_payload
    ? [{
        id: row.id,
        ...row.published_payload,
        version: row.published_version ?? row.draft_version,
        publishedAt: row.published_at ?? row.updated_at,
      }]
    : []);
}

export async function listSupabaseEditorArenaExerciseLevels(accessToken: string): Promise<ArenaExerciseLevelDocument[]> {
  const client = userDataClient(accessToken);
  const { data, error } = await client
    .from("arena_exercise_levels")
    .select(arenaExerciseLevelSelect)
    .order("updated_at", { ascending: false });
  if (error) throw new SupabaseOperationError(error.message, 500, error.code);
  return ((data ?? []) as unknown as ArenaExerciseLevelRow[]).map(asArenaExerciseLevelDocument);
}

export async function saveSupabaseArenaExerciseLevel(
  accessToken: string,
  documentId: string | undefined,
  payload: ArenaExerciseLevelPayload,
  note?: string,
) {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("save_arena_exercise_level", {
    p_document_id: documentId ?? null,
    p_payload: payload,
    p_note: note ?? "Sauvegarde du brouillon",
  });
  if (error) {
    const status = error.code === "42501" ? 403 : error.code === "P0002" ? 404 : 400;
    throw new SupabaseOperationError(error.message, status, error.code);
  }
  const savedId = data as string | null;
  if (!savedId) throw new SupabaseOperationError("Le niveau d’exercices n’a pas pu être enregistré.", 500);
  const saved = await client.from("arena_exercise_levels").select(arenaExerciseLevelSelect).eq("id", savedId).single();
  if (saved.error) throw new SupabaseOperationError(saved.error.message, 500, saved.error.code);
  return asArenaExerciseLevelDocument(saved.data as unknown as ArenaExerciseLevelRow);
}

export async function updateSupabaseArenaExerciseLevelStatus(
  accessToken: string,
  documentId: string,
  status: ArenaExerciseStatus,
) {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("set_arena_exercise_level_status", {
    p_document_id: documentId,
    p_status: status,
  });
  if (error) {
    const code = error.code === "42501" ? 403 : error.code === "P0002" ? 404 : 400;
    throw new SupabaseOperationError(error.message, code, error.code);
  }
  const savedId = data as string | null;
  if (!savedId) throw new SupabaseOperationError("Le statut n’a pas pu être modifié.", 500);
  const saved = await client.from("arena_exercise_levels").select(arenaExerciseLevelSelect).eq("id", savedId).single();
  if (saved.error) throw new SupabaseOperationError(saved.error.message, 500, saved.error.code);
  return asArenaExerciseLevelDocument(saved.data as unknown as ArenaExerciseLevelRow);
}

export async function getSupabaseProgress(accessToken: string, userId: string) {
  const client = userDataClient(accessToken);
  const { data, error } = await client
    .from("lesson_progress")
    .select("path_id,lesson_id,xp_awarded,best_score,attempt_count,completed_at")
    .eq("user_id", userId)
    .order("completed_at", { ascending: true });
  if (error) throw new SupabaseOperationError(error.message, 500, error.code);
  const rows = (data ?? []) as ProgressRow[];
  return {
    lessons: rows.map((row) => ({
      pathId: row.path_id,
      lessonId: row.lesson_id,
      xpAwarded: row.xp_awarded,
      bestScore: row.best_score,
      attemptCount: row.attempt_count,
      completedAt: row.completed_at,
    })),
    totals: {
      completedLessons: rows.length,
      totalXp: rows.reduce((total, row) => total + row.xp_awarded, 0),
    },
  };
}

export async function getSupabaseClassLeaderboard(
  accessToken: string,
  period: LeaderboardPeriod,
): Promise<LeaderboardSummary[]> {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("get_class_leaderboard", { p_period: period });
  if (error) {
    if (error.code === "PGRST202") {
      throw new SupabaseOperationError(
        "Le classement est en cours d’activation. Réessaie dans quelques instants.",
        503,
        "LEADERBOARD_NOT_READY",
      );
    }
    const status = error.code === "42501" ? 401 : error.code === "22023" ? 400 : 500;
    throw new SupabaseOperationError(error.message, status, error.code);
  }

  return ((data ?? []) as Array<{
    user_id: string;
    learner_name: string;
    photo_url: string | null;
    score: number;
    completed_lessons: number;
    streak_days: number;
    ranking: number;
    is_current_user: boolean;
    level_id: string;
  }>).map((entry) => ({
    id: entry.user_id,
    name: entry.learner_name,
    photoUrl: entry.photo_url ?? undefined,
    score: Number(entry.score),
    completedLessons: Number(entry.completed_lessons),
    streakDays: Number(entry.streak_days),
    rank: Number(entry.ranking),
    isCurrentLearner: entry.is_current_user,
    levelId: entry.level_id,
  }));
}

export async function completeSupabaseLesson(accessToken: string, pathId: string, lessonId: string) {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("complete_lesson", {
    p_path_id: pathId,
    p_lesson_id: lessonId,
  });
  if (error) {
    const status = error.code === "P0002" ? 404 : 400;
    throw new SupabaseOperationError(error.message, status, error.code);
  }
  const result = (data as Array<{ created: boolean; xp_awarded: number }> | null)?.[0];
  if (!result) throw new SupabaseOperationError("La progression n’a pas pu être enregistrée.", 500);
  return { created: result.created, xpAwarded: result.xp_awarded };
}

export async function submitSupabaseLevelAttempt(accessToken: string, pathId: string, lessonId: string, scoreOutOf20: number) {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("submit_level_attempt", {
    p_path_id: pathId,
    p_lesson_id: lessonId,
    p_score: scoreOutOf20,
  });
  if (error) {
    const status = error.code === "P0002" ? 404 : 400;
    throw new SupabaseOperationError(error.message, status, error.code);
  }
  const result = (data as Array<{
    passed: boolean;
    improved: boolean;
    xp_delta: number;
    xp_awarded: number;
    best_score: number;
    attempt_count: number;
  }> | null)?.[0];
  if (!result) throw new SupabaseOperationError("Le résultat n’a pas pu être enregistré.", 500);
  return {
    passed: result.passed,
    improved: result.improved,
    xpDelta: result.xp_delta,
    xpAwarded: result.xp_awarded,
    bestScore: result.best_score,
    attemptCount: result.attempt_count,
  };
}

export async function getSupabaseStoreWallet(accessToken: string) {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("get_store_wallet");
  if (error) throw new SupabaseOperationError(error.message, error.code === "42501" ? 401 : 500, error.code);
  const row = (data as Array<{
    gold_balance: number;
    gold_spent: number;
    total_xp: number;
    owned_item_ids: string[] | null;
  }> | null)?.[0];
  return {
    goldBalance: Number(row?.gold_balance ?? 0),
    goldSpent: Number(row?.gold_spent ?? 0),
    totalXp: Number(row?.total_xp ?? 0),
    ownedItemIds: row?.owned_item_ids ?? [],
  };
}

export async function purchaseSupabaseStoreItem(accessToken: string, itemId: string) {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("purchase_store_item", { p_item_id: itemId });
  if (error) {
    const status = error.code === "P0002" ? 404 : error.code === "42501" ? 401 : 400;
    throw new SupabaseOperationError(error.message, status, error.code);
  }
  const row = (data as Array<{ gold_balance: number; item_id: string }> | null)?.[0];
  if (!row) throw new SupabaseOperationError("L’achat n’a pas pu être enregistré.", 500);
  return { goldBalance: Number(row.gold_balance), itemId: row.item_id };
}

export async function writeSupabaseAudit(
  accessToken: string,
  actorUserId: string,
  action: string,
  subjectId?: string,
  metadata?: unknown,
) {
  const client = userDataClient(accessToken);
  const { error } = await client.from("audit_logs").insert({
    actor_user_id: actorUserId,
    action,
    subject_id: subjectId ?? null,
    metadata_json: metadata ?? null,
  });
  if (error) throw new SupabaseOperationError(error.message, 400, error.code);
}

export async function listSupabaseMessageRecipients(accessToken: string, search = ""): Promise<MessageRecipientSummary[]> {
  const client = userDataClient(accessToken);
  const { error: presenceError } = await client.rpc("touch_user_presence");
  if (presenceError) throw new SupabaseOperationError(presenceError.message, 500, presenceError.code);
  const { data, error } = await client.rpc("list_message_recipients", { p_search: search });
  if (error) throw new SupabaseOperationError(error.message, 500, error.code);
  return ((data ?? []) as Array<{
    user_id: string;
    user_name: string;
    user_role: UserRole;
    user_account_type: AccountAudience;
    user_level_id: string;
    user_photo_url: string | null;
    user_online: boolean;
    user_last_seen_at: string | null;
  }>).map((row) => ({
    id: row.user_id,
    name: row.user_name,
    role: row.user_role,
    accountType: row.user_account_type,
    levelId: row.user_level_id,
    photoUrl: row.user_photo_url ?? undefined,
    online: row.user_online,
    lastSeenAt: row.user_last_seen_at ?? undefined,
  }));
}

export async function listSupabaseMessageThreads(accessToken: string, includeArchived = false): Promise<MessageThreadSummary[]> {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("get_message_threads", { p_include_archived: includeArchived });
  if (error) throw new SupabaseOperationError(error.message, error.code === "PGRST202" ? 503 : 500, error.code);
  return ((data ?? []) as Array<{
    thread_id: string;
    thread_subject: string;
    participant_id: string;
    participant_name: string;
    participant_role: UserRole;
    participant_account_type: AccountAudience;
    participant_level_id: string;
    participant_photo_url: string | null;
    last_message_body: string | null;
    last_message_sender_id: string | null;
    last_message_created_at: string | null;
    last_message_deleted: boolean;
    unread_count: number;
    is_muted: boolean;
    is_archived: boolean;
    thread_created_at: string;
    thread_updated_at: string;
  }>).map((row) => ({
    id: row.thread_id,
    subject: row.thread_subject,
    participant: {
      id: row.participant_id,
      name: row.participant_name,
      role: row.participant_role,
      accountType: row.participant_account_type,
      levelId: row.participant_level_id,
      photoUrl: row.participant_photo_url ?? undefined,
    },
    lastMessage: {
      body: row.last_message_deleted ? "Message supprimé" : row.last_message_body ?? "Nouvelle conversation",
      senderId: row.last_message_sender_id ?? undefined,
      createdAt: row.last_message_created_at ?? row.thread_created_at,
      deleted: row.last_message_deleted,
    },
    unreadCount: Number(row.unread_count),
    muted: row.is_muted,
    archived: row.is_archived,
    createdAt: row.thread_created_at,
    updatedAt: row.thread_updated_at,
  }));
}

export async function getSupabaseThreadMessages(accessToken: string, threadId: string): Promise<ThreadMessageSummary[] | null> {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("get_thread_messages", { p_thread_id: threadId, p_limit: 150 });
  if (error) {
    if (error.code === "P0002" || error.code === "42501") return null;
    throw new SupabaseOperationError(error.message, 500, error.code);
  }
  return ((data ?? []) as Array<{
    message_id: string;
    thread_id: string;
    sender_id: string | null;
    sender_name: string;
    sender_photo_url: string | null;
    message_body: string;
    message_created_at: string;
    message_edited_at: string | null;
    message_deleted_at: string | null;
    is_mine: boolean;
    read_by_recipient: boolean;
    reply_to_id: string | null;
    reply_to_body: string | null;
    reply_to_sender_name: string | null;
    reply_to_deleted: boolean;
  }>).map((row) => ({
    id: row.message_id,
    threadId: row.thread_id,
    senderId: row.sender_id ?? undefined,
    senderName: row.sender_name,
    senderPhotoUrl: row.sender_photo_url ?? undefined,
    body: row.message_body,
    createdAt: row.message_created_at,
    editedAt: row.message_edited_at ?? undefined,
    deletedAt: row.message_deleted_at ?? undefined,
    isMine: row.is_mine,
    readByRecipient: row.read_by_recipient,
    replyTo: row.reply_to_id ? {
      id: row.reply_to_id,
      body: row.reply_to_body ?? "Message indisponible",
      senderName: row.reply_to_sender_name ?? "Utilisateur supprimé",
      deleted: row.reply_to_deleted,
    } : undefined,
  }));
}

export async function startSupabaseMessageThread(
  accessToken: string,
  input: { recipientId: string; subject: string; body: string },
): Promise<string | null | false> {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("start_message_thread", {
    p_recipient_id: input.recipientId,
    p_subject: input.subject,
    p_body: input.body,
  });
  if (error) {
    if (error.code === "P0002") return null;
    if (error.code === "42501") return false;
    throw new SupabaseOperationError(error.message, 400, error.code);
  }
  return data as string;
}

export async function sendSupabaseThreadMessage(
  accessToken: string,
  threadId: string,
  body: string,
  replyToId?: string | null,
): Promise<string | null | false> {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("send_thread_message", {
    p_thread_id: threadId,
    p_body: body,
    p_reply_to_id: replyToId ?? null,
  });
  if (error) {
    if (error.code === "P0002" || error.code === "42501") return null;
    if (error.code === "P0003") return false;
    throw new SupabaseOperationError(error.message, 400, error.code);
  }
  return data as string;
}

export async function markSupabaseThreadRead(accessToken: string, threadId: string) {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("mark_thread_read", { p_thread_id: threadId });
  if (error) throw new SupabaseOperationError(error.message, 400, error.code);
  return Boolean(data);
}

export async function updateSupabaseThreadPreferences(
  accessToken: string,
  threadId: string,
  input: { muted?: boolean; archived?: boolean },
) {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("update_thread_preferences", {
    p_thread_id: threadId,
    p_muted: input.muted ?? null,
    p_archived: input.archived ?? null,
  });
  if (error) throw new SupabaseOperationError(error.message, 400, error.code);
  return Boolean(data);
}

export async function editSupabaseMessage(accessToken: string, messageId: string, body: string) {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("edit_own_message", { p_message_id: messageId, p_body: body });
  if (error) throw new SupabaseOperationError(error.message, 400, error.code);
  return Boolean(data);
}

export async function deleteSupabaseMessage(accessToken: string, messageId: string) {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("delete_own_message", { p_message_id: messageId });
  if (error) throw new SupabaseOperationError(error.message, 400, error.code);
  return Boolean(data);
}

export async function listSupabaseGlobalMessages(accessToken: string, limit = 150): Promise<GlobalMessageSummary[]> {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("get_global_messages", { p_limit: limit });
  if (error) throw new SupabaseOperationError(error.message, error.code === "PGRST202" ? 503 : 500, error.code);
  return ((data ?? []) as Array<{
    message_id: string;
    sender_id: string | null;
    sender_name: string;
    sender_photo_url: string | null;
    sender_role: UserRole;
    sender_level_id: string;
    message_body: string;
    message_created_at: string;
    message_edited_at: string | null;
    message_deleted_at: string | null;
    is_mine: boolean;
    reply_to_id: string | null;
    reply_to_body: string | null;
    reply_to_sender_name: string | null;
    reply_to_deleted: boolean;
  }>).map((row) => ({
    id: row.message_id,
    threadId: "global",
    senderId: row.sender_id ?? undefined,
    senderName: row.sender_name,
    senderPhotoUrl: row.sender_photo_url ?? undefined,
    senderRole: row.sender_role,
    senderLevelId: row.sender_level_id,
    body: row.message_body,
    createdAt: row.message_created_at,
    editedAt: row.message_edited_at ?? undefined,
    deletedAt: row.message_deleted_at ?? undefined,
    isMine: row.is_mine,
    readByRecipient: false,
    replyTo: row.reply_to_id ? {
      id: row.reply_to_id,
      body: row.reply_to_body ?? "Message indisponible",
      senderName: row.reply_to_sender_name ?? "Utilisateur supprimé",
      deleted: row.reply_to_deleted,
    } : undefined,
  }));
}

export async function sendSupabaseGlobalMessage(accessToken: string, body: string, replyToId?: string | null) {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("send_global_message", { p_body: body, p_reply_to_id: replyToId ?? null });
  if (error) {
    if (error.code === "P0003") return false;
    throw new SupabaseOperationError(error.message, 400, error.code);
  }
  return data as string;
}

export async function editSupabaseGlobalMessage(accessToken: string, messageId: string, body: string) {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("edit_own_global_message", { p_message_id: messageId, p_body: body });
  if (error) throw new SupabaseOperationError(error.message, 400, error.code);
  return Boolean(data);
}

export async function deleteSupabaseGlobalMessage(accessToken: string, messageId: string) {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("delete_global_message", { p_message_id: messageId });
  if (error) throw new SupabaseOperationError(error.message, 400, error.code);
  return Boolean(data);
}

export async function getSupabaseLessonFeedback(
  accessToken: string,
  pathId: string,
  lessonId: string,
): Promise<LessonFeedbackSummary> {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("get_mastery_lesson_feedback", {
    p_path_id: pathId,
    p_lesson_id: lessonId,
  });
  if (error) throw new SupabaseOperationError(error.message, error.code === "PGRST202" ? 503 : 500, error.code);
  return data as unknown as LessonFeedbackSummary;
}

export async function setSupabaseLessonReaction(
  accessToken: string,
  pathId: string,
  lessonId: string,
  reaction: LessonReaction | null,
): Promise<LessonFeedbackSummary> {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("set_mastery_lesson_reaction", {
    p_path_id: pathId,
    p_lesson_id: lessonId,
    p_reaction: reaction,
  });
  if (error) throw new SupabaseOperationError(error.message, 400, error.code);
  return data as unknown as LessonFeedbackSummary;
}

export async function createSupabaseLessonComment(
  accessToken: string,
  pathId: string,
  lessonId: string,
  body: string,
) {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("create_mastery_lesson_comment", {
    p_path_id: pathId,
    p_lesson_id: lessonId,
    p_body: body,
  });
  if (error) throw new SupabaseOperationError(error.message, 400, error.code);
  return data as string;
}

export async function editSupabaseLessonComment(accessToken: string, commentId: string, body: string) {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("edit_mastery_lesson_comment", {
    p_comment_id: commentId,
    p_body: body,
  });
  if (error) throw new SupabaseOperationError(error.message, 400, error.code);
  return Boolean(data);
}

export async function deleteSupabaseLessonComment(accessToken: string, commentId: string) {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("delete_mastery_lesson_comment", {
    p_comment_id: commentId,
  });
  if (error) throw new SupabaseOperationError(error.message, 400, error.code);
  return Boolean(data);
}

export async function setSupabaseLessonCommentReaction(
  accessToken: string,
  commentId: string,
  reaction: CommentReaction | null,
): Promise<LessonFeedbackSummary> {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("set_mastery_lesson_comment_reaction", {
    p_comment_id: commentId,
    p_reaction: reaction,
  });
  if (error) throw new SupabaseOperationError(error.message, 400, error.code);
  return data as unknown as LessonFeedbackSummary;
}

export async function getSupabaseAdminFeedbackFeed(accessToken: string, limit = 40): Promise<AdminFeedbackItem[]> {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("get_admin_mastery_feedback_feed", { p_limit: limit });
  if (error) {
    const status = error.code === "42501" ? 403 : error.code === "PGRST202" ? 503 : 500;
    throw new SupabaseOperationError(error.message, status, error.code);
  }
  return (data ?? []) as unknown as AdminFeedbackItem[];
}

export async function getSupabaseBacExamState(accessToken: string, examId: string): Promise<BacExamState> {
  const client = userDataClient(accessToken);
  const [
    { data, error },
    { data: availability, error: availabilityError },
  ] = await Promise.all([
    client.rpc("get_bac_exam_state", { p_exam_id: examId }),
    client.rpc("get_bac_exam_availability", { p_exam_id: examId }),
  ]);
  if (error) {
    const status = error.code === "P0002" ? 404 : error.code === "42501" ? 401 : error.code === "PGRST202" ? 503 : 500;
    throw new SupabaseOperationError(error.message, status, error.code);
  }
  if (availabilityError) {
    const status = availabilityError.code === "P0002" ? 404
      : availabilityError.code === "42501" ? 401
        : availabilityError.code === "PGRST202" ? 503
          : 500;
    throw new SupabaseOperationError(availabilityError.message, status, availabilityError.code);
  }
  if (!data || typeof data !== "object") {
    throw new SupabaseOperationError("L’état de l’épreuve est indisponible.", 500, "BAC_EXAM_STATE_MISSING");
  }
  if (!availability || typeof availability !== "object") {
    throw new SupabaseOperationError("La disponibilité de l’épreuve est indisponible.", 500, "BAC_EXAM_AVAILABILITY_MISSING");
  }
  return { ...data, ...availability } as unknown as BacExamState;
}

export async function submitSupabaseBacExam(
  accessToken: string,
  examId: string,
  answers: BacExamAnswers,
  candidateZone: BacExamZone,
) {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("submit_bac_exam", {
    p_exam_id: examId,
    p_answers: answers,
    p_candidate_zone: candidateZone,
  });
  if (error) {
    const status = error.code === "P0002" ? 404
      : error.code === "23505" || error.code === "P0001" || error.code === "55000" ? 409
        : 400;
    throw new SupabaseOperationError(error.message, status, error.code);
  }
  if (typeof data !== "string") {
    throw new SupabaseOperationError("La copie n’a pas pu être enregistrée.", 500, "BAC_EXAM_SUBMISSION_MISSING");
  }
  return data;
}

export async function listSupabaseBacExamParticipantResults(
  accessToken: string,
  examId: string,
): Promise<BacExamParticipantResult[]> {
  const client = userDataClient(accessToken);
  const [
    { data, error },
    { data: zoneData, error: zoneError },
  ] = await Promise.all([
    client.rpc("get_bac_exam_participant_results", { p_exam_id: examId }),
    client.rpc("get_bac_exam_participant_zones", { p_exam_id: examId }),
  ]);
  if (error) {
    const status = error.code === "42501" ? 403
      : error.code === "P0002" ? 404
        : error.code === "55000" ? 409
          : error.code === "PGRST202" ? 503
            : 500;
    throw new SupabaseOperationError(error.message, status, error.code);
  }
  if (zoneError) {
    const status = zoneError.code === "42501" ? 403
      : zoneError.code === "P0002" ? 404
        : zoneError.code === "PGRST202" ? 503
          : 500;
    throw new SupabaseOperationError(zoneError.message, status, zoneError.code);
  }

  const zoneByUserId = new Map(
    ((zoneData ?? []) as unknown as Array<{ user_id: string; candidate_zone: BacExamZone | null }>)
      .map((row) => [row.user_id, row.candidate_zone] as const),
  );

  const rows = (data ?? []) as unknown as Array<{
    user_id: string;
    student_name: string;
    student_email: string;
    level_id: string;
    photo_url: string | null;
    submitted_at: string;
    correct_answers: number;
    score_max: number;
    english_correct: number;
    english_max: number;
    general_knowledge_correct: number;
    general_knowledge_max: number;
    scientific_knowledge_correct: number;
    scientific_knowledge_max: number;
  }>;

  return rows.map((row) => ({
    userId: row.user_id,
    name: row.student_name,
    email: row.student_email,
    levelId: row.level_id,
    photoUrl: row.photo_url ?? undefined,
    candidateZone: zoneByUserId.get(row.user_id) ?? undefined,
    submittedAt: row.submitted_at,
    correctAnswers: row.correct_answers,
    scoreMax: row.score_max,
    sectionScores: {
      english: {
        correctAnswers: row.english_correct,
        scoreMax: row.english_max,
      },
      generalKnowledge: {
        correctAnswers: row.general_knowledge_correct,
        scoreMax: row.general_knowledge_max,
      },
      scientificKnowledge: {
        correctAnswers: row.scientific_knowledge_correct,
        scoreMax: row.scientific_knowledge_max,
      },
    },
    appreciation: getBacExamAppreciation(row.correct_answers, row.score_max),
  }));
}

export async function setSupabaseBacExamResultsPublished(
  accessToken: string,
  examId: string,
  published: boolean,
) {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("set_bac_exam_results_published", {
    p_exam_id: examId,
    p_published: published,
  });
  if (error) {
    const status = error.code === "42501" ? 403 : error.code === "P0002" ? 404 : error.code === "55000" ? 409 : 400;
    throw new SupabaseOperationError(error.message, status, error.code);
  }
  return Boolean(data);
}

export async function setSupabaseBacExamSubjectPublished(
  accessToken: string,
  examId: string,
  published: boolean,
) {
  const client = userDataClient(accessToken);
  const { data, error } = await client.rpc("set_bac_exam_subject_published", {
    p_exam_id: examId,
    p_published: published,
  });
  if (error) {
    const status = error.code === "42501" ? 403 : error.code === "P0002" ? 404 : 400;
    throw new SupabaseOperationError(error.message, status, error.code);
  }
  return Boolean(data);
}
