"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import {
  BookOpen,
  Building2,
  MapPin,
  UserRound,
  FileText,
  CheckCircle2,
} from "lucide-react"
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PageBreadcrumb } from "./PageBreadcrumb"
import Container from "./Container"
import { toast } from "@/hooks/use-toast"
import { useBranch } from "@/context/BranchContext"
import { useCompany } from "@/context/CompanyContext"
import { Checkbox } from "./ui/checkbox"
import { Controller } from "react-hook-form"

type FormValues = {
  consumerName: string
  documentType: string
  documentNumber: string
  consumerAddress: string
  email: string
  phone: string
  isMinor: boolean
  representativeName: string
  representativeDocument: string
  claimType: "RECLAMO" | "QUEJA"
  productType: "PRODUCTO" | "SERVICIO"
  productDescription: string
  amount: string
  description: string
  request: string
  accepted: boolean
}

function SectionTitle({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof UserRound
  title: string
  description?: string
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h2 className="font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

export default function ComplaintsBookComponent() {
  const router = useRouter()
  const { branch, branches } = useBranch()
  const { company } = useCompany()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(
    branch?.idBranch ?? ""
  )
  const [today, setToday] = useState("")

  useEffect(() => {
    // Obtiene la fecha local del navegador.
    const date = new Date()
    const localDate = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-")

    setToday(localDate)
  }, [])

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      documentType: "DNI",
      claimType: "RECLAMO",
      productType: "PRODUCTO",
      isMinor: false,
      accepted: false,
    },
  })

  const isMinor = watch("isMinor")

  const selectedBranchData = branches.find(
    (item) => item.idBranch === selectedBranch
  )

  const onSubmit = async (data: FormValues) => {
    if (!selectedBranchData) {
      toast({
        title: "Selecciona un establecimiento",
        description: "Debes indicar dónde ocurrió el hecho.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        supplier: {
          name: "",
          ruc: "",
          address: selectedBranchData.address,
          branchId: selectedBranchData.idBranch,
          branchName: selectedBranchData.name,
        },
        date: today,
        consumer: {
          name: data.consumerName.trim(),
          documentType: data.documentType,
          documentNumber: data.documentNumber.trim(),
          address: data.consumerAddress.trim(),
          email: data.email.trim(),
          phone: data.phone.trim(),
          isMinor: data.isMinor,
          representativeName: data.isMinor
            ? data.representativeName.trim()
            : undefined,
          representativeDocument: data.isMinor
            ? data.representativeDocument.trim()
            : undefined,
        },
        claim: {
          type: data.claimType,
          productType: data.productType,
          productDescription: data.productDescription.trim(),
          amount: data.amount ? Number(data.amount) : null,
          description: data.description.trim(),
          request: data.request.trim(),
        },
        accepted: data.accepted,
      }

      // Implementa createClaim en tu API antes de habilitar el envío.
      // const result = await createClaim(payload)
      // if (!result.status) throw new Error(result.message)

      console.log("Payload del Libro de Reclamaciones:", payload)

      toast({
        title: "Formulario validado",
        description:
          "Conecta createClaim con tu backend para registrar la reclamación.",
      })

      // Cuando tu backend registre la reclamación:
      // router.push("/libro-de-reclamaciones/confirmacion")
    } catch (error) {
      toast({
        title: "No se pudo registrar",
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container>
      <PageBreadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Libro de Reclamaciones" },
        ]}
      />

      <div className="mx-auto max-w-3xl py-8 md:py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <BookOpen className="h-7 w-7 text-primary" />
          </div>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Libro de Reclamaciones
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Conforme a la normativa peruana de protección al consumidor.
          </p>

          <p className="mt-4 rounded-lg border bg-muted/30 p-3 text-left text-sm">
            Identifica el tipo de registro y completa los datos solicitados.
            Los campos marcados con * son obligatorios.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto max-w-3xl space-y-6"
        >
          {/* 1. Datos del proveedor */}
          <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
            <SectionTitle
              icon={Building2}
              title="1. Identificación del proveedor"
              description="Datos del establecimiento donde ocurrió el hecho."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>
                  Razón social <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={company.businessName}
                  readOnly
                  placeholder="Configura la razón social del negocio"
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  RUC <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={company.documentNumber}
                  readOnly
                  placeholder="RUC del proveedor"
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Fecha del registro
                </Label>
                <Input type="date" value={today} readOnly />
              </div>

              <div className="space-y-2">
                <Label>
                  Establecimiento <span className="text-destructive">*</span>
                </Label>

                <Select
                  value={selectedBranch}
                  onValueChange={setSelectedBranch}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un documento" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((typeDoc) => (
                      <SelectItem key={typeDoc.idBranch} value={typeDoc.idBranch}>
                        {typeDoc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-muted/40 p-3 sm:col-span-2">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium">
                    Dirección del establecimiento
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedBranchData?.address ||
                      "Selecciona una sucursal para mostrar su dirección."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Datos del consumidor */}
          <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
            <SectionTitle
              icon={UserRound}
              title="2. Identificación del consumidor"
              description="Ingresa tus datos de contacto y documento de identidad."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>
                  Nombre completo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="consumerName"
                  placeholder="Nombres y apellidos"
                  {...register("consumerName", {
                    required: "El nombre es obligatorio",
                    minLength: {
                      value: 3,
                      message: "Ingresa tu nombre completo",
                    },
                  })}
                  className={errors.consumerName ? "border-red-500" : ""}
                />
                {errors.consumerName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.consumerName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  Tipo de documento <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedBranch}
                  onValueChange={setSelectedBranch}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key={"DNI"} value={"DNI"}>DNI</SelectItem>
                    <SelectItem key={"CE"} value={"CE"}>Carné de extranjería</SelectItem>
                    <SelectItem key={"PASAPORTE"} value={"PASAPORTE"}>Pasaporte</SelectItem>
                    <SelectItem key={"OTRO"} value={"OTRO"}>Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Número de documento <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="documentNumber"
                  placeholder="Ingresa el número de documento"
                  {...register("documentNumber", {
                    required: "El documento es obligatorio",
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "Ingresa un documento válido",
                  })}
                  className={
                    errors.documentNumber ? "border-red-500" : ""
                  }
                />
                {errors.documentNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.documentNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  Domicilio <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="consumerAddress"
                  placeholder="Dirección del consumidor"
                  {...register("consumerAddress", {
                    required: "El domicilio es obligatorio",
                  })}
                  className={
                    errors.consumerAddress ? "border-red-500" : ""
                  }
                />
                {errors.consumerAddress && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.consumerAddress.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  Correo electrónico <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  {...register("email", {
                    required: "El correo es obligatorio",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Ingresa un correo válido",
                    },
                  })}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  Teléfono / celular <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+51 999 999 999"
                  {...register("phone", {
                    required: "El teléfono es obligatorio",
                    validate: (value) =>
                      value.trim().length >= 6 ||
                      "Ingresa un teléfono válido",
                  })}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="rounded-lg border p-4 sm:col-span-2">
                <div className="flex items-center gap-2">
                  <Controller
                    name="isMinor"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="isMinor"
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    )}
                  />

                  <Label htmlFor="isMinor" className="cursor-pointer">
                    El consumidor es menor de edad.
                  </Label>
                </div>

                {isMinor && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label>
                        Nombre del padre o representante <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="representativeName"
                        {...register("representativeName", {
                          validate: (value) =>
                            !isMinor ||
                            Boolean(value?.trim()) ||
                            "Ingresa el nombre del representante",
                        })}
                      />
                      {errors.representativeName && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.representativeName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Documento del representante <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="representativeDocument"
                        {...register("representativeDocument", {
                          validate: (value) =>
                            !isMinor ||
                            Boolean(value?.trim()) ||
                            "Ingresa el documento del representante",
                        })}
                      />
                      {errors.representativeDocument && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.representativeDocument.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 3. Detalle del reclamo o queja */}
          <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
            <SectionTitle
              icon={FileText}
              title="3. Detalle de la reclamación"
              description="Describe el producto o servicio y lo sucedido."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>
                  Tipo de registro <span className="text-destructive">*</span>
                </Label>
                <select
                  id="claimType"
                  {...register("claimType", { required: true })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="RECLAMO">Reclamo</option>
                  <option value="QUEJA">Queja</option>
                </select>

                <p className="mt-2 text-xs text-muted-foreground">
                  Reclamo: disconformidad con un producto o servicio.
                  Queja: disconformidad con la atención al público.
                </p>
              </div>

              <div className="space-y-2">
                <Label>
                  Tipo de bien contratado <span className="text-destructive">*</span>
                </Label>
                <select
                  id="productType"
                  {...register("productType", { required: true })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="PRODUCTO">Producto</option>
                  <option value="SERVICIO">Servicio</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>
                  Descripción del producto o servicio <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="productDescription"
                  placeholder="Producto adquirido o servicio contratado"
                  {...register("productDescription", {
                    required: "Describe el producto o servicio",
                  })}
                  className={
                    errors.productDescription ? "border-red-500" : ""
                  }
                />
                {errors.productDescription && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.productDescription.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  Monto reclamado (S/)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  {...register("amount", {
                    validate: (value) =>
                      !value ||
                      (Number.isFinite(Number(value)) &&
                        Number(value) >= 0) ||
                      "Ingresa un monto válido",
                  })}
                  className={errors.amount ? "border-red-500" : ""}
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label>
                  Detalle del reclamo o queja <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  rows={5}
                  placeholder="Describe qué sucedió, cuándo ocurrió y los detalles relevantes..."
                  {...register("description", {
                    required: "Describe los hechos",
                    minLength: {
                      value: 10,
                      message: "Escribe al menos 10 caracteres",
                    },
                  })}
                  className={
                    errors.description ? "border-red-500" : ""
                  }
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label>
                  Pedido concreto del consumidor <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="request"
                  rows={4}
                  placeholder="Indica qué solución solicitas..."
                  {...register("request", {
                    required: "Indica tu pedido concreto",
                    minLength: {
                      value: 5,
                      message: "Describe la solución que solicitas",
                    },
                  })}
                  className={errors.request ? "border-red-500" : ""}
                />
                {errors.request && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.request.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 4. Declaración */}
          <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
            <SectionTitle
              icon={CheckCircle2}
              title="4. Declaración"
            />

            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 accent-primary"
                {...register("accepted", {
                  required:
                    "Debes confirmar la declaración para continuar",
                })}
              />
              <span>
                Declaro que la información proporcionada es verdadera
                y corresponde a los hechos que expongo en esta
                reclamación o queja.
              </span>
            </label>

            {errors.accepted && (
              <p className="text-sm text-red-500">
                {errors.accepted.message}
              </p>
            )}

            <p className="text-xs text-muted-foreground">
              La presentación de una reclamación no impide acudir a
              otras vías de solución de controversias ni constituye
              un requisito previo para presentar una denuncia ante
              INDECOPI.
            </p>
          </section>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting || !today}
          >
            {isSubmitting
              ? "Procesando..."
              : "Registrar reclamación o queja"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Los datos serán utilizados para gestionar y responder
            el registro presentado.
          </p>
        </form>
      </div>
    </Container>
  )
}
