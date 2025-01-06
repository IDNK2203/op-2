// import { SignInButton } from "@clerk/clerk-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
// import { Unauthenticated } from "convex/react";
import Image from "next/image";
import Logo from "../public/images/op-2-logo.png";
import HeaderActions from "./header-actions";
import Link from "next/link";

function Header() {
  return (
    <header className="bg-slate-900 ">
      <div className="container max-w-7xl p-4 mx-auto max-w- flex items-center justify-between">
        <Link href={"/"}>
          <div className="w-12 flex justify-center relative">
            <Image alt="child savings avatar" src={Logo} className="" />{" "}
            <Link
              href={"/"}
              className="absolute top-0 right-0 left-0 bg-tranparent size-full"
            ></Link>
          </div>
        </Link>
        {/* <Unauthenticated>
          <SignInButton />
        </Unauthenticated> */}
        <div className="flex space-x-2 items-center px-2">
          <ModeToggle />
          <HeaderActions />
        </div>
      </div>
    </header>
  );
}

export default Header;
