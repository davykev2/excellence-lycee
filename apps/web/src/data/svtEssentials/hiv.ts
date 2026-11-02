import { cd, section, sheet } from "./types";

export default sheet("hiv-infection", "L’infection par le VIH", cd, [
  section("svt-hiv-particle", "Un virus à ARN, distinct du SIDA", [613], String.raw`
Le **VIH** est le virus de l’immunodéficience humaine. Le **SIDA** désigne un stade avancé de l’infection, marqué par une immunodéficience importante et certaines maladies associées. Être infecté par le VIH ne signifie donc pas nécessairement avoir le SIDA.

Le virion comporte une enveloppe lipidique portant des protéines virales, une capside, **deux copies d’ARN** et plusieurs enzymes :

| Enzyme | Fonction dans le cycle |
| --- | --- |
| Transcriptase inverse | Permet la synthèse d’ADN à partir de l’ARN viral |
| Intégrase | Participe à l’intégration de l’ADN viral dans l’ADN cellulaire |
| Protéase | Découpe des précurseurs protéiques et participe à la maturation des virions |

Le VIH infecte notamment des cellules portant le récepteur **CD4** et un corécepteur compatible, tel que CCR5 ou CXCR4. Les lymphocytes T CD4 sont essentiels à la coordination des réponses immunitaires.`),
  section("svt-hiv-cycle", "Les étapes de la multiplication", [613,614], String.raw`
1. **Fixation et entrée :** les protéines de l’enveloppe reconnaissent CD4 et un corécepteur ; la fusion permet l’entrée du contenu viral.
2. **Rétrotranscription :** l’ARN viral sert de modèle à la production d’ADN viral.
3. **Intégration :** l’ADN viral peut être inséré dans le génome de la cellule. Cette forme intégrée est appelée provirus.
4. **Expression :** la cellule produit des ARN et des protéines virales.
5. **Assemblage et bourgeonnement :** les éléments se réunissent ; de nouvelles particules quittent la cellule.
6. **Maturation :** les transformations assurées notamment par la protéase rendent les particules infectieuses.

**Ne pas confondre :** rétrotranscrire, intégrer, produire les composants et faire mûrir un virion sont des opérations différentes.

La diminution des lymphocytes T CD4 résulte de plusieurs mécanismes liés à l’infection et à l’activation immunitaire ; elle ne se résume pas à une seule explosion simultanée de toutes les cellules.`, "hiv-cycle"),
  section("svt-hiv-course", "Lire l’évolution d’une infection", [614,615], String.raw`
Les courbes historiques sans traitement décrivent un modèle, pas un calendrier obligatoire pour chaque personne.

| Phase | Tendances du modèle non traité |
| --- | --- |
| Primo-infection | Multiplication virale importante au cours des premières semaines ; réponse immunitaire qui s’installe |
| Phase chronique | Infection persistante ; équilibre partiel entre production virale et défenses, avec évolution variable |
| Immunodéficience avancée | Défenses très affaiblies ; risque accru de maladies opportunistes |

La **charge virale** mesure la quantité de matériel viral dans un prélèvement. Le **taux de CD4** renseigne sur une population de cellules immunitaires. Ces deux grandeurs ont des unités différentes et ne se lisent pas comme deux valeurs d’une même échelle.

La **séroconversion** correspond à l’apparition d’anticorps détectables par le test considéré. Il existe une période pendant laquelle une infection peut ne pas encore être mise en évidence par un test donné : c’est la fenêtre diagnostique.

Un test réactif isolé nécessite la suite de l’algorithme de confirmation adapté. Les anticorps ne disparaissent pas obligatoirement au stade avancé.

Avec un traitement antirétroviral efficace, l’évolution est profondément modifiée : l’évolution vers le SIDA n’est pas inévitable.`, "hiv-course"),
  section("svt-hiv-prevention", "Transmission, prévention et traitement", [615], String.raw`
La transmission peut se produire par certaines expositions sexuelles, par du sang contaminé, ou de la mère à l’enfant pendant la grossesse, l’accouchement ou l’allaitement. Le VIH ne se transmet pas par les contacts sociaux ordinaires, les poignées de main ou le partage des mêmes lieux de vie.

La prévention combine selon les situations : préservatifs, matériel d’injection stérile, sécurité des produits sanguins, dépistage, prise en charge des personnes infectées et prévention de la transmission à l’enfant. La PrEP et la prophylaxie après exposition relèvent d’un accompagnement de santé.

Les **antirétroviraux** bloquent différentes étapes du cycle viral. Ils contrôlent l’infection mais n’en constituent pas une guérison définitive.

**Indétectable = intransmissible** concerne la **transmission sexuelle**, lorsque la charge virale reste indétectable sous traitement efficace et suivi. Cette conclusion ne doit pas être étendue sans distinction à toutes les voies d’exposition.

Le suivi médical permet d’interpréter les tests, de choisir une prévention adaptée et de vérifier l’efficacité du traitement ; un graphique de cours ne peut pas établir un diagnostic individuel.`),
], [
  "Cours pages 613–615. VIH/SIDA distingués ; virion et six étapes du cycle rétablis ; pas de calendrier fatal ni de représentation des anticorps nécessairement nuls.",
  "Les courbes natives sont qualitatives et séparées par grandeur, non des mesures cliniques. Aucun exercice corrigé du fascicule ajouté.",
  "Vérification scientifique : fiches OMS HIV and AIDS et NIH HIV and AIDS Basics ; I=I limité explicitement à la transmission sexuelle sous traitement efficace et suivi.",
]);
