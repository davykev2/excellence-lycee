-- Excellence Lycée : récompenses XP des 10 parcours de Philosophie Terminale.

with published_paths(path_id, lesson_suffixes) as (
  values
    ('terminale-philo-l1-dissertation', array['overview', 'study-subject', 'problematisation', 'introduction', 'development-conclusion', 'mission-finale']),
    ('terminale-philo-l2-text-commentary', array['overview', 'problematics', 'ordered-study', 'philosophical-interest', 'introduction-conclusion', 'mission-finale']),
    ('terminale-philo-l3-knowledge-of-man', array['overview', 'consciousness-memory', 'freedom', 'unconscious', 'determinism-responsibility', 'mission-finale']),
    ('terminale-philo-l4-social-life', array['overview', 'social-human', 'others', 'state-nation', 'social-violence', 'mission-finale']),
    ('terminale-philo-l5-god-religion', array['overview', 'god-sacred', 'criticism-god', 'roles-religion', 'religion-freedom', 'mission-finale']),
    ('terminale-philo-l6-history-humanity', array['overview', 'humanity-culture', 'historicity', 'object-subject-history', 'decolonize-diversity', 'mission-finale']),
    ('terminale-philo-l7-value-philosophy', array['overview', 'philosophy-reason', 'myth-reason-opposition', 'myth-reason-complementarity', 'usefulness-philosophy', 'mission-finale']),
    ('terminale-philo-l8-progress-happiness', array['overview', 'desire-passion', 'work-technique-art', 'material-progress', 'conditions-happiness', 'mission-finale']),
    ('terminale-philo-l9-language-truth', array['overview', 'communication-language', 'language-thought', 'criteria-truth', 'power-limits-language', 'mission-finale']),
    ('terminale-philo-l10-scientific-knowledge', array['overview', 'forms-knowledge', 'types-science', 'scientific-process', 'limits-bioethics', 'mission-finale'])
), published_rewards as (
  select
    published_paths.path_id,
    published_paths.path_id || '-' || lesson.suffix as lesson_id,
    (array[40, 55, 60, 65, 70, 80])[lesson.ordinality::integer] as xp_awarded
  from published_paths
  cross join lateral unnest(published_paths.lesson_suffixes)
    with ordinality as lesson(suffix, ordinality)
)
insert into public.lesson_rewards (path_id, lesson_id, xp_awarded)
select path_id, lesson_id, xp_awarded
from published_rewards
on conflict (path_id, lesson_id) do update
  set xp_awarded = excluded.xp_awarded;
