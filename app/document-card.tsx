import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";

export default function DocumentCard({
  document,
}: {
  document: Doc<"document">;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{document.title}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          {document?.description ? (
            document?.description
          ) : (
            <Loader2 className="animate-spin" />
          )}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant={"secondary"}>
          <Link href={`/documents/${document._id}`}>
            {" "}
            <Eye /> Click
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
