import { HeaderActions } from "./header.actions";
import HeaderLogo from "./header.logo";
import { NavigationMenuDemo } from "./header.navigation";

export default function Header() {
  return (
    <nav className="z-9999 flex border-b border-r h-full w-full items-center justify-between">
      <div className="flex flex-row h-full">
        <div className="h-full flex flex-row bg-secondary items-center p-2 border-r px-8">
          <HeaderLogo />
        </div>
        <div className="h-full flex flex-row items-center">
          <NavigationMenuDemo />
        </div>
      </div>
      <div className="h-full flex flex-row items-center">
        <HeaderActions />
      </div>
    </nav>
  );
}
