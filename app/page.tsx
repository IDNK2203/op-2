"use client";

import { api } from "@/convex/_generated/api";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Home() {
  const clickMeCaller = useMutation(api.documents.createDocument);
  const fetchedDocs = useQuery(api.documents.fetchDocument);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Unauthenticated>
          <SignInButton />
        </Unauthenticated>
        <Authenticated>
          <UserButton />
          {/* <Content /> */}
          <ModeToggle />
          <Button
            onClick={() => {
              clickMeCaller({ title: "Mid Summer Winter" });
            }}
          >
            click me
          </Button>
          <div>
            {fetchedDocs?.map((el, i) => (
              <p className="border border-green-400 mt-1 p-2" key={i}>
                {el.title}
              </p>
            ))}
          </div>
        </Authenticated>
      </main>
    </div>
  );
}
