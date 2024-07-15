import Image from 'next/image';

const images = [
  {
    src: '/images/auth-background.jpg',
    alt: 'Auth Background',
  },
];

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-[calc(100vh-20rem)] w-full lg:grid lg:grid-cols-2 ">
      <div className="flex items-center justify-center">{children}</div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/images/auth-background.jpg"
          alt="Auth Background"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
    </div>
  );
}
