import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import fotoImg from '../../../../public/foto1.png'
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Prisma } from "@prisma/client"
import { PremiumCardBadge } from "./premium-badge"

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true,
  }
}>

interface ProfessionalsProps {
  professionals: UserWithSubscription[]
}


export function Professionals({ professionals }: ProfessionalsProps) {

  return (
    <section className="bg-gray-50 py-16">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl text-center mb-12 font-bold">
          Clinicas disponíveis
        </h2>

        <section
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >

          {professionals.map((clinic) => (
            <Card className="overflow-hidden hover:shadow-lg duration-300 flex flex-col h-full" key={clinic.id}>
              <div className="relative">
                <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                  <Image
                    src={clinic.image ?? fotoImg}
                    alt="Foto da clinica"
                    fill
                    className="object-cover"
                  />
                </div>
                {clinic?.subscription?.status === "active" && clinic?.subscription?.plan === "PROFESSIONAL" && <PremiumCardBadge />}
              </div>

              <CardContent className="p-4 flex flex-col flex-1">
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {clinic.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-3 flex-1">
                    {clinic.address ?? "Endereço não informado."}
                  </p>
                </div>

                <Link
                  href={`/clinica/${clinic.id}`}
                  target="_blank"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center py-3 rounded-md text-sm md:text-base font-medium mt-4 transition-colors"
                >
                  Agendar horário
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          ))}

        </section>


      </div>

    </section>
  )
} 