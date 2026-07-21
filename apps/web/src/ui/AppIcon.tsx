import {
  BookOpenText,
  CalendarCheck,
  House,
  ChatCircleDots,
  Trophy,
  Sword,
  ShieldCheck,
  Target,
  UserCircle,
  type IconProps,
} from "@phosphor-icons/react";
import type { IconName } from "../domain/learning";

const icons = {
  home: House,
  paths: BookOpenText,
  arena: Sword,
  ranking: Trophy,
  messages: ChatCircleDots,
  profile: UserCircle,
  admin: ShieldCheck,
  target: Target,
  calendar: CalendarCheck,
};

interface AppIconProps extends IconProps {
  name: IconName;
}

export function AppIcon({ name, ...props }: AppIconProps) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" {...props} />;
}
