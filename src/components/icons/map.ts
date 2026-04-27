import {
    IconEasy,
    IconGlobe,
    IconTelephone,
    IconMail,
    IconSign,
    IconHome,
    IconButterfly,
} from '@/components/icons';

export const iconMap = {
    easy: IconEasy,
    globe: IconGlobe,
    telephone: IconTelephone,
    mail: IconMail,
    sign: IconSign,
    home: IconHome,
    butterfly: IconButterfly,
} as const;

export type IconName = keyof typeof iconMap;