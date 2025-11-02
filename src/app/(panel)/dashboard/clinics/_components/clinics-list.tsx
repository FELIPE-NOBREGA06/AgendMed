import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Prisma } from "@prisma/client"

type ClinicWithDetails = Prisma.UserGetPayload<{
  include: {
    subscription: true,
    services: true,
    _count: {
      select: {
        appointments: true,
        services: true,
      }
    }
  }
}>

interface ClinicsListProps {
  clinics: ClinicWithDetails[]
}

export function ClinicsList({ clinics }: ClinicsListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Clínicas Cadastradas ({clinics.length})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clinics.map((clinic) => (
          <Card key={clinic.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{clinic.name}</CardTitle>
                <div className="flex gap-2">
                  {clinic.status ? (
                    <Badge variant="default">Ativa</Badge>
                  ) : (
                    <Badge variant="secondary">Inativa</Badge>
                  )}
                  
                  {clinic.subscription?.status === "active" && (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                      {clinic.subscription.plan}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">{clinic.email}</p>
              
              {clinic.address && (
                <p className="text-sm text-gray-600">{clinic.address}</p>
              )}
              
              {clinic.phone && (
                <p className="text-sm text-gray-600">{clinic.phone}</p>
              )}
              
              <div className="flex gap-4 text-sm text-gray-500 pt-2 border-t">
                <span>{clinic._count.services} serviços</span>
                <span>{clinic._count.appointments} agendamentos</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {clinics.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Nenhuma clínica cadastrada ainda.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}