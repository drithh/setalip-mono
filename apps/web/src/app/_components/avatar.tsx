'use client';

import { initials } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { User } from 'lucia';
import Image from 'next/image';
import { useMemo } from 'react';
interface AvatarImageProps {
  user: User;
}

export default function Avatar({ user }: AvatarImageProps) {
  const avatar = useMemo(() => {
    return createAvatar(initials, {
      size: 128,
      seed: user.name,
    }).toDataUriSync();
  }, []);

  return (
    <div className="flex items-center gap-4">
      <Image src={avatar} alt="avatar" width={64} height={64} />
    </div>
  );
}
