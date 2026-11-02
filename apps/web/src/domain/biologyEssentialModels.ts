/** Bounded pedagogical models. Curves are qualitative, never clinical measurements. */
export const biologyEssentialPresets = [
  "reflex", "neuron", "action-potential", "recruitment", "synapse",
  "energy-pathways", "muscle-twitch", "sarcomere", "nephron", "water-balance", "glycemia",
  "heart-circuit", "cardiac-cycle", "baroreflex", "phagocytosis", "immune-cooperation", "immune-memory",
  "hiv-cycle", "hiv-course", "fertilization", "implantation", "female-cycle", "female-axis", "male-axis",
  "flower", "plant-gametophytes", "double-fertilization", "punnett", "abo", "linkage",
  "soil", "soil-protection", "mineral-deposits", "mining-methods",
] as const;
export type BiologyEssentialPreset = typeof biologyEssentialPresets[number];
export const bounded = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
export function interpolate(points: readonly (readonly [number,number])[], value: number) {
  const x = bounded(value, points[0][0], points[points.length-1][0]);
  const index = points.findIndex(point => point[0] >= x);
  if (index <= 0) return points[0][1];
  const [a,b] = [points[index-1], points[index]];
  return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]);
}
export const potentialPoints = [[0,-70],[1,-70],[1.4,-55],[2,30],[2.7,0],[3.5,-80],[4.2,-76],[5,-70],[6,-70]] as const;
export const twitchPoints = [[0,0],[1,0],[2,.45],[3,1],[4,.8],[5,.4],[6,.1],[7,0],[8,0]] as const;
export function recruitmentModel(intensity: number) {
  const x=bounded(intensity,0,100);
  return { single: x>=25?1:0, nerve: Math.min(1,Math.max(0,(x-15)/65)) };
}
export function linkageProbabilities(recombinationPercent: number, trans = false) {
  const r=bounded(recombinationPercent,0,50)/100, parental=(1-r)/2, recombinant=r/2;
  return trans ? [recombinant,parental,parental,recombinant] : [parental,recombinant,recombinant,parental];
}
export function punnettCross(parent1: string, parent2: string) {
  const allowed = ["AA","Aa","aa"];
  const a=allowed.includes(parent1)?parent1:"Aa", b=allowed.includes(parent2)?parent2:"Aa";
  return [...a].flatMap(x=>[...b].map(y=>[x,y].sort().join("")));
}
export function aboCross(parent1: string, parent2: string) {
  const allowed=["AA","AO","BB","BO","AB","OO"];
  const a=allowed.includes(parent1)?parent1:"AO", b=allowed.includes(parent2)?parent2:"BO";
  return [...a].flatMap(x=>[...b].map(y=>{const pair=x+y; return pair.includes("A")&&pair.includes("B")?"AB":pair.includes("A")?"A":pair.includes("B")?"B":"O";}));
}
export const cycleCurves = {
  oestradiol: [[1,.12],[5,.17],[9,.4],[12,.9],[14,.3],[18,.45],[21,.6],[25,.35],[28,.1]],
  progesterone: [[1,.04],[12,.05],[14,.1],[17,.5],[21,.92],[24,.7],[28,.05]],
  lh: [[1,.08],[11,.08],[13,.35],[14,1],[15,.2],[17,.08],[28,.08]],
} as const;
export const biologyFlows: Partial<Record<BiologyEssentialPreset, {title:string; steps: readonly (readonly [string,string])[]}>> = {
  reflex: {title:"L’arc réflexe",steps:[["Récepteur","Un stimulus est transformé en message nerveux."],["Voie afférente","Le message rejoint le centre nerveux."],["Centre nerveux","Des circuits intègrent les informations."],["Voie efférente","Une commande atteint l’effecteur."],["Effecteur","Le muscle ou la glande produit la réponse."]]},
  synapse: {title:"Une synapse chimique",steps:[["Potentiel d’action","Il atteint la terminaison présynaptique."],["Entrée de calcium","L’ouverture des canaux déclenche la libération vésiculaire."],["Neurotransmetteur","Il diffuse dans la fente synaptique."],["Récepteurs","Sa fixation modifie le fonctionnement postsynaptique."],["Fin du signal","Dégradation, recapture ou diffusion limitent son action."]]},
  "energy-pathways": {title:"Régénérer l’ATP musculaire",steps:[["ATP disponible","Son hydrolyse fournit de l’énergie immédiatement utilisable."],["Phosphocréatine","Elle transfère rapidement un phosphate à l’ADP."],["Glycolyse","Elle fournit de l’ATP ; le pyruvate peut être converti en lactate."],["Respiration","L’oxydation mitochondriale participe à une production prolongée d’ATP."]]},
  "water-balance": {title:"Rétrocontrôle de l’équilibre hydrique",steps:[["Osmolarité en hausse","Exemple : une perte d’eau relativement pauvre en solutés."],["Détection centrale","Les osmorécepteurs hypothalamiques participent à la détection."],["ADH libérée","L’ADH gagne le rein par le sang."],["Eau réabsorbée","Le système collecteur devient davantage perméable à l’eau."],["Écart réduit","L’urine est moins abondante ; la soif participe à la compensation."]]},
  glycemia: {title:"Deux réponses à une variation de glycémie",steps:[["Glycémie élevée","Les cellules bêta libèrent davantage d’insuline."],["Stocker et utiliser","L’entrée et l’utilisation du glucose ainsi que son stockage sont favorisés."],["Glycémie basse","Les cellules alpha libèrent davantage de glucagon."],["Production hépatique","Le foie contribue au retour du glucose vers le sang."]]},
  "cardiac-cycle": {title:"Remplir, puis éjecter",steps:[["Remplissage","Les ventricules relâchés se remplissent."],["Systole atriale","Les oreillettes complètent le remplissage."],["B1 : fermeture AV","La pression ventriculaire monte ; les valves AV se ferment."],["Éjection","Les valves artérielles s’ouvrent ; le sang gagne les artères."],["B2 : fermeture artérielle","La pression ventriculaire baisse ; les valves artérielles se ferment."]]},
  baroreflex: {title:"Réponse à une hausse de pression artérielle",steps:[["Étirement accru","Les barorécepteurs artériels sont davantage stimulés."],["Messages afférents","L’information rejoint les centres bulbaires."],["Commande modulée","Frein vagal renforcé et activité sympathique réduite."],["Cœur et vaisseaux","L’activité cardiaque et le tonus vasculaire s’adaptent."],["Pression réduite","La réponse s’oppose à la perturbation initiale."]]},
  phagocytosis: {title:"Les étapes de la phagocytose",steps:[["Adhérence","Le phagocyte reconnaît la cible."],["Englobement","La membrane entoure la cible dans un phagosome."],["Phagolysosome","Le phagosome fusionne avec des lysosomes."],["Digestion","Les mécanismes cellulaires dégradent la cible."],["Résidus","Des produits sont éliminés ; des peptides peuvent être présentés."]]},
  "immune-cooperation": {title:"Coopération dans une réponse adaptative",steps:[["Cellule dendritique","Capture et présentation de peptides."],["Lymphocyte T CD4","Reconnaissance et signaux d’activation."],["Lymphocyte B","Reconnaissance de l’antigène et aide T pour de nombreuses réponses."],["Plasmocytes et mémoire","Production d’anticorps et conservation de cellules mémoires."],["Branche T CD8","Des effecteurs reconnaissent et éliminent des cellules cibles."]]},
  "hiv-cycle": {title:"Cycle du VIH",steps:[["Entrée","CD4 et corécepteur ; fusion de l’enveloppe."],["Rétrotranscription","ARN viral → ADN viral."],["Intégration","Insertion de l’ADN viral dans l’ADN cellulaire."],["Expression","Production d’ARN et de protéines virales."],["Bourgeonnement","Assemblage et sortie des particules."],["Maturation","La protéase participe à la formation de particules infectieuses."]]},
  fertilization: {title:"De deux gamètes au zygote",steps:[["Rencontre","Les gamètes se rencontrent normalement dans la trompe."],["Réaction acrosomiale","Elle participe à la traversée des enveloppes."],["Fusion et activation","Entrée du contenu spermatique, réaction corticale."],["Méiose achevée","Le lot chromosomique maternel est constitué."],["Zygote 2n","Les lots maternel et paternel participent à la première division."]]},
  implantation: {title:"Du zygote à l’implantation",steps:[["Zygote","Fécondation : repère du jour 0."],["2, 4, 8 cellules","Divisions précoces et progression dans la trompe."],["Morula","Vers J3–4 ; arrivée utérine."],["Blastocyste","Vers J5–6 ; embryoblaste et trophoblaste."],["Nidation","Début habituel vers J6–7 ; repères approximatifs."]]},
  "female-axis": {title:"Axe de commande ovarien",steps:[["Hypothalamus","GnRH pulsatile."],["Antéhypophyse","Sécrétion de FSH et LH."],["Ovaires","Follicules, ovulation et corps jaune."],["Rétrocontrôle","Négatif le plus souvent ; positif préovulatoire sous conditions."]]},
  "male-axis": {title:"Axe de commande testiculaire",steps:[["Hypothalamus","GnRH pulsatile."],["Antéhypophyse","FSH et LH."],["Testicule","Leydig : testostérone ; Sertoli : soutien de la spermatogenèse et inhibine."],["Rétrocontrôle négatif","Testostérone sur l’axe ; inhibine notamment sur FSH."]]},
  "plant-gametophytes": {title:"Du sporophyte au gamétophyte mâle",steps:[["Cellule mère 2n","Dans un sac pollinique."],["Méiose","Production de quatre microspores n."],["Mitose","Cellules végétative et génératrice."],["Deux gamètes n","Division de la cellule génératrice."],["Tube pollinique","Acheminement des gamètes vers le sac embryonnaire."]]},
  "double-fertilization": {title:"Deux fusions, deux tissus",steps:[["Deux gamètes mâles","Ils sont acheminés par le tube pollinique."],["Premier gamète + oosphère","n + n = 2n : zygote, puis embryon."],["Second + noyaux polaires","n + n + n = 3n : origine de l’albumen."],["Graine et fruit","L’ovule devient graine ; l’ovaire participe au fruit."]]},
  "soil-protection": {title:"Réduire le départ de terre",steps:[["Couvrir","Végétation ou paillage limitent l’impact des pluies."],["Ralentir","Courbes de niveau et bandes enherbées freinent le ruissellement."],["Structurer","Matière organique et activité biologique favorisent les agrégats."],["Adapter","Pente, pluie, sol et culture guident le choix des pratiques."]]},
  "mineral-deposits": {title:"D’une concentration primaire aux dépôts secondaires",steps:[["Concentration primaire","Minéralisation dans sa roche ; processus notamment hydrothermaux."],["Altération","La roche se transforme et libère des constituants."],["Résiduel","Concentration sur place."],["Transport et placer","Des grains déplacés par les eaux peuvent se concentrer lors du dépôt."]]},
};
