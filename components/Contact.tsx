"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Phone, MapPin, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Company, Branch, Consult } from "@/types/api-type"
import { createConsult } from "@/lib/api"
import { NavSecondary } from "./Nav"

type FormValues = {
  name: string
  email: string
  subject: string
  phone: string
  message: string
}

interface Props {
  company: Company
  branches: Branch[]
  authEnabled: boolean
}

const consultDefault: Consult = {
  name: "LUIS LARA",
  email: "alexander@gmail.com",
  phone: "+51 987654321",
  subject: "INFORMACIÓN",
  message: "Hola, me gustaría obtener más información sobre su productos estrella.",
  status: 1,
}

export default function Contact({ company, branches, authEnabled }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(branches[0].id)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: process.env.NEXT_PUBLIC_ENV === "development" ? consultDefault : undefined
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    const payload: Consult = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      status: 1,
    }

    const { status, message } = await createConsult(payload);

    if (!status) {
      toast({
        title: "Error",
        description: message,
      })
      return;
    }

    toast({
      title: "Formulario enviado",
      description: message,
    })

    // Redirigir a la página de mensaje enviado
    router.push("/contacto/mensaje-enviado")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <NavSecondary title="Contáctanos" authEnabled={authEnabled} />

      {/* Body */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-4 pb-8 text-center">
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Estamos aquí para ayudarte con cualquier duda o problema que tengas
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <h2 className="text-xl font-semibold mb-6">Envíanos un mensaje</h2>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Nombre
                  </label>
                  <Input
                    id="name"
                    placeholder="Tu nombre"
                    {...register("name", { required: "El nombre es obligatorio" })}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    {...register("email", {
                      required: "El email es obligatorio",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email inválido",
                      },
                    })}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Asunto
                </label>
                <Input
                  id="subject"
                  placeholder="¿Cómo podemos ayudarte?"
                  {...register("subject", { required: "El asunto es obligatorio" })}
                  className={errors.subject ? "border-red-500" : ""}
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  N° de celular
                </label>
                <Input
                  id="phone"
                  placeholder="Número de celular"
                  {...register("phone", { required: "El número de celular es obligatorio" })}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Mensaje
                </label>
                <Textarea
                  id="message"
                  placeholder="Escribe tu mensaje aquí..."
                  rows={6}
                  {...register("message", {
                    required: "El mensaje es obligatorio",
                    minLength: {
                      value: 10,
                      message: "El mensaje debe tener al menos 10 caracteres",
                    },
                  })}
                  className={errors.message ? "border-red-500" : ""}
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
              </div>
              <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar mensaje"}
              </Button>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-6">Nuestras Sucursales</h2>
            <Tabs defaultValue={branches[0].id} value={selectedBranch} onValueChange={setSelectedBranch} className="mb-6">
              <TabsList className="flex justify-start flex-grow w-full">
                {branches.map((branch) => (
                  <TabsTrigger key={branch.id} value={branch.id}>
                    {branch.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {branches.map((branch) => (
                <TabsContent key={branch.id} value={branch.id} className="space-y-6 mt-4">
                  <div className="flex items-start gap-4">
                    <Building2 className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium">{branch.name}</h3>
                      <p className="text-muted-foreground">{branch.schedule}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium">Dirección</h3>
                      <p className="text-muted-foreground">{branch.address}</p>
                      <a
                        href={branch.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm inline-block mt-1"
                      >
                        Ver en mapa
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-muted-foreground">{branch.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium">Teléfono</h3>
                      <p className="text-muted-foreground">{branch.phone}</p>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
