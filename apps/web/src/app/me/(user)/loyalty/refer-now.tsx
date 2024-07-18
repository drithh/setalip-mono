'use client';

import { SelectUser } from '@repo/shared/repository';
import { Button } from '@repo/ui/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface ReferNowProps {
  user_id: SelectUser['id'];
}

export default function ReferNow({ user_id }: ReferNowProps) {
  const host = window.location.host;
  const protocol = window.location.protocol;

  const referralLink = `${protocol}//${host}/register?referral=${user_id}`;
  const referralMessage = `Hey! let's transform our body and mind with Pilates!\n\nJoin me by registering through this link: ${referralLink}.\n\n Let's get stronger together!`;
  const onClick = () => {
    try {
      navigator.clipboard.writeText(referralMessage);
      toast.success('Referral link copied to clipboard', {
        description:
          'Now you can share it with your friends, make sure they register using this link to get rewards',
      });
    } catch (error) {
      toast.error('Failed to copy referral link to clipboard');
      console.error('Failed to copy referral link to clipboard', error);
    }
  };
  return (
    <Button className="ml-4" variant="outline" onClick={onClick}>
      Refer Now
    </Button>
  );
}
