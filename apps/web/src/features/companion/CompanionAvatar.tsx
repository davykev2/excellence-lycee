import davyIdle from "../../assets/davy-idle.webp";
import davyBlink from "../../assets/davy-blink.webp";
import davyWave from "../../assets/davy-wave.webp";
import davyCelebrate from "../../assets/davy-celebrate.webp";

export type CompanionMotion = "idle" | "blink" | "wave" | "celebrate";

interface CompanionAvatarProps {
  motion?: CompanionMotion;
  className?: string;
  label?: string;
  decorative?: boolean;
}

const frames: Array<{ motion: CompanionMotion; src: string }> = [
  { motion: "idle", src: davyIdle },
  { motion: "blink", src: davyBlink },
  { motion: "wave", src: davyWave },
  { motion: "celebrate", src: davyCelebrate },
];

export function CompanionAvatar({
  motion = "idle",
  className = "",
  label = "Davy, le compagnon virtuel d’Excellence Lycée",
  decorative = false,
}: CompanionAvatarProps) {
  return (
    <span
      className={`davy-avatar davy-avatar--${motion} ${className}`.trim()}
      data-motion={motion}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? "true" : undefined}
    >
      {frames.map((frame) => (
        <img
          key={frame.motion}
          className={`davy-avatar-frame davy-avatar-frame--${frame.motion}`}
          src={frame.src}
          alt=""
          aria-hidden="true"
          draggable="false"
        />
      ))}
    </span>
  );
}
