'use client';
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
import { Parallax } from 'react-scroll-parallax';

// image
const images = [
  'http://localhost:3000/uploads/1.webp',
  'http://localhost:3000/uploads/2.webp',
  'http://localhost:3000/uploads/3.webp',
];

export default function Home() {
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
      <div className="relative z-10 bg-secondary">
        <div className="">
          <div className="mx-auto flex h-screen max-w-screen-xl flex-col place-content-center place-items-center gap-6">
            <h2 className="text-center font-neue text-6xl md:text-[6rem]">
              Empowering Fitness, Elevating Life.
            </h2>
            <p className="mx-auto max-w-[80vw] text-center md:max-w-4xl md:text-lg">
              Pilates Reform is a pilates studio that offers a range of classes
              designed to help clients increase their fitness levels and improve
              their quality of life. Our studio is equipped with the latest
              pilates equipment, including the reformer bed, wunda chair and
              ladder barrel. Our highly qualified instructors provide
              personalised training to each client, ensuring that everyone gets
              the best workout possible. We offer a range of classes that cater
              to all fitness levels, and we're committed to creating a
              supportive and inspiring environment that will help you achieve
              your fitness goals.
            </p>
          </div>
          <div className=" bg-primary">
            <div className="mx-auto flex max-w-[90vw] flex-col gap-24 py-32 md:max-w-screen-xl">
              <div className="flex flex-col place-content-center place-items-center gap-4">
                <p className="font-gt text-[0.8rem] uppercase text-secondary-foreground md:text-lg">
                  Visit Us Here
                </p>
                <h2 className="text-center font-neue text-6xl md:text-[6rem]">
                  Our Locations
                </h2>
              </div>
              <div className="flex flex-row flex-wrap place-content-center gap-6 sm:px-6 md:place-content-between">
                {images.map((src, index) => (
                  <div className="w-40 md:w-80">
                    <div
                      key={index}
                      className=" relative h-36 bg-transparent p-0 md:h-72"
                    >
                      <Image
                        fill
                        className="absolute rounded-t-full border border-primary-foreground object-cover"
                        alt={'image ' + index}
                        src={src}
                      />
                    </div>
                    <div className="flex flex-col place-content-center place-items-center  bg-secondary py-4">
                      <h4 className="mb-4 font-neue text-2xl md:text-4xl">
                        Nama lokasi
                      </h4>
                      <h4 className="flex items-center gap-2 text-sm text-secondary-foreground  sm:text-base">
                        <Phone className="h-3 w-3 sm:h-5 sm:w-5" />
                        0812456789
                      </h4>
                      <h4 className="flex items-center gap-2 text-sm text-secondary-foreground  sm:text-base">
                        <MapPin className="h-3 w-3 sm:h-5 sm:w-5" />
                        Alamat lokasi
                      </h4>

                      <Button className="text-tiny mt-6 font-gt sm:text-sm">
                        See More
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
