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
      label: 'User Profile',
      path: `/admin/users/${userId}`,
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      label: 'User Statistic',
      path: `/admin/users/${userId}/statistic`,
    },
    {
      icon: <CalendarCheck className="h-5 w-5" />,
      label: 'User Agenda',
      path: `/admin/users/${userId}/booking`,
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      label: 'User Credit',
      path: `/admin/users/${userId}/credit`,
    },
    {
      icon: <Receipt className="h-5 w-5" />,
      label: 'User Package',
      path: `/admin/users/${userId}/package`,
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      label: 'User Loyalty',
      path: `/admin/users/${userId}/loyalty`,
    },
  ];
};
