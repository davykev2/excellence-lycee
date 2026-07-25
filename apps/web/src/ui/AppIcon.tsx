import {
  BookOpenText,
  CalendarCheck,
  House,
  ChatCircleDots,
  Trophy,
  Sword,
  ShieldCheck,
  Storefront,
  Coins,
  Target,
  UserCircle,
  type IconProps,
} from "@phosphor-icons/react";
import type { IconName } from "../domain/learning";

const icons = {
  home: House,
  paths: BookOpenText,
  arena: Sword,
  store: Storefront,
  ranking: Trophy,
  messages: ChatCircleDots,
  profile: UserCircle,
  admin: ShieldCheck,
  target: Target,
  calendar: CalendarCheck,
  coin: Coins,
};

interface AppIconProps extends IconProps {
  name: IconName;
}

export function AppIcon({ name, ...props }: AppIconProps) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" {...props} />;
}
