import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

export function LoadingBtn({
  children,
  isLoading,
  ...props
}: {
  children: React.ReactNode;
  isLoading: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className="flex flex-gap-2 items-center"
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin" />}
      {isLoading ? "Submitting..." : children}
    </Button>
  );
}
