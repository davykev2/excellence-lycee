-- ============================================================================
-- EXCELLENCE LYCÉE — résumés espagnol / Terminale (séries A)
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
  (1, 'L1 — Realidades sociolingüísticas de España', 'Conocer el mundo hispánico · variedades del español, seseo/yeísmo'),
  (2, 'L2 — Realidades políticas e históricas de España', 'Conocer el mundo hispánico · Guerra Civil, franquismo, memoria histórica'),
  (3, 'L3 — Realidades sociales e históricas de Hispanoamérica', 'Conocer el mundo hispánico · culturas precolombinas (aztecas, mayas, incas)'),
  (4, 'L4 — Realidades económicas y sociales de Hispanoamérica', 'Conocer el mundo hispánico · emigración, la ruta de la muerte'),
  (5, 'L5 — Realidades de Guinea Ecuatorial', 'Conocer el mundo hispánico y África · historia, plurilingüismo, petróleo'),
  (6, 'L6 — Poser des questions / Preguntar', 'Intercambio de información · técnica interrogativa'),
  (7, 'L7 — Décrire / Describir', 'Intercambio de información · comparativos'),
  (8, 'L8 — Raconter un fait / Relatar', 'Intercambio de información · tiempos del relato'),
  (9, 'L9 — Résumer / Resumir', 'Intercambio de información · conectores de resumen'),
  (10, 'L10 — Rappeler une information / Recordar', 'Intercambio de información · recordar / acordarse de'),
  (11, 'L11 — Exprimer une opinion', 'Expresión de opinión · fórmulas de opinión'),
  (12, 'L12 — Exprimer la capacité / l''incapacité', 'Expresión de opinión · ser capaz de / incapaz de'),
  (13, 'L13 — Exprimer l''approbation', 'Expresión de opinión · estar de acuerdo, aprobar'),
  (14, 'L14 — Exprimer la désapprobation', 'Expresión de opinión · no creer que + subjuntivo'),
  (15, 'L15 — Convaincre', 'Expresión de opinión · oración concesiva'),
  (16, 'L16 — Exprimer l''indignation', 'Estados de ánimo · subjuntivo de indignación'),
  (17, 'L17 — Exprimer la gratitude / le vœu', 'Estados de ánimo · gratitud y deseo'),
  (18, 'L18 — Exprimer la joie', 'Estados de ánimo · disfrutar, alegría'),
  (19, 'L19 — Exprimer la peine', 'Estados de ánimo · expresiones de pena'),
  (20, 'L20 — Exprimer l''espoir', 'Estados de ánimo · esperanza, acabar con, ¡ojalá!'),
  (21, 'L21 — Donner des consignes', 'Expresión de la orden · imperativo'),
  (22, 'L22 — Donner des conseils', 'Expresión de la orden · imperativo y obligación'),
  (23, 'L23 — Faire des suggestions', 'Expresión de la orden · sugerir/proponer que + subjuntivo'),
  (24, 'L24 — Faire une demande', 'Expresión de la orden · pedir/rogar/instar que + subjuntivo'),
  (25, 'L25 — Dissuader', 'Expresión de la orden · imperativo negativo, desaconsejar'),
  (26, 'L26 — Réaliser une conversation', 'Técnica de expresión · marcadores de conversación'),
  (27, 'L27 — Réaliser une interview', 'Técnica de expresión · técnica interrogativa'),
  (28, 'L28 — Faire un exposé / Ponencia', 'Técnica de expresión · estructura de la ponencia'),
  (29, 'L29 — Présenter un thème', 'Técnica de expresión · actitudes para presentar un tema'),
  (30, 'L30 — Commenter une image', 'Técnica de expresión · situar y describir una imagen')
) as x(ordre, titre, description) on true
where m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
on conflict (matiere_id, serie_id, ordre) do nothing;

-- 2) Injection des résumés (titre et description resynchronisés au passage)

-- ---- L1 — Realidades sociolingüísticas de España ----
update public.chapitres c set
  titre = 'L1 — Realidades sociolingüísticas de España',
  description = 'Conocer el mundo hispánico · variedades del español, seseo/yeísmo',
  resume = $md$*Competencia: Conocer el mundo hispánico — Comprensión oral*
*Apoyo: «Las variedades del español», Más Allá, Terminale*

## Contenido (resumen)

El español es una lengua con **muchas variedades**, tanto en **España** como en **Hispanoamérica**. Estas diferencias se deben a la **dispersión geográfica** y a los **distintos niveles socioculturales** de los hablantes. Sin embargo, estas variedades **no impiden** que los hispanohablantes se comprendan entre sí: no hay «un español de España» y «un español de América», sino un mismo idioma con variantes.

**Principales diferencias de pronunciación:**
- el **seseo** (pronunciar la *z* y la *c* como *s*: *casa* y *caza* suenan igual) ;
- el **yeísmo** (pronunciar la *ll* como *y*) ;
- la aspiración o pérdida de la *-s* al final de sílaba.

Se notan variantes en Andalucía, Islas Canarias, Colombia, Venezuela, México, etc.

## Vocabulario clave

- **el idioma / la lengua** : la langue (el dioula, el baoulé son idiomas de Costa de Marfil) ;
- **un hispanohablante** : un hispanophone (un mexicano es hispanohablante) ;
- **el seseo / el yeísmo** : rasgos de pronunciación.

## Gramática: los indefinidos *cuantos / cuantas*

Los indefinidos **cuantos/cuantas** se unen frecuentemente a **unos/unas** con el significado de *algunos/algunas*, para expresar una **cantidad indeterminada**.

> *En España hay **unas cuantas** variedades lingüísticas.*
> *Necesito **unas cuantas** naranjas.*

---

### 📌 Lo esencial

- El español = **un solo idioma con muchas variantes** (España + Hispanoamérica) ; las variantes no impiden la comprensión mutua ;
- Rasgos clave: **seseo** y **yeísmo** ;
- Gramática: **unos/unas cuantos/cuantas** = *algunos/algunas* (cantidad indeterminada).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 1;

-- ---- L2 — Realidades políticas e históricas de España ----
update public.chapitres c set
  titre = 'L2 — Realidades políticas e históricas de España',
  description = 'Conocer el mundo hispánico · Guerra Civil, franquismo, memoria histórica',
  resume = $md$*Competencia: Conocer el mundo hispánico — Comprensión oral*
*Apoyo: «Memoria histórica», Más Allá, Terminale*

## Contenido (resumen)

Dos periodos marcan la **historia contemporánea de España**:

- la **Guerra Civil (1936-1939)**: conflicto por el poder que opuso a los **Nacionalistas** (bando franquista) y a los **Republicanos**; terminó en 1939 con la victoria de Franco;
- el **franquismo (1939-1975)**: la dictadura del general **Francisco Franco**.

En **2008**, bajo la supervisión del juez **Baltasar Garzón**, las **Asociaciones por la Recuperación de la Memoria Histórica** procedieron a la **exhumación** de los restos mortales de las víctimas de la Guerra Civil y el franquismo, para darles una **sepultura digna**. La operación generó polémica al principio.

Otro hecho político reciente: la **abdicación del rey Juan Carlos I** el 2 de junio de 2014 (en favor de su hijo Felipe VI).

## Vocabulario clave

- **el franquismo** : le franquisme (reinado de Franco, 1939-1975) ;
- **un desaparecido** : un disparu ;
- **exhumar** : exhumer ;
- **los restos mortales** : la dépouille ; **una sepultura** : une sépulture.

## Gramática: la correlación de tiempos con verbos de voluntad

Con los verbos que expresan **voluntad** (querer, pedir, desear…), el verbo de la **oración subordinada** va en **subjuntivo**:

- verbo principal en **presente** → subjuntivo **presente**: *Quieren que se **escuchen** sus demandas.*
- verbo principal en **pasado** → subjuntivo **imperfecto**: *El juez pidió que **dieran** datos.*

---

### 📌 Lo esencial

- **Guerra Civil (1936-1939)**: Nacionalistas vs Republicanos → victoria de **Franco** ;
- **Franquismo (1939-1975)**: dictadura ; **memoria histórica** = exhumación de las víctimas (juez Garzón, 2008) ;
- Gramática: verbo de voluntad → subordinada en **subjuntivo** (con correlación de tiempos).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 2;

-- ---- L3 — Realidades sociales e históricas de Hispanoamérica ----
update public.chapitres c set
  titre = 'L3 — Realidades sociales e históricas de Hispanoamérica',
  description = 'Conocer el mundo hispánico · culturas precolombinas (aztecas, mayas, incas)',
  resume = $md$*Competencia: Conocer el mundo hispánico — Comprensión oral*
*Apoyo: «Culturas precolombinas», Más Allá, Terminale*

## Contenido (resumen)

Las **culturas precolombinas** son las que existían en América **antes de la llegada de Cristóbal Colón** (12 de octubre de 1492). Tres grandes civilizaciones dominaban el continente:

| Civilización | Territorio | Dios principal | Lengua | Fin |
|---|---|---|---|---|
| **Aztecas** | México y parte de Guatemala (capital **Tenochtitlan**) | **Quetzalcóatl** | náhuatl | llegada de los españoles (**Hernán Cortés**), **1521** |
| **Mayas** | del sur de México a Honduras (península de Yucatán) | **Hunab Kú** (creador del hombre a partir del maíz) | maya yucateco | — (grandes constructores de **pirámides**, sabios en **astronomía**) |
| **Incas** | del Pacífico a la selva amazónica (Perú, Bolivia, Ecuador…), rey **Yupanqui**; lugar sagrado **Machu Picchu** | — | quechua | llegada de **Francisco Pizarro**, **1530** |

**Características comunes**: gran **apego a la naturaleza y a la religión** (muchos dioses, sacrificios), fuerte **organización social** (nobles, sacerdotes, guerreros, comerciantes, agricultores, esclavos) y notables conocimientos **científicos**.

## Vocabulario clave

- **el sacerdote / el chamán** : le prêtre / le chaman ;
- **precolombino** : précolombien ; **el imperio** : l'empire.

## Gramática: el superlativo relativo

Eleva una cualidad a su grado **máximo o mínimo**. Se forma: **el/la/los/las + más / menos + adjetivo**.

> *La cultura precolombina es **la más** importante de América del Sur.*

Formas **irregulares**: **el mejor** (más bueno), **el peor** (más malo), **el mayor** (más grande), **el menor** (más pequeño).

---

### 📌 Lo esencial

- 3 culturas precolombinas: **Aztecas** (México, Quetzalcóatl), **Mayas** (Yucatán, astronomía, pirámides), **Incas** (Andes, Machu Picchu, quechua) ;
- Fin: Aztecas **1521** (Cortés), Incas **1530** (Pizarro) ;
- Gramática: **superlativo relativo** (el más / el menos + adj.) e irregulares (mejor, peor, mayor, menor).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 3;

-- ---- L4 — Realidades económicas y sociales de Hispanoamérica ----
update public.chapitres c set
  titre = 'L4 — Realidades económicas y sociales de Hispanoamérica',
  description = 'Conocer el mundo hispánico · emigración, la ruta de la muerte',
  resume = $md$*Competencia: Conocer el mundo hispánico — Comprensión oral*
*Apoyo: «La ruta de la muerte», Más Allá, Terminale*

## Contenido (resumen)

El **panorama migratorio en Hispanoamérica** ha cambiado mucho: unos **42,7 millones** de personas viven fuera de su país de nacimiento (+26 % en una década). Para huir de una situación **económica y social** difícil (y a veces por razones **políticas**), muchos **centroamericanos** emprenden el peligroso camino de la **emigración hacia los Estados Unidos**.

Las **caravanas de migrantes** (iniciadas en octubre de 2018, primero por hondureños) buscan **mejores condiciones de vida**, empujadas por la **pobreza y la violencia**. La **«ruta de la muerte»** es el trayecto que recorren los clandestinos: es muy **peligroso**, muchos pierden la vida. En EE. UU. viven inmigrantes hispanos de distintos orígenes: cubanos, peruanos, puertorriqueños, mexicanos, venezolanos, dominicanos, guatemaltecos…

## Vocabulario clave

- **la emigración** : l'émigration ; **un emigrante / inmigrante** ;
- **un indocumentado** : un sans-papiers (clandestino) ;
- **un peligro** : un danger ; **arriesgar la vida** : risquer sa vie.

## Gramática: expresar un deseo con *gustar*

Para que el verbo **gustar** exprese un **deseo**, se conjuga en **condicional** (*gustaría*):

> *Me **gustaría** viajar en tren.*
> *Me **gustaría** encontrar un trabajo decente.*
> *Me **gustaría que** Dios me dijera qué va a pasar.* (+ subjuntivo tras *que*)

---

### 📌 Lo esencial

- **Emigración** de centroamericanos hacia **EE. UU.** por razones económicas, sociales y políticas ;
- La **«ruta de la muerte»** = trayecto clandestino peligroso ; caravanas de migrantes (2018) ;
- Gramática: **me gustaría + infinitivo** (deseo) ; **me gustaría que + subjuntivo**.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 4;

-- ---- L5 — Realidades de Guinea Ecuatorial ----
update public.chapitres c set
  titre = 'L5 — Realidades de Guinea Ecuatorial',
  description = 'Conocer el mundo hispánico y África · historia, plurilingüismo, petróleo',
  resume = $md$*Competencia: Conocer el mundo hispánico y África — Comprensión oral*
*Apoyo: «El caso del español en Guinea Ecuatorial», Más Allá, Terminale*

## Contenido (resumen)

**Guinea Ecuatorial** es un pequeño país (unos 28 051 km², medio millón de habitantes) que consiguió su **independencia de España el 12 de octubre de 1968**. Es uno de los **más ricos del África subsahariana** gracias a la explotación del **petróleo y del gas** (también café y cacao).

Es el **único país africano** que tiene el **español como lengua oficial**; el **francés** y el **portugués** son lenguas cooficiales. Además, se hablan numerosas **lenguas nativas** de origen bantú: el **fang, el bubi, el ndowé, el bisió, el bujeba, el annobonés**, etc. → es un país **plurilingüe**.

El país sufrió una **dictadura** con su primer presidente, **Macías Nguema** (1968-1979, periodo de retroceso cultural), hasta el **golpe de Estado** del actual presidente **Teodoro Obiang Nguema** en **1979**.

## Vocabulario clave

- **la metrópoli ≠ la colonia** : la métropole / la colonie ;
- **una bolsa (de petróleo/gas)** : une poche (de pétrole/gaz) ;
- **una lengua nativa** : une langue autochtone.

## Gramática: *seguir / continuar + gerundio* (continuidad)

Se usa **seguir + gerundio** (o **continuar + gerundio**) para expresar una acción **que continúa**:

> *El español **sigue siendo** la lengua oficial.*
> *Ana **sigue/continúa mirando** la tele desde la mañana.*

---

### 📌 Lo esencial

- Guinea Ecuatorial: independencia **1968**, **único país africano hispanohablante** ; economía basada en el **petróleo** ;
- País **plurilingüe**: español + francés + portugués (oficiales) + lenguas nativas bantúes ;
- Historia: dictadura de **Macías Nguema** → golpe de **Obiang Nguema** (1979) ;
- Gramática: **seguir/continuar + gerundio** = continuidad de la acción.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 5;

-- ---- L6 — Poser des questions / Preguntar ----
update public.chapitres c set
  titre = 'L6 — Poser des questions / Preguntar',
  description = 'Intercambio de información · técnica interrogativa',
  resume = $md$*Competencia: Intercambio de información — Expresión oral*
*Apoyo: «Entrevista a Cristiano Ronaldo», Más Allá, Terminale*

## Acto de habla: preguntar

En una **entrevista**, un periodista del diario *El País* pregunta a **Cristiano Ronaldo** sobre los distintos aspectos de su vida (fútbol y negocios). El objetivo de la lección es aprender a **hacer preguntas**.

## Expresiones y técnica interrogativa

Para preguntar se pueden usar distintos tipos de oraciones:

- **interrogativa** (directa): *¿Por qué un negocio de implantes de cabello?* — con interrogativos: **¿qué? ¿cómo? ¿por qué? ¿cuál(es)? ¿cuándo? ¿dónde? ¿cuánto(s)? ¿quién?** ;
- **declarativa** (interrogativa indirecta): *Me pregunto **qué** es más complicado…* ;
- **dubitativa**: ***Acaso** disfruta con el fútbol.* (peut-être) ;
- **optativa**: ***Ojalá** sea más fácil elegir un negocio que un club.*

**Uso de algunos interrogativos:**
- **¿cuándo?** (tiempo): *¿Cuándo es tu cumpleaños?* ;
- **¿cuánto?** (cantidad/precio): *¿Cuánto cuesta esta blusa?* ;
- **¿cuál?** (elección): *¿Cuál es la profesión de Manuel?*

## Vocabulario clave

- **preguntar** : demander/poser une question ; **una pregunta** : une question ;
- **un periodista** : un journaliste ; **una entrevista** : une interview/entretien.

---

### 📌 Lo esencial

- Para **preguntar**: interrogativos **¿qué? ¿cómo? ¿por qué? ¿cuál? ¿cuándo? ¿dónde? ¿cuánto? ¿quién?** ;
- Interrogación **directa** (¿…?) vs **indirecta** (*me pregunto qué…*) ;
- Matices: **acaso** (duda), **ojalá** (deseo).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 6;

-- ---- L7 — Décrire / Describir ----
update public.chapitres c set
  titre = 'L7 — Décrire / Describir',
  description = 'Intercambio de información · comparativos',
  resume = $md$*Competencia: Intercambio de información — Expresión oral*
*Apoyo: «Tío Lucas», Más Allá, Terminale*

## Acto de habla: describir

En el texto **«Tío Lucas»**, el autor describe a un hombre **muy feo físicamente**, pero con **grandes valores morales**: un fuerte **contraste** entre el aspecto físico y el aspecto moral. Describir consiste en hacer el **retrato físico** (vestimenta, estatura, rasgos) y **moral** (carácter, sentimientos) de una persona, un lugar o un objeto.

## Expresiones útiles

- **Aspecto físico**: feo/guapo, alto/bajo, gordo/delgado, joven/anciano, robusto ; el **tamaño / la estatura** ;
- **Aspecto moral / carácter**: simpático, tímido, amable, serio, trabajador, respetuoso, malo… ;
- **Objetos / lugares**: colores (rojo, negro, azul), formas (redondo, cuadrado).

## Vocabulario clave

- **el retrato** : le portrait ; **la belleza / la hermosura** : la beauté ;
- **ser feo (a) ≠ ser guapo (a)** : être laid / beau ;
- **el tamaño** : la taille.

## Gramática: los comparativos

- **superioridad**: **más … que** — *Abiyán es **más grande que** Buaké.*
- **igualdad**: **tan … como** — *Juan es **tan** simpático **como** Manuel.*
- **inferioridad**: **menos … que** — *Tengo **menos** problemas **que** tú.*

**Comparativos irregulares**: **bueno → mejor**, **malo → peor**, **grande → mayor**, **pequeño → menor**.

> *Tío Lucas era **más feo que** Picio* = *Picio era **menos feo que** Lucas.*

---

### 📌 Lo esencial

- **Describir** = retrato **físico** (tamaño, rasgos, ropa) + **moral** (carácter) ;
- Gramática: comparativos **más/menos… que**, **tan… como** ;
- Irregulares: **mejor, peor, mayor, menor**.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 7;

-- ---- L8 — Raconter un fait / Relatar ----
update public.chapitres c set
  titre = 'L8 — Raconter un fait / Relatar',
  description = 'Intercambio de información · tiempos del relato',
  resume = $md$*Competencia: Intercambio de información — Expresión oral*
*Apoyo: «Llegada a Barcelona», Más Allá, Terminale*

## Acto de habla: relatar (raconter un fait)

**Andrea**, una joven estudiante, relata su **viaje a Barcelona** para estudiar en la universidad y lo que experimenta a su llegada (viaje largo y cansado, problema de billete, llegada muy tarde, acogida tranquilizadora de una anciana).

## Vocabulario clave

- **relatar / contar** : raconter ; **un relato** : un récit ;
- **el protagonista** : le personnage principal ;
- **una pesadilla ≠ un sueño agradable** : un cauchemar / un beau rêve.

## Gramática: los tiempos del relato

| Tiempo | Uso | Ejemplo |
|---|---|---|
| **Presente de indicativo** | acción en el momento del habla o futuro próximo | *El profesor **da** una tarea.* |
| **Pretérito perfecto simple** (indefinido) | acción pasada, terminada | *Me **quedé** sola en la acera.* |
| **Pretérito imperfecto** | acción pasada con continuidad / habitual | *Todos los días me **levantaba** a las siete.* |
| **Pretérito pluscuamperfecto** | acción **anterior a otra** acción pasada | *Quise pensar que me **había equivocado**.* |
| **Pretérito perfecto compuesto** | pasado en un periodo que continúa (hoy, este año…) o con *nunca, siempre, todavía* | *Este año **hemos trabajado** mucho.* |

## Ejemplo de conjugación

> *Estaba anocheciendo cuando Manolo **salió**. Se **paró**… **vio** que se **acercaba** el autobús… cuando **llegó**, el autobús ya **se había marchado**.*

---

### 📌 Lo esencial

- **Relatar** = organizar los hechos con los **tiempos del pasado** ;
- **Indefinido** (acción puntual terminada) vs **imperfecto** (descripción/hábito) vs **pluscuamperfecto** (anterioridad) ;
- **Perfecto compuesto** = pasado ligado al presente (*hoy, este año, nunca, siempre*).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 8;

-- ---- L9 — Résumer / Resumir ----
update public.chapitres c set
  titre = 'L9 — Résumer / Resumir',
  description = 'Intercambio de información · conectores de resumen',
  resume = $md$*Competencia: Intercambio de información — Expresión oral*
*Apoyo: «Las becas Erasmus», Más Allá, Terminale*

## Acto de habla: resumir

Un joven que obtuvo una **beca Erasmus** para ir a estudiar a **Bélgica** cuenta la despedida de su familia, el viaje y sus **sentimientos contradictorios**: por una parte, la **alegría** de ganar independencia; por otra, el **miedo** a la soledad y a no saber adaptarse. **Resumir** = reducir un texto o unos hechos a lo esencial.

## Vocabulario clave

- **resumir** : résumer (*reducir, decir lo esencial*) ; **un resumen** : un résumé ;
- **una beca** : une bourse ;
- **Erasmus** : programa de intercambio de estudiantes entre universidades europeas.

## Gramática: conectores para resumir

Un resumen se introduce con expresiones como:

**en resumen, en resumidas cuentas, en pocas palabras, para resumir, en suma, en definitiva, a fin de cuentas, globalmente, por fin, por tanto.**

> *Tenía miedo a la soledad, a no adaptarme, a no ser aceptado, **en definitiva**, a no saber empezar desde cero.*
> ***A fin de cuentas**, si nos esforzamos, aprobaremos el examen.*

---

### 📌 Lo esencial

- **Resumir** = decir lo **esencial** en pocas palabras ;
- Conectores: **en resumen, en pocas palabras, en suma, en definitiva, a fin de cuentas, para resumir** ;
- Vocabulario clave: **beca**, **Erasmus** (intercambio universitario europeo).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 9;

-- ---- L10 — Rappeler une information / Recordar ----
update public.chapitres c set
  titre = 'L10 — Rappeler une information / Recordar',
  description = 'Intercambio de información · recordar / acordarse de',
  resume = $md$*Competencia: Intercambio de información — Expresión oral*
*Apoyo: «Ataques en París», Más Allá, Terminale*

## Acto de habla: recordar (rappeler une información)

El texto recuerda los **atentados terroristas de París** (durante un partido Francia-Alemania). Lo que sucedió aquel día le **recordó** a **Farid** la **guerra civil** que vivió con su familia en **Argelia** (reconoció el sonido de la bomba por estar acostumbrado a ellos).

## Vocabulario clave

- **recordar (o→ue)** : se rappeler / rappeler (*tener en la mente*) ;
- **ocurrir = suceder, acontecer, producirse, tener lugar** : se produire ;
- **la matanza = el asesinato** : le massacre / le meurtre.

## Gramática: *recordar* vs *acordarse de*

Los dos significan lo mismo (evocar algo de la memoria), pero se construyen de forma **diferente**:

- **recordar** = verbo **transitivo** → complemento directo (sin preposición): *Farid **recordó** su vida en Argelia.* / *La agenda **recuerda** las obligaciones.* ;
- **acordarse** = verbo **pronominal**, va seguido de **de**: *Me **acuerdo de** los atentados.*

También: **no olvidarse (de)** : *No te **olvides de** repasar.*

---

### 📌 Lo esencial

- **Recordar** algo (transitivo, C.O.D.) vs **acordarse de** algo (pronominal + *de*) ;
- Sinónimos de *ocurrir*: **suceder, acontecer, producirse, tener lugar** ;
- Otra fórmula: **tener en la mente**, **no olvidarse de**.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 10;

-- ---- L11 — Exprimer une opinion ----
update public.chapitres c set
  titre = 'L11 — Exprimer une opinion',
  description = 'Expresión de opinión · fórmulas de opinión',
  resume = $md$*Competencia: Expresión de opinión — Comprensión escrita*
*Apoyo: «Para poner fin a los efectos de los cambios en el clima», Más Allá, Terminale*

## Acto de habla: expresar una opinión

Unos **expertos** opinan que los efectos del **cambio climático** se están acelerando más rápido de lo previsto y que el planeta afronta una **emergencia climática**. Proponen: **multas elevadas** a las empresas de combustibles fósiles, promoción de las **energías renovables**, **repoblación forestal** (bosques y manglares), cambio de dieta (más vegetal) y **sensibilización** de ciudadanos y dirigentes.

## Vocabulario clave

- **la opinión = el juicio, el punto de vista** : l'opinion ;
- **el cambio climático** : le changement climatique ;
- **el investigador / la investigación** : le chercheur / la recherche.

## Gramática: expresar la opinión

Fórmulas para formular una opinión:

**considerar que, (a mí) me parece que, creer que, opinar que, pensar que, según mi modo de ver, a mi juicio, en mi opinión, según yo, a mi entender, a mi parecer.**

> ***Considero que** es necesario reducir el desperdicio de alimentos.*
> ***A mi parecer**, era necesario tomar en serio la protección del medio ambiente.*

*(Nota: con opinión afirmativa → indicativo; con opinión negada «no creo que…» → subjuntivo.)*

---

### 📌 Lo esencial

- **Expresar opinión**: *creo que, opino que, me parece que, a mi juicio, en mi opinión, a mi parecer, considero que* ;
- Tema: el **cambio climático** y sus soluciones (energías renovables, reforestación, sensibilización) ;
- Vocabulario: **cambio climático, investigador, energías renovables**.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 11;

-- ---- L12 — Exprimer la capacité / l'incapacité ----
update public.chapitres c set
  titre = 'L12 — Exprimer la capacité / l''incapacité',
  description = 'Expresión de opinión · ser capaz de / incapaz de',
  resume = $md$*Competencia: Expresión de opinión — Comprensión escrita*
*Apoyo: «Cuba busca aliviar su crisis económica», Más Allá, Terminale*

## Acto de habla: expresar la capacidad / la incapacidad

Las autoridades **cubanas** toman medidas para **aliviar la crisis económica**: frenar el **mercado paralelo** y la **fuga de divisas**, permitir a los cubanos comprar electrodomésticos a precios de mercado, reparar el envejecido parque móvil… El Estado afirma así su **capacidad para reducir el empobrecimiento**.

## Vocabulario clave

- **ser capaz / incapaz de** : être capable / incapable de ;
- **aliviar = reducir, atenuar, disminuir** : soulager ;
- **una divisa** : une devise (monnaie).

## Gramática: capacidad e incapacidad

**Capacidad** (con o sin preposición):
- **ser capaz de**, **tener capacidad para**, **ser competente para**, **ser eficaz para** + infinitivo ;
- **ser posible / hacer posible algo**, **permitir algo**, **permitir a alguien hacer algo**.

> *El Estado **es capaz de** reducir la pobreza.* / *El programa va a **permitir a** la población adquirir los productos.*

**Incapacidad** (fórmulas negativas): **ser incapaz de, ser inapto para, estar descalificado para, ser ineficaz para, resultar imposible.**

> *El ciudadano **es incapaz de** hacer frente al aumento de los precios.*

---

### 📌 Lo esencial

- **Capacidad**: *ser capaz de, tener capacidad para, ser competente/eficaz para, permitir (a alguien) + inf.* ;
- **Incapacidad**: *ser incapaz de, ser inapto para, resultar imposible* ;
- Tema: medidas de **Cuba** contra la crisis económica.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 12;

-- ---- L13 — Exprimer l'approbation ----
update public.chapitres c set
  titre = 'L13 — Exprimer l''approbation',
  description = 'Expresión de opinión · estar de acuerdo, aprobar',
  resume = $md$*Competencia: Expresión de opinión — Comprensión escrita*
*Apoyo: «Igualdad de género, ¿todavía un largo camino por recorrer?», Más Allá, Terminale*

## Acto de habla: expresar la aprobación

El texto trata de las acciones a favor de la mujer **chilena** en el marco de la **igualdad de género**: la igualdad va siendo una realidad gracias a la creación de un **Ministerio de la Mujer y de la Equidad de Género**, a **leyes** contra las discriminaciones y a diversas estructuras para otorgar a la mujer su **dignidad y emancipación**.

## Vocabulario clave

- **aprobar (o→ue) = aceptar, admitir, consentir** : approuver ;
- **la emancipación = independencia** : l'émancipation ;
- **la igualdad de género** : l'égalité des sexes.

## Gramática: expresar la aprobación

Para **aprobar** una idea, se usan (en frases declarativas):

**aprobar, estar de acuerdo (con), estar a favor (de), compartir, conformarse con, apoyar, soportar, admitir, aceptar.**

> ***Estoy de acuerdo** contigo.* / ***Estoy a favor** del programa.* / ***Comparto** tu opinión.* / ***Me conformo con** la propuesta.*

---

### 📌 Lo esencial

- **Aprobar**: *estar de acuerdo con, estar a favor de, compartir, conformarse con, apoyar, admitir* ;
- Tema: la **igualdad de género** (Chile: Ministerio de la Mujer, leyes) ;
- Vocabulario: **aprobar, emancipación, igualdad de género**.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 13;

-- ---- L14 — Exprimer la désapprobation ----
update public.chapitres c set
  titre = 'L14 — Exprimer la désapprobation',
  description = 'Expresión de opinión · no creer que + subjuntivo',
  resume = $md$*Competencia: Expresión de opinión — Comprensión escrita*
*Apoyo: «Ola de xenofobia en Perú», Más Allá, Terminale*

## Acto de habla: expresar la desaprobación

Los ciudadanos **venezolanos** en **Perú** sufren actos de **xenofobia** por parte de algunos peruanos (los acusan de delincuencia, de quitarles el trabajo, y cometen agresiones). El gobierno venezolano manifiesta su **desaprobación** y acusa al gobierno peruano de favorecerla; el gobierno peruano **rechaza** la acusación.

## Vocabulario clave

- **desaprobar (o→ue) = estar en contra, rechazar** : désapprouver ;
- **la xenofobia** : la xénophobie (odio hacia los extranjeros).

## Gramática: expresar la desaprobación

Se usan los verbos de opinión (**creer, pensar, opinar**) en su **forma negativa**, que exigen el **subjuntivo** en la subordinada:

> ***No creo que** la guerra **sirva** para algo.*
> ***No pienso que** el gobierno **sea** responsable.*
> ***No opino que** este chico **sea** tan inteligente como su hermano.*

Otras fórmulas: **desaprobar, ir en contra (de), rechazar, rehusar, no estar de acuerdo (con), no compartir.**

---

### 📌 Lo esencial

- **Desaprobar**: *no creo/pienso/opino que + **subjuntivo***, *desaprobar, ir en contra de, rechazar, no estar de acuerdo* ;
- ⚠️ Verbo de opinión **negado** → **subjuntivo** ;
- Tema: la **xenofobia** (venezolanos en Perú).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 14;

-- ---- L15 — Convaincre ----
update public.chapitres c set
  titre = 'L15 — Convaincre',
  description = 'Expresión de opinión · oración concesiva',
  resume = $md$*Competencia: Expresión de opinión — Comprensión escrita*
*Apoyo: «Medidas contra empleados públicos», Más Allá, Terminale*

## Acto de habla: convencer

La Corte Constitucional y el Colegio de Abogados **colombianos** adoptaron **leyes** contra los trabajadores que se presenten al trabajo en estado de **embriaguez**; la petición de un **demandante** de revisarlas fue **rechazada**. El objetivo es obligar a los empleados públicos a un alto nivel de moral y de rendimiento.

## Vocabulario clave

- **convencer = persuadir** : convaincre ;
- **la embriaguez** : l'ivresse ;
- **el demandante** : le plaignant ; **derogar** : abroger.

## Expresiones para convencer

**lo mejor será…, sería interesante/importante…, pienso que deberías…, fíjate que…, convéncete de que…, estoy convencido/a de que…, hay que…**

## Gramática: la oración concesiva

Expresa una objeción que **no impide** la acción. Conectores: **aunque, a pesar de (que), pese a, por mucho/más/muy que, aun, aun cuando, si bien.** Admiten **indicativo** (hecho real) o **subjuntivo** (hecho hipotético):

> ***Aunque es** un trabajo bien pagado, no lo aceptaré.* (real → indicativo)
> ***Aunque insistas** tú, no iré.* (hipotético → subjuntivo)
> *Saldremos, **aun cuando haga** mal tiempo.*

---

### 📌 Lo esencial

- **Convencer**: *lo mejor será, sería importante, fíjate que, estoy convencido de que* ;
- **Oración concesiva**: *aunque, a pesar de que, por más que, aun cuando* + **indicativo** (real) o **subjuntivo** (hipotético).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 15;

-- ---- L16 — Exprimer l'indignation ----
update public.chapitres c set
  titre = 'L16 — Exprimer l''indignation',
  description = 'Estados de ánimo · subjuntivo de indignación',
  resume = $md$*Competencia: Expresión de los estados de ánimo — Expresión escrita*
*Apoyo: «El matrimonio infantil», Más Allá, Terminale*

## Acto de habla: expresar la indignación

A partir del caso de **Fátima**, una joven de 14 años que **muere a consecuencia de un parto**, **UNICEF** denuncia el **matrimonio infantil** mediante un vídeo. Es una práctica que **escandaliza** por contradecir las leyes que protegen a las niñas. UNICEF propone adoptar leyes protectoras y castigar a los autores.

## Vocabulario clave

- **indignarse** : s'indigner (→ *la indignación*) ;
- **irritar** : irriter (→ *la irritación*) ;
- **escandalizar, horrorizar, dar rabia/asco** : scandaliser, horrifier.

## Gramática: subjuntivo con las expresiones de indignación

Las expresiones de indignación **siempre exigen el subjuntivo** en la subordinada (con *que*):

> ***Es un escándalo que ocurra** hoy día.*
> ***No es posible que se siga** practicando la mutilación.*
> ***No me parece normal que** los agricultores **ganen** menos.*
> ***Me da rabia que** los habitantes **descuiden** las medidas.*

Fórmulas: **es un escándalo que, no es posible que, me parece inadmisible/injusto que, no se puede tolerar que, es indignante que, me horroriza que, me da rabia que.**

---

### 📌 Lo esencial

- **Indignación** + *que* → **subjuntivo** ;
- Fórmulas: *es un escándalo que, no es posible que, me parece inadmisible/injusto que, no se puede tolerar que* ;
- Tema: el **matrimonio infantil** (denuncia de UNICEF).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 16;

-- ---- L17 — Exprimer la gratitude / le vœu ----
update public.chapitres c set
  titre = 'L17 — Exprimer la gratitude / le vœu',
  description = 'Estados de ánimo · gratitud y deseo',
  resume = $md$*Competencia: Expresión de los estados de ánimo — Expresión escrita*
*Apoyo: «Una carta de amor en Navidad», Más Allá, Terminale*

## Acto de habla: expresar la gratitud y el deseo

En una carta navideña, **Katia** expresa a su amor su **gratitud** y sus **deseos** con sentimientos **genuinos** (amor puro y sincero).

## Vocabulario clave

- **la gratitud / el agradecimiento / el reconocimiento** : la gratitude ;
- **genuino** : authentique, sincère ; **dar las gracias** : remercier.

## Gramática 1: expresar la gratitud

Se emplea **estar + agradecido/a** (o *ser reconocido/a*):
- el motivo de la gratitud → complemento con **por**: *Estoy agradecido **por** tu ayuda.* ;
- la persona a quien se agradece → complemento con **con**: *Estaba agradecido **con** su padre.*

## Gramática 2: expresar el deseo

Con un verbo de deseo (**querer, desear, esperar, preferir, tener ganas de**):
- si el **sujeto es diferente** → subordinada en **subjuntivo** (+ *que*): *Deseo **que** te **quedes** a mi lado.* ;
- si el **sujeto es el mismo** → **infinitivo**: *Deseo **terminar** el trabajo.* / *Carmen desea **cantar**.*

---

### 📌 Lo esencial

- **Gratitud**: *estar agradecido/a* **por** algo, **con** alguien ; *dar las gracias, ser reconocido/a* ;
- **Deseo**: *desear/querer/esperar* **que + subjuntivo** (sujetos distintos) o **+ infinitivo** (mismo sujeto).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 17;

-- ---- L18 — Exprimer la joie ----
update public.chapitres c set
  titre = 'L18 — Exprimer la joie',
  description = 'Estados de ánimo · disfrutar, alegría',
  resume = $md$*Competencia: Expresión de los estados de ánimo — Expresión escrita*
*Apoyo: «Fin de año en Sudáfrica», Más Allá, Terminale*

## Acto de habla: expresar la alegría

El texto trata de las distintas **celebraciones de fin de año** y sus particularidades en **Sudáfrica** (Ciudad del Cabo, Johannesburgo, Hillsboro donde se aplica «**borrón y cuenta nueva**», deshaciéndose de los trastos viejos). Sentimiento dominante: la **alegría**.

## Vocabulario clave

- **la alegría** : la joie ;
- **ameno/a** : agréable, plaisant ;
- **disfrutar** : profiter / prendre du plaisir.

## Expresiones de alegría

**estar contento/a, estar alegre, alegrarse (de), entusiasmarse (con/por), estar a gusto, estar a mis anchas, ¡qué rico!** ; *A los alumnos les **alegra** la noticia.*

## Gramática: el verbo *disfrutar*

**Disfrutar** = sentir placer. Se construye con:
- **de / con** + complemento (la causa del placer): *Los alumnos **disfrutan del** recreo.* / *Disfruto **con** la ayuda de mis colegas.* ;
- **gerundio**: *Estos chicos **disfrutan bailando** música cubana.*

---

### 📌 Lo esencial

- **Alegría**: *estar contento/alegre, alegrarse de, entusiasmarse con, estar a gusto* ;
- **Disfrutar de/con** algo o **disfrutar + gerundio** = prendre plaisir à ;
- Vocabulario: **alegría, ameno, disfrutar**.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 18;

-- ---- L19 — Exprimer la peine ----
update public.chapitres c set
  titre = 'L19 — Exprimer la peine',
  description = 'Estados de ánimo · expresiones de pena',
  resume = $md$*Competencia: Expresión de los estados de ánimo — Expresión escrita*
*Apoyo: «Contra el trabajo infantil», Más Allá, Terminale*

## Acto de habla: expresar la pena (la peine)

El texto **denuncia la explotación laboral de los niños** en todos los sectores, con motivo del **Día Mundial contra el Trabajo Infantil**. Miles de niños no tendrán porvenir por sufrir esta realidad cruel.

## Vocabulario clave

- **apenar** : peiner, attrister ; **la pena / la lástima** : la peine ;
- **la esclavitud** : l'esclavage ;
- **estar horrorizado/a, estar afligido/a** : être horrifié / affligé.

## Gramática: las expresiones de pena

- con **que** → subordinada en **subjuntivo**: *Es una pena **que** la explotación **siga** practicándose.* / *Me parece terrible **que** se **estén** utilizando niños.* ;
- sin **que** → **infinitivo**: *Es horrible **ver**le sufrir.* / *Es escandaloso **oír** a personas defender tales prácticas.*

Fórmulas: **es una pena/lástima que, me parece terrible/horrible que, es escandaloso que, lamento que, está muy mal que, ¡qué pena que…!, ser insoportable.**

---

### 📌 Lo esencial

- **Pena** + *que* → **subjuntivo** ; sin *que* → **infinitivo** ;
- Fórmulas: *es una pena/lástima que, me parece horrible que, lamento que, ¡qué pena!* ;
- Tema: el **trabajo infantil** / la explotación de los niños.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 19;

-- ---- L20 — Exprimer l'espoir ----
update public.chapitres c set
  titre = 'L20 — Exprimer l''espoir',
  description = 'Estados de ánimo · esperanza, acabar con, ¡ojalá!',
  resume = $md$*Competencia: Expresión de los estados de ánimo — Expresión escrita*
*Apoyo: «Batalla contra el paludismo», Más Allá, Terminale*

## Acto de habla: expresar la esperanza

El texto evoca las medidas del gobierno **ecuatoguineano** contra el **paludismo (malaria)**: reparto de **mosquiteras** a niños y embarazadas, **rociamiento** de las viviendas con insecticidas. En **Bioko** se logró el control de la enfermedad antes del plazo previsto → **esperanza**.

## Vocabulario clave

- **la esperanza** : l'espoir ;
- **una mosquitera** : une moustiquaire ;
- **el rociamiento / rociar** : la pulvérisation / pulvériser.

## Gramática: *acabar con* y expresiones de esperanza

- **acabar con** = terminar/destruir algo: *Para **acabar con** la enfermedad, el gobierno toma medidas.* ;
- verbos de esperanza: **esperanzar(se), tener esperanza en, tener fe, creer en, ilusionar(se)** ;
- **¡Ojalá + subjuntivo!** (deseo/esperanza): *¡**Ojalá se acabe** con la enfermedad!*

---

### 📌 Lo esencial

- **Esperanza**: *esperanzar(se), tener fe/esperanza en, creer en, ilusionarse, ¡ojalá + subjuntivo!* ;
- **acabar con** algo = en finir avec / éradiquer ;
- Tema: la lucha contra el **paludismo** en Guinea Ecuatorial (mosquiteras, rociamiento).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 20;

-- ---- L21 — Donner des consignes ----
update public.chapitres c set
  titre = 'L21 — Donner des consignes',
  description = 'Expresión de la orden · imperativo',
  resume = $md$*Competencia: Expresión de la orden — Expresión escrita*
*Apoyo: «Lázaro cuenta que vivió con un clérigo» (Lazarillo de Tormes), Más Allá, Terminale*

## Acto de habla: dar consignas

El texto (del *Lazarillo de Tormes*) evoca la **vida hambrienta** de **Lázaro** como criado de un **clérigo tacaño** que solo se preocupaba por sí mismo mientras hacía padecer hambre a su criado.

## Vocabulario clave

- **dar consignas / dar recomendaciones** : donner des consignes ;
- **un clérigo** : un clerc / homme d'Église ;
- **el criado / la criada** : le/la domestique.

## Gramática: el imperativo para dar consignas

Para expresar un mandato o dar consignas se usa el **imperativo**:

> ***Toma**, come, triunfa.* / ***Tráemela** pronto.*

**Imperativo afirmativo (vosotros)** = infinitivo con **-d**: *trabaja**d**, cocina**d**, lee**d**, corre**d**, veni**d**, escucha**d**, segui**d***.

> *Trabajad mucho. Después cocinad la cena. Llevad el perro al parque. Leed un libro.*

---

### 📌 Lo esencial

- **Dar consignas** = **imperativo** ;
- Imperativo **vosotros** afirmativo = infinitivo → **-d** (*escuchad, aprended, pedid*) ;
- Texto clave: el *Lazarillo de Tormes* (Lázaro y el clérigo).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 21;

-- ---- L22 — Donner des conseils ----
update public.chapitres c set
  titre = 'L22 — Donner des conseils',
  description = 'Expresión de la orden · imperativo y obligación',
  resume = $md$*Competencia: Expresión de la orden — Expresión escrita*
*Apoyo: «15 consejos para ser feliz», Más Allá, Terminale*

## Acto de habla: dar consejos

El texto presenta la **felicidad** como un **ritual** que el ser humano ha de aplicar (rodearse de sus seres queridos, comer sano y variado, crear hábitos saludables…).

## Vocabulario clave

- **aconsejar** : conseiller (→ *el consejo*) ;
- **la felicidad** : le bonheur ; **advertir** : avertir.

## Gramática: expresar el consejo

Para dar un consejo se usa el **imperativo** o la **obligación** (personal o impersonal):

- **imperativo**: *Rodéate de tus seres queridos.* / *Crea hábitos saludables.* ;
- **obligación personal**: **tener que** / **haber de** + infinitivo — *Tenemos que ser realistas.* / *Hemos de conformarnos.* ;
- **obligación impersonal**: **hay que**, **es necesario/preciso que**, **hace falta que**, **es menester que** — *Hay que trabajar en clase.* / *Es menester que levantéis la mano.*

---

### 📌 Lo esencial

- **Aconsejar**: **imperativo** (*crea, cuida, asegúrate*) o **obligación** ;
- Obligación **personal** (*tener que / haber de + inf.*) vs **impersonal** (*hay que, es necesario que + subjuntivo*) ;
- Tema: los **consejos para ser feliz**.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 22;

-- ---- L23 — Faire des suggestions ----
update public.chapitres c set
  titre = 'L23 — Faire des suggestions',
  description = 'Expresión de la orden · sugerir/proponer que + subjuntivo',
  resume = $md$*Competencia: Expresión de la orden — Expresión escrita*
*Apoyo: «Enfrentar las redes de contrabando», Más Allá, Terminale*

## Acto de habla: hacer sugerencias

El texto trata de la necesidad de una **acción común** entre **Estados Unidos, México y los países centroamericanos** para luchar contra las **olas migratorias**. Se sugiere a los gobiernos que **compartan información e inteligencia** sobre las **redes de contrabando**.

## Vocabulario clave

- **sugerir (e→ie)** : suggérer ; **proponer** : proposer ;
- **el contrabando** : la contrebande.

## Gramática: expresar sugerencias

- **sugerir / proponer + que + subjuntivo**: *Sugiero **que** los jóvenes **se queden** en su país.* ;
- **sugerir / proponer + infinitivo** (mismo sujeto o impersonal): *Te propongo **hacer** este trabajo juntos.* ;
- **ser conveniente / esencial / convenir + infinitivo**: *Será esencial **encontrar** maneras de impedirlo.* ;
- el **imperativo**: *Ve al hospital.* ;
- la **obligación** (personal/impersonal): *Hace falta **involucrar** a los gobiernos.* / *Es menester **que se involucre** a los gobiernos.*

---

### 📌 Lo esencial

- **Sugerencia**: *sugerir/proponer* **que + subjuntivo** o **+ infinitivo** ; *ser conveniente/esencial + inf.* ; imperativo ; obligación ;
- Tema: cooperación **regional** contra las **redes de contrabando** de migrantes.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 23;

-- ---- L24 — Faire une demande ----
update public.chapitres c set
  titre = 'L24 — Faire une demande',
  description = 'Expresión de la orden · pedir/rogar/instar que + subjuntivo',
  resume = $md$*Competencia: Expresión de la orden — Expresión escrita*
*Apoyo: «Propuestas de la resolución del Parlamento Europeo», Más Allá, Terminale*

## Acto de habla: hacer una solicitud (une demande)

El **Parlamento Europeo** insta a la **Unión Europea** y a **China** a **intensificar y diversificar** su cooperación con **África**: apoyar el desarrollo, promover la transformación de los productos básicos africanos, reducir los aranceles y abordar juntos los problemas **medioambientales**.

## Vocabulario clave

- **solicitar** : demander/solliciter (→ *la solicitación / la solicitud*) ;
- **instar** : exhorter (→ *la instancia*) ;
- **rogar (o→ue)** : prier (→ *el ruego*) ; **suplicar** : supplier.

## Gramática: expresar una solicitud

**pedir / rogar / instar / suplicar / recomendar + que + subjuntivo**:

> *El director **pide que** todos **lleven** mascarilla.*
> *El gobierno **ruega a** la población **que respete** las medidas.*
> *La policía **insta a** los jóvenes **a que no consuman** estupefacientes.*
> *Te **suplico que llegues** pronto.*

*(Útil para redactar una carta de solicitud formal: asunto, fórmula de cortesía, «le rogamos que…», «saluda atentamente».)*

---

### 📌 Lo esencial

- **Solicitar**: *pedir / rogar / instar / suplicar* **que + subjuntivo** ;
- Registro **formal** (carta): *le solicitamos/rogamos que…, atentamente* ;
- Tema: petición del **Parlamento Europeo** (cooperación UE-China-África).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 24;

-- ---- L25 — Dissuader ----
update public.chapitres c set
  titre = 'L25 — Dissuader',
  description = 'Expresión de la orden · imperativo negativo, desaconsejar',
  resume = $md$*Competencia: Expresión de la orden — Expresión escrita*
*Apoyo: «Evitar el contagio de Ébola», Más Allá, Terminale*

## Acto de habla: disuadir

El texto enseña las **vías de contagio del Ébola** y las medidas para **evitarlo** (avisa a la gente mostrando la peligrosidad de la enfermedad y disuadiéndola de ciertas prácticas).

## Vocabulario clave

- **disuadir** : dissuader ; **desaconsejar** : déconseiller ;
- **el contagio** : la contagion.

## Gramática: expresar la disuasión

- el **imperativo negativo**: *No **tengas** relaciones con personas que no conoces.* / *No **salgáis** sin mascarilla.* (⚠️ imperativo negativo = **subjuntivo**) ;
- **desaconsejar + que + subjuntivo**: *Te **desaconsejo que hagas** trampas.* / *Os **desaconsejo que salgáis** sin mascarilla.* ;
- **disuadir (a alguien) de + infinitivo**: *La OMS **disuade** a la población **de** practicar la automedicación.*

---

### 📌 Lo esencial

- **Disuadir**: **imperativo negativo** (*no hagas, no salgáis*) o **desaconsejar que + subjuntivo** ; *disuadir de + infinitivo* ;
- ⚠️ El **imperativo negativo** se forma con el **presente de subjuntivo** ;
- Tema: prevención del contagio (**Ébola**, tabaco…).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 25;

-- ---- L26 — Réaliser une conversation ----
update public.chapitres c set
  titre = 'L26 — Réaliser une conversation',
  description = 'Técnica de expresión · marcadores de conversación',
  resume = $md$*Competencia: Técnica de expresión oral o escrita*
*Apoyo: «Las mil historias de Antón el Cojo», Más Allá, Terminale*

## Técnica: realizar una conversación

Una **conversación** es un diálogo entre dos o más personas. En el texto, **Antón el Cojo** narra a una pandilla de chicos cómo perdió la pierna; los interlocutores lo estimulan con marcadores de inicio («cuenta, cuenta»).

## Vocabulario clave

- **una conversación / platicar** : une conversation / bavarder, converser ;
- **el interlocutor** : l'interlocuteur.

## Gramática: marcadores para llamar la atención

- **para iniciar / mantener** la conversación: **cuenta, dime, mira, oye, a ver, bueno** ;
- **para cerrar** la conversación: **basta, vale, ya está**.

> *Dime, chico, ¿cómo te ha pasado el fin de semana?*
> *Basta, basta; pasemos a otro asunto.*

---

### 📌 Lo esencial

- **Conversación** = platicar (diálogo) ;
- Marcadores de **inicio**: *cuenta, dime, mira, oye, a ver, bueno* ; de **cierre**: *basta, vale, ya está* ;
- Alternancia de turnos entre **interlocutores**.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 26;

-- ---- L27 — Réaliser une interview ----
update public.chapitres c set
  titre = 'L27 — Réaliser une interview',
  description = 'Técnica de expresión · técnica interrogativa',
  resume = $md$*Competencia: Técnica de expresión oral o escrita*
*Apoyo: «Programa Intercultura», Más Allá, Terminale*

## Técnica: realizar una interviú (entrevista)

**Intercultura** es una asociación de voluntarios que promueve el **intercambio cultural** entre jóvenes (de 15 a 18 años) de diversos horizontes, mediante la educación y la convivencia. Sus objetivos: que los participantes comprendan mejor su propia cultura y la de los demás, aprendan a relacionarse en distintos entornos y alcancen su desarrollo personal.

## Vocabulario clave

- **una interviú / una entrevista** : une interview ;
- **un chaval** : un(e) gamin(e), un(e) jeune ;
- **un estereotipo / un prejuicio** : un stéréotype / un préjugé.

## Gramática: la técnica interrogativa

Dos maneras de preguntar en una entrevista:

- **interrogación directa** (enunciado interrogativo, con pronombres interrogativos): *¿**Qué** es la xenofobia?* ;
- **interrogación indirecta** (enunciado afirmativo con tono interrogativo): *¿Intercultura **pretende que** los participantes **tengan** una mejor comprensión?*

Estructura de la entrevista: **presentación → preguntas (directas/indirectas) → cierre y agradecimiento**.

---

### 📌 Lo esencial

- **Entrevista** = intercambio periodista/entrevistado con preguntas **directas** e **indirectas** ;
- Vocabulario: *interviú, chaval, estereotipo* ;
- Tema del texto: el **intercambio intercultural** entre jóvenes.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 27;

-- ---- L28 — Faire un exposé / Ponencia ----
update public.chapitres c set
  titre = 'L28 — Faire un exposé / Ponencia',
  description = 'Técnica de expresión · estructura de la ponencia',
  resume = $md$*Competencia: Técnica de expresión oral o escrita*
*Apoyo: «Todos tras los objetivos de desarrollo sostenible», Más Allá, Terminale*

## Técnica: hacer una ponencia (un exposé)

**Claudia Maciel**, consejera de la cancillería de **Brasil**, informa que Brasil propone planes de **desarrollo socioeconómico sostenible** compatibles con los **Objetivos de Desarrollo del Milenio** de la ONU, integrando temas como los **refugiados** y los **desastres climáticos**. Concluye que las propuestas son aún generales y deben profundizarse.

## Vocabulario clave

- **una ponencia / exponer** : un exposé / exposer ;
- **sostenible** : durable.

## Estructura de una ponencia

Los **elementos** de una ponencia son:

1. **el tema** ;
2. **el título** ;
3. **la idea central** ;
4. **el supuesto** (las ideas desarrolladas) ;
5. **el objetivo** (lo que se quiere alcanzar) ;
6. **la conclusión** (lo que se resume).

Fórmulas para exponer: *Señoras y señores, su atención por favor…* ; *Miren, las cifras indican que…*

---

### 📌 Lo esencial

- **Ponencia** = exposición estructurada: **tema → título → idea central → supuesto → objetivo → conclusión** ;
- Tema: los **objetivos de desarrollo sostenible** (Brasil / ONU) ;
- Vocabulario: *ponencia, exponer, sostenible*.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 28;

-- ---- L29 — Présenter un thème ----
update public.chapitres c set
  titre = 'L29 — Présenter un thème',
  description = 'Técnica de expresión · actitudes para presentar un tema',
  resume = $md$*Competencia: Técnica de expresión oral o escrita*
*Apoyo: «Elecciones 2019», Más Allá, Terminale*

## Técnica: presentar un tema

El texto es un **debate** entre los **portavoces** de siete grupos parlamentarios durante las **elecciones generales de 2019 en España** (los bloques: PSOE, PP, Ciudadanos, Unidas Podemos, Vox, ERC, PNV). Presentar un tema exige dominar el asunto y usar el léxico adecuado.

## Vocabulario clave

- **un asunto / un tema** : un sujet ;
- **el/la ponente = el/la conferenciante** : l'orateur / le conférencier ;
- **una charla** : une causerie / un exposé.

## Gramática: actitudes para presentar un tema

Las **actitudes** (cualidades) para presentar bien un tema son:

- el **dominio del tema** ;
- la **pronunciación** y la **acentuación** ;
- la **claridad** ;
- el **uso correcto del vocabulario** (léxico específico del tema) ;
- la **expresividad**.

Además, hay que **identificar el tema** de un texto y el **vocabulario** relacionado con él.

---

### 📌 Lo esencial

- **Presentar un tema**: dominio del tema + **pronunciación/acentuación** + **claridad** + léxico adecuado + **expresividad** ;
- Saber **identificar el tema** de un texto y su vocabulario ;
- Tema del apoyo: el **panorama político español** (elecciones 2019).$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 29;

-- ---- L30 — Commenter une image ----
update public.chapitres c set
  titre = 'L30 — Commenter une image',
  description = 'Técnica de expresión · situar y describir una imagen',
  resume = $md$*Competencia: Técnica de expresión oral o escrita*
*Apoyo: «La salubridad», Más Allá, Terminale (y «Guernica», Picasso)*

## Técnica: comentar una imagen

El apoyo presenta dos fotos sobre la **salubridad urbana**: en la primera, un **amontonamiento de basuras** al pie de un contenedor lleno (dos hombres se tapan la nariz por el olor); en la segunda, un **espacio limpio** con dos contenedores cerrados → buena gestión de la basura. (La lección se apoya también en el cuadro **Guernica** de **Picasso**.)

## Vocabulario clave

- **la basura** : les ordures ; **un contenedor** : un conteneur/une poubelle.

## Gramática: expresiones para comentar una imagen

**Situar los elementos**: *en primer plano, en segundo plano, a la derecha, a la izquierda, al fondo, en el centro, cerca de, al lado de, detrás de.*

**Introducir la descripción**: *en esta imagen vemos…, podemos ver…, veo…*

**Precisar**: la **naturaleza** (una foto, un dibujo, un cuadro, una historieta/cómic), la **forma**, los **colores**, el **autor** y la **fuente**. Terminar con una **interpretación / mensaje**.

---

### 📌 Lo esencial

- **Comentar una imagen** = **situar** (primer/segundo plano, derecha/izquierda, al fondo…) → **describir** (*vemos, podemos ver*) → **interpretar** ;
- Precisar la **naturaleza** (foto, dibujo, cuadro, cómic), colores, autor, fuente ;
- Tema del apoyo: la **salubridad** / la limpieza del entorno.$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = 'espagnol' and n.nom = 'Terminale' and s.nom in ('A')
  and c.ordre = 30;

-- Contrôle : liste des résumés publiés pour la matière
select s.nom as serie, c.ordre, c.titre, length(c.resume) as taille_resume, c.resume_published
from public.chapitres c
join public.matieres m on m.id = c.matiere_id
join public.series s on s.id = c.serie_id
join public.niveaux n on n.id = s.niveau_id
where m.slug = 'espagnol' and n.nom = 'Terminale'
order by s.nom, c.ordre;
