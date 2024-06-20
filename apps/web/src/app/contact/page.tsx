import { InstagramLogoIcon } from '@radix-ui/react-icons';
import { container, TYPES } from '@repo/shared/inversify';
import { LocationService } from '@repo/shared/service';
import { MailIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';

export default async function Contacts() {
  const locationService = container.get<LocationService>(TYPES.LocationService);

  const locations = await locationService.findAll();

  return (
    <div className="mx-auto flex  max-w-screen-2xl flex-col">
      <section className="w-full py-8 md:py-16 lg:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Contact Us
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Get in Touch
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  We're here to help. Reach out to us through any of our
                  channels.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <Link
                  href="#"
                  className="flex gap-2 text-muted-foreground hover:text-primary"
                  prefetch={false}
                >
                  <InstagramLogoIcon className="h-6 w-6" />
                  <span className="sr-only">Instagram</span>
                  <p>Our Instagram</p>
                </Link>
                <Link
                  href="#"
                  className="flex gap-2 text-muted-foreground hover:text-primary"
                  prefetch={false}
                >
                  <TiktokSvg className="h-6 w-6 fill-current" />
                  <span className="sr-only">TikTok</span>
                  <p>Our TikTok</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full pb-12 md:pb-24">
        <div className="container px-4 md:px-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Our Pilates Studios
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Visit us at one of our locations to experience our classes
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {locations?.result?.map((location) => (
                <div
                  key={location.id}
                  className="rounded-lg border p-6 shadow-sm"
                >
                  <h3 className="text-xl font-bold">{location.name}</h3>
                  <p className="text-muted-foreground">{location.address}</p>
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <MailIcon className="h-5 w-5 text-muted-foreground" />
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-primary"
                      >
                        {location.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="h-5 w-5 text-muted-foreground" />
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-primary"
                      >
                        {location.phone_number}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface TiktokSvgProps {
  className?: string;
}
function TiktokSvg({ className }: TiktokSvgProps) {
  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
      >
        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
      </svg>
    </div>
  );
}
