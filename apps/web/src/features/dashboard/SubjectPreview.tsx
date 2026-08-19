import type { ReactNode } from "react";
import type { SubjectDefinition } from "../../domain/learning";
import { MathPreviewChart } from "./MathPreviewChart";

interface SubjectPreviewProps {
  subject: SubjectDefinition;
  lessonTitle: string;
}

interface IllustrationProps {
  accent: string;
  accentSoft: string;
}

function PhysicsChemistryIllustration({ accent, accentSoft }: IllustrationProps) {
  return (
    <>
      <ellipse cx="242" cy="168" rx="136" ry="50" fill="none" stroke={accent} strokeWidth="3" />
      <ellipse cx="242" cy="168" rx="136" ry="50" fill="none" stroke={accent} strokeWidth="3" transform="rotate(60 242 168)" />
      <ellipse cx="242" cy="168" rx="136" ry="50" fill="none" stroke={accent} strokeWidth="3" transform="rotate(-60 242 168)" />
      <circle cx="242" cy="168" r="31" fill={accentSoft} stroke={accent} strokeWidth="4" />
      <circle cx="242" cy="168" r="12" fill="#f45d08" />
      <circle cx="378" cy="168" r="10" fill="#42a53c" stroke="#ffffff" strokeWidth="4" />
      <circle cx="173" cy="51" r="10" fill="#f45d08" stroke="#ffffff" strokeWidth="4" />
      <circle cx="309" cy="285" r="10" fill="#42a53c" stroke="#ffffff" strokeWidth="4" />
      <path d="M64 312 C96 278 126 346 158 312 S220 278 252 312 S314 346 346 312 S408 278 438 310" fill="none" stroke="#0b2c67" strokeWidth="5" strokeLinecap="round" />
    </>
  );
}

function SvtIllustration({ accent, accentSoft }: IllustrationProps) {
  return (
    <>
      <path d="M70 179 C70 80 159 40 261 63 C366 86 424 154 397 238 C369 325 258 325 161 291 C102 270 70 228 70 179Z" fill={accentSoft} stroke={accent} strokeWidth="5" />
      <ellipse cx="231" cy="175" rx="65" ry="57" fill="#ffffff" fillOpacity="0.84" stroke={accent} strokeWidth="4" />
      <circle cx="231" cy="175" r="26" fill="#f7d69f" stroke="#f45d08" strokeWidth="4" />
      <path d="M124 132 C150 103 176 103 198 130 C171 151 146 153 124 132Z" fill="#ffffff" stroke="#42a53c" strokeWidth="4" />
      <path d="M292 232 C324 204 354 211 365 244 C336 263 306 260 292 232Z" fill="#ffffff" stroke="#42a53c" strokeWidth="4" />
      <path d="M302 103 C329 90 352 103 354 127 C328 139 307 128 302 103Z" fill="#ffffff" stroke="#0b2c67" strokeWidth="4" />
      <path d="M108 224 C137 198 165 207 174 236 C147 254 119 250 108 224Z" fill="#ffffff" stroke="#f45d08" strokeWidth="4" />
      <path d="M213 151 C254 165 207 186 248 201" fill="none" stroke="#0b2c67" strokeWidth="4" strokeLinecap="round" />
      <path d="M249 151 C208 165 255 186 214 201" fill="none" stroke="#f45d08" strokeWidth="4" strokeLinecap="round" />
    </>
  );
}

function PhilosophyIllustration({ accent, accentSoft }: IllustrationProps) {
  return (
    <>
      <path d="M240 86 L121 191 M240 86 L359 191 M121 191 L240 283 M359 191 L240 283" fill="none" stroke="#ccd4df" strokeWidth="5" strokeLinecap="round" />
      <circle cx="240" cy="86" r="58" fill={accentSoft} stroke={accent} strokeWidth="5" />
      <circle cx="121" cy="191" r="52" fill="#e8f4e5" stroke="#42a53c" strokeWidth="5" />
      <circle cx="359" cy="191" r="52" fill="#fff0e6" stroke="#f45d08" strokeWidth="5" />
      <circle cx="240" cy="283" r="48" fill="#edf3fb" stroke="#0b2c67" strokeWidth="5" />
      <text x="240" y="92" textAnchor="middle" fill="#0b2c67" fontSize="21" fontWeight="800">Question</text>
      <text x="121" y="197" textAnchor="middle" fill="#0b2c67" fontSize="18" fontWeight="800">Idée</text>
      <text x="359" y="197" textAnchor="middle" fill="#0b2c67" fontSize="18" fontWeight="800">Objection</text>
      <text x="240" y="289" textAnchor="middle" fill="#0b2c67" fontSize="18" fontWeight="800">Argument</text>
    </>
  );
}

function HistoryGeographyIllustration({ accent, accentSoft }: IllustrationProps) {
  return (
    <>
      <path d="M116 61 L196 44 L244 72 L312 55 L372 93 L354 151 L389 190 L347 239 L282 223 L239 270 L178 243 L126 259 L91 211 L109 158 L78 113Z" fill={accentSoft} stroke={accent} strokeWidth="5" strokeLinejoin="round" />
      <path d="M143 112 C174 91 206 101 228 124 C250 146 277 143 305 119" fill="none" stroke="#42a53c" strokeWidth="6" strokeLinecap="round" />
      <path d="M143 191 C184 168 214 174 251 194 C278 209 309 206 338 183" fill="none" stroke="#f45d08" strokeWidth="6" strokeLinecap="round" />
      <line x1="72" y1="312" x2="408" y2="312" stroke="#0b2c67" strokeWidth="4" strokeLinecap="round" />
      <circle cx="112" cy="312" r="10" fill="#42a53c" stroke="#ffffff" strokeWidth="4" />
      <circle cx="240" cy="312" r="10" fill={accent} stroke="#ffffff" strokeWidth="4" />
      <circle cx="368" cy="312" r="10" fill="#f45d08" stroke="#ffffff" strokeWidth="4" />
      <text x="112" y="343" textAnchor="middle" fill="#0b2c67" fontSize="15" fontWeight="800">Repérer</text>
      <text x="240" y="343" textAnchor="middle" fill="#0b2c67" fontSize="15" fontWeight="800">Expliquer</text>
      <text x="368" y="343" textAnchor="middle" fill="#0b2c67" fontSize="15" fontWeight="800">Relier</text>
    </>
  );
}

function LanguageIllustration({ accent, accentSoft }: IllustrationProps) {
  return (
    <>
      <path d="M69 91 C129 65 188 76 240 111 V304 C188 271 129 262 69 286Z" fill={accentSoft} stroke={accent} strokeWidth="5" strokeLinejoin="round" />
      <path d="M411 91 C351 65 292 76 240 111 V304 C292 271 351 262 411 286Z" fill="#ffffff" stroke={accent} strokeWidth="5" strokeLinejoin="round" />
      <path d="M240 111 V304" stroke={accent} strokeWidth="5" />
      {[139, 170, 201, 232].map((y) => <line key={`left-${y}`} x1="99" y1={y} x2="204" y2={y} stroke="#0b2c67" strokeWidth="5" strokeLinecap="round" opacity="0.62" />)}
      {[139, 170, 201, 232].map((y) => <line key={`right-${y}`} x1="276" y1={y} x2="381" y2={y} stroke="#0b2c67" strokeWidth="5" strokeLinecap="round" opacity="0.62" />)}
      <path d="M166 53 H314 C329 53 341 65 341 80 V102 H194 L166 124 V53Z" fill="#fff0e6" stroke="#f45d08" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="221" cy="79" r="6" fill="#42a53c" />
      <circle cx="253" cy="79" r="6" fill={accent} />
      <circle cx="285" cy="79" r="6" fill="#f45d08" />
    </>
  );
}

function illustrationForSubject(subject: SubjectDefinition): ReactNode {
  const colors = { accent: subject.theme.accent, accentSoft: subject.theme.accentSoft };

  switch (subject.id) {
    case "physics-chemistry":
      return <PhysicsChemistryIllustration {...colors} />;
    case "svt":
      return <SvtIllustration {...colors} />;
    case "philosophy":
      return <PhilosophyIllustration {...colors} />;
    case "history-geography":
      return <HistoryGeographyIllustration {...colors} />;
    case "french":
    case "english":
      return <LanguageIllustration {...colors} />;
    default:
      return <LanguageIllustration {...colors} />;
  }
}

export function SubjectPreview({ subject, lessonTitle }: SubjectPreviewProps) {
  if (subject.id === "mathematics") return <MathPreviewChart />;

  return (
    <div
      className="math-chart"
      role="img"
      aria-label={`Aperçu de ${subject.label} pour « ${lessonTitle} »`}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 480 360"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ fontFamily: "Nunito Sans, sans-serif" }}
      >
        {illustrationForSubject(subject)}
      </svg>
    </div>
  );
}
