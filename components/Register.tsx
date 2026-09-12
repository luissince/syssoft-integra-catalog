// components/Register.tsx
'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TypeDocument } from "@/types/api-type";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import Container from "./Container";
import { PageBreadcrumb } from "./PageBreadcrumb";
import { useIsMobile } from "@/hooks/use-mobile";
import { keyNumberPhone } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
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
      },()=>{
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

      {/* Breadcrumb */}
      <PageBreadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Registro" },
        ]}
      />

      {/* Body */}
      <div className="w-full flex items-center justify-center py-2 lg:py-4">
        <form className="space-y-4 w-full lg:w-2/4" onSubmit={handleRegister}>
          {/* Document type */}
          <div>
            <Label className="text-foreground font-medium">
              Tipo de Documento <span className="text-red-500 text-base">*</span>
            </Label>
            <Select
              value={idTypeDocument}
              onValueChange={(value) =>
                setIdTypeDocument(value)
              }
            >
              <SelectTrigger
                ref={refTypeDocument}
                className="bg-muted border-border text-foreground mt-2"
              >
                <SelectValue placeholder="Selecciona el tipo de documento" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {listTypeDocument.map((typeDoc) => (
                  <SelectItem
                    key={typeDoc.id}
                    value={typeDoc.id}
                    className="text-foreground"
                  >
                    {typeDoc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Document */}
          <div>
            <Label className="text-foreground font-medium">N° de Documento({document.length ?? 0}) <span className="text-red-500 text-base">*</span></Label>
            <Input
              ref={refDocument}
              type="text"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              className="mt-1 bg-muted border-border text-foreground"
              placeholder="0000000"
            />
          </div>

          {/* Name */}
          <div>
            <Label className="text-foreground font-medium">Nombre Completo <span className="text-red-500 text-base">*</span></Label>
            <Input
              ref={refName}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 bg-muted border-border text-foreground"
              placeholder="Juan Pérez"
            />
          </div>

          {/* Phone */}
          <div>
            <Label
              htmlFor="phone"
              className="text-foreground font-medium"
            >
              Número de celular({phone.length ?? 0}) <span className="text-red-500 text-base">*</span>
            </Label>
            <Input
              id="phone"
              ref={refPhone}
              type={isMobile ? "tel" : "text"}
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="987654321"
              onKeyDown={!isMobile ? keyNumberPhone : undefined}
              className="bg-muted border-border text-foreground mt-2"
            />
          </div>

          {/* WhatsApp con selector de país */}
          <CountryCodeSelector
            value={whatsapp}
            onChange={setWhatsapp}
            placeholder="987654321"
            className="mt-2"
          />

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-foreground font-medium">
              Correo Electrónico <span className="text-red-500 text-base">*</span>
            </Label>
            <Input
              id="email"
              ref={refEmail}
              type={isMobile ? "email" : "text"}
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="tumail@gmail.com"
              className="bg-muted border-border text-foreground mt-2"
            />
          </div>

          {/* Password */}
          <div>
            <Label
              htmlFor="password"
              className="text-foreground font-medium"
            >
              Contraseña de la cuenta({password.length}) <span className="text-red-500 text-base">*</span>
            </Label>
            <div className="relative mt-2">
              <Input
                id="password"
                ref={refPassword}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="******"
                className="bg-muted border-border text-foreground pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Validation password */}
          <div>
            <Label
              htmlFor="validationPassword"
              className="text-foreground font-medium"
            >
              Validar contraseña({validationPassword.length}) <span className="text-red-500 text-base">*</span>
            </Label>
            <div className="relative mt-2">
              <Input
                id="validationPassword"
                ref={refValidationPassword}
                type={showValidationPassword ? "text" : "password"}
                value={validationPassword}
                onChange={(e) =>
                  setValidationPassword(e.target.value)
                }
                placeholder="******"
                className="bg-muted border-border text-foreground pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() =>
                  setShowValidationPassword(!showValidationPassword)
                }
              >
                {showValidationPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Address */}
          <div>
            <Label className="text-foreground font-medium">Dirección</Label>
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 bg-muted border-border text-foreground"
              placeholder="Ej: Av. 28 de mayo 123"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? "Registrando..." : "Crear Cuenta"}
            </Button>
          </DialogFooter>
        </form>
      </div>
    </Container>
  );
}