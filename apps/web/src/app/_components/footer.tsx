import Link from 'next/link';
import Image from 'next/image';
import { container, TYPES } from '@repo/shared/inversify';
import { LocationService, WebSettingService } from '@repo/shared/service';
export default async function Footer() {
  const webSettingService = container.get<WebSettingService>(
    TYPES.WebSettingService,
  );

  const logo = await webSettingService.findLogo();
  const locationService = container.get<LocationService>(TYPES.LocationService);
  const locations = await locationService.findAll();

  return (
    <footer className="w-full bg-primary pt-12">
      <div className="mx-auto flex max-w-screen-xl flex-col place-content-around place-items-center gap-8 font-sans md:w-full md:flex-row  md:gap-0">
        <Link
          href="/"
          className="relative flex h-28 w-56 items-center gap-2 font-semibold"
        >
          <Image
            fill
            src={logo.result?.logo ?? '/logo.webp'}
            alt="Pilates Reform"
            className="absolute object-cover"
          />
        </Link>
        <div className="flex flex-row flex-wrap place-content-center gap-12 md:gap-x-40">
          <div className="link-wrapper flex flex-col gap-2">
            <div className="text-sm font-bold text-primary-foreground opacity-80">
              LOCATIONS
            </div>
            {locations.result?.map((location) => (
              <Link
                key={location.id}
                href={`/locations/${location.id}`}
                className="text-sm text-primary-foreground no-underline opacity-70 hover:underline"
              >
                {location.name}
              </Link>
            ))}
          </div>
          <div className="link-wrapper flex flex-col gap-2">
            <div className="text-sm font-bold text-primary-foreground opacity-80">
              PILATES
            </div>
            <Link
              href="http://"
              className="text-sm text-primary-foreground no-underline opacity-70 hover:underline"
            >
              Classes
            </Link>
            <Link
              href="http://"
              className="text-sm text-primary-foreground no-underline opacity-70 hover:underline"
            >
              Schedule
            </Link>
            <Link
              href="http://"
              className="text-sm text-primary-foreground no-underline opacity-70 hover:underline"
            >
              Package
            </Link>
          </div>
          <div className="link-wrapper flex flex-col gap-2">
            <div className="text-sm font-bold text-primary-foreground opacity-80">
              HELP
            </div>
            <Link
              href="http://"
              className="text-sm text-primary-foreground no-underline opacity-70 hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="contact"
              className="text-sm text-primary-foreground no-underline opacity-70 hover:underline"
            >
              Contact
            </Link>
            <Link
              href="/contact#faq"
              className="text-sm text-primary-foreground no-underline opacity-70 hover:underline"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
      <div className="copyright mt-8 flex h-10 place-content-center place-items-center text-xs font-extralight text-primary-foreground opacity-50">
        © 2024 Pilates Reform. All Rights Reserved.
      </div>
    </footer>
  );
}
