import CveFixPage, {
  generateMetadata as baseGenerateMetadata,
  generateStaticParams,
  dynamicParams,
  revalidate,
} from "@/app/solutions/fix-[cve_id]/page"

export { generateStaticParams, dynamicParams, revalidate }

export async function generateMetadata({
  params,
}: {
  params: { lang: string; cve_id: string }
}) {
  return baseGenerateMetadata({ params: { cve_id: params.cve_id } })
}

export default async function LocalizedCveFixPage({
  params,
}: {
  params: { lang: string; cve_id: string }
}) {
  return CveFixPage({ params: { cve_id: params.cve_id } })
}
