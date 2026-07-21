-- Publie les 19 cours officiels de mathématiques de Terminale C.
-- Les activités d'introduction sont ignorées ; chaque niveau correspond à un bloc de cours
-- suivi de son exercice de fixation. Chaque parcours distribue exactement 10 000 XP.

create temporary table terminal_c_math_manifest (
  path_id text primary key,
  lesson_ids jsonb not null
) on commit drop;

insert into terminal_c_math_manifest (path_id, lesson_ids) values
  ('terminale-c-math-l01-limits-continuity', '["limit-composition","monotone-finite-limit","parabolic-branches","continuous-extension","continuous-image-interval","continuity-operations","continuous-bijection-inverse","intermediate-value-theorem","rational-powers"]'),
  ('terminale-c-math-l02-barycenter', '["weighted-barycenter","isobarycenter-homogeneity","weighted-vector-reduction","barycenter-coordinates","partial-barycenter","quadratic-level-sets","apollonius-level-set","oriented-angle-level-set"]'),
  ('terminale-c-math-l03-divisibility', '["integer-divisibility","euclidean-division-z","remainders-operations","congruences","numeration-divisibility-tests","prime-numbers","prime-factorization","number-of-divisors"]'),
  ('terminale-c-math-l04-derivatives-functions', '["one-sided-derivatives","derivative-at-junction","vertical-half-tangent","derivative-composition","inverse-function-derivative","successive-derivatives","finite-increments","lipschitz-bound"]'),
  ('terminale-c-math-l05-space-analytic-geometry', '["plane-normal-vector","plane-cartesian-equation","line-parametric-form","relative-lines-space","line-plane-position","relative-planes"]'),
  ('terminale-c-math-l06-primitives', '["primitive-definition","primitive-existence","primitive-initial-value","usual-primitives","primitive-linearity","composite-primitives"]'),
  ('terminale-c-math-l07-conics', '["conic-focus-directrix","conic-axis-vertices","conic-region","parabola-reduced-equation","ellipse-reduced-equation","hyperbola-reduced-equation"]'),
  ('terminale-c-math-l08-logarithms', '["natural-log-definition","log-algebra","log-equations","log-limits","log-derivative","log-primitives","other-log-bases"]'),
  ('terminale-c-math-l09-complex-numbers', '["complex-algebra","complex-powers","complex-conjugate","complex-modulus","complex-arguments","trigonometric-form","exponential-form","moivre-linearization","complex-equations","roots-of-unity"]'),
  ('terminale-c-math-l10-exponential-power', '["exp-properties","exp-equations","exp-limits","exp-derivative","exp-primitives","real-powers","power-equations","growth-comparison"]'),
  ('terminale-c-math-l11-lcm-gcd', '["common-multiples-lcm","common-divisors-gcd","euclidean-algorithm","bezout-identity","gauss-theorem","gcd-lcm-relation","diophantine-solvability","diophantine-congruences"]'),
  ('terminale-c-math-l12-sequences', '["sequence-induction","sequence-monotonicity","sequence-limit-algebra","monotone-convergence","reference-sequences","sequence-growth","small-angle-sequence","recursive-sequence-limit"]'),
  ('terminale-c-math-l13-complex-geometry', '["complex-angle","complex-distance-ratio","complex-loci","complex-align-orthogonal","complex-cyclic-triangles","complex-transformation","similarity-elements","similarity-from-data","similarity-decomposition","similarity-images"]'),
  ('terminale-c-math-l14-plane-isometries', '["isometry-invariants","reflection-compositions","reflection-translation-rotation","direct-isometries","opposite-isometries","glide-reflection","isometry-fixed-points","isometry-applications"]'),
  ('terminale-c-math-l15-integral-calculus', '["definite-integral","integral-area","chasles-linearity","integral-order","integral-bounds-mean","integration-by-parts","integral-substitution","integral-symmetry-function"]'),
  ('terminale-c-math-l16-direct-similarities', '["similarity-definition","similarity-composition-inverse","similarity-invariants","similarity-canonical","similarity-complex-form","similarity-center-form","similarity-from-images","similarity-center-construction","similarity-applications"]'),
  ('terminale-c-math-l17-probability', '["conditional-probability","product-independence","partition-total-probability","random-variable-law","expectation-variance","bernoulli-binomial","binomial-parameters","cumulative-distribution"]'),
  ('terminale-c-math-l18-differential-equations', '["first-order-homogeneous","first-order-constant","first-order-initial-value","second-order-hyperbolic","second-order-oscillatory","second-order-initial-values"]'),
  ('terminale-c-math-l19-statistics', '["scatter-plot","mean-point","covariance","correlation","regression-lines","statistical-estimation"]');

with raw_rewards as (
  select
    manifest.path_id,
    expanded.lesson_id,
    (50 + least(expanded.position - 1, 7) * 5)::integer as xp_awarded
  from terminal_c_math_manifest as manifest
  cross join lateral jsonb_array_elements_text(manifest.lesson_ids)
    with ordinality as expanded(lesson_id, position)
)
insert into public.lesson_rewards (path_id, lesson_id, xp_awarded)
select path_id, lesson_id, xp_awarded
from raw_rewards
on conflict (path_id, lesson_id) do update
  set xp_awarded = excluded.xp_awarded;

with reward_weights as (
  select
    reward.path_id,
    reward.lesson_id,
    reward.xp_awarded as weight,
    sum(reward.xp_awarded) over (partition by reward.path_id) as total_weight
  from public.lesson_rewards as reward
  join terminal_c_math_manifest as manifest using (path_id)
),
base_allocations as (
  select
    path_id,
    lesson_id,
    floor(1000.0 * weight / nullif(total_weight, 0))::integer as base_units,
    (1000.0 * weight / nullif(total_weight, 0))
      - floor(1000.0 * weight / nullif(total_weight, 0)) as fractional_units
  from reward_weights
),
allocations_with_remainder as (
  select
    path_id,
    lesson_id,
    base_units,
    fractional_units,
    1000 - sum(base_units) over (partition by path_id) as remaining_units
  from base_allocations
),
ranked_allocations as (
  select
    path_id,
    lesson_id,
    base_units,
    remaining_units,
    row_number() over (
      partition by path_id
      order by fractional_units desc, lesson_id asc
    ) as bonus_rank
  from allocations_with_remainder
),
normalized_rewards as (
  select
    path_id,
    lesson_id,
    (base_units + case when bonus_rank <= remaining_units then 1 else 0 end) * 10 as xp_awarded
  from ranked_allocations
)
update public.lesson_rewards as reward
set xp_awarded = normalized.xp_awarded
from normalized_rewards as normalized
where reward.path_id = normalized.path_id
  and reward.lesson_id = normalized.lesson_id;

-- Recalcule les validations déjà acquises sans faire perdre le meilleur score de l'élève.
update public.lesson_progress as progress
set xp_awarded = case
  when progress.best_score = 20 then reward.xp_awarded
  when progress.best_score >= 10 then floor(reward.xp_awarded / 2.0)::integer
  else 0
end
from public.lesson_rewards as reward
where progress.path_id = reward.path_id
  and progress.lesson_id = reward.lesson_id
  and exists (
    select 1 from terminal_c_math_manifest as manifest where manifest.path_id = progress.path_id
  );
