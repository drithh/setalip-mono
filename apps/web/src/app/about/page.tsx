import { container, TYPES } from '@repo/shared/inversify';
import { WebSettingService } from '@repo/shared/service';
import RichTextViewer from '@repo/ui/components/rich-text/viewer';
import Image from 'next/image';
import Link from 'next/link';
import { BackButton } from '@repo/ui/components/back-button';

import { env } from '@repo/shared/env';

const ImageUrl = {
  whyUs: `${env.ADMIN_URL}/static/auth-1.webp`,
  story: `${env.ADMIN_URL}/static/story.webp`,
};

export default async function Page() {
  return (
    <div className="mx-auto mb-24 flex w-full max-w-5xl flex-col gap-12  px-4 py-12 md:px-6 md:py-16">
      <div className="flex">
        <BackButton />
        <div className="w-full text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Our Story
          </h1>
        </div>
      </div>
      <div className=" flex flex-col gap-6">
        <div className="grid items-start gap-2 lg:grid-cols-2 lg:gap-6">
          <div className="">
            <div className=" flex flex-col gap-6">
              <p className="text-justify md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Founded by Miss Rina, a dedicated yoga instructor with over 12
                years of experience, our studio began with a simple belief: that
                everyone deserves to experience the joy of a healthy, balanced
                life through movement.
              </p>
              <p className="text-justify md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Miss Rina and her daughter, who had experienced the profound
                benefits of Pilates for her wellness while studying abroad,
                shared her love for it and together they envisioned bringing
                this joy back to their home country, Jakarta, Indonesia. With a
                deep-rooted commitment to wellness and a desire to foster
                connections, Pilates Reform was born!
              </p>
            </div>
          </div>
          <div className="relative aspect-video h-full  w-full">
            <div className="absolute inset-0">
              <Image
                src={ImageUrl.story ?? '/placeholder.svg'}
                fill
                style={{ filter: 'brightness(90%) saturate(90%)' }}
                alt="Story"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:w-full"
              />
            </div>
          </div>
        </div>
        <p className="text-justify md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          From our humble beginnings to becoming a cornerstone in our community,
          Pilates Reform has grown into a sanctuary for those seeking strength,
          flexibility, and balance. We offer more than just exercise; we provide
          a supportive space where individuals of all backgrounds and fitness
          levels can thrive.
        </p>
        <div className="grid items-start gap-2 lg:grid-cols-2 lg:gap-6">
          <div className="relative aspect-video h-full  w-full">
            <div className="absolute inset-0">
              <Image
                src={ImageUrl.whyUs ?? '/placeholder.svg'}
                fill
                style={{ filter: 'brightness(90%) saturate(90%)' }}
                alt="Story"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:w-full"
              />
            </div>
          </div>
          <div className="">
            <div className=" flex flex-col gap-6">
              <p className="text-justify md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our journey is driven by a passion for health, a dedication to
                create an impactful health and fitness community through mindful
                movement. At Pilates Reform, our expert instructors bring years
                of experience and a genuine commitment to your well-being. Every
                session is crafted to meet your unique goals, whether you're
                seeking to build strength, improve flexibility, or simply
                enhance your overall vitality.
              </p>
              <p className="text-justify md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join us in embracing movement, forging connections, and
                discovering the joy of a healthier, more vibrant life. Together,
                may Pilates Reform your Mind, Body and Soul.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
