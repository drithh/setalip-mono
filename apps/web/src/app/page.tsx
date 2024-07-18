'use server';
import { container, TYPES } from '@repo/shared/inversify';
import { LocationService, WebSettingService } from '@repo/shared/service';
import { Button } from '@repo/ui/components/ui/button';
import { Card } from '@repo/ui/components/ui/card';
import {
  Carousel,
  CarouselIndicator,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbsContainer,
  SliderMainItem,
} from '@repo/ui/components/ui/carousel';
import { MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Review } from './_components/review';
import { env } from '@repo/shared/env';

const ImageUrl = {
  whyUs: `${env.HOST}/static/why-us.webp`,
  story: `${env.HOST}/static/story.webp`,
};

const whyUs = [
  {
    title: 'Welcoming Community Atmosphere',
    description:
      'Join our welcoming community at Pilates Reform, where clients of all backgrounds find encouragement and motivation to achieve their fitness goals.',
  },
  {
    title: 'Flexible Scheduling and Convenience',
    description:
      'Enjoy convenient class times and personalized private sessions across multiple Pilates Reform locations, designed to fit seamlessly into your busy lifestyle.',
  },
  {
    title: 'Expert Guidance and State-of-the-art Equipment',
    description:
      'Our expert instructors use quality equipment to deliver personalized Pilates sessions tailored to your goals and fitness level, ensuring effective and innovative workouts.',
  },
  {
    title: 'Proven Results and Client Success Stories',
    description:
      'At Pilates Reform, we take pride in our track record of delivering results. Experience significant improvements in strength, flexibility, and overall fitness through our structured programs, supported by inspiring success stories from our community.',
  },
];

export default async function Home() {
  const locationService = container.get<LocationService>(TYPES.LocationService);
  const locations = await locationService.findAll();

  const webSettingService = container.get<WebSettingService>(
    TYPES.WebSettingService,
  );

  const carousels = await webSettingService.findAllCarousel();

  return (
    <main className="relative z-0 mx-auto w-full">
      <div className="sticky top-[72px] z-0">
        <Carousel className="relative m-0 w-full overflow-x-hidden">
          <CarouselPrevious
            variant={'ghost'}
            className="border-0 bg-transparent text-white hover:bg-transparent"
          />
          <CarouselNext
            variant={'ghost'}
            className="border-0 bg-transparent text-white hover:bg-transparent"
          />

          <div className="relative z-0 w-full">
            <CarouselMainContainer className="">
              {carousels.result?.map((carousel, index) => (
                <SliderMainItem
                  key={index}
                  className="relative h-[50vh] w-full bg-transparent p-0 md:h-[calc(100vh-72px)]"
                >
                  <Image
                    fill
                    style={{ filter: 'brightness(70%) saturate(90%)' }}
                    className="absolute object-cover"
                    alt={carousel.title}
                    src={carousel.image_url}
                  />
                  <div className="absolute left-1/2 top-1/2 z-0 flex max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-md bg-black/40 p-8 text-center text-white md:left-[8rem] md:-translate-x-0 md:gap-8 md:rounded-xl md:text-left">
                    <h1 className="z-10 text-xl font-medium sm:text-5xl md:text-7xl">
                      {carousel.title}
                    </h1>
                    <Link href="/schedules" className="z-10">
                      <Button
                        className="h-10 w-28 text-base shadow-md md:h-16 md:w-48 md:text-xl"
                        variant={'default'}
                      >
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </SliderMainItem>
              ))}
            </CarouselMainContainer>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <CarouselThumbsContainer className="gap-x-1 ">
                {carousels.result?.map((_, index) => (
                  <CarouselIndicator key={index} index={index} />
                ))}
              </CarouselThumbsContainer>
            </div>
          </div>
        </Carousel>
      </div>
      <section className="relative z-10 ">
        <section className="w-full bg-background py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Why Choose Pilates Reform
                </div>
                <h2 className="max-w-2xl text-3xl font-bold tracking-tighter sm:text-5xl">
                  Achieve Your Fitness Goals with Pilates Reform
                </h2>
              </div>
            </div>
            <div className="mx-auto grid  items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-8">
                  {whyUs.map((item, index) => (
                    <li key={index}>
                      <div className="grid gap-1">
                        <h3 className="text-xl font-bold">{item.title}</h3>
                        <p className="text-justify text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative h-full w-full">
                <div className="absolute inset-0">
                  <Image
                    src={ImageUrl.whyUs ?? '/placeholder.svg'}
                    fill
                    alt="Why Us"
                    style={{ filter: 'brightness(90%) saturate(90%)' }}
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-background py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Our Story
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  A Legacy of Excellence
                </h2>
                <div className="mt-4 flex flex-col gap-6">
                  <p className="text-justify md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Founded by Miss Rina, a dedicated yoga instructor with over
                    12 years of experience, our studio began with a simple
                    belief: that everyone deserves to experience the joy of a
                    healthy, balanced life through movement.
                  </p>
                  <p className="text-justify md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Miss Rina and her daughter, who had experienced the profound
                    benefits of Pilates for her wellness while studying abroad,
                    shared her love for it and together they envisioned bringing
                    this joy back to their home country, Jakarta, Indonesia.
                    With a deep-rooted commitment to wellness and a desire to
                    foster connections, Pilates Reform was born!{' '}
                    <span className="text-secondary underline">
                      <Link href={'/about'}>See More</Link>
                    </span>
                  </p>
                </div>
              </div>
              <div className="relative h-full w-full">
                <div className="absolute bottom-0 left-0 right-0 top-auto h-[90%]">
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
          </div>
        </section>
        <section className="flex h-[40rem] flex-col gap-4 bg-background py-12 md:py-24 lg:pb-24 lg:pt-32 ">
          <div className="flex flex-col place-items-center">
            <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-5xl">
              Reviews that Speak Volumes
            </h2>
            <p className="max-w-[900px] text-center text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from our satisfied clients on how Pilates Reform has
              transformed their lives.
            </p>
          </div>
          <Review />
          <div className="flex flex-col items-center justify-center">
            <p className="max-w-[900px] text-center text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Want to share your experience with us? Leave a review!
            </p>
            <Link href="/reviews" passHref>
              <Button className="my-4">Leave a Review</Button>
            </Link>
          </div>
        </section>
        <section className="bg-background" id="locations">
          <div className="mx-auto flex max-w-[95vw] flex-col gap-24 pb-12 pt-32 md:max-w-screen-xl">
            <div className="flex flex-col place-content-center place-items-center gap-4">
              <h2 className="text-center text-4xl font-bold md:text-6xl">
                Our Locations
              </h2>
            </div>
            <div className="grid grid-cols-1 place-items-center gap-6 sm:grid-cols-2 sm:px-6 md:grid-cols-3 md:place-items-center">
              {locations?.result?.map((location) => (
                <Card
                  key={location.id}
                  className="w-full max-w-80 overflow-hidden rounded-xl border border-secondary sm:w-full"
                >
                  <div className=" relative h-56 bg-transparent p-0 md:h-56">
                    <Image
                      fill
                      className="absolute object-cover"
                      alt={location.asset_name ?? ''}
                      src={location.asset_url ?? ''}
                    />
                  </div>
                  <div className="flex flex-col place-content-start bg-background  px-6 py-4">
                    <h4 className="mb-4 text-lg font-semibold md:text-2xl">
                      {location.name}
                    </h4>
                    <div className="flex flex-col">
                      <div className="flex  gap-2 text-base  text-secondary-foreground">
                        <Phone className="mt-1 h-4 w-4 flex-shrink-0" />
                        <p className="">{location.phone_number}</p>
                      </div>
                      <div className="flex  gap-2 text-base  text-secondary-foreground">
                        <MapPin className="mt-1 h-4 w-4 flex-shrink-0" />
                        <p className="">{location.address}</p>
                      </div>
                    </div>
                    <Link
                      href={`/locations/${location.id}`}
                      passHref
                      className="mt-4 w-full"
                    >
                      <Button variant={'outline'} className="w-full">
                        View Location
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full bg-background py-8 md:py-16 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Interested? Come Join Us!
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Take the first step towards a healthier you by signing up for
                  a class today.
                </p>
              </div>
              <div className="flex flex-row gap-2">
                <Link href="/login" passHref>
                  <Button variant={'outline'}>Get Started</Button>
                </Link>
                <Link href="/contact" passHref>
                  <Button className="border">Contact Us</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
