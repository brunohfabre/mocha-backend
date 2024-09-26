import { Button, Tailwind } from "@react-email/components";

interface CodeEmailProps {
  code: string
}

export function CodeEmail({ code }: CodeEmailProps) {
  return (
    <Tailwind>
      <Button
        href="https://example.com"
        className="bg-violet-500 px-3 py-2 font-medium leading-4 text-white"
      >
        Click me
      </Button>
    </Tailwind>
  )
}
