import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4">
      <Heading level={1}>Squad Up</Heading>
      <Text size="regular" muted>
        Coming soon.
      </Text>
    </main>
  );
}
