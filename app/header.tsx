import { SignInButton, UserButton } from "@clerk/clerk-react";
// import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Authenticated, Unauthenticated } from "convex/react";
import Image from "next/image";
import Logo from "../public/images/op-2-logo.png";

function Header() {
  return (
    <header className="bg-slate-900 ">
      <div className="container p-4 mx-auto max-w- flex items-center justify-between">
        <div className="w-12 flex justify-center">
          <Image alt="child savings avatar" src={Logo} className="" />{" "}
        </div>
        <Unauthenticated>
          <SignInButton />
        </Unauthenticated>
        <Authenticated>
          <div className="flex space-x-2 items-center">
            <UserButton />
            <ModeToggle />
          </div>
        </Authenticated>
      </div>
    </header>
  );
}

export default Header;
