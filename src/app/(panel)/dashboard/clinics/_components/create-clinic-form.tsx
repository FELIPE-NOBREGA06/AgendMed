"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"
import { createClinic } from "../_actions/create-clinic"

export function CreateClinicForm() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    try {
      setIsLoading(true)
      
      const result = await createClinic(formData)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Clínica criada com sucesso!")
        // Reset form
        const form = document.getElementById('clinic-form') as HTMLFormElement
        form?.reset()
      }
    } catch (error) {
      toast.error("Erro ao criar clínica")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar Nova Clínica</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="clinic-form" action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome da Clínica</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Ex: Clínica Odonto Smile"
                required 
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email"
                placeholder="contato@clinica.com"
                required 
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Endereço</Label>
            <Input 
              id="address" 
              name="address" 
              placeholder="Rua, número - Bairro, Cidade - Estado"
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input 
              id="phone" 
              name="phone" 
              placeholder="(11) 99999-9999"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Criando..." : "Criar Clínica"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}