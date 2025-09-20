import type React from "react"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { Providers } from "../providers"

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Provide a fallback for messages
  let messages
  try {
    messages = await getMessages()
  } catch (error) {
    console.error('Error loading messages:', error)
    messages = {}
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Providers>{children}</Providers>
    </NextIntlClientProvider>
  )
}