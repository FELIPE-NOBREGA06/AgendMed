import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { GridPlans } from './_components/grid-plans'
import { getSubscription } from '@/utils/get-subscription'
import { SubscriptionDetail } from './_components/subscription-detail'
import { OAuthDebug } from '@/components/oauth-debug'

export default async function Plans() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  const subscritpion = await getSubscription({ userId: session?.user?.id! })

  return (
    <div>
      <OAuthDebug />

      {subscritpion?.status !== "active" && (
        <GridPlans />
      )}

      {subscritpion?.status === "active" && (
        <SubscriptionDetail subscription={subscritpion!} />
      )}

    </div>
  )
}