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
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <Button variant={"secondary"}>Click</Button>
      </CardFooter>
    </Card>
  );
}
