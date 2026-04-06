import { MenuIcon } from "lucide-react";
import { HeaderActions } from "./header.actions";
import HeaderLogo from "./header.logo";
import { MobileNavButton, MobileNavProvider } from "./header.mobile-navigation";
import { NavigationMenuComponent } from "./header.navigation";

export default function Header() {
  return (
    <nav className="z-9999 h-16 bg-background/50 backdrop-blur-md flex border-b border-r w-full items-center justify-between">
      <div className="flex flex-row h-full">
        <div className="h-full flex flex-row bg-secondary items-center p-2 border-r px-8">
          <HeaderLogo />
        </div>
        <div className="h-full hidden md:flex flex-row items-center">
          <NavigationMenuComponent />
        </div>
      </div>
      <div className="h-full flex sm:hidden md:hidden flex-row items-center">
        <MobileNavProvider>
          <div className="h-full flex flex-row items-center p-2 px-4 border-l">
            <MobileNavButton />
          </div>
        </MobileNavProvider>
      </div>
      <div className="h-full hidden sm:flex md:flex flex-row items-center">
        <HeaderActions />
      </div>
    </nav>
  );
}
