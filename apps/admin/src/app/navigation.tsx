'use client';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui/components/ui/tooltip';
import Link from 'next/link';
import {
  CalendarClock,
  Gift,
  Home,
  LineChart,
  MapPin,
  Package,
  Package2,
  Settings,
  ShoppingCart,
  SquarePercent,
  Users2,
} from 'lucide-react';

export default function Navigation() {
  interface NavLinkProps {
    children: React.ReactNode;
    label: string;
    href: string;
  }
  function NavLink({ children, label, href }: NavLinkProps) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
          >
            {children}
            <span className="sr-only">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <NavLink label="Dashboard" href="#">
          <Home className="h-5 w-5" />
        </NavLink>
        <NavLink label="Locations" href="locations">
          <MapPin className="h-5 w-5" />
        </NavLink>
        <NavLink label="Packages" href="packages">
          <PilatesSvg className="h-5 w-5 fill-current" />
        </NavLink>
        <NavLink label="Users" href="users">
          <Users2 className="h-5 w-5" />
        </NavLink>
        <NavLink label="Agendas" href="#">
          <CalendarClock className="h-5 w-5" />
        </NavLink>
        <NavLink label="Loyalty" href="#">
          <Gift className="h-5 w-5" />
        </NavLink>
        <NavLink label="Voucher & Flash Sale" href="#">
          <SquarePercent className="h-5 w-5" />
        </NavLink>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <NavLink label="Settings" href="#">
          <Settings className="h-5 w-5" />
        </NavLink>
      </nav>
    </aside>
  );
}

interface PilatesSvgProps {
  className?: string;
}
function PilatesSvg({ className }: PilatesSvgProps) {
  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
      >
        <path d="M.816.309H23.293c.223.004.379.035.566.16.16.187.16.379.16.617V23.024c-.003.206-.03.343-.16.507-.199.13-.355.16-.59.16h-.578c-.14.004-.28 0-.421 0-.18 0-.36 0-.54.004h-1.05c-.188-.03-.285-.093-.43-.21-.586-.981-.14-2.282-.14-3.422H3.89v3.187c-.222.336-.222.336-.421.422-.14.02-.14.02-.301.02H2.164c-.18-.005-.36 0-.539 0H.57a.943.943 0 0 1-.43-.16c-.152-.196-.16-.376-.16-.618V.976C-.016.77.004.63.14.47.36.32.563.309.817.309Zm.356 1.238v14.578h3.187v-1.922c-.355-.012-.355-.012-.71-.02-.344-.011-.61-.03-.86-.292a.71.71 0 0 1-.023-.579.948.948 0 0 1 .328-.28c.117-.005.234-.009.351-.009h1.246c.223 0 .446 0 .672-.003H6.578c.188 0 .332.015.5.105.133.203.133.469.094.703-.133.184-.258.258-.469.328-.129.016-.129.016-.27.02-.042 0-.09.004-.136.004-.086.004-.086.004-.172.004-.18.007-.36.011-.547.02v1.921h17.25V6.844a2.845 2.845 0 0 0-.207.367c-.02.047-.043.094-.066.14-.024.051-.047.102-.075.153-.023.05-.046.101-.074.156-.246.52-.484 1.04-.722 1.559-.125.27-.25.539-.375.804-.028.055-.051.11-.079.168l-.152.332c-.078.165-.152.329-.23.493-.024.054-.051.109-.078.164-.047.11-.098.218-.149.328-.133.277-.262.558-.39.836-.227.488-.454.976-.676 1.465l-.047.105c-.074.16-.074.16-.102.336.051.016.102.027.157.043.105.031.207.062.312.098.121.257.129.515.063.789-.083.133-.149.148-.297.195-.133.012-.133.012-.286.012-.058 0-.113.004-.171.004h-.931c-.112 0-.226.004-.339.004H16.73l-1.101.003c-.313 0-.629.004-.945.004h-1.289c-.551.008-.551.008-.704-.136-.132-.204-.195-.364-.148-.602a.74.74 0 0 1 .348-.367c.07-.004.136-.008.207-.008h.277c.05-.004.102-.004.152-.004.168 0 .332-.004.5-.004.118 0 .23 0 .348-.004.305 0 .61-.004.914-.004.309-.003.617-.007.93-.007.61-.008 1.218-.012 1.828-.016.324-.664.644-1.332.945-2.008.262-.574.528-1.144.797-1.715.305-.636.606-1.277.898-1.918.165-.359.329-.714.493-1.074l.058-.117c.403-.875.403-.875.594-1.285.066-.149.137-.293.203-.438a6.74 6.74 0 0 1 .395-.765c.664-1.149.398-1.864.398-3.383H9.375L9.328 4.78c-.234.282-.234.282-.375.328-.426.02-.426.02-.61-.093-.097-.188-.105-.348-.109-.559v-.094c-.004-.105-.004-.207-.004-.312 0-.07 0-.145-.003-.215 0-.191-.004-.379-.004-.57-.004-.227-.008-.454-.008-.684l-.012-1.035H5.578c0 .418-.004.832-.004 1.262-.004.296-.004.593-.008.89 0 .387-.003.77-.003 1.156 0 .305-.004.61-.004.915-.004.16-.004.324-.004.484 0 .18 0 .36-.004.539v.164c-.004.305-.02.54-.242.77-.215.113-.38.117-.61.05-.187-.109-.219-.164-.293-.37-.02-.192-.02-.38-.02-.571 0-.086 0-.086-.003-.172v-.469c0-.164-.004-.328-.004-.492 0-.308-.004-.617-.004-.926 0-.386-.004-.773-.004-1.16-.008-.691-.008-1.379-.012-2.07H1.172Zm0 15.797v1.5h21.656v-1.5H1.172Zm0 2.718v2.391h1.5v-2.39h-1.5Zm20.156 0v2.391h1.5v-2.39h-1.5Zm0 0" />
      </svg>
    </div>
  );
}
