import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { Hero } from './_components/hero'
import { Professionals } from "./_components/professionals";
import { getProfessionals } from "./_data-access/get-professionals";
import { OAuthDebug } from "@/components/oauth-debug";

export const revalidate = 120; // 120 segundos = 2 minutos.

export default async function Home() {

  const professionals = await getProfessionals();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div>
        <div className="container mx-auto px-4 pt-20">
          <OAuthDebug />
        </div>
        
        <Hero />

        <Professionals professionals={professionals || []} />

        <Footer />
      </div>
    </div>
  )
}