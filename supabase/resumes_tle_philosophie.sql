-- ============================================================================
-- EXCELLENCE LYCÉE — résumés philosophie / Terminale (séries A, C, D)
-- Généré par supabase/resumes/build_sql.mjs — idempotent, rejouable sans risque.
-- À coller intégralement dans Supabase SQL Editor > New query.
-- ============================================================================

-- 1) Création des chapitres (ignorés s'ils existent déjà au même ordre)
insert into public.chapitres (matiere_id, serie_id, ordre, titre, description, published)
select m.id, s.id, x.ordre, x.titre, x.description, true
from public.matieres m
join public.series s on true
join public.niveaux n on n.id = s.niveau_id
join (values
  (1, 'L1 — La dissertation philosophique', 'Méthodologie · Compétence I : rédiger une dissertation philosophique'),
  (2, 'L2 — Le commentaire de texte philosophique', 'Méthodologie · Compétence I : rédiger un commentaire de texte philosophique'),
  (3, 'L3 — La connaissance de l''homme', 'Les conditions de la liberté · conscience, inconscient, responsabilité'),
  (4, 'L4 — La vie en société', 'Les conditions de la liberté · société, État, nation, autrui, violence'),
  (5, 'L5 — Dieu et la religion', 'Les conditions de la liberté · Dieu, rôles de la religion, aliénation et liberté'),
  (6, 'L6 — L''histoire et l''humanité', 'Les conditions du bonheur · historicité, décolonisation, diversité culturelle'),
  (7, 'L7 — La valeur de la philosophie', 'Les conditions du bonheur · philosophie, raison et mythe'),
  (8, 'L8 — Progrès et bonheur', 'Les conditions du bonheur · désir, travail, technique, art, types de progrès'),
  (9, 'L9 — Langage et vérité', 'Les conditions d''élaboration de la connaissance · formes du langage, critères de la vérité'),
  (10, 'L10 — La connaissance scientifique', 'Les conditions d''élaboration de la vérité · types de sciences, démarches, bioéthique')
) as x(ordre, titre, description) on true
where m.slug = 'philosophie' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
on conflict (matiere_id, serie_id, ordre) do nothing;

-- 2) Injection des résumés (titre et description resynchronisés au passage)

-- ---- L1 — La dissertation philosophique ----
update public.chapitres c set
  titre = 'L1 — La dissertation philosophique',
  description = 'Méthodologie · Compétence I : rédiger une dissertation philosophique',
  resume = $md$*Thème : La méthodologie*

## Présentation

La **dissertation philosophique** est un exercice écrit portant sur un sujet, à partir duquel on dégage le **problème central** en vue de son analyse, à travers une **argumentation cohérente**. Tout commence par la bonne compréhension du sujet.

## I. La compréhension du sujet (phase préparatoire)

### 1. L'étude parcellaire

Identifier les **mots ou expressions essentiels** du sujet (indispensables à sa compréhension) et les **définir selon le contexte**.

> Exemple — « Doit-on condamner le progrès technique ? » : *doit-on* = faut-il, est-il normal ; *condamner* = blâmer, rejeter ; *le progrès technique* = les avancées réalisées par la technique.

### 2. La reformulation du sujet

Donner la **signification d'ensemble** du sujet : le réécrire pour le rendre plus explicite **sans en altérer le sens initial**.

> Exemple : « Faut-il blâmer les avancées réalisées par la technique ? »

## II. La problématisation du sujet

- **Le problème** : la difficulté centrale que soulève le sujet. Il apparaît à partir d'une **contradiction ou d'un paradoxe** au cœur du sujet ;
- **Les aspects du problème** : les diverses questions que suscite le problème — ils annoncent les **axes du développement**.

> Exemple : Problème — « La technique est-elle nuisible ? » ; Aspect 1 — « En quoi le progrès technique est-il facteur de développement ? » ; Aspect 2 — « Ne suscite-t-il pas des inquiétudes ? »

## III. La rédaction de la dissertation

### 1. L'introduction

Elle pose clairement le **problème** du sujet, selon la structure : **amorce → problème → aspects du problème**.

### 2. Le développement

Il consiste à **résoudre le problème** : structurer les **axes d'analyse**, les **argumenter** en s'appuyant sur des **références** (philosophes, œuvres, citations) et des **illustrations**. Le passage d'un argument ou d'un axe à l'autre se fait par des **transitions** (connecteurs logiques).

### 3. La conclusion

Elle **répond de façon claire et précise au problème** posé dans l'introduction, précédée du **bilan** de la réflexion, et peut s'achever par une **ouverture**.

## Exemple de travail préparatoire complet

Sujet : « Il faut plaindre celui qui vit en société. » Qu'en pensez-vous ?

1. **Étude parcellaire** : *plaindre* = avoir pitié de ; *celui qui vit en société* = celui qui vit avec ses semblables dans un espace régi par des règles ;
2. **Reformulation** : Il est impératif d'avoir de la compassion pour celui qui vit en société ;
3. **Problème** : Faut-il avoir un sentiment de pitié pour celui qui vit en société ?
4. **Aspects** : En quel sens faut-il plaindre celui qui vit en société ? / Ne doit-on pas plutôt l'envier ?
5. **Axes et références** :
   - *Axe 1 — Il faut le plaindre* : insécurité et hypocrisie d'autrui (**Sartre** : « L'enfer, c'est les autres », *Huis clos* ; **Hobbes** : « L'homme est un loup pour l'homme », *Léviathan*) ; contraintes des lois et de l'État (**Bakounine**, *Étatisme et anarchisme*) ;
   - *Axe 2 — Il faut l'envier* : la société comble les déficiences naturelles par l'entraide (**Garaudy** : « L'enfer, c'est l'absence des autres » ; **Malson** : « Les hommes ne sont pas des hommes hors de l'ambiance sociale », *Les enfants sauvages*) ; l'État assure sécurité et liberté (**Spinoza** : « La fin de l'État est donc en réalité la liberté », *Traité théologico-politique*).

---

### 📌 L'essentiel à retenir

- **7 opérations au brouillon** : étude parcellaire → reformulation → problème → aspects → plan → arguments par axe → références/citations ;
- **Introduction** = amorce + problème + aspects ;
- **Développement** = axes argumentés avec références et transitions ;
- **Conclusion** = bilan + réponse au problème (+ ouverture) ;
- Une dissertation réussie **analyse un problème**, elle ne récite pas un cours.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'philosophie' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 1;

-- ---- L2 — Le commentaire de texte philosophique ----
update public.chapitres c set
  titre = 'L2 — Le commentaire de texte philosophique',
  description = 'Méthodologie · Compétence I : rédiger un commentaire de texte philosophique',
  resume = $md$*Thème : La méthodologie*

## Présentation

Le **commentaire de texte philosophique** est un exercice écrit qui consiste à dégager l'**intérêt philosophique** d'un texte à partir de son **étude ordonnée**. Commenter un texte, c'est d'abord l'**expliquer** (mettre en évidence son sens), puis l'**évaluer**. Le devoir comprend trois parties : introduction, développement, conclusion.

## I. L'introduction

Elle **présente le texte** à partir de trois éléments essentiels : le **thème**, le **problème** et la **thèse**. La **structure logique** peut figurer à la fin de l'introduction ou au début du développement.

**Les éléments de la problématique d'un texte :**

| Élément | Question correspondante |
|---|---|
| **Thème** | De quoi est-il question dans le texte ? |
| **Problème** | De quoi s'agit-il (quelle difficulté est traitée) ? |
| **Thèse** | Quelle est la position de l'auteur ? |
| **Intention** | Quel est l'objectif immédiat de l'auteur ? |
| **Enjeu** | Qu'y a-t-il à gagner dans la résolution du problème ? |
| **Structure logique** | Quels sont les mouvements du texte ? |
| **Démarche argumentative** | Quelles sont les étapes de l'argumentation ? |

## II. Le développement

### 1. L'étude ordonnée

C'est l'**explication du texte** à partir de sa structure logique (ses mouvements) : mettre en évidence la démarche argumentative de l'auteur, ses **arguments**, ses **concepts**, ses allusions, exemples et figures de style. Chaque mouvement a une **idée principale** et des idées secondaires. À éviter absolument : la **paraphrase**, les contresens, les non-sens. Prévoir des **transitions** entre les mouvements.

### 2. L'intérêt philosophique

C'est la partie **critique** du devoir, en deux temps :

- **La critique interne** (évaluation de la **forme**) : cohérence de l'argumentation, adéquation entre la démarche et l'**intention** de l'auteur, forces et faiblesses des arguments, pertinence de la démarche ;
- **La critique externe** (évaluation du **fond**) : apprécier la position de l'auteur — d'abord **justifier sa thèse** en s'appuyant sur d'autres auteurs (axe 1), puis la **dépasser** à l'aide d'autres positions (axe 2).

## III. La conclusion

Elle consiste en une **prise de position** par rapport à l'intérêt du texte, précédée du **bilan du débat** engagé dans la critique externe.

## Exemple (texte de Hountondji sur la philosophie)

- **Thème** : la définition de la philosophie ; **Problème** : la philosophie est-elle un système ? **Thèse** : la philosophie n'est pas un système mais un débat sans cesse rebondissant ; **Intention** : rejeter l'opinion qui fait de la philosophie un savoir achevé ; **Enjeu** : la connaissance ;
- **Critique externe** — axe 1 (justification) : la philosophie est questionnement (**Socrate** : « Ce que je sais, c'est que je ne sais rien » ; **Jaspers** : « Philosopher, c'est être en route » ; **Kant** : « On n'apprend pas la philosophie, on apprend à philosopher ») ; axe 2 (dépassement) : la philosophie comme système (**Hegel** : « Une philosophie qui n'est pas un système ne saurait rien avoir de scientifique » ; **Descartes** et l'arbre de la philosophie).

---

### 📌 L'essentiel à retenir

- Commenter = **expliquer** (sens) + **évaluer** (critique), jamais paraphraser ;
- **Introduction** = thème + problème + thèse (+ structure logique) ;
- **Développement** = étude ordonnée (mouvements, idées principales) + intérêt philosophique ;
- **Intérêt philosophique** = critique **interne** (forme) + critique **externe** (fond : justifier puis dépasser la thèse) ;
- **Conclusion** = bilan + prise de position personnelle.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'philosophie' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 2;

-- ---- L3 — La connaissance de l'homme ----
update public.chapitres c set
  titre = 'L3 — La connaissance de l''homme',
  description = 'Les conditions de la liberté · conscience, inconscient, responsabilité',
  resume = $md$*Thème : Les conditions de la liberté*

## Introduction

Connaître l'homme revient à savoir ce qui fait son **essence**, c'est-à-dire sa nature. L'homme est généralement défini comme un être **conscient** ou pensant. Pourtant, certains de ses actes semblent échapper à son contrôle. La connaissance de l'homme se réduit-elle à la conscience ? L'homme est-il toujours responsable de ses actes ?

## I. Les caractéristiques essentielles de l'homme

### 1. L'homme, un être de conscience et de mémoire

La **conscience** est la faculté psychique qui permet de se connaître, de connaître le monde et de juger. Elle a deux dimensions :

- **La conscience psychologique** : faculté de se connaître et de connaître le monde extérieur. C'est la découverte de **Descartes** avec le *Cogito* : « **Je pense donc je suis** » (*Discours de la méthode*) — en doutant de tout, la seule certitude qui résiste est que je pense ;
- **La conscience morale** : capacité de juger ses actes. **Rousseau** : « Conscience ! Conscience ! Instinct divin (…) juge infaillible du bien et du mal » (*Émile ou de l'éducation*).

La conscience a aussi une fonction de rétention et de restitution : la **mémoire**, faculté de conservation des idées acquises. **Bergson** : « **Toute conscience est donc mémoire** » (*L'énergie spirituelle*).

### 2. L'homme, un être de liberté

La **liberté** est la capacité de s'autodéterminer, d'agir sans contrainte, de n'obéir qu'à sa volonté. Être libre pour un être conscient, c'est agir de façon **responsable** (« agir en toute conscience »). **Bergson** : « Notre conscience nous avertit que nous sommes des êtres libres (…) notre conscience témoigne de notre liberté » (*Leçons clermontoises*).

Mais sommes-nous toujours maîtres de nous-mêmes ? Déjà **Leibniz** (théorie des petites perceptions) remettait en cause la surestimation de la conscience. C'est avec **Freud** qu'on parvient à la découverte de l'inconscient.

## II. L'inconscient, une autre dimension de l'homme

### 1. La découverte de l'inconscient

De nombreux faits psychiques échappent à l'homme : oublis, motivations cachées, phobies, **rêves**, actes manqués… Ces limites de la conscience présupposent un **inconscient psychique**. Selon **Sigmund Freud** (1856-1939), l'inconscient est l'**ensemble des désirs refoulés qui échappent à la conscience** — l'instance psychique où sont emmagasinés instincts, pulsions et désirs refoulés. « Pour bien comprendre la vie psychique, il est indispensable de **cesser de surestimer la conscience** » (*L'interprétation des rêves*).

### 2. La violence comme manifestation de l'inconscient

Pour la psychanalyse, l'inconscient est le **siège de la violence** en l'homme. **Freud** : « L'homme n'est point cet être débonnaire, au cœur assoiffé d'amour (…) mais un être qui doit porter au compte de ses données instinctives une bonne somme d'**agressivité** » (*Malaise dans la civilisation*).

## III. Le déterminisme psychologique et la responsabilité de l'homme

### 1. Le déterminisme psychologique et la liberté humaine

Si nos actes sont produits par des forces indépendantes de nous, le moi conscient est manipulé : la responsabilité et la liberté semblent **illusoires**. **Paul Valéry** : « **La conscience règne mais ne gouverne pas** ». Freud dit aussi que « le moi n'est pas maître dans sa propre maison ».

### 2. L'homme, un être responsable

Les philosophes moralistes et existentialistes critiquent la théorie freudienne :

- **Alain** rejette l'hypothèse de l'inconscient : « Le freudisme si fameux est un art d'inventer en chaque homme un animal redoutable » (*Éléments de philosophie*) ;
- **Sartre** : l'homme est « **condamné à être libre** » — invoquer l'inconscient relève de la **mauvaise foi**, un prétexte pour justifier nos inconduites.

## Conclusion

Connaître l'homme est une entreprise difficile : il est tantôt un être conscient et libre, tantôt déterminé par l'inconscient. L'homme est un être **pluridimensionnel et complexe**.

---

### 📌 L'essentiel à retenir

- **Conscience** = psychologique (Descartes, *Cogito*) + morale (Rousseau) + mémoire (Bergson) ;
- La conscience fonde la **liberté** et la responsabilité ;
- **Freud** découvre l'**inconscient** (désirs refoulés, rêves, actes manqués) : « cesser de surestimer la conscience » ;
- Objections : **Alain** (l'inconscient est une invention), **Sartre** (l'inconscient = mauvaise foi, l'homme est « condamné à être libre ») ;
- Citations clés : « Je pense donc je suis » (Descartes) · « La conscience règne mais ne gouverne pas » (Valéry) · « Toute conscience est mémoire » (Bergson).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'philosophie' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 3;

-- ---- L4 — La vie en société ----
update public.chapitres c set
  titre = 'L4 — La vie en société',
  description = 'Les conditions de la liberté · société, État, nation, autrui, violence',
  resume = $md$*Thème : Les conditions de la liberté*

## Introduction

De tous les êtres, l'homme est le seul qui vit en **société**, c'est-à-dire avec ses semblables. Mais cette vie en société lui est-elle bénéfique ? Garantit-elle sa **liberté** ?

## I. L'homme, un être social

### 1. L'origine sociale de l'homme

La société est une communauté d'individus ayant des rapports organisés. Deux thèses s'opposent sur son origine :

- **La thèse naturaliste** (Aristote) : la société est un fait naturel — « **L'homme est par nature un animal politique** » (*La Politique*) ;
- **La thèse culturaliste** (philosophes du contrat : **Hobbes, Locke, Rousseau**) : la société est le produit d'un **contrat social**, un accord passé entre les hommes. Hobbes : les hommes ne s'assemblent « que par accident et non par une disposition nécessaire de la nature » (*Du citoyen*).

### 2. La relation nécessaire à autrui

Naturelle ou contractuelle, la sociabilité est inévitable : l'homme vit toujours avec les autres. **Hegel** et **Sartre** rejettent le **solipsisme** (l'existence solitaire de la conscience). **Sartre** : « Pour obtenir une vérité quelconque sur moi, il faut que je passe par l'autre » (*L'existentialisme est un humanisme*). Autrui contribue à ma prise de conscience et à mon humanisation. **Malson** : « Avant la rencontre d'autrui et du groupe, l'homme n'est rien d'autre que des virtualités aussi légères qu'une transparente vapeur » (*Les enfants sauvages*).

## II. L'État et la Nation, formes d'organisation sociale

### 1. La nécessité de l'État

L'**État** est une organisation politico-administrative et juridique exerçant une autorité sur un territoire. Il fait sortir les hommes de l'**état de nature** : ils aliènent leur liberté individuelle contre la garantie de leurs droits. L'État élabore les **lois** (le droit positif) et garantit liberté et sécurité. **Spinoza** : « **La fin de l'État est donc en réalité la liberté** » (*Traité théologico-politique*).

La **justice** signifie l'équité — attribuer à chacun ce qui lui revient — et désigne aussi l'institution chargée d'appliquer le droit. Pour **Rousseau** (*Du contrat social*), les lois sont l'émanation de la **volonté générale**.

### 2. La Nation, garante de l'unité sociale

La **Nation** se distingue de l'État : elle implique une **unité spontanée** (une Nation peut être partagée entre plusieurs États, un État peut contenir plusieurs Nations). Deux conditions la fondent :

- **objectives** : liens géographiques, ethniques, linguistiques, politiques, religieux ;
- **subjectives** : une **conscience nationale**. **Ernest Renan** : une Nation est « **une âme, un principe spirituel** » — un riche legs de souvenirs communs (passé) et « le désir de vivre ensemble » (avenir) (*Qu'est-ce qu'une Nation ?*).

## III. L'omniprésence de la violence dans l'espace social

### 1. Les relations conflictuelles avec autrui

La **violence** est l'usage abusif de la force. Selon **Hegel**, autrui se révèle dans un conflit originel qui débouche sur la reconnaissance mutuelle (**dialectique du maître et de l'esclave**, *Phénoménologie de l'esprit*). Chez **Sartre**, autrui est « un autre moi, le moi qui n'est pas moi » ; son regard me **chosifie** : « La honte est toujours honte devant quelqu'un » (*L'être et le néant*) — d'où « **L'enfer, c'est les autres** » (*Huis clos*).

### 2. La violence nécessaire de l'État

Pour **Machiavel**, en politique compte d'abord l'**efficacité** : la violence est un moyen de maintenir l'ordre, car les hommes sont méchants — « Qui veut faire entièrement profession d'homme de bien ne peut éviter sa perte parmi tant d'autres qui ne sont pas bons » (*Le Prince*). Pour **Max Weber**, l'État moderne a le **monopole de la violence légitime**, exercée à travers les trois pouvoirs (législatif, exécutif, judiciaire). **Althusser** distingue les **appareils idéologiques d'État** (école, médias, religion) qui imposent une doctrine, et les **appareils répressifs** (police, armée, justice) qui exercent la coercition.

## Conclusion

La vie en société confronte l'homme au défi de la liberté. L'analyse de la société, de l'État, de la Nation, du droit et d'autrui montre que l'homme est le **principal artisan de sa liberté**, par le respect des institutions qu'il a créées — et qu'il peut améliorer quand elles ne correspondent plus à ses aspirations.

---

### 📌 L'essentiel à retenir

- Origine de la société : **naturelle** (Aristote, « animal politique ») ou **contractuelle** (Hobbes, Locke, Rousseau) ;
- **Autrui est indispensable** à mon humanisation (Sartre, Malson) mais aussi source de conflit (« L'enfer, c'est les autres ») ;
- **État** = garant du droit et de la liberté (Spinoza) ; lois = volonté générale (Rousseau) ;
- **Nation** = « une âme, un principe spirituel » (Renan) ;
- Violence : monopole légitime de l'État (**Weber**), appareils idéologiques/répressifs (**Althusser**), efficacité politique (**Machiavel**).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'philosophie' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 4;

-- ---- L5 — Dieu et la religion ----
update public.chapitres c set
  titre = 'L5 — Dieu et la religion',
  description = 'Les conditions de la liberté · Dieu, rôles de la religion, aliénation et liberté',
  resume = $md$*Thème : Les conditions de la liberté*

## Introduction

De tous les êtres vivants, l'homme est le seul qui pratique la **religion** : la religiosité est une caractéristique essentielle de l'humanité. Quel est le sens de cette pratique ? Contribue-t-elle véritablement à la **liberté** de l'homme et à son épanouissement ?

## I. Dieu comme fondement de la religion

### 1. Dieu, être sacré

Pour **André Lalande**, la religion est « une institution sociale caractérisée par l'existence d'une communauté d'individus unis par la croyance en une valeur absolue : **Dieu** ». Dieu est un être **surnaturel, sacré**, objet de vénération, doté de qualités absolues : **omnipotence, omniscience, omniprésence**, bonté, perfection — un être **transcendant** qui peut se révéler aux hommes. **Durkheim** : « une religion est un système solidaire de croyances et de pratiques relatives à des choses **sacrées** (…) qui unissent en une même communauté morale tous ceux qui y adhèrent » (*Les formes élémentaires de la vie religieuse*).

### 2. Les critiques de l'existence de Dieu

Il faut distinguer l'**idée** de Dieu de son **existence**. Pour **Kant**, concevoir Dieu comme un être parfait ne prouve pas qu'il existe : « il nous faut sortir du concept pour attribuer à l'objet son existence » (*Critique de la raison pure*) — toute preuve de l'existence de Dieu est une **spéculation, une illusion de la raison**. De plus, l'**existence du mal** semble contredire la perfection divine. Ces critiques nourrissent la position des **athées**.

## II. Les différents rôles de la religion dans la société

### 1. La religion, facteur de cohésion sociale et de libération

Du latin *religio*, la religion renvoie au **lien vertical** (l'homme et Dieu) et au **lien horizontal** (les hommes entre eux). Sa fonction primordiale est de **rassembler** les hommes : par ses rites et ses mythes, elle assure la **cohésion sociale**. **Proudhon** : « c'est la religion qui cimenta les fondements des sociétés, qui donna l'unité et la personnalité aux nations ».

**Bergson** (*Les deux sources de la morale et de la religion*) lui reconnaît une triple fonction : assurance contre la désorganisation (interdits), protection contre l'**angoisse de la mort**, réassurance face à l'imprévisibilité de l'existence. **Hegel** : « la religion est la vraie libération de l'homme ». **Freud** : elle « nous éclaire sur l'origine et la formation de l'univers (…) nous assure la protection divine et la béatitude finale » (*L'avenir d'une illusion*).

### 2. La religion, source de moralisation de l'homme

La **morale** (règles de conduite fondées sur la connaissance du bien et du mal) trouve un fondement dans la religion : amour du prochain, partage, fraternité. **Kant** : « **La religion est la connaissance de tous nos devoirs comme des commandements divins** » (*La religion dans les limites de la simple raison*).

## III. L'impact de la pratique religieuse sur la liberté

### 1. La religion, source d'aliénation

La pratique religieuse exige sacrifices, renoncements et obéissance inconditionnelle : elle peut **aliéner**. **Marx** : les hommes « se sont inclinés devant leurs propres créations » (*L'Idéologie allemande*) ; la religion est « **l'opium du peuple** » — la vraie liberté suppose une société sans religion pour mystifier les consciences. **Feuerbach** : « l'aliénation majeure est l'idée de Dieu » (*L'essence du christianisme*) ; la théologie n'est qu'une **anthropologie** (l'homme projette sa propre essence en Dieu). Le **fanatisme religieux** peut aussi déboucher sur la violence et la guerre.

### 2. Le rapport entre la liberté et l'obligation morale

Les obligations morales religieuses ne contredisent pas la liberté : elles la **présupposent**. L'homme, être conscient, exerce son **libre arbitre** — il choisit de croire ou non. Chez **Kant**, le devoir est un **impératif catégorique** : un commandement qui s'impose sans condition (à la différence de l'impératif hypothétique, subordonné à un intérêt), mais auquel le sujet libre peut se soustraire. Obligation morale et liberté sont donc **compatibles**.

## Conclusion

La religion est naturelle et nécessaire à l'homme ; elle repose fondamentalement sur l'idée de Dieu. Malgré les obligations qu'elle impose, elle est facteur de liberté : fonction **psychologique** (apaiser les angoisses) et **sociale** (enseigner les vertus de la vie commune). La religion est un facteur d'**équilibre social et moral**.

---

### 📌 L'essentiel à retenir

- **Dieu** = être transcendant, sacré, parfait — fondement de la religion (Lalande, Durkheim) ;
- **Critiques** : Kant (l'existence ne se déduit pas du concept), le problème du mal, l'athéisme ;
- **Fonctions de la religion** : cohésion sociale (Proudhon), consolation face à la mort (Bergson), libération (Hegel), moralisation (Kant) ;
- **Aliénation** : « opium du peuple » (Marx), projection de l'homme (Feuerbach), fanatisme ;
- L'obligation morale **présuppose** la liberté (libre arbitre, impératif catégorique kantien).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'philosophie' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 5;

-- ---- L6 — L'histoire et l'humanité ----
update public.chapitres c set
  titre = 'L6 — L''histoire et l''humanité',
  description = 'Les conditions du bonheur · historicité, décolonisation, diversité culturelle',
  resume = $md$*Thème : Les conditions du bonheur*

## Introduction

L'histoire et l'humanité révèlent l'identité spécifique de l'homme parmi les êtres vivants. L'évolution de l'humanité rend compte des diverses productions accomplies par les hommes. L'histoire permet-elle de saisir les caractéristiques fondamentales de la notion d'**humanité** ?

## I. Les caractéristiques de l'humanité

### 1. Humanité, histoire, culture, civilisation et existence

- **L'humanité** : la totalité des hommes, mais aussi un **ordre éthique et moral** qui les distingue des animaux. **Sophocle** : « Il est bien des merveilles en ce monde, il n'en est pas de plus grande que l'homme » (*Antigone*). **Pascal** : l'humanité est « toute la suite des hommes à travers les générations » qui « apprend continuellement et se transforme sans cesse » (*Traité du vide*) ;
- **L'histoire** : l'ensemble des faits du passé humain, et l'étude de ces faits ;
- **La culture** : les modifications que l'homme imprime à la nature et à lui-même ; les connaissances acquises par l'éducation ;
- **La civilisation** : la culture en action — **Senghor** : « l'ensemble des valeurs morales et techniques et la manière de s'en servir » (*Liberté*) ;
- **L'existence** (*existentia*) : le fait d'être présent au monde et d'en prendre conscience — à distinguer de l'**essence** (ce qui définit un être). **Sartre** : « **L'existence précède l'essence** » (*L'existentialisme est un humanisme*).

### 2. Les interactions entre ces notions

Culture, civilisation et histoire confèrent à l'humanité sa spécificité. **Rousseau** : la différence entre l'homme et l'animal réside dans « la faculté de se **perfectionner** » (*Discours sur l'origine de l'inégalité*). **Kant** : « L'homme ne peut devenir homme que par l'**éducation** » (discipline + instruction, *Traité de pédagogie*).

## II. Les différents rôles de l'homme dans l'histoire

### 1. L'historicité comme expression de l'humanité

L'**historicité** est le récit des actions et événements dignes de mémoire. La mémoire individuelle et collective restitue le passé, repère du parcours de l'humanité (**Raymond Aron**, *Les dimensions de la conscience historique*). L'homme est le **seul être historique** : l'histoire intègre passé, présent et avenir.

### 2. La responsabilité de l'homme dans le cours de l'histoire

- **L'homme, objet de l'histoire** : pour les religions révélées, l'histoire est soumise à la **Providence** ; pour les stoïciens (**Marc-Aurèle** : « Tout ce qui arrive est nécessaire »), c'est le **fatalisme** ; pour **Hegel**, c'est l'**Esprit universel** (la Raison) qui « mène les peuples et le monde » (*La raison dans l'histoire*) — l'homme n'est qu'un instrument ;
- **L'homme, sujet de l'histoire** : **Marx et Engels** (matérialisme historique) critiquent Hegel — « **Les hommes font leur propre histoire** dans des conditions directement héritées du passé » (*Le 18 Brumaire*). **Sartre** : « l'histoire est l'œuvre propre de toute l'activité de tous les hommes » (*Critique de la raison dialectique*) ;
- **L'homme, à la fois produit et agent** : pour **Machiavel**, l'histoire n'est pas totalement prédéterminée — elle laisse place à l'engagement et à l'action des hommes.

## III. Décoloniser et désaliéner : deux exigences de l'humanité

### 1. Le refus de la domination

L'humanité repose sur la **dignité humaine** et la diversité culturelle : elle est incompatible avec la domination. L'**ethnocentrisme** (privilégier sa propre culture) est illégitime et dangereux : il conduit au racisme, à l'esclavage, à la colonisation. Contre les justifications de l'esclavage (cf. l'ironie de Montesquieu), **Senghor, Césaire, Damas et Fanon** revendiquent l'égalité des peuples à travers la **Négritude**. **Lévi-Strauss** : « Aucune société n'est foncièrement bonne ; mais aucune n'est absolument mauvaise » (*Tristes Tropiques*).

### 2. La diversité culturelle, facteur d'enrichissement

L'humanité se construit dans la **diversité** des peuples et des cultures. **Saint-Exupéry** : « **Si tu diffères de moi, mon frère, loin de me léser, tu m'enrichis** » (*Terre des hommes*). **Comte** : « notre harmonie morale repose exclusivement sur l'**altruisme** » (*Catéchisme positiviste*). **Senghor** prône la « civilisation de l'universel » ; **Mandela** incarne la lutte contre toutes les dominations.

## Conclusion

L'histoire de l'humanité permet de saisir le parcours des hommes et des peuples à travers le temps et leurs productions (culture, civilisation, existence). Le refus de l'ethnocentrisme et de la domination est légitime au nom du **rationalisme** : la raison est une faculté universelle.

---

### 📌 L'essentiel à retenir

- **Humanité** = totalité des hommes + ordre moral ; l'homme se distingue par la **perfectibilité** (Rousseau) et l'**éducation** (Kant) ;
- L'homme et l'histoire : **objet** (Providence, fatalisme stoïcien, Esprit hégélien) / **sujet** (Marx, Sartre) / **les deux** (Machiavel) ;
- **Décoloniser et désaliéner** : exigences de l'humanité contre l'ethnocentrisme — la **Négritude** (Senghor, Césaire, Fanon) ;
- La **diversité culturelle enrichit** l'humanité (Saint-Exupéry, Comte, Lévi-Strauss) ;
- Citation clé : « Les hommes font leur propre histoire » (Marx) · « Si tu diffères de moi… tu m'enrichis » (Saint-Exupéry).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'philosophie' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 6;

-- ---- L7 — La valeur de la philosophie ----
update public.chapitres c set
  titre = 'L7 — La valeur de la philosophie',
  description = 'Les conditions du bonheur · philosophie, raison et mythe',
  resume = $md$*Thème : Les conditions du bonheur*

## Introduction

Pour comprendre et transformer le monde, l'homme a eu recours aussi bien aux productions **rationnelles** (la philosophie) qu'aux productions **imaginaires** (le mythe). Ces deux discours s'opposent-ils systématiquement ? Quel est le rôle de la philosophie dans l'histoire de l'humanité ?

## I. La caractérisation de la philosophie, de la raison et du mythe

### 1. La philosophie, quête perpétuelle de savoir rationnel et de vertu

Née vers le **VIe siècle av. J.-C.**, la philosophie signifie étymologiquement « **amour de la sagesse** » (Pythagore). C'est un usage **critique de la raison** en quête de vérité. **Platon** : elle « sert à l'instruction » (*Gorgias*) ; **Descartes** : elle permet de « régler nos mœurs » (*Principes de la philosophie*) ; **Heidegger** : « La philosophie est œuvre de la raison ».

### 2. La raison, faculté de connaissance et de jugement

Du grec ***logos*** (discours cohérent) et du latin ***ratio*** (calcul), la raison est la faculté de connaître, juger et agir selon des principes. **Descartes** : « La raison est la puissance de **bien juger et de distinguer le vrai d'avec le faux** » (*Discours de la méthode*). Elle est la matrice de la science et de la philosophie.

### 3. Le mythe, récit imaginaire et fabuleux

Du grec ***muthos*** (récit, parole), le mythe est une production de l'**imagination** : un récit imaginaire et **symbolique** des origines du monde et de l'humanité. Inhérent à la culture et aux croyances des peuples, il perpétue les traditions et explique les phénomènes (mythes d'Homère). **Edith Hamilton** : « Le mythe est la **science des premiers âges** » (*La Mythologie*).

## II. Les rapports entre la raison et le mythe

### 1. L'opposition entre la raison et le mythe

- La raison se rapporte au **réel** ; le mythe invente des images qui le transcendent. **Pascal** : l'imagination est « **maîtresse d'erreurs et de faussetés** », « ennemie de la raison » (*Pensées*) ;
- La connaissance rationnelle est **objective et scientifique** ; le mythe baigne dans la subjectivité et la métaphysique. **Auguste Comte** (loi des **trois états** : théologique → métaphysique → **positif**) voit dans le mythe « l'**enfance de l'esprit** » (*Discours sur l'esprit positif*) ;
- La raison exige des **preuves** (démonstrations, vérifications) ; le mythe repose sur la **croyance**.

### 2. La nécessaire complémentarité entre la raison et le mythe

Raison et mythe s'inscrivent dans un mouvement **dialectique** :

- Le mythe est aussi un effort pour **penser le monde** : c'est le premier balbutiement de la raison. **Vernant** : le mythe est « comme une **ébauche de discours rationnel** » (*Mythe et société*) ;
- Quand la raison avoue son impuissance, elle **produit le mythe** pour résoudre l'énigmatique ; en retour, la raison donne au mythe cohérence et logique. **François Jacob** : « mythe et science remplissent une même fonction : ils fournissent à l'esprit humain une certaine représentation du monde » (*Le jeu des possibles*).

## III. La valeur de la philosophie dans l'histoire de l'humanité

### 1. La raison et le mythe comme fondements de la philosophie

**Gusdorf** : « **La philosophie naît par épuration du mythe** ». **Platon** lui-même utilise le mythe pour exprimer l'ineffable et enseigner : le **mythe de la caverne** (théorie de la connaissance, *République* VII), le mythe d'**Er** (destinée des âmes), le mythe de l'**androgyne** (origine du désir, *Le Banquet*). Le mythe a une valeur **pédagogique et cognitive** (Étienne Borne, Roger Caillois).

### 2. Le rôle de la philosophie dans l'histoire de l'humanité

- **Intellectuel** : elle délivre de l'ignorance — **Aristote** : « Ce fut pour échapper à l'ignorance que les premiers philosophes se livrèrent à la philosophie » (*Métaphysique*) ; **Russell** : sans philosophie, l'homme reste « emprisonné dans les préjugés » (*Problèmes de philosophie*) ;
- **Moral** : elle fonde les valeurs en raison et rend vertueux — **Épicure** : une vie heureuse conforme à la satisfaction des seuls désirs naturels et nécessaires (*Lettre à Ménécée*) ;
- **Social et politique** : **Platon** : « Tant que les philosophes ne seront pas rois (…) il n'y aura de cesse aux maux des cités » (*La République*) ;
- **Existentiel** : la philosophie est une **anthropologie** — **Kant** : sa question fondamentale est « **Qu'est-ce que l'homme ?** » (*Logique*) ;
- **Dynamique du progrès** : **Hegel** : sans la philosophie, il ne peut y avoir dans les sciences et les arts « ni vie, ni esprit, ni vérité » (*Phénoménologie de l'esprit*).

## Conclusion

Raison et mythe, bien que procédant différemment, ne s'excluent pas : ils sont **complémentaires** pour comprendre l'histoire de l'humanité. Parce qu'elle examine de façon critique l'homme, son monde, ses connaissances et ses valeurs, la philosophie demeure une activité **indispensable** à l'humanité et au progrès.

---

### 📌 L'essentiel à retenir

- **Philosophie** = amour de la sagesse (Pythagore), œuvre de la raison ; **raison** = bien juger (Descartes) ; **mythe** = récit imaginaire et symbolique (*muthos*) ;
- **Opposition** : preuve contre croyance (Pascal, Comte : « l'enfance de l'esprit ») ;
- **Complémentarité** : le mythe est l'ébauche du *logos* (Vernant) ; la philosophie « naît par épuration du mythe » (Gusdorf) ; Platon use des mythes (caverne, androgyne) ;
- **Valeur de la philosophie** : libère de l'ignorance (Aristote, Russell), moralise (Épicure), éclaire la politique (Platon, le philosophe-roi), interroge l'homme (Kant).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'philosophie' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 7;

-- ---- L8 — Progrès et bonheur ----
update public.chapitres c set
  titre = 'L8 — Progrès et bonheur',
  description = 'Les conditions du bonheur · désir, travail, technique, art, types de progrès',
  resume = $md$*Thème : Les conditions du bonheur*

## Introduction

Le **progrès** est inhérent à l'espèce humaine : révolutions scientifiques, techniques, économiques. Pourtant, comme le remarque **Freud** (*Malaise dans la civilisation*), ces progrès spectaculaires n'ont pas réussi à rendre les hommes **heureux**. Le progrès conduit-il nécessairement au bonheur ? L'homme, être de désir et de passion, peut-il accéder à la pleine satisfaction ?

## I. Les caractéristiques du désir, du travail, de l'art, du progrès et du bonheur

### 1. Le désir et les passions

- **Le désir** est l'expression du **manque** : aspirer à posséder ce qui nous manque. Lié à la conscience, il est propre à l'homme (l'animal n'a que des besoins). **Platon** : « Le désirable par excellence est le Bien » (*Phédon*) ;
- **La passion** : développement démesuré d'un sentiment — on la subit, on en souffre. **Épicure** classe les désirs (*Lettre à Ménécée*) : **naturels et nécessaires** (le sage s'en contente), naturels non nécessaires, ni naturels ni nécessaires. Mais il existe de **bonnes passions**, énergies au service de l'action — **Hegel** : « **rien de grand ne s'est accompli dans le monde sans passion** » (*La Raison dans l'histoire*) ; Rousseau : « il n'y a que des âmes de feu qui sachent combattre et vaincre » (*La Nouvelle Héloïse*).

### 2. Le travail, la technique, l'art et l'imagination

- **Le travail** : activité consciente de transformation de la nature et de l'homme (du latin *tripalium*, instrument de torture) — contrainte à surmonter, présenté comme malédiction dans la Genèse ;
- **La technique** : ensemble de procédés, savoir-faire ; aujourd'hui science appliquée (**technoscience**) ;
- **L'art** : production du **beau** par un être conscient. **Platon** le condamne comme copie du sensible (*République*) ; mais pour **Kant**, « l'art est la belle représentation d'une chose, et non la représentation d'une belle chose » (*Critique de la faculté de juger*) ; **Hegel** : l'imitation ne produit « jamais des œuvres d'art » (*Esthétique*) — l'art est **création** ;
- **L'imagination** : « pouvoir de se représenter par intuition un objet, même en son absence » (Kant). Elle est invention, création — **Bachelard** : « l'expérience même de l'ouverture, de la nouveauté » (*L'air et le songe*).

### 3. Les différents types de progrès

Le progrès est une **marche en avant**, du bien au mieux. Pour **Hegel**, c'est une nécessité historique conduite par l'Esprit ; pour **Marx**, il est l'**œuvre de l'homme** par son travail. Deux formes :

- **le progrès matériel** : fruit de la rationalité technoscientifique — l'homme devenu « **comme maître et possesseur de la nature** » (Descartes, *Discours de la méthode*) ;
- **le progrès spirituel et moral** : élévation intellectuelle, psychologique et morale de l'homme.

## II. Les rapports entre travail, technique, art et imagination

Le désir et les passions **stimulent l'imagination**, source des créations, inventions et découvertes. Le **travail** est un remède contre la misère : il libère de la tyrannie des besoins — **Voltaire** : « **Le travail éloigne de nous trois grands maux : l'ennui, le vice et le besoin** » (*Candide*) — et permet la **sublimation** des pulsions (Freud).

Mais cette satisfaction n'est que **matérielle** : le machinisme sacrifie le travailleur à la machine, l'**aliène** et le déshumanise (**Marx**, *Manuscrits de 1844*).

## III. Les conditions du bonheur

### 1. Les limites du progrès matériel

Le progrès matériel s'est parfois mué en **régression** : atrocités de masse, violences d'une civilisation industrielle avancée. **Adorno et Horkheimer** (école de Francfort) doutent de la mission rédemptrice de la technoscience : « la raison est devenue une finalité sans fin » (*La dialectique de la raison*). La dimension spirituelle et morale de l'homme a été occultée.

### 2. La nécessaire complémentarité entre progrès matériel et spirituel

Le bonheur — « la satisfaction de toutes nos inclinations » (Kant) — exige que le progrès matériel s'accompagne du **progrès spirituel et moral**, car l'homme est corps, âme et esprit. **Rabelais** : « **Science sans conscience n'est que ruine de l'âme** » (*Pantagruel*). **Bergson** : « À une culture technologique extrêmement poussée, il faut un **supplément d'âme** » (*Les deux sources de la morale et de la religion*). Le véritable développement vise la promotion de la **personne humaine** : travail, logement, nourriture, éducation et santé pour tous.

## Conclusion

L'homme aspire au bonheur et crée les conditions du progrès. Mais le monde actuel, dominé par la rationalité technoscientifique, ne valorise que l'aspect **matériel** du progrès — qui n'est pas le plus important. Être de désir et de passion, l'homme peut-il vraiment relever le défi du bonheur ?

---

### 📌 L'essentiel à retenir

- **Désir** = manque (propre à l'homme) ; le sage se contente des désirs **naturels et nécessaires** (Épicure) ; les passions peuvent être moteurs (« rien de grand sans passion », Hegel) ;
- **Progrès matériel** (technoscience, Descartes) ≠ **progrès spirituel et moral** — les deux sont **complémentaires** ;
- Le travail libère (« éloigne l'ennui, le vice et le besoin », Voltaire) mais peut aliéner (machinisme, Marx) ;
- Le progrès matériel seul ne fait pas le bonheur (Freud, école de Francfort) ;
- Citations clés : « Science sans conscience n'est que ruine de l'âme » (Rabelais) · « il faut un supplément d'âme » (Bergson) · « Le désir est un vase percé » (Platon).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'philosophie' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 8;

-- ---- L9 — Langage et vérité ----
update public.chapitres c set
  titre = 'L9 — Langage et vérité',
  description = 'Les conditions d''élaboration de la connaissance · formes du langage, critères de la vérité',
  resume = $md$*Thème : Les conditions d'élaboration de la connaissance*

## Introduction

Il est difficile de s'accorder sur le sens de la **vérité**, à cause de ses différentes acceptions et des limites des formes de communication qui l'expriment. Qu'est-ce que la vérité ? À quel critère la reconnaît-on ? Le **langage** est-il un moyen efficace de communication de la vérité ?

## I. Les différentes formes de communication

### 1. Communication animale et langage humain

Le **langage** est un système de signes (oraux, graphiques) permettant d'exprimer et de communiquer la pensée. **Searle** : « La communication est la fonction essentielle du langage ». Les animaux communiquent (la **danse des abeilles** étudiée par **Karl von Frisch**), mais leur communication n'est qu'un **code de signaux** : fixe, invariable, instinctif, sans dialogue. **Benveniste** : « Les différences sont considérables et elles aident à prendre conscience de ce qui caractérise en propre le langage humain ».

Le **signe linguistique** (Saussure, *Cours de linguistique générale*) unit un **signifiant** (aspect matériel) et un **signifié** (concept) de façon **arbitraire** (conventionnelle). Le langage humain est **évolutif, créatif, polysémique, culturel** et dialogique. Il a de multiples fonctions : communication, expression, élaboration de la pensée, fonction esthétique (poésie), fonction magique.

### 2. Le langage comme moyen d'expression de la pensée

- **Fondement culturel** : le langage **s'acquiert** en société (cf. les enfants sauvages de Malson) — **Dumery** : « Tout le passé culturel est inhérent à l'acquis linguistique d'un peuple ». Chaque langue porte une vision du monde : apprendre à parler, c'est apprendre à penser le monde d'une certaine manière ;
- **Relation intime langage-pensée** : **Descartes** : « C'est parce qu'ils n'ont pas la pensée que les animaux ne parlent pas ». **Hegel** : « **C'est dans les mots que nous pensons** (…) le mot donne à la pensée son existence la plus haute et la plus vraie » (*Phénoménologie de l'esprit*). **Platon** : pensée et langage sont comme le recto et le verso d'une feuille — « Qui connaît les mots, connaît les choses » (*Cratyle*). **Boileau** : « **Ce que l'on conçoit bien s'énonce clairement**, et les mots pour le dire arrivent aisément » (*Art poétique*).

## II. Les différents types de vérité

### 1. Les critères de la vérité

- **La réalité (correspondance)** : est vrai ce qui est conforme au réel — la vérité est « l'accord de la connaissance avec l'objet » (**Kant**) ; « Le vrai est ce qui est ; le faux ce qui n'est point » (**Bossuet**) ;
- **L'unanimité** : est vrai ce qui recueille l'accord de tous — **Lalande** : « On appelle vérité ce qu'on a cru vrai à une certaine époque ou en un certain pays » (risques : conformisme, suivisme) ;
- **L'évidence** : est vrai ce qui s'impose « clairement et distinctement » à l'esprit — **Descartes** : « La vérité est une notion si transcendantalement claire qu'il est impossible de l'ignorer » ; **Spinoza** : « Qui a une idée vraie sait en même temps qu'il a une idée vraie » (*Éthique*) ;
- **Le pragmatisme (efficacité)** : est vrai ce qui réussit — **William James** : « Le vrai consiste simplement dans ce qui est avantageux pour notre pensée » (*Le pragmatisme*).

### 2. La relativité de la vérité

- **Le scepticisme** : **Protagoras** — « L'homme est la mesure de toute chose » ; **Pyrrhon** doute de tout et pratique l'***épochè*** (suspension du jugement) : il n'existe pas de vérité objective ;
- **La vérité comme donnée subjective et historique** : « **Chaque siècle a ses vérités** » (Lalande) ; **Pascal** : « Vérité en deçà des Pyrénées, erreur au-delà » (*Pensées*) ; **Bachelard** : « Il n'y a pas de vérités premières : il n'y a que des erreurs premières » (*Rationalisme appliqué*). La vérité scientifique d'aujourd'hui peut être l'erreur de demain.

## III. Le pouvoir et les limites du langage

### 1. Les avantages du langage

- **Moyen privilégié d'expression de la vérité** : **Merleau-Ponty** : « Notre pensée traîne dans le langage, et toute vérité est par le langage » ; **Hobbes** : « **Là où il n'y a pas de langage, il n'y a ni vérité ni fausseté** » (*Léviathan*) ; **Lavelle** : le langage « n'est pas le simple vêtement de la pensée, il en est le corps véritable » ;
- **Facteur de cohésion sociale** : la vérité rapproche ceux qui la partagent — **Nietzsche** : « les certitudes partagées maintiennent un accord entre les hommes » (*Le gai savoir*).

### 2. Les limites du langage

- **Insuffisances** : la pensée déborde les mots — **Diderot** : « nous avons plus d'idées que de mots » ; **Bergson** : « **la pensée demeure incommensurable avec le langage** » (*Essai sur les données immédiates de la conscience*) — les mots sont collectifs et impersonnels, nos vécus sont individuels ; l'expérience du **lapsus** trahit la pensée ;
- **Source d'abus et de tromperies** : **Locke** : « Le langage nous trompera parfois » (*Essai sur l'entendement humain*) — cf. la **rhétorique des sophistes**. **Wittgenstein** : « **Ce dont on ne peut parler, il faut le taire** » (*Tractatus logico-philosophicus*).

## Conclusion

La vérité dépend de la capacité du langage à la traduire. Mais sa polysémie, sa **relativité** et les limites du langage rendent cette expression souvent imparfaite. Dans le domaine de la connaissance, il faut donc utiliser les méthodes les plus adéquates — celles que privilégient les sciences. Mais n'y a-t-il de vérité que scientifique ?

---

### 📌 L'essentiel à retenir

- Langage humain ≠ communication animale : signe **arbitraire** (Saussure), créativité, dialogue, culture ;
- Langage et pensée sont **indissociables** (Platon, Hegel, Merleau-Ponty) ;
- **4 critères de vérité** : correspondance au réel (Kant), unanimité, évidence (Descartes), efficacité (James) ;
- La vérité est **relative** : scepticisme (Protagoras, Pyrrhon), historicité (« chaque siècle a ses vérités ») ;
- Le langage exprime la vérité mais **la trahit parfois** (Bergson, Locke, les sophistes).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'philosophie' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 9;

-- ---- L10 — La connaissance scientifique ----
update public.chapitres c set
  titre = 'L10 — La connaissance scientifique',
  description = 'Les conditions d''élaboration de la vérité · types de sciences, démarches, bioéthique',
  resume = $md$*Thème : Les conditions d'élaboration de la vérité*

## Introduction

**Freud** : « Le travail scientifique est le seul qui puisse nous mener à la connaissance de la réalité extérieure » (*L'avenir d'une illusion*). La vérité scientifique s'impose par son objectivité et son efficacité. Pourtant la science semble limitée sur certaines préoccupations humaines. La science est-elle la **détentrice exclusive de la vérité** ?

## I. Les caractéristiques de la connaissance scientifique

### 1. Les différentes formes de connaissance

- **La connaissance vulgaire (générale)** : informations diffuses issues de l'expérience quotidienne — la ***doxa*** de Platon, faite d'opinions et de préjugés. **Bachelard** : « **l'opinion pense mal ; elle ne pense pas** » (*La formation de l'esprit scientifique*) ;
- **La connaissance philosophique** : savoir **critique**, interrogation perpétuelle sur l'univers, l'homme et les normes (le bien, le juste, le beau, le vrai) ;
- **La connaissance scientifique** : « ensemble de connaissances et de recherches ayant un degré suffisant d'unité, de généralité (…) confirmées par des méthodes de vérification définies » (**Lalande**) — rationnelle, universelle, fondée sur la vérification.

### 2. La spécificité de la connaissance scientifique

Elle **rompt avec le sens commun** (préjugés, dogmatisme, traditions) et dépasse les apparences pour expliquer les causes profondes. Elle exige **esprit critique, preuve et objectivité**. Selon **Comte**, elle n'est pas naturelle à l'homme : elle représente la **maturité de l'esprit humain** (état positif). C'est une connaissance **apodictique, objective, universelle**, qui fait l'accord des esprits.

## II. Le processus d'élaboration de la vérité scientifique

### 1. Les différents types de sciences

- **Sciences formelles** (logique, mathématiques) : sciences **axiomatico-déductives** du raisonnement ;
- **Sciences expérimentales** (physique, chimie) : sciences de la nature fondées sur raisonnement et **expérimentation** ;
- **Sciences humaines** (histoire, sociologie, psychologie) : étude de l'homme et de ses comportements.

### 2. Les démarches des sciences

- **Sciences formelles** : seule compte la **cohérence** du raisonnement (syllogisme d'Aristote : « Tous les hommes sont mortels… »). L'**axiomatique** (définitions, axiomes, postulats) ignore la réalité matérielle : est vrai ce qui est logiquement démontré. Les mathématiques sont le **langage de toutes les sciences** — **Galilée** : « Le livre de la nature est écrit dans le langage mathématique » (*L'Essayeur*) ;
- **Sciences expérimentales** : dépassement du conflit **empirisme** (Locke : l'esprit est une « table rase », la connaissance vient des sens) / **rationalisme** (Descartes : la connaissance vient de la raison — analyse du morceau de cire). **Kant** les concilie : « La connaissance suppose deux éléments : le concept par lequel l'objet est pensé et l'intuition sensible par laquelle il est donné » (*Critique de la raison pure*). **Claude Bernard** : « **Le savant complet est celui qui embrasse à la fois la théorie et l'expérience** ». Les **3 étapes de la démarche expérimentale** : **observation** du fait (fait-polémique) → **hypothèse** (« idée préconçue ou anticipée », Cl. Bernard) → **vérification/expérimentation** (l'hypothèse confirmée devient **loi**) ;
- **Sciences humaines** : sciences inductives qui instruisent l'homme sur lui-même (Piaget).

## III. Les insuffisances de la démarche scientifique et les limites de la vérité scientifique

### 1. Les limites des démarches

- **Sciences formelles** : simples **outils** (*organon* d'Aristote), coupées du réel — **Russell** : « Les mathématiques peuvent être définies comme le domaine dans lequel on ne sait jamais de quoi l'on parle, ni si ce que l'on dit est vrai » (*Mysticisme et logique*) ;
- **Sciences expérimentales** : observation imparfaite, remise en cause des acquis (théorie corpusculaire → ondulatoire de la lumière) ; l'hypothèse trahit la **subjectivité** du savant ;
- **Sciences humaines** : l'événement humain est **irréversible** (inobservable directement) ; le chercheur est influencé par son époque et ses choix.

### 2. La connaissance du vivant et la bioéthique

Le **vivant** (étudié par la **biologie**) se caractérise par la cellule, la respiration, la reproduction, l'irritabilité, l'autogenèse. Théories explicatives : le **finalisme** (Aristote : « la nature ne fait rien en vain »), le **mécanisme** (Descartes : le corps est une machine), le **vitalisme** (force vitale immatérielle), l'**organicisme** (Kant : « un être organisé n'est pas une simple machine » ; Canguilhem : autoconstitution, autorégulation, autoréparation).

Les biotechnologies (procréatique : FIVETE, insémination artificielle, mères porteuses ; génétique ; euthanasie et acharnement thérapeutique ; commerce d'organes) posent d'énormes problèmes moraux. La **bioéthique** est née pour définir « les frontières du possible et du légitime » : l'étude des préceptes moraux qui doivent présider aux pratiques médicales et biologiques. **Rabelais** : « **Science sans conscience n'est que ruine de l'âme** ».

### 3. Les limites de la vérité scientifique

- **La relativité des théories** : les lois scientifiques sont « des vérités **partielles et provisoires** » (Claude Bernard) ; leur caractère fondamental est la **falsifiabilité** — **Popper** : « un système faisant partie de la science empirique doit pouvoir être réfuté par l'expérience » (*La logique de la découverte scientifique*) ; une théorie qui s'absolutise devient un « **obstacle épistémologique** » (Bachelard) ;
- **Le caractère lacunaire** : la science domine la matière mais ne comble pas les aspirations **morales et spirituelles** (amour, solidarité, foi) — d'autres voies mènent à la vérité.

## Conclusion

Loin d'avoir le monopole de la vérité, la science n'exprime qu'**un type particulier de vérité** parmi d'autres : les vérités du cœur, de la foi, de la philosophie, de l'esthétique la complètent. Science et poésie, selon Bachelard, « doivent s'unir comme deux contraires bien faits ».

---

### 📌 L'essentiel à retenir

- 3 formes de connaissance : **vulgaire** (doxa), **philosophique** (critique), **scientifique** (objective, vérifiée) ;
- 3 types de sciences : **formelles** (cohérence logique), **expérimentales** (observation → hypothèse → vérification), **humaines** ;
- Kant réconcilie **empirisme et rationalisme** ; Claude Bernard : théorie + expérience ;
- La vérité scientifique est **provisoire et falsifiable** (Popper, Bachelard) ;
- La **bioéthique** encadre les pratiques sur le vivant — « Science sans conscience n'est que ruine de l'âme » (Rabelais).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'philosophie' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 10;

-- Contrôle : liste des résumés publiés pour la matière
select s.nom as serie, c.ordre, c.titre, length(c.resume) as taille_resume, c.resume_published
from public.chapitres c
join public.matieres m on m.id = c.matiere_id
join public.series s on s.id = c.serie_id
join public.niveaux n on n.id = s.niveau_id
where m.slug = 'philosophie' and n.nom = 'Terminale'
order by s.nom, c.ordre;
