-- ============================================================================
-- EXCELLENCE LYCÉE — résumés histoire-geo / Terminale (séries A, C, D)
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
  (1, 'H1 — L''Organisation des Nations Unies (ONU)', 'Histoire · Thème 1 : Les relations internationales de 1945 à nos jours'),
  (2, 'H2 — L''ère de la bipolarisation de 1947 à 1991', 'Histoire · Thème 1 : Les relations internationales de 1945 à nos jours'),
  (3, 'H3 — De la fin de la guerre froide vers un monde multipolaire', 'Histoire · Thème 1 : Les relations internationales de 1945 à nos jours'),
  (4, 'H4 — La montée des nationalismes en Afrique', 'Histoire · Thème 2 : De la décolonisation aux efforts d''organisation de l''Afrique'),
  (5, 'H5 — L''accession de la Côte d''Ivoire à l''indépendance', 'Histoire · Thème 2 : De la décolonisation aux efforts d''organisation de l''Afrique'),
  (6, 'H6 — L''accession de l''Algérie à l''indépendance', 'Histoire · Thème 2 : De la décolonisation aux efforts d''organisation de l''Afrique'),
  (7, 'H7 — L''Union Africaine (UA)', 'Histoire · Thème 2 : De la décolonisation aux efforts d''organisation de l''Afrique'),
  (8, 'H8 — Croyances et valeurs dominantes dans le monde occidental', 'Histoire · Thème 3 : Croyances et valeurs dans le monde d''aujourd''hui'),
  (9, 'H9 — Les mutations contemporaines de la civilisation négro-africaine', 'Histoire · Thème 3 : Croyances et valeurs dans le monde d''aujourd''hui'),
  (10, 'G1 — Les fondements du développement économique de la Côte d''Ivoire', 'Géographie · Thème 1 : La Côte d''Ivoire, étude économique'),
  (11, 'G2 — Les secteurs d''activités économiques de la Côte d''Ivoire', 'Géographie · Thème 1 : La Côte d''Ivoire, étude économique'),
  (12, 'G3 — Les problèmes de développement économique de la Côte d''Ivoire', 'Géographie · Thème 1 : La Côte d''Ivoire, étude économique'),
  (13, 'G4 — Les fondements du développement économique de la Corée du Sud', 'Géographie · Thème 2 : La Corée du Sud, un exemple de pays émergent'),
  (15, 'G6 — La CEDEAO, une organisation régionale à caractère économique', 'Géographie · Thème 3 : Regroupements et coopération économique'),
  (16, 'G7 — Les relations UE-ACP : un exemple de coopération Nord-Sud', 'Géographie · Thème 3 : Regroupements et coopération économique')
) as x(ordre, titre, description) on true
where m.slug = 'histoire-geo' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
on conflict (matiere_id, serie_id, ordre) do nothing;

-- 2) Injection des résumés (titre et description resynchronisés au passage)

-- ---- H1 — L'Organisation des Nations Unies (ONU) ----
update public.chapitres c set
  titre = 'H1 — L''Organisation des Nations Unies (ONU)',
  description = 'Histoire · Thème 1 : Les relations internationales de 1945 à nos jours',
  resume = $md$*Thème 1 : Les relations internationales de 1945 à nos jours*

## Introduction

La Seconde Guerre mondiale consacre l'échec de la **SDN** (Société des Nations). Les Alliés jettent alors les bases d'une nouvelle organisation chargée du maintien de la paix et de la sécurité internationales : l'**ONU** (Organisation des Nations Unies). Quel bilan peut-on faire de ses actions plusieurs décennies après sa création ?

## I. Création, objectifs et principes

### 1. Une construction progressive (1941-1945)

L'ONU est l'aboutissement d'une série de conférences entre Alliés. Elle fonctionne officiellement à partir du **24 octobre 1945**.

| Date | Conférence | Décisions importantes |
|---|---|---|
| 14 août 1941 | Terre-Neuve (Roosevelt, Churchill) | **Charte de l'Atlantique** : idée de création de l'ONU |
| 1er janvier 1942 | Washington | **Déclaration des Nations Unies** (26 nations antifascistes) |
| oct. 1943 | Moscou | Idée de création réaffirmée |
| nov.-déc. 1943 | Téhéran | Égalité souveraine, objectif de sécurité |
| sept.-oct. 1944 | Dumbarton Oaks | Définition des **organes** et du fonctionnement |
| 4-11 février 1945 | Yalta | Résolution de la question du **droit de veto** |
| 26 avril - 26 juin 1945 | **San Francisco** (50 États, dont 4 africains) | **Charte de l'ONU**, ratifiée par USA, GB, URSS, Chine, France |

### 2. Les objectifs

- **Maintenir la paix et la sécurité internationales** (objectif principal) ;
- Promouvoir la souveraineté et l'autodétermination des peuples ;
- Promouvoir les droits de l'homme et les libertés fondamentales ;
- Promouvoir la coopération internationale dans tous les domaines.

### 3. Les principes

- **Égalité souveraine** de tous les États membres ;
- Remplir de bonne foi ses obligations vis-à-vis de l'ONU ;
- **Règlement pacifique** des différends internationaux ;
- S'abstenir de recourir à la menace ou à la force ;
- **Non-ingérence** dans les affaires intérieures des États membres.

## II. Le fonctionnement des principaux organes

### 1. Les organes principaux

- **L'Assemblée générale** : organe de **délibération**, 193 États membres (le Soudan du Sud est le 193e, indépendant le 9 juillet 2011). Une session ordinaire par an, un État = une voix, décisions non contraignantes. Vote le budget, élit le secrétaire général, se prononce sur l'adhésion de nouveaux membres.
- **Le Conseil de sécurité** : organe **exécutif**. 5 membres permanents avec **droit de veto** (États-Unis, France, Grande-Bretagne, Russie, Chine) + 10 membres non permanents élus pour 2 ans. Gère le maintien de la paix : résolutions → sanctions (embargo) → intervention armée (**casques bleus**).
- **Le Secrétariat général** : organe **administratif**, dirigé par un secrétaire général élu pour 5 ans renouvelables (actuellement **António Guterres**, Portugal, depuis 2017 ; avant lui Ban Ki-Moon, Kofi Annan, Boutros Boutros-Ghali…).
- **Le Conseil économique et social** : organe de **coordination** des questions économiques et sociales, 54 États élus pour 3 ans.
- **La Cour internationale de justice** : organe **judiciaire**, 15 juges élus pour 9 ans, siège à **La Haye** (Pays-Bas). Règle les différends juridiques entre États.
- **Le Conseil de tutelle** : contrôle l'administration des territoires sous mandat des Nations Unies (ex. Timor-Oriental 2002, Kosovo 1999).

### 2. Les organismes spécialisés

- **Social, culturel, humanitaire** : UNESCO (Paris, 1946), FAO (Rome, 1945), OMS (Genève, 1948), OIT, HCR ;
- **Technique** : AIEA (Vienne, 1957), OACI, UPU ;
- **Économique** : FMI et Banque mondiale (Washington, 1944), GATT (1947) devenu CNUCED en 1964.

## III. Un bilan mitigé

### 1. Des succès dans plusieurs domaines

- **Paix et sécurité** : prévention des conflits (accords de désarmement, contrôle du nucléaire avec l'AIEA, supervision d'élections), règlement des conflits (résolutions, casques bleus : Corée 1950, Égypte 1956, Congo 1961, Koweït 1990, Côte d'Ivoire 2003…). **Prix Nobel de la paix en 1988**.
- **Droits de l'homme** : **Déclaration universelle des droits de l'homme (10 décembre 1948)**, soutien aux indépendances africaines, TPI (Rwanda) et CPI (jugements de Milosevic, Taylor, Bemba…), assistance électorale (Guinée 2010, Côte d'Ivoire 2010).
- **Économique, social et humanitaire** : lutte contre la pauvreté (FMI, BM, PNUD), éducation et santé (UNICEF, UNESCO, OMS), conférence de Rio (1992) sur le climat, secours humanitaires.

### 2. Les limites

- **Précarité de la paix** : non-respect des résolutions (Irak, Kosovo…), usage abusif du **droit de veto**, impuissance pendant la guerre froide, toute-puissance des USA, échecs des casques bleus (Somalie, conflit israélo-palestinien), persistance des conflits et du terrorisme ;
- **Droits de l'homme** : oppressions et déficits démocratiques persistants ;
- **Économique et social** : écart croissant Nord/Sud, pauvreté grandissante, secours insuffisants face aux catastrophes et pandémies (SIDA, COVID).

### 3. Les réformes souhaitables

Réformer le Conseil de sécurité (encadrer le droit de veto), démocratiser le fonctionnement (renforcer l'Assemblée générale), privilégier la prévention des conflits et lancer de grands projets de développement pour les pays pauvres.

## Conclusion

Créée pour préserver la paix et la sécurité mondiales au sortir de la Seconde Guerre mondiale, l'ONU connaît des succès certains, mais des problèmes demeurent : des voix s'élèvent pour demander des réformes structurelles profondes.

---

### 📌 L'essentiel à retenir

- **24 octobre 1945** : entrée en fonction officielle de l'ONU (Charte signée à **San Francisco** le 26 juin 1945) ;
- Objectif n°1 : **paix et sécurité internationales** ;
- 6 organes principaux ; 5 membres permanents du Conseil de sécurité avec **droit de veto** ;
- **10 décembre 1948** : Déclaration universelle des droits de l'homme ;
- Bilan **mitigé** : succès réels mais limites institutionnelles (veto) et persistance des conflits.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'histoire-geo' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 1;

-- ---- H2 — L'ère de la bipolarisation de 1947 à 1991 ----
update public.chapitres c set
  titre = 'H2 — L''ère de la bipolarisation de 1947 à 1991',
  description = 'Histoire · Thème 1 : Les relations internationales de 1945 à nos jours',
  resume = $md$*Thème 1 : Les relations internationales de 1945 à nos jours*

## Introduction

Unis contre l'Axe, les Alliés se divisent dès la fin de la guerre. En **1947**, la rupture entre l'URSS et les Occidentaux donne naissance à **deux blocs hostiles** : le monde devient **bipolaire**. Tensions et périodes d'accalmie se succèdent jusqu'en **1991**, année de l'implosion de l'URSS. Comment les rapports entre les deux blocs ont-ils évolué ?

## I. La formation de deux blocs antagonistes

### 1. La rupture de 1947

- **La question polonaise et allemande** : désaccords sur la ligne Oder-Neisse et sur le sort de l'Allemagne (les Soviétiques démantèlent les usines de leur zone, les Occidentaux arrêtent la dénazification) ;
- **Les démocraties populaires** : dans les pays libérés par l'Armée rouge (Bulgarie, Tchécoslovaquie, Roumanie, Pologne, Hongrie, Allemagne de l'Est), les communistes accaparent le pouvoir entre 1947 et 1949. Churchill dénonce à **Fulton** le « **rideau de fer** » ;
- **La politique du "containment"** : la **doctrine Truman** (12 mars 1947) veut endiguer l'expansion du communisme ; le **plan Marshall** (5 juin 1947) offre une aide économique à l'Europe — 16 pays l'acceptent, Staline le refuse et l'impose à ses satellites. L'**OECE** (16 avril 1948) répartit cette aide ;
- **La doctrine Jdanov** (septembre 1947) : réplique soviétique — le monde est divisé en deux camps, tous les partis communistes doivent se mobiliser derrière l'URSS. Création du **Kominform** (5 octobre 1947).

La **bipolarisation** est la division du monde en deux blocs opposés idéologiquement, politiquement, économiquement et militairement : bloc **capitaliste** (Ouest) contre bloc **socialiste** (Est).

### 2. La structuration des deux blocs

| | Bloc occidental (USA) | Bloc oriental (URSS) |
|---|---|---|
| Militaire | **OTAN** (4 avril 1949) + OTASE, CENTO, ANZUS | **Pacte de Varsovie** (14 mai 1955) |
| Économique | **OCDE** (1961, remplace l'OECE) | **CAEM / COMECON** (25 janvier 1949) |

Les deux blocs refusent le conflit armé direct (risque atomique) : leur affrontement est appelé **guerre froide** — une lutte dans tous les domaines (idéologique, politique, économique, militaire, scientifique, culturel) sans guerre directe entre les deux Grands.

## II. Des manifestations de la guerre froide à la coexistence pacifique

### 1. Les grandes crises

- **Première crise de Berlin (juin 1948 - mai 1949)** : en réaction à la conférence de Londres (fusion des zones occidentales, Deutschemark), Staline impose le **blocus de Berlin-Ouest**. Les Américains ripostent par un gigantesque **pont aérien** (275 000 vols, 318 jours). Staline lève le blocus le 12 mai 1949. Conséquence : division de l'Allemagne — **RFA** (23 mai 1949, chancelier Adenauer) et **RDA** (7 octobre 1949) ;
- **Deuxième crise de Berlin (1958-1961)** : face à l'exode massif des Allemands de l'Est vers l'Ouest (plus de 2 millions de réfugiés), Khrouchtchev exige un changement de statut de Berlin-Ouest. Après l'échec des négociations, le **mur de Berlin** est construit dans la nuit du **12 au 13 août 1961** (« mur de la honte ») ;
- **La crise des fusées de Cuba (1962)** — paroxysme de la guerre froide : après la révolution de **Fidel Castro** (1959), l'embargo américain et le fiasco de la **baie des Cochons** (avril 1961), Castro se rallie à l'URSS qui installe des **missiles nucléaires** sur l'île. Le 22 octobre 1962, **Kennedy** impose un blocus naval. **Khrouchtchev** recule : retrait des missiles contre l'engagement américain de ne pas envahir Cuba et de retirer ses fusées de Turquie. Conséquences : baisse du prestige soviétique, installation du **« téléphone rouge »** (23 juin 1963), prise de conscience de la nécessité du dialogue.

### 2. La coexistence pacifique

Notion élaborée au **XXe congrès du PCUS (février 1956)** : chaque camp accepte l'existence de l'autre. **Facteurs** : nouveaux dirigeants (Khrouchtchev, Kennedy), traumatisme de la crise de Cuba, **équilibre de la terreur** (course aux armements — Spoutnik 1957), fissures dans les blocs (la France de De Gaulle quitte le commandement de l'OTAN, schisme sino-soviétique, révolte de Budapest 1956, **printemps de Prague** 1968), intérêts économiques réciproques.

**Manifestations — les accords de désarmement :**

- **Traité de Moscou** (août 1963) : interdiction des essais nucléaires dans l'atmosphère ;
- **Traité de non-prolifération nucléaire** (juillet 1968, 115 États) ;
- **SALT 1** (1972, Nixon-Brejnev) et **SALT 2** (1979, Carter-Brejnev — non ratifié après l'invasion de l'Afghanistan) ;
- **Traité de Washington** (8 décembre 1987, Reagan-Gorbatchev) : destruction des missiles de courte et moyenne portée (euromissiles) ;
- **START** (31 juillet 1991, Bush-Gorbatchev) : réduction d'un tiers des missiles stratégiques.

**La détente en Asie** : « diplomatie triangulaire » de Nixon, admission de la Chine populaire à l'ONU (1971), voyage de Nixon à Pékin (février 1972).

### 3. La détente contrariée : la deuxième guerre du Vietnam

Après les **accords de Genève** (21 juillet 1954 : indépendance, coupure provisoire au 17e parallèle), le Sud de Ngô Dinh Diem, soutenu par les USA, refuse les élections de réunification. Le **FNL (Viêt-Cong)**, créé en 1960 et soutenu par le Nord communiste, engage la guérilla. Après l'incident du **golfe du Tonkin** (août 1964), les USA s'engagent massivement (545 000 hommes en 1969). L'**offensive du Têt** (janvier 1968) choque l'opinion américaine. Nixon « vietnamise » la guerre, et les **accords de Paris (23 janvier 1973)** permettent le retrait américain. **Saïgon tombe le 30 avril 1975** : le Vietnam est réunifié sous régime communiste. Bilan : hécatombe humaine, pays ruiné, grave crise morale américaine.

## III. La désagrégation de l'URSS et la naissance d'un monde unipolaire

### 1. L'échec de l'expérience Gorbatchev

Arrivé au pouvoir en 1985, **Gorbatchev** lance deux réformes pour sauver le communisme :

- la **perestroïka** (restructuration économique) : autonomie des entreprises, ouverture au commerce extérieur ;
- la **glasnost** (transparence) : suppression de la censure, démocratisation de la vie politique.

Il abandonne la doctrine Brejnev de « souveraineté limitée » : l'Armée rouge n'intervient plus. Les démocraties populaires s'émancipent une à une, le **mur de Berlin tombe le 9 novembre 1989** et l'Allemagne est **réunifiée en octobre 1990** : le rideau de fer s'effondre.

### 2. La fin de l'URSS (1991)

Échec économique, pénuries, réveil des **nationalismes** (pays baltes, Caucase). Après l'échec du **putsch conservateur d'août 1991**, **Boris Eltsine** interdit le PCUS ; les républiques proclament leur indépendance et fondent la **CEI** (21 décembre 1991). Gorbatchev démissionne le **25 décembre 1991** : l'URSS disparaît.

### 3. Un monde unipolaire

Les États-Unis deviennent une « **hyperpuissance** », « gendarmes du monde » : guerres du Golfe (1991, 2003), interventions en Somalie (1992), en Afghanistan (2001)…

## Conclusion

Commencée en 1947, la guerre froide s'achève en 1991 avec l'effondrement du bloc de l'Est. La désagrégation de l'URSS marque la fin du monde bipolaire et consacre un monde unipolaire dominé par les États-Unis — une domination toutefois de plus en plus contestée.

---

### 📌 L'essentiel à retenir

- **1947** : rupture Est/Ouest — doctrine **Truman** + plan **Marshall** (Ouest) contre doctrine **Jdanov** + Kominform (Est) ;
- **OTAN (1949)** ↔ **Pacte de Varsovie (1955)** ; OCDE ↔ COMECON ;
- Crises majeures : **Berlin 1948-49** (blocus/pont aérien), **mur de Berlin 1961**, **Cuba 1962** (paroxysme) ;
- **Coexistence pacifique** dès 1956, ponctuée d'accords de désarmement (Moscou 1963, TNP 1968, SALT, Washington 1987, START 1991) ;
- **9 novembre 1989** : chute du mur de Berlin ; **25 décembre 1991** : disparition de l'URSS → monde **unipolaire**.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'histoire-geo' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 2;

-- ---- H3 — De la fin de la guerre froide vers un monde multipolaire ----
update public.chapitres c set
  titre = 'H3 — De la fin de la guerre froide vers un monde multipolaire',
  description = 'Histoire · Thème 1 : Les relations internationales de 1945 à nos jours',
  resume = $md$*Thème 1 : Les relations internationales de 1945 à nos jours*

## Introduction

La dissolution de l'URSS et la dislocation du bloc de l'Est mettent fin à la guerre froide et à la bipolarisation. Mais l'espoir d'un « nouvel ordre international » s'évanouit vite face à la volonté hégémonique des **États-Unis**. Cette suprématie sera contrariée une décennie plus tard par l'émergence de **nouveaux pôles d'influence** et la montée du **terrorisme**.

## I. Un monde unipolaire après la guerre froide (1991-2001)

### 1. L'hyperpuissance américaine

La disparition de l'URSS en 1991 consacre les États-Unis comme **seule superpuissance** — on parle d'**hyperpuissance** et de **Soft Power** américain. Elle s'exprime dans tous les domaines :

- **Militaire** : première puissance nucléaire, armée la mieux équipée, budget colossal du Pentagone (740 milliards $ en 2021), bases sur tout le globe, commandement de l'OTAN ;
- **Économique** : première puissance économique, suprématie du **dollar**, puissance boursière (**Wall Street**), siège du FMI et de la Banque mondiale, domination des multinationales du numérique ;
- **Technologique** : leader en informatique, aérospatiale, biochimie, robotique ; cyber-surveillance mondiale (NSA) ;
- **Culturelle** : Hollywood et l'« *american way of life* » (musique, cinéma, mode, fast-food) ;
- **Politique** : membre permanent du Conseil de sécurité, suprématie diplomatique.

### 2. Les États-Unis, « gendarme du monde »

À partir de 1991, les USA multiplient les interventions (*nation-building*), tantôt unilatérales, tantôt avec l'ONU ou l'OTAN :

- **1991** : guerre du Golfe (opération *Tempête du désert*, libération du Koweït occupé par l'Irak) ;
- **1993-1994** : opération *Restore Hope* en Somalie ;
- **1994** : opération *Uphold Democracy* en Haïti (réinstallation du président Aristide) ;
- **1995** : intervention en Bosnie-Herzégovine → accords de Dayton (21 novembre 1995) ;
- **1999** : intervention contre la Serbie dans la guerre du Kosovo.

Ces interventions nourrissent un **antiaméricanisme** croissant, surtout dans les États arabes du Proche et Moyen-Orient.

## II. Vers un monde multipolaire (depuis 2001)

### 1. L'affaiblissement du leadership américain après le 11 septembre 2001

Le **11 septembre 2001**, les attentats d'**Al-Qaïda** (Oussama Ben Laden) frappent le **World Trade Center** (plus de 3 000 morts) et le Pentagone. En représailles, les USA lancent la « guerre contre le terrorisme » : intervention en **Afghanistan (2001)** contre les Talibans, puis **guerre préventive en Irak (2003)** contre Saddam Hussein, accusé (à tort) de fabriquer des armes de destruction massive — les « États voyous » de l'« **axe du mal** » (Iran, Irak, Syrie, Corée du Nord).

L'enlisement de ces guerres, les mensonges sur l'Irak, les crises financières et le rejet de l'unilatéralisme américain révèlent la **fragilité des États-Unis** et remettent en cause leur suprématie.

### 2. Les nouveaux pôles d'influence

- **L'Union européenne** : née du **traité de Maastricht (1992)**, 27 États (départ du Royaume-Uni en 2020). Premier espace économique mondial, influente (économie, environnement, droits de l'homme), mais sa défense reste dépendante de l'OTAN ;
- **Les BRICS** (Brésil, Russie, Inde, Chine, Afrique du Sud) :
  - **Russie** : héritière de l'URSS, 2e exportateur mondial d'armement, 1er exportateur d'énergie (~30 % des réserves de gaz), interventionniste (Géorgie 2008, Ukraine 2014), coopère avec la Chine au sein de l'**OCS** (Organisation de coopération de Shanghai) ;
  - **Chine** : 2e puissance économique mondiale, expansion par le Soft Power (marché africain, contrôle des mers proches), moteur de l'ASEAN+3 ;
  - **Inde** : puissance démographique, économique, technologique et spatiale émergente ;
  - **Brésil** : puissance diplomatique régionale (commandement de la MINUSTAH en Haïti 2004, prédominance dans le **MERCOSUR**, créé en 1991) ;
- **Les puissances émergentes du Moyen-Orient** : Israël, Iran, Turquie, Arabie Saoudite aspirent au leadership régional. Oppositions religieuses, intégrisme, enjeux territoriaux et pétroliers font du Moyen-Orient « la poudrière de la planète ».

## Conclusion

De 1991 à 2001, les États-Unis dominent seuls la scène internationale. À partir de 2001, les attentats du 11 septembre, la montée du terrorisme et l'émergence de nouveaux pôles d'influence remettent en cause cette hégémonie : le monde devient progressivement **multipolaire**.

---

### 📌 L'essentiel à retenir

- **1991-2001** : monde **unipolaire**, les USA « hyperpuissance » et « gendarme du monde » (Golfe 1991, Somalie, Haïti, Bosnie, Kosovo) ;
- **11 septembre 2001** : attentats d'Al-Qaïda → guerre contre le terrorisme (Afghanistan 2001, Irak 2003) ;
- L'hégémonie américaine s'affaiblit → montée de l'**UE** (Maastricht 1992), des **BRICS** et des puissances du Moyen-Orient ;
- Depuis 2001, le monde est devenu **multipolaire** : plusieurs centres de domination, et non plus un seul.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'histoire-geo' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 3;

-- ---- H4 — La montée des nationalismes en Afrique ----
update public.chapitres c set
  titre = 'H4 — La montée des nationalismes en Afrique',
  description = 'Histoire · Thème 2 : De la décolonisation aux efforts d''organisation de l''Afrique',
  resume = $md$*Thème 2 : De la décolonisation aux efforts d'organisation de l'Afrique*

## Introduction

À la fin de la Seconde Guerre mondiale, les puissances impérialistes d'Europe sont ébranlées et affaiblies. Dans leurs empires coloniaux naissent des **mouvements nationalistes** : la manifestation de la prise de conscience des peuples colonisés contre la domination des puissances impérialistes. Cet élan de liberté s'accentue particulièrement en **Afrique**.

## I. Les facteurs de la montée des nationalismes

### 1. Les facteurs externes (exogènes)

- **L'attitude anticoloniale des États-Unis et de l'URSS** : les USA, anciennes colonies britanniques, sont hostiles à la colonisation (qui entrave aussi leur expansion économique) ; l'URSS s'y oppose au nom du **marxisme** (égalité des peuples, refus de l'asservissement) ;
- **L'affaiblissement des puissances coloniales** par la Seconde Guerre mondiale : l'Europe est en ruine, les colonisés saisissent l'occasion ;
- **La charte de l'ONU** : son article 1er proclame l'**égalité des droits des peuples et leur droit à disposer d'eux-mêmes** — l'ONU devient une tribune mondiale pour la souveraineté nationale ;
- **Le mouvement des non-alignés** : depuis la **conférence de Bandung (avril 1955)**, les pays déjà indépendants condamnent la politique coloniale et soutiennent les peuples colonisés.

### 2. Les facteurs internes (endogènes)

- **L'émergence des élites africaines** : instruites à l'école occidentale, elles s'approprient les idées de justice, liberté, égalité — le système colonial « porte en lui les germes de sa propre destruction » ;
- **Les bouleversements socio-économiques** : les cultures d'exportation (café, cacao) créent une **bourgeoisie agricole** ; croissance démographique, urbanisation et chômage radicalisent les sentiments nationalistes ;
- **Les contraintes du système colonial** : travaux forcés, corvées, portage, code de l'indigénat, impôts, recrutements militaires, discriminations, expropriations — autant de frustrations qui unissent les populations ;
- **L'impact des deux guerres mondiales** : promesses de liberté non tenues contre la participation africaine à l'effort de guerre ; les **anciens combattants** reviennent avec le mythe de l'invincibilité du Blanc **démystifié**.

## II. Caractères et manifestations des mouvements nationalistes

### 1. Les mouvements politiques et syndicaux

- **Partis politiques** : le **CPP** de Kwame Nkrumah (Ghana), le **PDCI-RDA** de Félix Houphouët-Boigny (Côte d'Ivoire), le **FLN** (Algérie). Actions : meetings, marches, désobéissance civile, alliances avec les partis métropolitains (RDA-PCF), élections, négociations de réformes ;
- **Syndicats** : le **Syndicat Agricole Africain (SAA)** fondé par Houphouët-Boigny en **1944**, l'**UGTAN** de Sékou Touré, la Fédération des Cheminots Africains. Actions : grèves, boycotts, soutien aux leaders.

### 2. Les mouvements religieux

Les mouvements **messianiques** noirs : le **harrisme** de William Wade Harris (originaire du Liberia), le **kimbanguisme** de Simon Kimbangu (Congo belge). Ils annoncent la fin des aliénations et la délivrance de l'homme noir.

### 3. Les mouvements culturels

Les écrivains de la **Négritude** — **Léopold Sédar Senghor, Aimé Césaire, Léon-Gontran Damas** — revendiquent l'identité noire. La presse africaine (*Présence Africaine*), les mouvements étudiants (**FEANF**, Union des Étudiants de l'Afrique de l'Ouest) sont des catalyseurs de l'éveil nationaliste.

## III. Les conséquences des mouvements nationalistes

### 1. Les acquis sociaux

- Loi du **20 février 1946** : abolition du **code de l'indigénat** ;
- **Loi Houphouët-Boigny (11 avril 1946)** : suppression des **travaux forcés** dans les colonies françaises ;
- Lois d'avril 1946 : liberté de réunion et liberté d'association.

Ces réformes améliorent les conditions de vie et renforcent l'aspiration à la souveraineté.

### 2. Les acquis politiques

- Constitution française du **13 octobre 1946** : création de l'**Union française** (fin de l'expression « empire colonial ») ;
- **Loi-cadre du 23 juin 1956** (loi Defferre) : généralisation du suffrage, autonomie interne aux colonies ;
- **28 septembre 1958** : la **Communauté franco-africaine** remplace l'Union française (adoptée par référendum, sauf la Guinée qui vote « non »).

Le plus grand acquis : l'accession progressive des colonies à l'**indépendance** (1960, « année des indépendances » : 17 pays africains deviennent souverains).

## Conclusion

Les mouvements nationalistes africains ont bénéficié de facteurs endogènes et exogènes favorables. Exprimés sur les plans politique, syndical, religieux et culturel, ils ont accéléré la quête de la souveraineté nationale sur le continent.

---

### 📌 L'essentiel à retenir

- **Facteurs exogènes** : anticolonialisme USA/URSS, affaiblissement de l'Europe, charte de l'ONU, **Bandung 1955** ;
- **Facteurs endogènes** : élites instruites, bourgeoisie locale, frustrations coloniales, anciens combattants ;
- 3 types de mouvements : **politiques/syndicaux** (PDCI-RDA, CPP, SAA 1944), **religieux** (harrisme, kimbanguisme), **culturels** (Négritude, FEANF) ;
- Acquis clés : abolition de l'indigénat et des travaux forcés (**1946**), **loi-cadre 1956**, Communauté (**1958**), indépendances (**1960**).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'histoire-geo' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 4;

-- ---- H5 — L'accession de la Côte d'Ivoire à l'indépendance ----
update public.chapitres c set
  titre = 'H5 — L''accession de la Côte d''Ivoire à l''indépendance',
  description = 'Histoire · Thème 2 : De la décolonisation aux efforts d''organisation de l''Afrique',
  resume = $md$*Thème 2 : De la décolonisation aux efforts d'organisation de l'Afrique*

## Introduction

Après la Seconde Guerre mondiale, la décolonisation devient irréversible en Afrique. L'émancipation de la Côte d'Ivoire s'inscrit dans le cadre général de celle de l'Afrique noire française, marquée sur le plan interne par la personnalité de **Félix Houphouët-Boigny**. Le processus se déroule en trois phases : **l'espoir (1944-1947), la lutte (1947-1950) et la collaboration (1950-1960)**.

## I. La phase de l'espoir (1944-1947)

### 1. Les réformes de la conférence de Brazzaville (30 janvier - 8 février 1944)

Convoquée par le **général de Gaulle** pour préserver les colonies françaises, elle réunit 21 gouverneurs, 9 députés et 6 observateurs — **aucune élite africaine n'est invitée**. Ses recommandations :

- suppression progressive du **travail forcé** et du **code de l'indigénat** ;
- possibilité de créer des assemblées élues, syndicats et partis ;
- plus large représentation des Indigènes dans les assemblées françaises ;
- accès des Indigènes à tous les emplois.

**Impact en Côte d'Ivoire** (sous le gouverneur **André Latrille**, favorable aux Africains) :

- création du **Syndicat Agricole Africain (SAA)** le **8 août 1944** ;
- élection de **Félix Houphouët-Boigny député** à l'Assemblée constituante française (21 octobre 1945) ;
- création du **PDCI le 9 avril 1946**.

### 2. L'Union française et l'évolution politique

La constitution d'**octobre 1946** (IVe République) crée l'**Union française** (27 octobre 1946) : métropole + DOM + TOM + territoires et États associés. L'expression « Empire colonial » disparaît. Avancées obtenues :

- **suppression du travail forcé le 11 avril 1946** (loi Houphouët-Boigny) ;
- suppression du code de l'indigénat et citoyenneté française (**loi Lamine Gueye**, 7 mai 1946).

Déçus par le caractère assimilationniste de la constitution, les leaders africains créent à Bamako, le **18 octobre 1946**, le **Rassemblement Démocratique Africain (RDA)**, présidé par **Houphouët-Boigny** (siège à Abidjan). Le PDCI devient sa section ivoirienne.

## II. La phase de la lutte (1947-1950)

### 1. L'apparentement

Le RDA s'apparente au **Parti Communiste Français (PCF)**, qui le soutient (financement, formation, vote des lois). En pleine guerre froide, cette alliance fait du RDA un « danger » aux yeux de la France.

### 2. La lutte du PDCI et la répression de Péchoux

Le PDCI résiste : journaux, meetings, marches, **boycotts** (travail chez les colons, magasins coloniaux). L'administration remplace Latrille par **Laurent Péchoux**, chargé de réprimer le militantisme du PDCI-RDA, et suscite des partis rivaux (BDE d'Étienne Djaument, 1948).

Répression : incidents de **Treichville (6 février 1949)** — 30 arrestations dont 8 membres du comité directeur —, **marche des femmes sur la prison de Grand-Bassam**, incidents de Bouaflé, Séguéla et **Dimbokro (janvier 1950)**. Bilan : **52 morts, environ 3 000 blessés**. Le PDCI, interdit de réunion, entre dans la clandestinité et change de stratégie.

## III. La phase de la collaboration à l'indépendance (1950-1960)

### 1. Le désapparentement

Sous l'influence de **François Mitterrand** (ministre de la France d'Outre-mer), Houphouët-Boigny rompt avec le PCF et s'allie à l'**UDSR** — annoncé au **discours du 7 octobre 1950 au stade Géo André**. La lutte devient parlementaire : aux élections de 1956, le RDA obtient la majorité des sièges africains et **Houphouët-Boigny devient ministre d'État** dans le gouvernement de Guy Mollet.

### 2. La loi-cadre (23 juin 1956)

Rédigée par **Gaston Defferre**, elle associe les Africains à la gestion de leurs affaires :

- suffrage universel et **collège unique** ;
- pouvoirs élargis des assemblées territoriales ;
- création d'un **Conseil de gouvernement** (vice-président : le chef du parti majoritaire).

Elle dote les colonies d'une **autonomie politique et administrative**.

### 3. La Communauté franco-africaine et l'indépendance

De retour au pouvoir en 1958, **de Gaulle** propose la **Communauté franco-africaine** : républiques autonomes gérant leurs affaires, sauf les domaines stratégiques (justice, défense, monnaie, diplomatie…). Au **référendum de septembre 1958**, toutes les colonies acceptent **sauf la Guinée de Sékou Touré**, indépendante dès le **28 septembre 1958** (avec rupture de l'aide française).

La Communauté divise les leaders : **fédéralistes** (Senghor) contre **territorialistes** (Houphouët-Boigny). Elle se désagrège dès janvier 1959 (Fédération du Mali). Entre janvier et août 1960, c'est la vague des indépendances : la **Côte d'Ivoire devient indépendante le 7 août 1960**, avec **Félix Houphouët-Boigny comme premier président**.

## Conclusion

Le processus d'indépendance de la Côte d'Ivoire s'est fait en trois phases (espoir, lutte, collaboration). Bien qu'ayant fait des morts, il s'est déroulé dans l'ensemble de manière **pacifique**, à travers des réformes successives, sous la houlette d'Houphouët-Boigny et du PDCI-RDA. Après l'indépendance, la Côte d'Ivoire a maintenu des relations d'amitié et de coopération avec la France.

---

### 📌 L'essentiel à retenir

- **3 phases** : espoir (1944-47) → lutte (1947-50) → collaboration (1950-60) ;
- **1944** : conférence de Brazzaville + création du **SAA** (8 août) ;
- **1946** : suppression du travail forcé (11 avril), création du **PDCI** (9 avril) et du **RDA** à Bamako (18 octobre) ;
- **1949-1950** : répression de Péchoux (Treichville, Grand-Bassam, Dimbokro — 52 morts) ;
- **7 octobre 1950** : désapparentement du PCF ; **loi-cadre 1956** = autonomie ;
- **7 août 1960** : indépendance de la Côte d'Ivoire, Houphouët-Boigny premier président.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'histoire-geo' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 5;

-- ---- H6 — L'accession de l'Algérie à l'indépendance ----
update public.chapitres c set
  titre = 'H6 — L''accession de l''Algérie à l''indépendance',
  description = 'Histoire · Thème 2 : De la décolonisation aux efforts d''organisation de l''Afrique',
  resume = $md$*Thème 2 : De la décolonisation aux efforts d'organisation de l'Afrique*

## Introduction

La décolonisation de l'Algérie est l'exemple typique de la **lutte d'indépendance armée**. Ce pays, enjeu stratégique pour la France, va acquérir sa souveraineté après huit ans de guerre. Quels sont les facteurs et les étapes de cette marche vers l'indépendance ?

## I. L'Algérie française de 1830 à 1954

### 1. Le statut politique et administratif

Occupée par la France depuis **1830**, l'Algérie est une **colonie de peuplement**, puis devient **partie intégrante de la France** le 9 décembre 1848 : 3 départements (**Alger, Oran, Constantine**) sous l'autorité d'un gouverneur général relevant du ministère de l'Intérieur français.

### 2. L'inégalité économique et sociale

Société très inégalitaire :

- ~**1 million de Français d'Algérie** (« pieds-noirs », 80 % nés sur place) : fonctions administratives, agriculture moderne sur les meilleures terres ;
- ~**8 millions de musulmans autochtones** : sous tutelle, sans partage de l'autorité, agriculture rudimentaire, sous-emploi et misère. Malgré leur participation à la guerre de 1914-1918, aucune amélioration — la minorité française refuse toute égalité.

Ces disparités éveillent la **conscience nationale** (commerçants, intellectuels, ouvriers, anciens combattants).

### 3. La naissance et l'affirmation du nationalisme algérien

**Trois tendances :**

- **Traditionnelle** : les **Oulémas** d'**Abdelhamid Ben Badis** (Association des Oulémas, 1931) — « L'Islam est ma religion, l'arabe est ma langue, l'Algérie est ma patrie » ;
- **Révolutionnaire et populiste** : **Messali Hadj** — l'Étoile Nord-Africaine (1927), devenue **Parti du Peuple Algérien (PPA)** en 1939 ;
- **Modérée / réformiste** : **Ferhat Abbas** (Fédération des Élus Indigènes, 1927) — revendique d'abord l'assimilation et l'égalité.

**La radicalisation** : les émeutes de **Sétif (8 mai 1945)**, réprimées dans le sang (environ 100 Français tués, 8 000 à 15 000 Algériens massacrés). En 1946, Ferhat Abbas fonde l'**UDMA**, Messali Hadj le **MTLD**. Le **statut de 1947** (20 septembre : assemblée territoriale à deux collèges) n'est jamais appliqué. En **mars 1954**, des dissidents du MTLD créent le **CRUA** (Belkacem Krim, Ben Boulaïd, Larbi Ben M'Hidi) : objectif commun — l'indépendance par la **lutte armée**.

## II. De l'insurrection à l'indépendance

### 1. L'insurrection algérienne (1954)

Le CRUA devient le **Front de Libération Nationale (FLN)**, avec sa branche militaire l'**ALN**. L'insurrection éclate dans la nuit du **31 octobre au 1er novembre 1954** : la « **Toussaint rouge** » (série d'attentats contre installations militaires et bâtiments publics). La France, qui vient de perdre l'Indochine, réagit violemment et envoie des renforts massifs.

En 1956, le FLN intensifie le **terrorisme urbain** ; la France riposte par le quadrillage, les regroupements de populations et la **torture**. Paris refuse l'internationalisation du conflit (« l'Algérie, c'est la France »), mais l'ONU et les non-alignés exigent la décolonisation. Le **13 mai 1958**, des émeutes éclatent à Alger ; l'armée crée un Comité de salut public et le général Salan appelle **de Gaulle** au pouvoir.

### 2. La politique algérienne de de Gaulle

Au pouvoir le **1er juin 1958**, de Gaulle lance à Alger le 4 juin son célèbre « **Algériens, je vous ai compris !** ». Réaliste, il renonce à l'Algérie française et propose trois solutions : indépendance totale, assimilation, ou autonomie associée à la France.

- Le FLN, qui a formé le **GPRA** (Gouvernement Provisoire de la République Algérienne, octobre 1958), exige l'indépendance totale ;
- Les Français d'Algérie, craignant « **la valise ou le cercueil** », s'y opposent : **semaine des barricades** (24-31 janvier 1960), création de l'**OAS** (Organisation de l'Armée Secrète) qui multiplie les attentats et tente un putsch contre de Gaulle (22 avril 1961).

### 3. Les accords d'Évian et l'indépendance

Négociés entre le gouvernement français (Louis Joxe…) et le FLN (Belkacem Krim…), les **accords d'Évian (18 mars 1962)** prévoient :

- la reconnaissance de l'**indépendance** de l'Algérie et de l'intégrité de son territoire (Sahara compris) ;
- l'évacuation progressive des troupes françaises et le maintien de l'aide pendant 3 ans ;
- des garanties à la France sur le pétrole.

Le **8 avril 1962**, un référendum français approuve les accords. Le **1er juillet 1962**, le référendum d'autodétermination donne **90 % de « oui »** : l'**indépendance est proclamée le 3 juillet 1962**, avec **Ahmed Ben Bella** comme premier président.

## Conclusion

Colonie stratégique de la France depuis 1830, l'Algérie a acquis son indépendance dans la violence et la douleur en 1962, au prix d'environ **un million de morts** en huit années de guerre. Ce sont les nationalistes algériens qui ont **conquis** (et non reçu) l'indépendance de leur pays.

---

### 📌 L'essentiel à retenir

- Algérie = **colonie de peuplement** intégrée à la France (3 départements) depuis 1848 ;
- 3 courants nationalistes : **Ben Badis** (Oulémas), **Messali Hadj** (PPA/MTLD), **Ferhat Abbas** (UDMA) ;
- **8 mai 1945** : massacres de Sétif → radicalisation ; **1er novembre 1954** : Toussaint rouge, début de la guerre (FLN/ALN) ;
- **1958** : retour de de Gaulle (« Je vous ai compris ») ; opposition de l'**OAS** ;
- **18 mars 1962** : accords d'**Évian** → indépendance proclamée le **3 juillet 1962** (président **Ben Bella**) ;
- Contrairement à la Côte d'Ivoire (voie pacifique), l'Algérie illustre l'**indépendance arrachée par les armes**.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'histoire-geo' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 6;

-- ---- H7 — L'Union Africaine (UA) ----
update public.chapitres c set
  titre = 'H7 — L''Union Africaine (UA)',
  description = 'Histoire · Thème 2 : De la décolonisation aux efforts d''organisation de l''Afrique',
  resume = $md$*Thème 2 : De la décolonisation aux efforts d'organisation de l'Afrique*

## Introduction

Au lendemain des indépendances, une Afrique morcelée, fragile et pauvre apparaît sur la scène internationale. Les États africains créent l'**OUA** (Organisation de l'Unité Africaine) le **25 mai 1963 à Addis-Abeba** (Éthiopie), transformée en **Union Africaine (UA)** en **2002** pour répondre à un besoin d'efficacité.

## I. Naissance, objectifs et principes

### 1. La création de l'UA

**Les échecs de l'OUA** qui expliquent son remplacement : structures inadaptées, marginalisation économique et politique de l'Afrique à l'ère de la mondialisation, insécurité et instabilité du continent.

**Les 4 sommets fondateurs de l'UA :**

| Date | Sommet | Décision |
|---|---|---|
| Septembre 1999 | **Syrte** (Libye) | Décision de créer l'UA (initiative de Kadhafi) |
| Juillet 2000 | **Lomé** (Togo) | Adoption de l'**acte constitutif** |
| Juillet 2001 | **Lusaka** (Zambie) | Programme de mise en place |
| **9 juillet 2002** | **Durban** (Afrique du Sud) | Création officielle de l'UA |

L'UA compte **55 pays membres** (toute l'Afrique) et conserve le siège d'Addis-Abeba.

### 2. Objectifs et principes

**Objectifs** : réaliser l'unité et la solidarité africaines ; défendre la souveraineté et l'intégrité territoriale des membres ; promouvoir la paix, la sécurité et la stabilité ; promouvoir la démocratie, la bonne gouvernance et les droits de l'homme ; accélérer l'**intégration économique et politique** ; permettre à l'Afrique de peser dans l'économie mondiale ; promouvoir le développement durable et la recherche.

**Principes** : règlement pacifique des conflits ; égalité souveraine des États ; non-ingérence ; **condamnation des changements anticonstitutionnels de gouvernement** ; interdiction du recours à la force ; **droit d'intervention en cas de génocide, crise ou guerre** (nouveauté par rapport à l'OUA) ; respect des frontières héritées de la colonisation.

## II. Structures et fonctionnement

### 1. Les organes de direction

- **La Conférence de l'Union** : organe **suprême** — chefs d'État et de gouvernement, réunie au moins une fois par an ; définit les politiques, vote le budget ; présidence tournante d'un an ;
- **Le Conseil exécutif** : ministres des États membres ; contrôle la mise en œuvre des politiques ;
- **La Commission de l'Union** : secrétariat général, administration quotidienne (président actuel : le Tchadien **Moussa Faki Mahamat**) ;
- **Le Comité des représentants permanents** : ambassadeurs à Addis-Abeba, prépare les travaux du Conseil exécutif ;
- **Le Parlement panafricain (PAP)** : 5 représentants par pays, siège en **Afrique du Sud**.

### 2. Les autres organes

- **Le Conseil de paix et de sécurité (CPS)** : 15 membres — prévention, gestion et règlement des conflits ;
- **Les comités techniques spécialisés** (conseil-appui) ;
- **Les institutions financières** : Banque Centrale Africaine (BCA), Fonds Monétaire Africain (FMA), Banque Africaine d'Investissement (BAI) ;
- **L'ECOSOCC** : organe consultatif économique et culturel ;
- **L'organe judiciaire** : Commission Africaine des Droits de l'Homme et des Peuples (CADHP), Cour Africaine des Droits de l'Homme et des Peuples (CAfDHP), CUADI.

## III. Le bilan des actions de l'UA

### 1. Les succès

- **Politique et militaire** : interventions dans la crise ivoirienne, au **Darfour**, en **Somalie**, aux **Comores** (2008, rétablissement de la légalité constitutionnelle) ; condamnation des coups d'État (Mali 2012, Burkina Faso 2015) et des crimes de guerre ;
- **Économique et social** : budget en forte hausse (150 M$ en 2011 → 1,2 Md$ en 2017) ; aide humanitaire (Darfour, Éthiopie, Mozambique) ; appropriation du **NEPAD** ; projets de développement via la **BAD** (écoles, routes, infrastructures).

### 2. Les échecs et limites

- **Politique et militaire** : instabilité persistante (coups d'État en Égypte, Soudan, Zimbabwe…), crises post-électorales (Côte d'Ivoire, Burundi, Gambie…), impuissance face aux guerres civiles et au **terrorisme** (Sahel : Mali, Burkina, Niger, Nigeria, Tchad), manque d'autonomie pour financer les missions de paix, influences extérieures ;
- **Économique et social** : dépendance financière (**95 % du budget vient de l'extérieur** ; siège construit par la Chine), retards de cotisations (17 pays à jour seulement en 2012), faiblesse des échanges intra-africains (~**12 %**), surendettement, multiplicité des monnaies, retard de l'intégration monétaire, pauvreté, corruption et mauvaise gouvernance.

## Conclusion

Deux décennies après avoir remplacé l'OUA, l'UA a réalisé des succès encourageants qui démontrent sa raison d'exister. Mais les défis restent nombreux : il appartient aux dirigeants africains de créer un environnement de paix et de sécurité, préalable au développement du continent.

---

### 📌 L'essentiel à retenir

- **OUA** : 25 mai 1963, Addis-Abeba → remplacée par l'**UA** le **9 juillet 2002** à Durban (processus : Syrte 1999 → Lomé 2000 → Lusaka 2001 → Durban 2002) ;
- **55 membres**, siège à **Addis-Abeba** ;
- Organe suprême : la **Conférence de l'Union** ; administration : la **Commission** ; conflits : le **CPS** ;
- Nouveauté clé vs l'OUA : **droit d'intervention** en cas de génocide ou de crise grave ;
- Bilan **mitigé** : succès (médiations, NEPAD, budget en hausse) mais forte **dépendance financière extérieure** et impuissance face à l'insécurité.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'histoire-geo' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 7;

-- ---- H8 — Croyances et valeurs dominantes dans le monde occidental ----
update public.chapitres c set
  titre = 'H8 — Croyances et valeurs dominantes dans le monde occidental',
  description = 'Histoire · Thème 3 : Croyances et valeurs dans le monde d''aujourd''hui',
  resume = $md$*Thème 3 : Croyances et valeurs dans le monde d'aujourd'hui*

## Introduction

Le monde occidental est caractérisé par un haut niveau de vie et de développement industriel. C'est le monde dit **capitaliste**, longtemps opposé au monde socialiste, marqué par les **institutions démocratiques**. Géographiquement, il comprend l'**Amérique du Nord, l'Europe de l'Ouest, le Japon et l'Australie**. Quels sont les grands traits de civilisation de ce monde ?

## I. Les fondements historiques des croyances et valeurs occidentales

### 1. Un héritage lointain

- **Les apports de la Grèce antique** : la **démocratie**, née à Athènes à la fin du VIe siècle av. J.-C. sous l'impulsion de **Clisthène** — égalité de tous les citoyens devant les lois, liberté et droits politiques ;
- **La domination politique de la Rome antique** : le **droit civil romain** est la base du droit européen (justice, statut des personnes, régimes matrimoniaux, successions, propriété, famille) ; la notion d'**État souverain** en découle ;
- **L'influence judéo-chrétienne** : le peuple juif crée le **monothéisme** ; le christianisme, greffé sur la civilisation gréco-latine, demeure une force sociale puissante malgré ses divisions (protestants, orthodoxes…) ;
- **Les apports gréco-latins** : plusieurs langues modernes (français, italien, espagnol, portugais, roumain) dérivent du latin ; la pensée politique de **Platon et Aristote** fonde la philosophie politique européenne (les mots monarchie, aristocratie, tyrannie, démocratie sont grecs ou latins).

### 2. L'héritage des temps modernes et contemporains

- **Les régimes parlementaires** : les révolutions anglaises du XVIIe siècle limitent le pouvoir du monarque — avec la Déclaration des droits (1690) et **John Locke**, la souveraineté réside dans le **peuple**, non dans le roi ;
- **Les régimes démocratiques et les droits de l'homme** : la **révolution américaine de 1776** (liberté, droit des peuples à choisir leur gouvernement) et la **révolution française de 1789** avec la **Déclaration des Droits de l'Homme et du Citoyen** — laboratoire du libéralisme et de la démocratie, qui se répandent ensuite dans le monde.

**Limites de la démocratie libérale** : exclusion de certaines catégories (pauvres, immigrés), dérives de la liberté (grèves excessives, port d'armes aux USA), pouvoir monopolisé par les **lobbies**, montée des extrêmes droites et idéologies racistes.

## II. Les grands traits des institutions et de la vie politique, économique et culturelle

### 1. Le domaine politique

Le modèle politique occidental repose sur :

- **le principe de liberté** : primauté de l'individu, droits naturels (pensée, opinion, presse, association…), pouvoir légitimé par le **contrat social** (Rousseau), égalité des citoyens ;
- **le suffrage universel** : direct (France) ou indirect (États-Unis), scrutin secret ;
- **l'existence des partis politiques** : pluralisme issu de la liberté de pensée ;
- **les assemblées parlementaires** : votent le budget et les lois, contrôlent l'exécutif ;
- **la séparation des pouvoirs** (exécutif, législatif, judiciaire), garantie par la **Constitution** — la presse constituant le « **4e pouvoir** ».

### 2. Le domaine économique

Le système repose sur le **libéralisme économique** : liberté d'initiative des producteurs et consommateurs, **libre concurrence**, recherche du profit maximum, **loi de l'offre et de la demande** (loi du marché). L'entrepreneur capitaliste possède les moyens de production et verse un salaire déterminé par le marché. Ce capitalisme libéral a permis la production et la consommation de masse.

### 3. Le domaine socio-culturel et religieux

- **Une vie sociale en mutation** : urbanisation, consommation de masse, éducation, loisirs et sport devenus prioritaires ; mais aussi transformation des rapports entre générations, montée de la délinquance et de la violence ;
- **Le développement de l'art** : renouveau des lettres, de la musique et surtout du **cinéma** ; valeurs de paix, de fraternité et de refus du racisme portées par les nouvelles générations ;
- **Une société axée sur la chrétienté** : le **christianisme** est la religion majoritaire ; ses croyances et valeurs se diffusent dans le monde entier via les **médias** (internet, télévision, cinéma, publicité) et tendent à devenir universelles.

## Conclusion

Le monde occidental est dominé par les valeurs de **liberté** et de **démocratie**, qui influencent sa vie politique, économique, sociale et culturelle. Toutefois, avec l'émergence d'autres sociétés, la civilisation occidentale influence de moins en moins le reste du monde.

---

### 📌 L'essentiel à retenir

- Monde occidental = **Amérique du Nord + Europe de l'Ouest + Japon + Australie** ;
- Héritages : **démocratie grecque** (Clisthène), **droit romain**, **christianisme**, philosophie de Platon/Aristote ;
- Étapes modernes : révolutions anglaises (XVIIe), **1776** (USA), **1789** (France, DDHC) ;
- Politique : liberté, suffrage universel, pluralisme, parlement, **séparation des pouvoirs** ;
- Économie : **libéralisme** (libre concurrence, profit, loi du marché) ;
- La démocratie libérale a aussi des **limites** (exclusions, lobbies, extrémismes).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'histoire-geo' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 8;

-- ---- H9 — Les mutations contemporaines de la civilisation négro-africaine ----
update public.chapitres c set
  titre = 'H9 — Les mutations contemporaines de la civilisation négro-africaine',
  description = 'Histoire · Thème 3 : Croyances et valeurs dans le monde d''aujourd''hui',
  resume = $md$*Thème 3 : Croyances et valeurs dans le monde d'aujourd'hui*

## Introduction

La **civilisation négro-africaine** est l'ensemble des caractères propres aux peuples d'Afrique noire (institutions politiques, techniques, économie, croyances…). De la préhistoire au Moyen Âge, l'Afrique a produit de brillantes civilisations. Mais les contacts avec le reste du monde, notamment aux XVIIIe et XIXe siècles, font subir de **profondes mutations** à ses structures et valeurs originelles.

## I. Les grands traits de la civilisation négro-africaine précoloniale

### 1. Des structures politiques variées

- **Les sociétés étatiques** (royaumes et empires) : pouvoir **centralisé** détenu par un souverain sacré (roi ou empereur) aux pouvoirs politiques, militaires et religieux — aristocratie souvent héréditaire. Exemples : royaumes **Mossi, Ashanti, Dahomey**, empires du **Ghana, du Mali**, de Samory ; sultanats et émirats islamiques (Kano). Le pouvoir absolu est tempéré par : l'**arbre à palabres** (conseils), les **griots**, les **chefs de terre**, la **Reine-Mère** et le conseil des notables chez les Akan ;
- **Les sociétés sans État** (chefferies) : chef assisté d'un conseil des notables, choisi selon l'ancienneté, la sagesse ou la moralité (ex. peuples **Krou** de Côte d'Ivoire). Organisation fondée sur les **lignages, clans et villages**, avec parfois une gestion collégiale par **classes d'âge** (peuples Akan lagunaires : Ébrié, Attié, Adjoukrou).

### 2. Une économie essentiellement de subsistance

- **Agriculture** de subsistance : terres collectives, culture sur brûlis et jachère, outils rudimentaires (houe, machette) → rendements faibles ;
- **Élevage** traditionnel dominant en savane (pasteurs peulhs, Masaï, Hottentots) ; cueillette, chasse (confréries de **dozos**) et pêche ;
- **Artisanat** important (poteries, sculptures, bijoux) alimentant le commerce et le rayonnement de royaumes (Oyo, Ifé, Abomey) ;
- **Commerce** peu développé : **troc** dominant, monnaies primitives (**cauris**, poudre d'or), grandes transactions dans les villes sahéliennes (**Tombouctou, Gao, Djenné**).

### 3. Une société bien structurée

- **Communautaire** : l'individu n'est jamais isolé ; l'éducation des enfants incombe à toute la communauté ; le mariage unit deux familles (scellé par la **dot**) ;
- **Hiérarchisée** : nobles / hommes libres / esclaves ; aîné supérieur au cadet, homme à la femme ; **gérontocratie** (pouvoir des anciens initiés) ; rites d'**initiation** (le **Poro** chez les Sénoufo) ; **castes** socio-professionnelles héréditaires (forgerons, griots, cordonniers) ;
- **Culturelle** : littérature **orale** (contes, légendes, proverbes), musique et danse (tam-tam, balafon), art **sacré** (masques et statues représentant des divinités) ;
- **Religieuse** : reconnaissance d'un **Dieu suprême** (Gnamien en baoulé, Lagô en bété, Kolotchôlô en sénoufo), avec les génies et les **ancêtres** comme intermédiaires — l'**animisme** est la religion par excellence, fondée sur la notion de force vitale.

## II. Une société négro-africaine en mutation

### 1. Les facteurs des mutations

La **colonisation** est la cause principale, à travers :

- **l'école** occidentale : promotion du savoir des jeunes, remise en cause de la sacralisation du savoir des anciens ;
- **l'économie monétaire** : cultures d'exportation, impôts ; l'argent déstabilise la hiérarchie sociale et crée des classes (riches/pauvres) ;
- **l'urbanisation et les nouvelles religions** : mobilité, brassages ethniques et culturels ; le **christianisme** introduit la monogamie, l'enseignement et les œuvres sanitaires ; l'**islam** progresse grâce à son message simple et sa compatibilité avec certaines habitudes africaines.

### 2. La nouvelle société africaine

- **Mutations politiques** : États modernes aux **frontières artificielles** (source de conflits), institutions calquées sur la métropole (présidence, gouvernement, assemblée), affaiblissement des chefs traditionnels, influence de la démocratie occidentale (multipartisme, élections) ;
- **Mutations économiques** : monétarisation (Franc CFA, Naira…), industrie au détriment de l'artisanat, cultures commerciales, **propriété privée** des terres, salariat, économie de marché ;
- **Mutations sociales** : disparition des castes au profit des classes socio-professionnelles, **mariage civil** en progression, succession légale, **émancipation de la femme** (scolarisation, travail), interdiction de la polygamie et de l'excision, famille **nucléaire**, affaiblissement des solidarités ;
- **Mutations culturelles** : modes vestimentaires occidentaux, nouveaux médias, expansion du christianisme et marginalisation des religions africaines, **syncrétisme religieux** (harrisme, kimbanguisme), recul du culte des ancêtres, langue du colonisateur, techniques nouvelles.

**Mais certaines valeurs traditionnelles résistent** : chefferies, animisme, solidarité africaine (funérailles, mariages, baptêmes), polygamie, modes de succession.

## Conclusion

Les transformations actuelles de la civilisation négro-africaine résultent de sa rencontre avec la civilisation occidentale. L'Afrique est en constante mutation, confrontée à la mondialisation et aux nouvelles technologies. Cependant, certaines valeurs traditionnelles **résistent** à ces changements.

---

### 📌 L'essentiel à retenir

- Avant la colonisation : sociétés **étatiques** (empires du Ghana, Mali…) ou **chefferies** ; économie de **subsistance** (troc, cauris) ; société **communautaire, hiérarchisée et gérontocratique** ; religion = **animisme** + culte des ancêtres ;
- Facteurs de mutation : **colonisation** → école, économie monétaire, urbanisation, christianisme et islam ;
- Mutations dans 4 domaines : politique (États modernes), économique (monnaie, salariat), social (famille nucléaire, émancipation de la femme), culturel (syncrétisme, médias) ;
- La civilisation négro-africaine n'est **pas devenue une copie de l'Occident** : des valeurs ancestrales résistent.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'histoire-geo' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 9;

-- ---- G1 — Les fondements du développement économique de la Côte d'Ivoire ----
update public.chapitres c set
  titre = 'G1 — Les fondements du développement économique de la Côte d''Ivoire',
  description = 'Géographie · Thème 1 : La Côte d''Ivoire, étude économique',
  resume = $md$*Thème 1 (Géographie) : La Côte d'Ivoire — étude économique*

## Introduction

Située entre 4°30 et 10°30 de latitude nord, la Côte d'Ivoire est un pays de l'Afrique occidentale humide de **322 462 km²** (1 % du continent), peuplé d'environ **26 millions d'habitants** (2020). Bien que classée parmi les pays pauvres, elle reste l'un des pays les plus prospères de la sous-région. Quelles sont les bases de son développement économique ?

## I. Les atouts naturels et humains

### 1. Une nature généreuse

- **Un relief peu accidenté** : plaines au sud, plateaux sur la majeure partie du territoire, montagnes à l'ouest. Cette platitude facilite l'installation des hommes, l'agriculture et les infrastructures (routes, chemin de fer) ;
- **Trois zones climatiques complémentaires** :

| Zone | Climat | Précipitations | Potentialités |
|---|---|---|---|
| Sud et ouest | **Subéquatorial (attiéen)** | 1500-2300 mm/an | Forêt dense (acajou, iroko, bété…), cultures d'exportation (cacao, café, hévéa, palmier, banane, ananas), cultures vivrières |
| Centre | **Tropical humide (baouléen)** | 1100-1500 mm/an | Forêts et savanes, café, hévéa, teck, vivriers, élevage |
| Nord | **Soudanais** | ≤ 1000 mm/an | Savane, coton, **anacarde**, canne à sucre, mangues, karité, céréales (maïs, riz, mil, sorgho), élevage, écotourisme |

- **Un réseau hydrographique dense** : 4 grands fleuves, fleuves côtiers, lagunes, 6 lacs de barrages hydroélectriques (**Kossou, Taabo** sur le Bandama ; **Buyo, Soubré** sur le Sassandra ; **Ayamé 1 et 2** sur la Bia) ; importantes réserves souterraines ; **520 km de côte** sur l'Atlantique avec **2 grands ports** (Abidjan, San-Pédro) → irrigation, pêche, hydroélectricité, échanges, tourisme balnéaire ;
- **Un sous-sol riche** : **or** (Ity, Bonikro, Tongon — 32,5 t en 2019), diamant (Séguéla, Tortiya), nickel, manganèse, **fer** (Man, San-Pédro), bauxite, cuivre ; **pétrole et gaz naturel** au large de Jacqueville, alimentant les centrales thermiques d'**Azito et Vridi** (75 % de la production électrique).

### 2. Une population jeune et dynamique

De 3,8 millions d'habitants en 1960 à **22,7 millions (RGPH 2014)** puis ~26 millions en 2020. Cette population nombreuse, enrichie par l'apport étranger, offre un **marché de consommation** important et une **main-d'œuvre abondante et bon marché**. Sa diversité ethnique est une richesse culturelle et touristique. Très jeune (**45 % de moins de 15 ans**), elle est un espoir pour l'avenir malgré les défis (scolarisation, emploi, logement) — les jeunes diplômés créent de plus en plus de PME/PMI.

## II. Les fondements historiques et politiques

### 1. Une politique économique en constante évolution

Depuis 1960, la Côte d'Ivoire a choisi le **libéralisme économique**, caractérisé par :

- **une forte intervention de l'État** : planification par lois-plans (plans décennaux 1960-70, 1970-80 ; plans quinquennaux) ; l'État est lui-même entrepreneur (SOTRA, SIR, PALMINDUSTRIE, SODEMI, CAISTAB…) → un **capitalisme d'État** ;
- **la libre entreprise** : exonérations fiscales, code des investissements souple, liberté de transfert des fonds, engagement de non-nationalisation ;
- **l'ouverture sur l'extérieur** : capitaux étrangers, main-d'œuvre qualifiée, accès aux marchés mondiaux.

Ce choix a permis de bâtir les infrastructures, développer l'agriculture et diversifier l'industrie entre 1960 et 1980 — le « miracle ivoirien » — avant la crise des années 1980.

### 2. Les réformes de la politique économique

- **Les Programmes d'Ajustement Structurel (PAS)** : conclus dès **1981** avec le **FMI et la Banque mondiale** pour relancer l'économie en crise ;
- **La privatisation et le désengagement de l'État** (à partir de **1990**) : participation accrue du privé, hausse des investissements, actionnariat ivoirien, financement des investissements publics. L'État devient **arbitre et régulateur** : il organise l'espace économique, garantit la libre concurrence, mobilise les capitaux (Trésor public, **CEPICI**) et se recentre sur les secteurs régaliens (routes, écoles, hôpitaux).

## Conclusion

Les ressources naturelles et humaines constituent un atout majeur du développement économique de la Côte d'Ivoire. Son choix d'une économie mixte au lendemain de l'indépendance, puis libérale depuis 1990, lui a permis de s'adapter au contexte national et international et de viser l'**émergence**.

---

### 📌 L'essentiel à retenir

- **Atouts naturels** : relief plat, 3 zones climatiques complémentaires, réseau hydrographique dense (6 barrages), 520 km de côte, 2 ports, sous-sol riche (or, pétrole, gaz) ;
- **Atouts humains** : ~26 M d'habitants, **45 % de moins de 15 ans**, main-d'œuvre abondante, marché de consommation, apport étranger ;
- **Politique** : libéralisme + capitalisme d'État (1960-1980) → crise → **PAS (1981)** avec FMI/BM → **privatisations (1990)**, État arbitre ;
- La CI = l'une des économies les plus prospères de la sous-région ouest-africaine.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'histoire-geo' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 10;

-- ---- G2 — Les secteurs d'activités économiques de la Côte d'Ivoire ----
update public.chapitres c set
  titre = 'G2 — Les secteurs d''activités économiques de la Côte d''Ivoire',
  description = 'Géographie · Thème 1 : La Côte d''Ivoire, étude économique',
  resume = $md$*Thème 1 (Géographie) : La Côte d'Ivoire — étude économique*

## Introduction

Pour son développement, la Côte d'Ivoire s'appuie sur trois secteurs d'activités : **primaire, secondaire et tertiaire**. Chacun, selon son importance, intervient dans le processus de développement du pays.

## I. Un secteur primaire prépondérant

Le secteur primaire regroupe les activités d'exploitation des ressources naturelles (agriculture, élevage, pêche, forêt). Il est **dominé par l'agriculture**.

### 1. L'agriculture, pilier fort de l'économie

**Conditions favorables** : relief plat, plus de **60 % de la population active**, main-d'œuvre abondante (nationaux et étrangers), instituts de recherche (CNRA, IRCC, IRCA, IRHO), structures d'encadrement (**ANADER**, PNASA — héritières de la CIDT, SATMACI, SODEPALM), garantie des prix du binôme café-cacao.

**Régions et types de cultures** :

- **Région forestière (sud)** : cultures arborées — cacao, café, hévéa, palmier à huile ;
- **Région des savanes (nord)** : cultures herbacées — coton, maïs, riz, arachide, sorgho — combinées à l'arboriculture (anacardier, karité, manguier) ;
- **Cultures vivrières** (alimentation de la population) et **cultures d'exportation** (poids économique majeur).

**Performances remarquables** :

- **Cacao : 1er producteur mondial** (~1 400 000 t, 40 % de la production mondiale) ;
- **Noix de cajou : 1er producteur mondial** (715 000 t en 2017) ;
- **Caoutchouc : 1er producteur africain** (340 000 t en 2015) ;
- **Noix de cola : 1er exportateur mondial** ; coton : 3e producteur africain ; igname : 4e producteur mondial.

L'agriculture occupe **66 % des actifs** et fournit **~70 % des recettes d'exportation** (droits uniques de sortie sur café, cacao, bois).

### 2. Élevage, pêche et forêt

- **Élevage** : surtout au nord (bovins : 1,3 M de têtes ; ovins/caprins : 2,1 M ; aviculture en plein essor : 27 M de volailles) — production **insuffisante** pour couvrir la consommation nationale ;
- **Pêche** : atouts (réseau hydrographique, façade sur le golfe de Guinée, ports d'Abidjan et San-Pédro) ; pêche **industrielle** (41 410 t) et **artisanale** (59 590 t) — total ~101 000 t en 2019, également déficitaire ;
- **Exploitation forestière** : longtemps un moteur (scieries d'Adzopé, San-Pédro, Gagnoa…), 70 % du bois exporté (teck en tête) — mais le massif forestier est **gravement menacé** par la surexploitation (de 16 M d'hectares en 1960 à moins de 3 M).

## II. Un secteur secondaire en plein essor

### 1. Les phases de l'industrialisation

1. **1960-1970** : l'**import-substitution** ;
2. **1970-1980** : la **régionalisation industrielle** ;
3. **1980-1994** : la **stagnation** (crise, dévaluation du FCFA en 1994) ;
4. **Depuis 1994** : la **reprise et la diversification**.

### 2. Types d'industries et foyers industriels

- **Agro-alimentaires** (le « poumon » industriel) : SOLIBRA, BRASSIVOIRE, conserveries ;
- **Textiles et bois** : GONFREVILLE (Bouaké), FILTISAC, UNIWAX ;
- **Chimiques, métallurgiques, bâtiment** : SOTACI, CARENA, SOCIMAT ;
- **Extractives** : PETROCI, SODEMI, mines d'Ity…

Foyers industriels : sud (Abidjan, Grand-Bassam, Bonoua), centre (Yamoussoukro, Bouaké), nord (Korhogo), sud-ouest (San-Pédro). **~70 % des industries concentrées dans le district d'Abidjan**.

**Caractères** : prédominance des industries légères, poids de l'agro-industrie, inégale répartition, forte concentration à Abidjan.

### 3. L'importance de l'industrie

14 % de la population active, **30,8 % du PIB** (2018), forte croissance depuis 2011. Transformation locale croissante : 35 % du cacao (2015), ~50 % du coton graine, la totalité du caoutchouc (première transformation), la quasi-totalité de l'huile de palme.

## III. Un secteur tertiaire dynamique

### 1. Le commerce

- **Intérieur** : grandes surfaces (SOCOCE…), grossistes, détaillants ;
- **Extérieur** : exportations de matières premières (café, cacao, coton, bois, pétrole) contre importations de produits manufacturés ; partenaires : France, USA, Pays-Bas, UE, UEMOA, CEDEAO. Les exportations représentent **~40 % du PIB** et la **balance commerciale est excédentaire**.

### 2. Le tourisme

**Atouts** : plages et lagunes (Ébrié, Aby), parcs et réserves (**Taï**, Banco, Azagny), diversité culturelle (~60 peuples, fêtes de générations), monuments (**basilique de Yamoussoukro**, mosquées séculaires de Kong et Bondoukou), infrastructures modernes. En 2016 : **7,5 % du PIB**, 1 543,9 milliards FCFA générés, 62 % de l'économie des services.

### 3. Les infrastructures de transport

- **Routier** : ~68 000 km dont 6 000 km bitumés — l'un des meilleurs réseaux d'Afrique de l'Ouest ;
- **Ferroviaire** : ligne **Abidjan-Ouagadougou** (1 156 km, dont 638 en CI), gérée par SITARAIL ;
- **Aérien** : 3 aéroports internationaux (Abidjan FHB, Bouaké, Yamoussoukro), compagnie Air Côte d'Ivoire ;
- **Maritime** : **Port Autonome d'Abidjan (90 % du trafic)** et port de San-Pédro ;
- **Lagunaire** : bateaux-bus (SOTRA, STL).

## Conclusion

Les secteurs d'activités ivoiriens sont en expansion. Le secteur primaire, dominant depuis l'indépendance, voit sa place se réduire au profit des autres secteurs. Toutefois, l'économie reste confrontée à des problèmes auxquels des solutions sont envisagées.

---

### 📌 L'essentiel à retenir

- **Primaire** : pilier — cacao (**1er mondial**), cajou (1er mondial), 66 % des actifs, ~70 % des recettes d'exportation ; élevage et pêche **déficitaires** ; forêt en danger ;
- **Secondaire** : 4 phases depuis 1960, agro-industrie dominante, **70 % des usines à Abidjan**, ~30 % du PIB ;
- **Tertiaire** : commerce extérieur excédentaire, tourisme (7,5 % du PIB), réseau routier + train Abidjan-Ouaga + 2 ports + 3 aéroports.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'histoire-geo' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 11;

-- ---- G3 — Les problèmes de développement économique de la Côte d'Ivoire ----
update public.chapitres c set
  titre = 'G3 — Les problèmes de développement économique de la Côte d''Ivoire',
  description = 'Géographie · Thème 1 : La Côte d''Ivoire, étude économique',
  resume = $md$*Thème 1 (Géographie) : La Côte d'Ivoire — étude économique*

## Introduction

Depuis l'indépendance, la Côte d'Ivoire a connu un relatif développement économique. Mais ce succès ne doit pas occulter les **nombreux problèmes** qui minent sa croissance. Quels sont-ils, et quelles solutions sont mises en œuvre ?

## I. Les problèmes généraux du développement économique

### 1. Les problèmes économiques

- **Une économie extravertie et dépendante des matières premières agricoles** : le secteur primaire occupe plus de 60 % de la main-d'œuvre et l'essentiel de la production est exporté **sans transformation**. La **fluctuation des cours** mondiaux et la **détérioration des termes de l'échange** font perdre d'importantes devises ;
- **L'insuffisance des ressources financières** : dette totale de **16 133 milliards FCFA** (septembre 2020) dont 10 587 milliards de dette extérieure — le **service de la dette** pénalise lourdement le pays ; faiblesse de l'épargne nationale (pauvreté), incivisme fiscal → recours obligé aux investissements étrangers.

### 2. Le « fardeau » de la croissance démographique

Plus de 26 millions d'habitants en 2020, croissance accélérée (**TAN > 2,5 %/an** : forte natalité + immigration massive). Une large part de cette population jeune manque de capacités de base (santé fragile, malnutrition, analphabétisme, chômage, manque de logements). L'État consacre l'essentiel de ses ressources aux **investissements sociaux** au détriment des **investissements productifs**.

### 3. La dégradation de l'environnement

**Déforestation galopante** (plantations + pression démographique), insalubrité chronique des villes, prolifération des bidonvilles, pollutions diverses (perturbations climatiques, maladies respiratoires, intoxications).

## II. Les problèmes sectoriels

### 1. Le secteur primaire

- **Une agriculture destructrice de l'environnement** : agriculture **extensive** dévoreuse d'espaces — le couvert forestier est passé de **16 millions d'hectares en 1960 à moins de 2-3 millions** aujourd'hui ; brûlis, herbicides et engrais chimiques dégradent sols et eaux ;
- **La dépendance aux aléas climatiques** : l'essentiel des exploitations dépend de la pluie ; le dérèglement climatique (sécheresses, inondations) fait osciller les productions — grand pays agricole, la CI est pourtant **grande importatrice de riz** ;
- **Autres** : vieillissement des vergers et des planteurs, absence d'entrepôts de stockage, pertes « bord champ ».

### 2. Une industrialisation faible et déséquilibrée

- **Au plan interne** : tissu industriel peu développé (agro-industrie surtout), quasi-absence d'**industries lourdes et de pointe**, déséquilibre régional (**plus de 75 % des capacités dans le sud**, district d'Abidjan), entreprises de petite taille ;
- **Au plan externe** : dépendance de l'étranger (**60 % des capitaux et ~50 % des matières premières importés**), concurrence (Maroc, Asie du Sud-Est), contrebande et contrefaçon liées à la porosité des frontières.

### 3. Les problèmes du secteur tertiaire

- **Transports** : anarchie de la filière, routes dégradées, accidents, **racket** et insécurité (« coupeurs de route ») ;
- **Tourisme** : séquelles des crises des années 2000, difficultés d'accès aux sites, insécurité, insalubrité, personnel insuffisamment formé, choc de la pandémie de Covid-19 ;
- **Échanges** : hégémonie des étrangers dans la distribution, enclavement des régions productrices, absence de stockage, déséquilibre offre/demande, faible promotion des produits nationaux.

## III. Les tentatives de solutions

### 1. Les grandes phases de l'action de l'État

- **Des indépendances aux années 1990** : libéralisme + capitalisme d'État (croissance jusqu'en 1980), puis **PAS** pour assainir l'économie (privatisations, dévaluation du FCFA en 1994) ;
- **Années 2000** : libéralisation des filières, **diversification** (anacarde, hévéa, hydrocarbures, mines), promotion du civisme fiscal, initiative **PPTE** ;
- **Depuis 2012** : politique volontariste — diversification des partenaires, réforme du **CEPICI**, révision du code minier, **3 PND** (2012-2015, 2016-2020, 2021-2025), **PNIA** pour l'agriculture, grands travaux d'infrastructures.

### 2. Solutions aux problèmes généraux

Promotion du civisme fiscal et de l'épargne (DGI, microfinance) ; **transformation locale des matières premières** (usines de cacao, cajou, riz) ; maîtrise de la croissance démographique ; protection de l'environnement (parcs, salubrité, assainissement).

### 3. Solutions sectorielles

- **Primaire** : modernisation (irrigation, mécanisation, plants sélectionnés), installation de jeunes agriculteurs, promotion de la riziculture par l'**ADERIZ** ;
- **Secondaire** : compétitivité, **déconcentration** industrielle, encouragement des entrepreneurs nationaux ;
- **Tertiaire** : organisation des transports, lutte contre le racket, promotion touristique « **Sublime Côte d'Ivoire** », écotourisme, promotion des produits nationaux.

## Conclusion

Le développement économique de la Côte d'Ivoire est freiné par plusieurs problèmes généraux et sectoriels. Les pouvoirs publics s'emploient à y apporter des solutions pour favoriser un développement économique **durable**.

---

### 📌 L'essentiel à retenir

- **Problèmes généraux** : économie **extravertie** (dépendance aux matières premières brutes), **dette** lourde (16 133 Mds FCFA en 2020), démographie galopante, environnement dégradé ;
- **Problèmes sectoriels** : agriculture extensive et dépendante du climat, industrie faible et concentrée à Abidjan (75 %), transports anarchiques, tourisme fragile ;
- **Solutions** : PAS (années 80) → PPTE → **PND** successifs, transformation locale, ADERIZ, CEPICI, « Sublime Côte d'Ivoire » ;
- Image clé : la CI, « **géant aux pieds d'argile** » — prospère mais vulnérable.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'histoire-geo' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 12;

-- ---- G4 — Les fondements du développement économique de la Corée du Sud ----
update public.chapitres c set
  titre = 'G4 — Les fondements du développement économique de la Corée du Sud',
  description = 'Géographie · Thème 2 : La Corée du Sud, un exemple de pays émergent',
  resume = $md$*Thème 2 (Géographie) : La Corée du Sud — un exemple de pays émergent*

## Introduction

La République de Corée (Corée du Sud) occupe la moitié sud de la péninsule coréenne (le nord étant occupé par la Corée du Nord). Bordée par la mer Jaune à l'ouest et la mer du Japon à l'est, elle couvre **98 480 km²** pour plus de **51 millions d'habitants** (2017). Capitale : **Séoul**. Comment ce pays, occupé puis ravagé par la guerre et classé parmi les pays en développement dans les années 1960, est-il devenu une puissance économique mondiale ?

## I. Un territoire restreint aux potentialités variables

- **Un relief essentiellement montagneux** (70 % du territoire) : chaîne du **Taebaek** le long de la côte est (mont Seorak, site classé par l'UNESCO), chaînes secondaires (Sobaek, Kwangju), île volcanique de **Jeju-do** avec le plus haut sommet (**Halla-san**, ~1 950 m). Les plaines (< 1/5 du pays) se concentrent sur les littoraux ouest et sud, très densément peuplés ;
- **Un climat continental contrasté** : hiver froid et sec (-5 °C à 5 °C), été chaud et pluvieux (**mousson**), printemps et automne cléments propices au tourisme ; sécheresses et **typhons** périodiques ;
- **Une végétation tempérée en pleine mutation** : conifères et feuillus ; le couvert forestier, détruit pendant l'occupation japonaise, a été **régénéré par un vaste programme de reforestation** de l'État ;
- **Des ressources minières insignifiantes** : houille, zinc, tungstène, fer… au poids économique négligeable ;
- **Des ressources en eau propices** : grands fleuves (**Nakdong** 521 km, **Han** qui traverse Séoul, Geum, Yeongsan) et **2 413 km de littoral** → ports, hydroélectricité, pêche industrielle, irrigation, navigation.

## II. Le capital humain, facteur fondamental du développement

### 1. Une population dynamique mais vieillissante

Plus de 51 millions d'habitants et des indicateurs sociaux excellents (espérance de vie 82 ans, alphabétisation ~100 %, chômage ~5 %). Mais la **croissance démographique est devenue négative** : le vieillissement de la main-d'œuvre commence à peser sur l'économie. Le **confucianisme** a inculqué la priorité au groupe, le respect de la hiérarchie, le dévouement et l'engagement dans le travail.

### 2. L'éducation et la formation, piliers du développement

Dépourvue de ressources naturelles, la Corée du Sud a fait le choix d'**optimiser son capital humain** : « le développement du système éducatif doit précéder le développement économique ». Cette « **révolution éducative** », lancée dès 1945 sous les présidents **Syngman Rhee** et **Park Chung-hee**, consacre **4,5 % du PIB à l'éducation** : le taux d'alphabétisation passe de **22 % en 1945 à 88 % en 1970** (100 % aujourd'hui). La démocratisation de l'enseignement supérieur a permis de former les cadres qui dirigent aujourd'hui les multinationales du pays.

## III. La politique économique sud-coréenne

### 1. L'influence extérieure

Colonisée par le **Japon (1910-1945)**, la Corée du Sud devient, dans le contexte de la guerre froide, un allié majeur des **États-Unis** : protection militaire et soutien économique massif (entre 1953 et 1961, l'aide américaine représente **8 % du PNB, 64 % des investissements et 70 % des importations**).

### 2. Un État-développeur dominant

Tout en pratiquant l'économie de marché, l'État reste **stratège** : plans quinquennaux, **Bureau de planification économique (1961)**, **KAIST (1971)** pour la recherche scientifique et technologique, politique commerciale tournée vers l'exportation (subventions, exonérations), mobilisation de l'épargne intérieure. L'État s'appuie sur les **chaebols** — grands conglomérats familiaux (Samsung, Hyundai, POSCO…) à la puissance nationale et internationale considérable.

### 3. Les grandes phases du développement

1. **Substitution aux importations (1953-1961)** : reconstruction, production locale de biens de consommation, industries légères à forte main-d'œuvre, « **trois blancs** » (coton, sucre, farine) ;
2. **Exportation audacieuse (1961-1973)** : promotion massive des exportations d'industries légères (textile, chaussures) — les exportations passent de **3,3 % du PNB en 1960 à 48 % en 1977** ;
3. **Industries lourdes (1973-1980)** : investissements massifs (parcs industriels, sidérurgie avec **POSCO**, chimie), coopération État-chaebols — l'industrie lourde passe de 25 % (1962) à **55 % (1979)** de l'industrie manufacturière. À partir de 1990 : montée en puissance de l'**automobile et de l'électronique** grand public.

## Conclusion

Pays à la géographie contraignante, longtemps soumis aux occupations étrangères, la Corée du Sud s'est forgé un modèle de développement original à partir de 1953 : **planification audacieuse, priorité absolue au capital humain, étroite collaboration État-secteur privé**. Elle s'est industrialisée de façon fulgurante et s'impose comme une puissance économique stratégique — l'un des « **quatre dragons d'Asie** ».

---

### 📌 L'essentiel à retenir

- Territoire **montagneux (70 %)**, ressources minières négligeables → le développement repose sur les **hommes** ;
- **Éducation** = pilier n°1 (4,5 % du PIB, alphabétisation 22 % → 100 %) + valeurs confucéennes (travail, groupe, hiérarchie) ;
- Aide **américaine** massive après 1953, puis **État stratège** (plans, KAIST) + **chaebols** (Samsung, POSCO…) ;
- 3 phases : substitution aux importations (1953-61) → promotion des **exportations** (1961-73) → **industries lourdes** (1973-80) puis high-tech ;
- Défi actuel : **vieillissement démographique** (croissance négative).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'histoire-geo' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 13;

-- ---- G6 — La CEDEAO, une organisation régionale à caractère économique ----
update public.chapitres c set
  titre = 'G6 — La CEDEAO, une organisation régionale à caractère économique',
  description = 'Géographie · Thème 3 : Regroupements et coopération économique',
  resume = $md$*Thème 3 (Géographie) : Regroupements et coopération économique*

## Introduction

À leur indépendance, les États africains sont morcelés et fragiles. Conscients de leurs faiblesses, ceux de l'Afrique de l'Ouest décident de mettre en commun leurs potentialités : la **Communauté Économique des États de l'Afrique de l'Ouest (CEDEAO)** est créée le **28 mai 1975 à Lagos** (Nigeria).

## I. Présentation de la CEDEAO

### 1. Une création par la volonté des chefs d'État

L'idée d'une union ouest-africaine est émise en 1968 par le président libérien **William Tolbert**, reprise en 1972 par les chefs d'État du Nigeria et du Togo, et concrétisée le **28 mai 1975** par 16 États (la **Mauritanie se retire en 1999**). La CEDEAO couvre environ **5,1 millions de km²** et compte plus de **300 millions d'habitants**, avec **15 États membres** :

- **8 francophones** : Bénin, Burkina Faso, Côte d'Ivoire, Guinée, Mali, Niger, Sénégal, Togo ;
- **5 anglophones** : Gambie, Ghana, Liberia, Nigeria, Sierra Leone ;
- **2 lusophones** : Cap-Vert, Guinée-Bissau.

### 2. Objectifs et principes

**Objectif principal** : l'**intégration sous-régionale** par la coopération et la création d'une union économique, pour élever le niveau de vie des peuples et contribuer au développement du continent. **Objectifs spécifiques** : suppression des barrières douanières, **libre circulation des personnes, des biens et des capitaux**, création d'une **monnaie commune**, infrastructures régionales, harmonisation des politiques agricoles, industrielles et énergétiques.

**Principes** : égalité et interdépendance des États, **non-agression**, promotion de la démocratie, règlement pacifique des différends, non-ingérence, intervention de la communauté dans un État à sa demande.

## II. Structure et fonctionnement

### 1. Les organes de direction

- **La Conférence des chefs d'État et de gouvernement** : organe **suprême**, une session ordinaire par an, présidence tournante d'un an ;
- **Le Conseil des ministres** : prépare la Conférence, veille à l'application des décisions (2 réunions/an) ;
- **La Commission** : administration quotidienne, président nommé pour 4 ans.

### 2. Les autres organes

- **Le Parlement de la communauté** (2006, 120 députés) : légifère, droits de l'homme ;
- **La Cour de justice** (siège à **Abuja**) : respect des traités, saisissable par les citoyens ;
- **Le Conseil économique, social et environnemental** (consultatif) ;
- **La BIDC** (Banque d'Investissement et de Développement de la CEDEAO, siège à **Lomé**) : finance les projets de développement ;
- **Les commissions techniques** : Organisation Ouest-Africaine de la Santé, Agence Monétaire de l'Afrique de l'Ouest…

## III. Forces et faiblesses de la CEDEAO

### 1. De nombreux atouts

- **Naturels** : sous-sol riche — **or** (1re région aurifère d'Afrique, devant l'Afrique du Sud), uranium (Niger), diamant, fer, bauxite, phosphate ; **30 % des réserves de pétrole et gaz du continent** (Nigeria : 2,3 millions de barils/jour) ; diversité climatique (subéquatorial → sahélien) favorable à des cultures variées — l'agriculture emploie **75 % de la population rurale** ;
- **Humains** : plus de **300 millions d'habitants** = vaste marché de consommation et main-d'œuvre jeune et abondante ;
- **Financiers** : BIDC, AMAO, **ECOBANK** (banque commerciale régionale dynamique).

### 2. Des réalisations appréciables

- **Politique et militaire** : libre circulation (carte d'identité et permis de conduire CEDEAO), condamnation des coups d'État, interventions de l'**ECOMOG** (Liberia, Sierra Leone, Côte d'Ivoire, Guinée-Bissau) ;
- **Économique** : infrastructures de transport et télécommunications, projets agricoles (ADRAO-riz), facilitation des échanges, soutien de la **BOAD** ;
- **Socio-culturel** : compétitions sportives (UFOA), Miss CEDEAO, projet de « **ceinture verte** » contre l'avancée du désert.

### 3. De nombreuses insuffisances

- **Instabilité politique** : faible gouvernance démocratique, modifications des constitutions, contestations électorales, **plus de 25 tentatives de coups d'État entre 1990 et 2019** ;
- **Insécurité chronique** : montée du **terrorisme** (Mali, Burkina, Niger, Nigeria), ECOMOG insuffisant → recours à des forces extérieures (G5 Sahel) ;
- **Faiblesses économiques** : économies extraverties, dépendantes de l'agriculture de rente, faible industrialisation, **multiplicité des monnaies** (retard de la monnaie commune **ECO**), faiblesse des échanges intra-régionaux (~11 %), corruption, retards de cotisations, rivalités (Côte d'Ivoire/Nigeria, anglophone/francophone) ;
- **Limites sociales** : pauvreté, analphabétisme, chômage des jeunes, immigration clandestine, barrières linguistiques.

## Conclusion

La CEDEAO est l'une des plus importantes organisations d'Afrique et **l'espace d'intégration sous-régionale le mieux organisé du continent**, malgré ses faiblesses structurelles et sécuritaires. La mise en circulation de sa monnaie commune (ECO) et l'industrialisation, dans un environnement de paix, l'aideront à élever le niveau de vie de ses peuples.

---

### 📌 L'essentiel à retenir

- **28 mai 1975, Lagos** : création par 16 États (15 aujourd'hui, la Mauritanie partie en 1999) — 5,1 M km², +300 M d'habitants ;
- Objectif clé : **intégration économique** (libre circulation, monnaie commune ECO) ;
- Organes : **Conférence des chefs d'État** (suprême), Conseil des ministres, Commission, Parlement, Cour de justice (Abuja), **BIDC** (Lomé) ;
- Succès : libre circulation, **ECOMOG**, condamnation des putschs ;
- Faiblesses : instabilité (25+ coups d'État), terrorisme au Sahel, économies extraverties, échanges intra-régionaux ~11 %.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'histoire-geo' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 15;

-- ---- G7 — Les relations UE-ACP : un exemple de coopération Nord-Sud ----
update public.chapitres c set
  titre = 'G7 — Les relations UE-ACP : un exemple de coopération Nord-Sud',
  description = 'Géographie · Thème 3 : Regroupements et coopération économique',
  resume = $md$*Thème 3 (Géographie) : Regroupements et coopération économique*

## Introduction

La coopération entre l'**Union Européenne (UE)** et les pays d'**Afrique, des Caraïbes et du Pacifique (ACP)** remonte au **traité de Rome (1957)**. Ces relations entre pays fournisseurs de matières premières (ACP) et pays transformateurs (UE) ont longtemps été considérées comme un **modèle de coopération Nord-Sud**. Comment se traduisent-elles ?

## I. Présentation des partenaires

### 1. L'Union Européenne : une puissance mondiale de 27 États

Née de la volonté de reconstruire l'Europe après 1945 : **CECA** → **CEE (traité de Rome, 1957)** → **UE (traité de Maastricht, 1992)**. 27 États membres depuis le Brexit, **446 millions d'habitants** (2020).

- **Puissance agricole** : 1re puissance agricole mondiale (405 Mds € en 2016), grâce à la **PAC** ;
- **Puissance industrielle** : automobile (Mercedes, Volkswagen, Renault, Peugeot, Fiat), pharmacie (Bayer, Sanofi), aéronautique (**Airbus, Ariane**), agroalimentaire et luxe (Danone, Dior) ;
- **Puissance commerciale et de services** : vaste marché de consommation, ~15 % du commerce mondial de biens et services (banques, assurances, tourisme).

### 2. Les ACP : 79 États producteurs de matières premières

**Étapes de la construction du groupe** : PTOM (avant 1960) → **EAMA** (18 États, années 1960) → accord d'**Arusha** (1969 : entrée du Kenya, de l'Ouganda, de la Tanzanie) → adhésion britannique à la CEE (1973 : entrée de 21 pays du Commonwealth) → **accord de Georgetown (1975)** qui institue le **groupe ACP**.

Aujourd'hui : **79 États** (48 d'Afrique, 16 des Caraïbes, 15 du Pacifique), plus de **1,1 milliard d'habitants**. **Potentialités** : 21 % des réserves minières mondiales, ~10 % de la production mondiale de pétrole (Nigeria), productions agricoles importantes (café, cacao, coton, bois…) — mais les produits primaires représentent **80 % des exportations africaines**.

## II. Les accords de coopération UE/ACP

### 1. Raisons, objectifs et institutions

**Raisons** : **historiques** (les ACP sont d'anciennes colonies européennes), **politiques et culturelles** (francophonie, Commonwealth), **économiques** (matières premières pour l'UE, marchés et investissements ; pour les ACP : aides multiformes, **STABEX/SYSMIN**, accès sans droits de douane au marché européen).

**Objectifs** : promouvoir le développement des ACP, approfondir les relations dans un esprit de solidarité, maintenir les liens économiques. **Principes** : égalité des partenaires, droit de chaque État à ses choix.

**Institutions** : Conseil des ministres ACP/UE (décision), Comité des ambassadeurs (exécutif), Assemblée parlementaire paritaire (consultatif), CDE (entreprises), CTA (agriculture).

### 2. L'évolution des accords

| Accord | Période | Points clés |
|---|---|---|
| 1re convention d'association | 1958-1962 | CEE-PTOM ; création du **FED** (Fonds Européen de Développement) |
| **Yaoundé I** | 1963-1969 | CEE-18 EAMA ; suppression des droits de douane ; création de la **BEI** |
| **Yaoundé II** | 1969-1975 | Priorité à l'industrie et au commerce |
| **Lomé I** | 1975-1980 | 46 ACP-9 CEE ; création du **STABEX** ; libre accès des produits ACP au marché CEE |
| **Lomé II** | 1980-1985 | Création du **SYSMIN** (produits miniers) |
| **Lomé III** | 1985-1990 | Développement autonome, droits de l'homme, aide aux réfugiés |
| **Lomé IV** | 1990-2000 | Non-remboursement des transferts, soutien aux PAS, secteur privé ; révision 1995 : allègement de la dette, démocratie |
| **Cotonou** | 2000-2020 | Signé le **23 juin 2000** : éradication de la pauvreté, bonne gouvernance, société civile, paix ; annonce les **APE** (Accords de Partenariat Économique) qui prévoient la fin des préférences commerciales |

### 3. Les domaines de coopération

- **Économique et financier** : libre accès des produits ACP au marché européen, financement de projets (FED, BEI), STABEX/SYSMIN, sécurité alimentaire, industrialisation (PME-PMI), aide aux PAS ;
- **Politico-humanitaire et culturel** : aide aux réfugiés, consolidation de la paix, droits de l'homme, démocratie, coopération décentralisée et culturelle.

## III. Bilan de la coopération UE/ACP

### 1. Des acquis importants

- **Pour les ACP** : nombreux projets financés (FED, BEI), bourses d'études, dons non remboursables, soutien des secteurs clés (STABEX, SYSMIN) ;
- **Pour l'UE** : matières premières à bas prix, vaste marché pour ses produits industriels, extension de son influence politique et culturelle.

### 2. Des relations limitées

Après plus de 60 ans, les résultats sont décevants : les ACP restent de simples **fournisseurs de matières premières**, subissent le déficit commercial et la **détérioration des termes de l'échange**, manquent de compétitivité, croulent sous l'**endettement** ; certains pays de l'UE rechignent à financer. Le commerce bilatéral reste « largement déséquilibré au profit de l'Europe » — un « relent néo-colonial » selon certains analystes.

## Conclusion

Les relations UE/ACP, qui devaient constituer un bel exemple de coopération Nord-Sud, restent **mitigées** après plus de soixante ans de partenariat. Pour donner un nouveau souffle à leur coopération, les partenaires s'engagent dans les **APE** — ces accords aideront-ils à la renforcer ?

---

### 📌 L'essentiel à retenir

- **UE** (27 États, 446 M hab.) = puissance agricole, industrielle et commerciale ; **ACP** (79 États, +1,1 Md hab.) = fournisseurs de matières premières ;
- Groupe ACP institué par l'accord de **Georgetown (1975)** ;
- Succession d'accords : **Yaoundé** (1963-75) → **Lomé I-IV** (1975-2000, STABEX/SYSMIN) → **Cotonou** (2000-2020) → **APE** ;
- Bilan **mitigé** : aides réelles (FED, BEI) mais échanges déséquilibrés, dépendance et endettement des ACP persistants.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'histoire-geo' and n.nom = 'Terminale' and s.nom in ('A', 'C', 'D')
  and c.ordre = 16;

-- Contrôle : liste des résumés publiés pour la matière
select s.nom as serie, c.ordre, c.titre, length(c.resume) as taille_resume, c.resume_published
from public.chapitres c
join public.matieres m on m.id = c.matiere_id
join public.series s on s.id = c.serie_id
join public.niveaux n on n.id = s.niveau_id
where m.slug = 'histoire-geo' and n.nom = 'Terminale'
order by s.nom, c.ordre;
