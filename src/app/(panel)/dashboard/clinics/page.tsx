"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Trash2, Plus, Phone, Mail, MapPin, Calendar, Users } from 'lucide-react'
import { toast } from 'sonner'

interface Clinic {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  status: string
  createdAt: string
  services: any[]
  totalServices: number
  totalAppointments: number
  activeAppointments: number
  canDelete: boolean
}

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    loadClinics()
  }, [])

  const loadClinics = async () => {
    try {
      const response = await fetch('/api/clinics/manage')
      if (response.ok) {
        const data = await response.json()
        setClinics(data.clinics || [])
      } else {
        toast.error('Erro ao carregar clínicas')
      }
    } catch (error) {
      toast.error('Erro ao carregar clínicas')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClinic = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email) {
      toast.error('Nome e email são obrigatórios')
      return
    }

    try {
      const response = await fetch('/api/clinics/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Clínica criada com sucesso!')
        setFormData({ name: '', email: '', phone: '', address: '' })
        setShowCreateForm(false)
        loadClinics()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erro ao criar clínica')
      }
    } catch (error) {
      toast.error('Erro ao criar clínica')
    }
  }

  const handleDeleteClinic = async (clinicId: string, clinicName: string) => {
    if (!confirm(`Tem certeza que deseja excluir a clínica "${clinicName}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/clinics/delete?id=${clinicId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Clínica excluída com sucesso!')
        loadClinics()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erro ao excluir clínica')
      }
    } catch (error) {
      toast.error('Erro ao excluir clínica')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando clínicas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Gerenciar Clínicas
          </h1>
          <p className="text-gray-600">Cadastre e gerencie todas as clínicas do sistema</p>
        </div>
        
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Clínica
        </Button>
      </div>

      {/* Formulário de Criação */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Nova Clínica</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateClinic} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome da Clínica *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Clínica São Paulo"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="contato@clinica.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Rua, número, bairro, cidade"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">Criar Clínica</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Clínicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clinics.map((clinic) => (
          <Card key={clinic.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{clinic.name}</CardTitle>
                  <Badge variant={clinic.status === 'Ativo' ? 'default' : 'secondary'}>
                    {clinic.status}
                  </Badge>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteClinic(clinic.id, clinic.name)}
                  disabled={!clinic.canDelete}
                  className={`${!clinic.canDelete ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50 hover:text-red-600'}`}
                  title={!clinic.canDelete ? `Não é possível excluir. Há ${clinic.activeAppointments} agendamento(s) ativo(s)` : 'Excluir clínica'}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{clinic.email}</span>
                </div>
                
                {clinic.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{clinic.phone}</span>
                  </div>
                )}
                
                {clinic.address && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{clinic.address}</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-600">
                    <Users className="w-4 h-4" />
                    <span className="font-semibold">{clinic.totalServices}</span>
                  </div>
                  <p className="text-xs text-gray-500">Serviços</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600">
                    <Calendar className="w-4 h-4" />
                    <span className="font-semibold">{clinic.totalAppointments}</span>
                  </div>
                  <p className="text-xs text-gray-500">Agendamentos</p>
                </div>
              </div>
              
              {clinic.activeAppointments > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                  <p className="text-xs text-yellow-800">
                    ⚠️ {clinic.activeAppointments} agendamento(s) ativo(s)
                  </p>
                </div>
              )}
              
              <p className="text-xs text-gray-500">
                Criada em {new Date(clinic.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {clinics.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma clínica cadastrada
            </h3>
            <p className="text-gray-600 mb-4">
              Comece criando sua primeira clínica no sistema
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Clínica
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}