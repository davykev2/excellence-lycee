import{gcdExercise as e,proof}from"./terminalCGcdBuilders";
export const gcdSituations=[
e(82,"Les corps célestes","En 2019, un astronome observe le 7décembre le corps céleste A, dont la période est105 jours, puis le 13décembre le corps céleste B, dont la période est81 jours. Il cherche la date de leur prochaine apparition simultanée, le nombre de jours depuis le 7décembre 2019 et le délai minimal jusqu’à la suivante s’il manque cette observation.",[
proof("Proposer une solution justifiée à ces trois préoccupations.",String.raw`**1. Choisir une origine.** Prenons le 7décembre 2019 comme jour0. B est observé6 jours plus tard. Une apparition simultanée au jour $t$ vérifie donc
$$t\equiv0\pmod{105},\qquad t\equiv6\pmod{81}.$$

**2. Résoudre.** Écrivons $t=105u$. Alors $105u\equiv6\pmod{81}$. Le PGCD de105 et81 vaut3 ; on divise **aussi le modulo** par 3 :
$$35u\equiv2\pmod{27},\quad\text{soit }8u\equiv2\pmod{27}.$$
Comme $8\times17=136\equiv1\pmod{27}$, on obtient $u\equiv34\equiv7\pmod{27}$.
$$t=105(7+27k)=735+2835k.$$

**3. Première date.** La plus petite valeur positive est $\boxed{735\text{ jours}}$. Vérification : $735=7\times105$ et $735-6=729=9\times81$.

Du 7décembre 2019 au 7décembre 2020, il y a366 jours, car2020 est bissextile ; jusqu’au 7décembre 2021, encore365 jours, soit731 jours. Il reste4 jours : la date cherchée est donc $\boxed{\text{le 11décembre 2021}}$.

**4. Apparition simultanée suivante.** Les solutions successives sont espacées de $\operatorname{PPCM}(105;81)=2835$ jours, car $105\times81/3=2835$. S’il manque la première, il devra attendre $\boxed{2835\text{ jours}}$ jusqu’à la suivante. Il s’agit de périodes supposées exactes dans le modèle de l’exercice.`)
],true),
];
