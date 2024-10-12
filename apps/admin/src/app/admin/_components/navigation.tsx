'use client';
import { menus } from './menu';
import NavigationLink from './navigation-link';

export default function Navigation() {
  return (
    <aside className="group fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background transition-all duration-300 hover:w-52 sm:flex">
      <nav className="flex h-full flex-col gap-4 px-2 sm:py-5">
        {menus.map((menu) => (
          <NavigationLink key={menu.label} {...menu} />
        ))}
      </nav>
    </aside>
  );
}
