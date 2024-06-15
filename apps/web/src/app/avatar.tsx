'use client';

import { User } from 'lucia';
import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';
import Image from 'next/image';
interface AvatarImageProps {
  user: User;
}

export default async function Avatar({ user }: AvatarImageProps) {
  const avatar = useMemo(() => {
    return createAvatar(initials, {
      size: 128,
      seed: user.email,

      // ... other options
    }).toDataUriSync();
  }, []);

  return (
    <div className="flex items-center gap-4">
      <Image src={avatar} alt="avatar" width={64} height={64} />
    </div>
  );
}
