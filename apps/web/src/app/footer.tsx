import Link from 'next/link';
import Image from 'next/image';
export default function Footer() {
  return (
    <footer className="mx-auto w-full bg-secondary pt-12">
      <div className="flex w-full  max-w-screen-2xl flex-row place-content-around  place-items-center">
        <Link
          href="/"
          className="relative flex h-28 w-56 items-center gap-2 font-semibold"
        >
          <Image
            fill
            src="/logo.webp"
            alt="Pilates Reform"
            className="absolute object-cover"
          />
        </Link>
        <div className="main-footer flex gap-40">
          <div className="link-wrapper flex flex-col gap-2">
            <div className="title-link text-soft font-gt text-sm font-bold opacity-80">
              Classes
            </div>
            <Link
              href="http://"
              className="text-soft font-gt text-sm font-thin no-underline opacity-60 hover:underline"
            >
              All
            </Link>
            <Link
              href="http://"
              className="text-soft font-gt text-sm font-thin no-underline opacity-60 hover:underline"
            >
              Private
            </Link>
            <Link
              href="http://"
              className="text-soft font-gt text-sm font-thin no-underline opacity-60 hover:underline"
            >
              Semi-Private
            </Link>
            <Link
              href="http://"
              className="text-soft font-gt text-sm font-thin no-underline opacity-60 hover:underline"
            >
              Group
            </Link>
          </div>
          <div className="link-wrapper flex flex-col gap-2">
            <div className="title-link text-soft font-gt text-sm font-bold opacity-80">
              Packages
            </div>
            <Link
              href="http://"
              className="text-soft font-gt text-sm font-thin no-underline opacity-60 hover:underline"
            >
              All
            </Link>
            <Link
              href="http://"
              className="text-soft font-gt text-sm font-thin no-underline opacity-60 hover:underline"
            >
              Private
            </Link>
            <Link
              href="http://"
              className="text-soft font-gt text-sm font-thin no-underline opacity-60 hover:underline"
            >
              Semi-Private
            </Link>
            <Link
              href="http://"
              className="text-soft font-gt text-sm font-thin no-underline opacity-60 hover:underline"
            >
              Group
            </Link>
          </div>
          <div className="link-wrapper flex flex-col gap-2">
            <div className="title-link text-soft font-gt text-sm font-bold opacity-80">
              HELP
            </div>
            <Link
              href="http://"
              className="text-soft font-gt text-sm font-thin no-underline opacity-60 hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="http://"
              className="text-soft font-gt text-sm font-thin no-underline opacity-60 hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
      <div className="copyright text-soft mt-8 flex h-10 place-content-center place-items-center font-gt text-xs font-extralight opacity-50">
        © 2024 Pilates Reform. All Rights Reserved.
      </div>
    </footer>
  );
}
