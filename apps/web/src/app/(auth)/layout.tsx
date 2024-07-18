import Image from 'next/image';
import { env } from '@repo/shared/env';
env;
const images = [
  {
    src: `${env.HOST}/static/auth-1.webp`,
    alt: 'Auth Background',
  },
  {
    src: `${env.HOST}/static/auth-2.webp`,
    alt: 'Auth Background',
  },
];

const whyUs = [
  'Join our welcoming community at Pilates Reform, where clients of all backgrounds find encouragement and motivation to achieve their fitness goals.',
  'Enjoy convenient class times and personalized private sessions across multiple Pilates Reform locations, designed to fit seamlessly into your busy lifestyle.',
  'Our expert instructors use quality equipment to deliver personalized Pilates sessions tailored to your goals and fitness level, ensuring effective and innovative workouts.',
  'Experience significant improvements in strength, flexibility, and overall fitness through our structured programs, supported by inspiring success stories from our community.',
];

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const randomImage = images[Math.floor(Math.random() * images.length)];
  const randomWhyUs = whyUs[Math.floor(Math.random() * whyUs.length)];
  return (
    <div className="min-h-[calc(100vh-82px)] w-full lg:grid lg:grid-cols-2 ">
      <div className="flex items-center justify-center">{children}</div>
      <div className="sticky top-[82px]  hidden max-h-[calc(100vh-82px)] lg:block">
        <div className="absolute -top-[24rem] bottom-0 left-0 right-0">
          <Image
            src={randomImage?.src ?? '/placeholder.svg'}
            alt={randomImage?.alt ?? 'Placeholder'}
            className="h-full w-full object-cover"
            fill
            style={{ filter: 'brightness(70%) saturate(90%)' }}
          />
          <div className="absolute inset-0 flex items-end justify-start text-center text-white">
            <h2 className="pb-8 pl-16 pr-24 text-left text-3xl font-medium  leading-normal">
              {randomWhyUs}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
