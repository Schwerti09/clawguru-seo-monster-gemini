import { redirect } from "next/navigation"

export default async function LocaleSecurityCheckLegacyPage(props: {
  params: { lang: string }
}) {
  const params = props.params
  redirect(`/${params.lang}/check`)
}
