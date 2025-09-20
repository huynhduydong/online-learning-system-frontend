import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async ({ locale }) => {
  // Fallback to 'vi' if locale is undefined or invalid
  const validLocale = locale && ['vi', 'en'].includes(locale) ? locale : 'vi'
  
  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default,
  }
})