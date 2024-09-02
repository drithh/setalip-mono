import { Users } from '@repo/shared/db';
import {
  CalendarCheck,
  CalendarClock,
  CreditCard,
  HandHeart,
  LogOut,
  Receipt,
  Sparkles,
  Trophy,
  User2,
} from 'lucide-react';

interface Menu {
  icon: React.ReactNode;
  label: string;
  path: string;
  role?: Users['role'];
}

export const menus: Menu[] = [
  {
    icon: <User2 className="h-5 w-5" />,
    label: 'My Profile',
    path: '/me',
  },
  {
    icon: <Trophy className="h-5 w-5" />,
    label: 'My Statistic',
    path: '/me/statistic',
  },
  {
    icon: <CalendarCheck className="h-5 w-5" />,
    label: 'My Booking',
    path: '/me/booking',
    role: 'user',
  },
  {
    icon: <CreditCard className="h-5 w-5" />,
    label: 'My Credit',
    path: '/me/credit',
    role: 'user',
  },
  {
    icon: <Receipt className="h-5 w-5" />,
    label: 'My Billing',
    path: '/me/package',
    role: 'user',
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    label: 'My Loyalty',
    path: '/me/loyalty',
    role: 'user',
  },
  {
    icon: <CalendarClock className="h-5 w-5" />,
    label: 'My Agenda',
    path: '/me/agenda',
    role: 'coach',
  },
  {
    icon: <LogOut className="h-5 w-5" />,
    label: 'Logout',
    path: '/logout',
  },
];
