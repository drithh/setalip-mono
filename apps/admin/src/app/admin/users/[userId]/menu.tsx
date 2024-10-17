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
}

export const getMenus = (userId: number): Menu[] => {
  return [
    {
      icon: <User2 className="h-5 w-5" />,
      label: 'Profile',
      path: `/admin/users/${userId}`,
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      label: 'Statistic',
      path: `/admin/users/${userId}/statistic`,
    },
    {
      icon: <CalendarCheck className="h-5 w-5" />,
      label: 'Booking',
      path: `/admin/users/${userId}/booking`,
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      label: 'Credit',
      path: `/admin/users/${userId}/credit`,
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      label: 'Loyalty',
      path: `/admin/users/${userId}/loyalty`,
    },
  ];
};
