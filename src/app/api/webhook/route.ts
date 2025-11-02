import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/utils/stripe'
import { manageSubscription } from '@/utils/manage-subscription'
import { Plan } from '@prisma/client'
import { revalidatePath } from 'next/cache'



export const POST = async (request: Request) => {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("❌ Webhook: Signature não encontrada");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  console.log("🚀 WEBHOOK INICIANDO...");

  const text = await request.text();

  if (!process.env.STRIPE_SECRET_WEBHOOK_KEY) {
    console.error("❌ Webhook: STRIPE_SECRET_WEBHOOK_KEY não configurada");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_SECRET_WEBHOOK_KEY as string,
    );
  } catch (err) {
    console.error("❌ Webhook: Erro na verificação da assinatura:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }


  switch (event.type) {
    case "customer.subscription.deleted":
      const payment = event.data.object as Stripe.Subscription;

      await manageSubscription(
        payment.id,
        payment.customer.toString(),
        false,
        true
      )

      break;
    case "customer.subscription.updated":
      const paymentIntent = event.data.object as Stripe.Subscription;

      await manageSubscription(
        paymentIntent.id,
        paymentIntent.customer.toString(),
        false,
      )

      revalidatePath("/dashboard/plans")

      break;
    case "checkout.session.completed":
      const checkoutSession = event.data.object as Stripe.Checkout.Session;

      const type = checkoutSession?.metadata?.type ? checkoutSession?.metadata?.type : "BASIC";

      if (checkoutSession.subscription && checkoutSession.customer) {
        await manageSubscription(
          checkoutSession.subscription.toString(),
          checkoutSession.customer.toString(),
          true,
          false,
          type as Plan
        )
      }

      revalidatePath("/dashboard/plans")

      break;

    default:
      console.log("Evento não tratado: ", event.type)
  }

  return NextResponse.json({ received: true })

}

