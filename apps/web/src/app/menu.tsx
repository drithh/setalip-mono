import { Users } from '@repo/shared/db';
import {
  User2,
  CalendarCheck,
  CreditCard,
  HandHeart,
  Sparkles,
  FileClock,
  LogOut,
  CalendarClock,
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
    icon: <HandHeart className="h-5 w-5" />,
    label: 'My Package',
    path: '/me/package',
    role: 'user',
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    label: 'My Loyalty',
    path: '/me/loyalty',
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
