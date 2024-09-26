import { Html, Text } from "@react-email/components";

interface CodeEmailProps {
  code: string
}

export function CodeEmail({ code }: CodeEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Text>Verification code: {code}</Text>
    </Html>
  )
}
