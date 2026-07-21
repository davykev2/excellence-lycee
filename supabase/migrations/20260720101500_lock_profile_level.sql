-- Excellence Lycée: le niveau et la série ne peuvent plus être modifiés par l'utilisateur.
-- La fonction security-definer admin_update_profile_level reste la seule voie de modification.

revoke update (level_id) on table public.profiles from authenticated;
