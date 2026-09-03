export function normalizePastedExerciseLayout(markdown: string) {
  return markdown.replace(
    /(^|[.!?:;])\s*([a-h]\))\s*(?=\\\(|\$\$?)/gm,
    (_, prefix: string, label: string) => `${prefix}${prefix ? "\n" : ""}${label} `,
  );
}
