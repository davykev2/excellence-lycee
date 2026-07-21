-- Lot pilote validé : Terminale C / Mathématiques / Limites et continuité.
-- Les PDF ont servi uniquement à l'alignement au programme ; le contenu est original.

begin;

select public.importer_lot_exercices($lot$
{
  "schema_version": 1,
  "batch_code": "2026-07-tle-c-maths-l01-v1",
  "status": "reviewed",
  "target": {
    "niveau": "Terminale",
    "serie": "C",
    "matiere_slug": "maths",
    "chapitre_id": "7119e82d-895f-4502-8a12-d9f61e505acf",
    "chapitre_code": "TLE-C-MATH-L01",
    "chapitre_ordre": 1,
    "chapitre_titre": "Limites et continuité"
  },
  "source": {
    "code": "CI-EN-TC-MATH-L01-REF-2026-07",
    "titre": "Terminale C — Mathématiques — Limites et continuité d’une fonction",
    "type": "pdf",
    "auteur_organisme": "Côte d’Ivoire — École numérique",
    "droits_statut": "reference_only",
    "licence_code": null,
    "storage_path": "content_sources/archive_20260713/Nouveau dossier/TC/Maths/TC Maths leçon 01 Limite et continuité.pdf",
    "sha256": "e8c25ae6a92e361f1a9ae768269c812ab1eef1d5202cb6dadc41f76327e9ddcf",
    "notes": "Source utilisée uniquement pour l’alignement au programme. Tous les exercices de ce lot sont originaux."
  },
  "quizzes": [
    {
      "code": "TLE-C-MATH-L01-ENT",
      "numero": 1,
      "palier": "entrainement",
      "titre": "Entraînement — Les bons réflexes",
      "questions": [
        {
          "code": "TLE-C-MATH-L01-ENT-Q01",
          "ordre": 1,
          "type": "qcm",
          "enonce": "Calculer : $\\displaystyle \\lim_{x\\to+\\infty}\\sqrt{1+\\frac{3x+2}{x+4}}$.",
          "choix": ["1", "2", "3", "4"],
          "bonnes_reponses": "2",
          "points": 1,
          "explication": "On a $\\frac{3x+2}{x+4}\\to 3$. Par continuité de la racine carrée, la limite vaut $\\sqrt{1+3}=2$.",
          "difficulte": 1,
          "origine": "originale",
          "licence_code": "proprietaire-excellence-lycee"
        },
        {
          "code": "TLE-C-MATH-L01-ENT-Q02",
          "ordre": 2,
          "type": "qcm",
          "enonce": "Calculer : $\\displaystyle \\lim_{x\\to2}\\frac{x^2+x-6}{x-2}$.",
          "choix": ["0", "2", "5", "La limite n’existe pas"],
          "bonnes_reponses": "5",
          "points": 1,
          "explication": "$x^2+x-6=(x-2)(x+3)$. Pour $x\\ne2$, le quotient vaut $x+3$ ; sa limite en 2 est donc $5$.",
          "difficulte": 1,
          "origine": "originale",
          "licence_code": "proprietaire-excellence-lycee"
        },
        {
          "code": "TLE-C-MATH-L01-ENT-Q03",
          "ordre": 3,
          "type": "qcm",
          "enonce": "Calculer : $\\displaystyle \\lim_{x\\to-1}(2x^3-x+4)$.",
          "choix": ["−3", "1", "3", "5"],
          "bonnes_reponses": "3",
          "points": 1,
          "explication": "Un polynôme est continu. On remplace donc $x$ par $-1$ : $2(-1)^3-(-1)+4=3$.",
          "difficulte": 1,
          "origine": "originale",
          "licence_code": "proprietaire-excellence-lycee"
        },
        {
          "code": "TLE-C-MATH-L01-ENT-Q04",
          "ordre": 4,
          "type": "texte",
          "enonce": "Calculer : $\\displaystyle \\lim_{x\\to4}6\\,\\frac{\\sqrt{x+5}-3}{x-4}$. Donne seulement le résultat.",
          "choix": null,
          "bonnes_reponses": ["1", "+1", "1,0", "1.0"],
          "points": 1,
          "explication": "On rationalise : $6\\frac{\\sqrt{x+5}-3}{x-4}=\\frac{6}{\\sqrt{x+5}+3}$. La limite vaut donc $\\frac{6}{6}=1$.",
          "difficulte": 1,
          "origine": "originale",
          "licence_code": "proprietaire-excellence-lycee"
        },
        {
          "code": "TLE-C-MATH-L01-ENT-Q05",
          "ordre": 5,
          "type": "qcm",
          "enonce": "Pour $x\\ne2$, on pose $f(x)=\\frac{x^2-4}{x-2}$ et $f(2)=k$. Quelle valeur de $k$ rend $f$ continue en 2 ?",
          "choix": ["0", "2", "4", "−4"],
          "bonnes_reponses": "4",
          "points": 1,
          "explication": "Pour $x\\ne2$, $f(x)=x+2$. Ainsi $\\lim_{x\\to2}f(x)=4$ ; il faut donc choisir $k=4$.",
          "difficulte": 1,
          "origine": "originale",
          "licence_code": "proprietaire-excellence-lycee"
        }
      ]
    },
    {
      "code": "TLE-C-MATH-L01-MAI",
      "numero": 2,
      "palier": "maitrise",
      "titre": "Maîtrise — Raisonne et justifie",
      "questions": [
        {
          "code": "TLE-C-MATH-L01-MAI-Q01",
          "ordre": 1,
          "type": "qcm",
          "enonce": "Soit $g(x)=\\frac{x-1}{|x-1|}$. Quelle est la limite de $g$ en 1 ?",
          "choix": ["−1", "0", "1", "Elle n’existe pas"],
          "bonnes_reponses": "Elle n’existe pas",
          "points": 1,
          "explication": "À gauche de 1, $g(x)=-1$ ; à droite, $g(x)=1$. Les deux limites latérales sont différentes, donc la limite en 1 n’existe pas.",
          "difficulte": 2,
          "origine": "originale",
          "licence_code": "proprietaire-excellence-lycee"
        },
        {
          "code": "TLE-C-MATH-L01-MAI-Q02",
          "ordre": 2,
          "type": "qcm",
          "enonce": "Quelle est l’image de $[1;4]$ par $h(x)=x^2-4x+1$ ?",
          "choix": ["[−3;1]", "[−2;1]", "[−3;−2]", "[−2;4]"],
          "bonnes_reponses": "[−3;1]",
          "points": 1,
          "explication": "$h(x)=(x-2)^2-3$. Le minimum sur $[1;4]$ est $-3$, atteint en 2, et le maximum est $h(4)=1$. L’image est donc $[-3;1]$.",
          "difficulte": 2,
          "origine": "originale",
          "licence_code": "proprietaire-excellence-lycee"
        },
        {
          "code": "TLE-C-MATH-L01-MAI-Q03",
          "ordre": 3,
          "type": "qcm",
          "enonce": "Pour $p(x)=x^3+x-1$, quelle affirmation est correcte ?",
          "choix": ["Aucune racine dans ]0;1[", "Une unique racine dans ]0;1[", "Deux racines dans ]0;1[", "Une infinité de racines dans ]0;1["],
          "bonnes_reponses": "Une unique racine dans ]0;1[",
          "points": 1,
          "explication": "$p$ est continue et $p'(x)=3x^2+1>0$, donc elle est strictement croissante. Comme $p(0)=-1$ et $p(1)=1$, le théorème des valeurs intermédiaires donne une racine dans $]0;1[$, et la stricte croissance garantit son unicité.",
          "difficulte": 2,
          "origine": "originale",
          "licence_code": "proprietaire-excellence-lycee"
        },
        {
          "code": "TLE-C-MATH-L01-MAI-Q04",
          "ordre": 4,
          "type": "qcm",
          "enonce": "On cherche par dichotomie la racine de $p(x)=x^3+x-1$ dans $[0;1]$. Après deux découpages successifs, quel encadrement obtient-on ?",
          "choix": ["[0;0,25]", "[0,25;0,5]", "[0,5;0,75]", "[0,75;1]"],
          "bonnes_reponses": "[0,5;0,75]",
          "points": 1,
          "explication": "$p(0,5)=-3/8<0$, donc on garde $[0,5;1]$. Puis $p(0,75)=11/64>0$, donc on garde $[0,5;0,75]$.",
          "difficulte": 2,
          "origine": "originale",
          "licence_code": "proprietaire-excellence-lycee"
        },
        {
          "code": "TLE-C-MATH-L01-MAI-Q05",
          "ordre": 5,
          "type": "qcm",
          "enonce": "Sur $[0;+\\infty[$, la fonction $u(x)=2-\\frac{1}{x+1}$ est croissante et majorée par 2. Quelle est sa limite en $+\\infty$ ?",
          "choix": ["1", "2", "+∞", "Elle n’existe pas"],
          "bonnes_reponses": "2",
          "points": 1,
          "explication": "$\\frac{1}{x+1}\\to0$, donc $u(x)\\to2$. Cela concorde avec le théorème de convergence d’une fonction croissante et majorée.",
          "difficulte": 2,
          "origine": "originale",
          "licence_code": "proprietaire-excellence-lycee"
        }
      ]
    },
    {
      "code": "TLE-C-MATH-L01-CON",
      "numero": 3,
      "palier": "concours",
      "titre": "Type concours — Relève le défi",
      "questions": [
        {
          "code": "TLE-C-MATH-L01-CON-Q01",
          "ordre": 1,
          "type": "qcm",
          "enonce": "Calculer : $\\displaystyle \\lim_{x\\to+\\infty}(\\sqrt{4x^2+x+1}-2x)$.",
          "choix": ["0", "1/4", "1/2", "+∞"],
          "bonnes_reponses": "1/4",
          "points": 1,
          "explication": "Après rationalisation : $$\\sqrt{4x^2+x+1}-2x=\\frac{x+1}{\\sqrt{4x^2+x+1}+2x}=\\frac{1+1/x}{\\sqrt{4+1/x+1/x^2}+2}.$$ La limite vaut donc $1/4$.",
          "difficulte": 3,
          "origine": "originale",
          "licence_code": "proprietaire-excellence-lycee"
        },
        {
          "code": "TLE-C-MATH-L01-CON-Q02",
          "ordre": 2,
          "type": "qcm",
          "enonce": "Pour $f(x)=\\sqrt{x^3+2x+1}$, quelle est la nature de la branche de la courbe en $+\\infty$ ?",
          "choix": ["Asymptote horizontale", "Asymptote oblique", "Branche parabolique de direction (OI)", "Branche parabolique de direction (OJ)"],
          "bonnes_reponses": "Branche parabolique de direction (OJ)",
          "points": 1,
          "explication": "$f(x)\\to+\\infty$ et $\\frac{f(x)}{x}=\\sqrt{x+\\frac{2}{x}+\\frac{1}{x^2}}\\to+\\infty$. La courbe possède donc une branche parabolique de direction l’axe $(OJ)$.",
          "difficulte": 3,
          "origine": "originale",
          "licence_code": "proprietaire-excellence-lycee"
        },
        {
          "code": "TLE-C-MATH-L01-CON-Q03",
          "ordre": 3,
          "type": "texte",
          "enonce": "On définit $F_a(x)=\\frac{x^2-1}{x-1}$ si $x<1$, et $F_a(x)=ax+1$ si $x\\ge1$. Déterminer $a$ pour que $F_a$ soit continue en 1. Donne seulement la valeur de $a$.",
          "choix": null,
          "bonnes_reponses": ["1", "+1", "1,0", "1.0", "a=1", "a = 1"],
          "points": 1,
          "explication": "À gauche, $\\frac{x^2-1}{x-1}=x+1$, donc la limite vaut 2. À droite et en 1, la valeur est $a+1$. Il faut $a+1=2$, donc $a=1$.",
          "difficulte": 3,
          "origine": "originale",
          "licence_code": "proprietaire-excellence-lycee"
        },
        {
          "code": "TLE-C-MATH-L01-CON-Q04",
          "ordre": 4,
          "type": "qcm",
          "enonce": "Soit la bijection $f:[0;+\\infty[\\to[0;3[$ définie par $f(x)=\\frac{3x^2}{2+x^2}$. Quelle est l’expression de $f^{-1}(y)$ ?",
          "choix": ["√(2y/(3−y))", "√((3−y)/(2y))", "2y/(3−y)", "√(3y/(2−y))"],
          "bonnes_reponses": "√(2y/(3−y))",
          "points": 1,
          "explication": "$y(2+x^2)=3x^2$, donc $x^2=\\frac{2y}{3-y}$. Comme $x\\ge0$, on obtient $f^{-1}(y)=\\sqrt{\\frac{2y}{3-y}}$.",
          "difficulte": 3,
          "origine": "originale",
          "licence_code": "proprietaire-excellence-lycee"
        },
        {
          "code": "TLE-C-MATH-L01-CON-Q05",
          "ordre": 5,
          "type": "qcm",
          "enonce": "Pour $x\\ge0$, soit $r(x)=\\sqrt{x^2+6x+10}-x$. Quelle affirmation est correcte ?",
          "choix": ["La limite vaut 3 et la courbe est sous y = 3", "La limite vaut 3 et la courbe est au-dessus de y = 3", "La limite vaut 6", "Il n’y a pas d’asymptote horizontale"],
          "bonnes_reponses": "La limite vaut 3 et la courbe est au-dessus de y = 3",
          "points": 1,
          "explication": "La rationalisation donne une limite égale à 3. De plus, $x^2+6x+10=(x+3)^2+1$, donc $\\sqrt{x^2+6x+10}>x+3$ et ainsi $r(x)>3$.",
          "difficulte": 3,
          "origine": "originale",
          "licence_code": "proprietaire-excellence-lycee"
        }
      ]
    }
  ]
}

$lot$::jsonb);

commit;
