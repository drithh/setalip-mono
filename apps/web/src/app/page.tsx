'use server';
import { TYPES, container } from '@repo/shared/inversify';
import { LocationService } from '@repo/shared/service';
import { Button } from '@repo/ui/components/ui/button';
import {
  Carousel,
  CarouselIndicator,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbsContainer,
  SliderMainItem,
} from '@repo/ui/components/ui/carousel';
import { Building, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import { Review } from './_components/review';
import Link from 'next/link';

// image
const images = [
  'http://localhost:3000/uploads/1.webp',
  'http://localhost:3000/uploads/2.webp',
  'http://localhost:3000/uploads/3.webp',
];

export default async function Home() {
  const locationService = container.get<LocationService>(TYPES.LocationService);
  const locations = await locationService.findAll();
  return (
    <main className="relative z-0 mx-auto w-full">
      <div className="sticky top-[72px] z-0">
        <Carousel className=" m-0 w-full">
          <div className="relative w-full">
            <CarouselMainContainer className="">
              {images.map((src, index) => (
                <SliderMainItem
                  key={index}
                  className="relative h-[calc(100vh-72px)] w-full bg-transparent p-0"
                >
                  <Image
                    fill
                    className="absolute object-cover"
                    alt={'image ' + index}
                    src={src}
                  />
                </SliderMainItem>
              ))}
            </CarouselMainContainer>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
              <CarouselThumbsContainer className="gap-x-1 ">
                {images.map((_, index) => (
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
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Unlock Your Potential
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover how our comprehensive suite of services can transform
                  your health and wellness journey.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Comprehensive Services
                      </h3>
                      <p className="text-muted-foreground">
                        Explore a wide range of services that cater to your
                        unique needs.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Personalized Approach
                      </h3>
                      <p className="text-muted-foreground">
                        Receive tailored guidance from our expert instructors.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Exceptional Support</h3>
                      <p className="text-muted-foreground">
                        Rely on our dedicated team to provide expert guidance
                        and support.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <img
                src="/placeholder.svg"
                alt="Why Us"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section className="w-full bg-primary py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Our Story
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  A Legacy of Excellence
                </h2>
                <p className="flex max-w-[600px] flex-row gap-4 overflow-x-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Pilates Reform has been a trusted name in the fitness industry
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Facere necessitatibus ea fugiat consequatur reprehenderit eos,
                  magnam sapiente corrupti illo dolor.
                </p>
              </div>
              <img
                src="/placeholder.svg"
                alt="Our Story"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <Review />
        <section className=" bg-primary" id="locations">
          <div className="mx-auto flex max-w-[90vw] flex-col gap-24 pb-12 pt-32 md:max-w-screen-xl">
            <div className="flex flex-col place-content-center place-items-center gap-4">
              <h2 className="text-center text-2xl font-bold md:text-6xl">
                Our Locations
              </h2>
            </div>
            <div className="grid grid-cols-1 place-items-center gap-6 sm:grid-cols-2 sm:px-6 md:grid-cols-3 md:place-items-center">
              {locations?.result?.map((location) => (
                <div
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
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full bg-primary py-8 md:py-16 lg:py-24">
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
