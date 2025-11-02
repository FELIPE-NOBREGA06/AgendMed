import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { CreateClinicForm } from './_components/create-clinic-form'
import { ClinicsList } from './_components/clinics-list'
import { getAllClinics } from './_data-access/get-all-clinics'

export default async function ClinicsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  const clinics = await getAllClinics()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gerenciar Clínicas</h1>
        <p className="text-gray-600">Cadastre e gerencie todas as clínicas do sistema</p>
      </div>

      <CreateClinicForm />
      
      <ClinicsList clinics={clinics} />
    </div>
  )
}