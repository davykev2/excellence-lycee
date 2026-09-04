import { z } from "zod";

// Supabase Auth n'impose aucune catégorie de caractères lorsque l'option
// correspondante est désactivée. Il conserve uniquement ces bornes techniques.
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 72;

export const passwordSchema = z.string()
  .min(
    MIN_PASSWORD_LENGTH,
    `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères. Son format reste libre.`,
  )
  .max(
    MAX_PASSWORD_LENGTH,
    `Le mot de passe ne peut pas dépasser ${MAX_PASSWORD_LENGTH} caractères.`,
  );
