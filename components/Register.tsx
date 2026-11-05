// components/Register.tsx
'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TypeDocument } from "@/types/api-type";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import Container from "./Container";
import { PageBreadcrumb } from "./PageBreadcrumb";
import { useIsMobile } from "@/hooks/use-mobile";
import { keyNumberPhone } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  House,
  UserRound,
  ShieldCheck,
} from "lucide-react"
import { fetchRegisterConsumer } from "@/data/data-rest";
import { FormCustomer } from "@/types/form";
import { useRouter } from "next/navigation";
import { useAlert } from "@/hooks/use-alert";
import CountryCodeSelector from "./CountryCodeSelector";

interface RegisterCardProps {
  listTypeDocument: TypeDocument[];
}

export default function RegisterComponent({ listTypeDocument }: RegisterCardProps) {
  const router = useRouter()
  const isMobile = useIsMobile();
  const alertKit = useAlert();

  const [loading, setLoading] = useState(false);
  const [idTypeDocument, setIdTypeDocument] = useState("");
  const [document, setDocument] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("+519987654321"); // Valor inicial con código
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationPassword, setValidationPassword] = useState("");
  const [address, setAddress] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showValidationPassword, setShowValidationPassword] = useState(false);

  const refTypeDocument = React.useRef<HTMLButtonElement>(null);
  const refDocument = React.useRef<HTMLInputElement>(null);
  const refName = React.useRef<HTMLInputElement>(null);
  const refPhone = React.useRef<HTMLInputElement>(null);
  const refEmail = React.useRef<HTMLInputElement>(null);
  const refPassword = React.useRef<HTMLInputElement>(null);
  const refValidationPassword = React.useRef<HTMLInputElement>(null);

  const handleRegister = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (!document || !name || !password || !email || !whatsapp) {
      alertKit.warning({
        title: "Cliente",
        message: "Por favor, rellene todos los campos",
      });
      return;
    }

    if (idTypeDocument) {
      const typeDocument = listTypeDocument.find(item => item.id === idTypeDocument);
      if (typeDocument) {
        if (typeDocument.required && typeDocument.lenght !== document.length) {
          alertKit.warning({
            title: "Cliente",
            message: "El campo debe contener exactamente " + typeDocument.lenght + " caracteres",
          }, () => {
            refDocument.current?.focus();
          });
          return
        }
      }
    }

    if (password.trim() !== validationPassword.trim()) {
      alertKit.warning({
        title: "Cliente",
        message: "Las contraseñas no coinciden.",
      }, () => {
        refPassword.current?.focus();
      });
      return;
    }

    setLoading(true);

    alertKit.loading({
      message: "Procesando pedido...",
    });

    const body: FormCustomer = {
      idTipoDocumento: idTypeDocument,
      documento: document.trim(),
      informacion: name.trim(),
      telefono: phone.trim(),
      celular: whatsapp.trim(), // Aquí ya viene con el código de país
      email: email.trim(),
      clave: password.trim(),
      direccion: address.trim(),

      cliente: true,
      estado: true,
      idUsuario: "US0001",
    }

    const { success, data, message } = await fetchRegisterConsumer(body);

    if (!success) {
      alertKit.warning({
        title: "Cliente",
        message: message,
      }, () => {
        setLoading(false);
      });
      return;
    }

    alertKit.success({
      title: "Cliente",
      message: data,
    }, () => {
      router.refresh();
    });
  };


  return (
    <Container>
      <PageBreadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Registro" },
        ]}
      />

      <div className="mx-auto max-w-5xl py-8 md:py-12">
        <div className="mx-auto mb-8 max-w-xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <House className="h-7 w-7" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Crear una cuenta
          </h1>

          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Regístrate para comenzar a explorar nuestro catálogo.
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="mx-auto max-w-3xl space-y-6"
        >
          {/* Datos personales */}
          <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">Datos personales</h2>
                <p className="text-sm text-muted-foreground">
                  Información para identificar tu cuenta.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tipo de documento <span className="text-destructive">*</span></Label>
                <Select
                  value={idTypeDocument}
                  onValueChange={setIdTypeDocument}
                >
                  <SelectTrigger
                    ref={refTypeDocument}
                  >
                    <SelectValue placeholder="Selecciona un documento" />
                  </SelectTrigger>
                  <SelectContent>
                    {listTypeDocument.map((typeDoc) => (
                      <SelectItem key={typeDoc.id} value={typeDoc.id}>
                        {typeDoc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document">
                  Número de documento (<small className="">{document.length}</small>)  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="document"
                  ref={refDocument}
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  placeholder="Ingresa tu documento"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">
                  Nombre completo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  ref={refName}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Teléfono <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  ref={refPhone}
                  type={isMobile ? "tel" : "text"}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={!isMobile ? keyNumberPhone : undefined}
                  placeholder="987654321"
                />
              </div>

              <CountryCodeSelector
                value={whatsapp}
                onChange={setWhatsapp}
                placeholder="987654321"
                className="w-full"
              />

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Dirección de tu domicilio"
                />
              </div>
            </div>
          </section>

          {/* Seguridad de la cuenta */}
          <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">Seguridad de la cuenta</h2>
                <p className="text-sm text-muted-foreground">
                  Configura tus credenciales de acceso.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Correo electrónico <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  ref={refEmail}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Contraseña <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    ref={refPassword}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crea una contraseña"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword
                      ? <EyeOff className="h-4 w-4" />
                      : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {password.length} caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="validationPassword">
                  Confirmar contraseña <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="validationPassword"
                    ref={refValidationPassword}
                    type={showValidationPassword ? "text" : "password"}
                    value={validationPassword}
                    onChange={(e) => setValidationPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                  />
                  <button
                    type="button"
                    aria-label={showValidationPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    onClick={() =>
                      setShowValidationPassword(!showValidationPassword)
                    }
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                  >
                    {showValidationPassword
                      ? <EyeOff className="h-4 w-4" />
                      : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full text-base font-semibold shadow-sm"
            >
              {loading ? "Creando cuenta..." : "Crear mi cuenta"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Al registrarte, tus datos serán utilizados para gestionar
              tu cuenta conforme a la política de privacidad del sitio.
            </p>
          </div>
        </form>
      </div>
    </Container >
  )

}