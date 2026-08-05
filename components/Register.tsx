// components/Register.tsx
'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { TypeDocument } from "@/types/api-type";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import Container from "./Container";
import { PageBreadcrumb } from "./PageBreadcrumb";
import { useIsMobile } from "@/hooks/use-mobile";
import { keyNumberPhone } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface RegisterCardProps {
  listTypeDocument: TypeDocument[];
}

export default function RegisterComponent({ listTypeDocument }: RegisterCardProps) {
  const isMobile = useIsMobile();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [idTypeDocument, setIdTypeDocument] = useState("");
  const [document, setDocument] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationPassword, setValidationPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showValidationPassword, setShowValidationPassword] = useState(false);

  const refTypeDocument = React.useRef<HTMLButtonElement>(null);
  const refDocument = React.useRef<HTMLInputElement>(null);
  const refName = React.useRef<HTMLInputElement>(null);
  const refPhone = React.useRef<HTMLInputElement>(null);
  const refEmail = React.useRef<HTMLInputElement>(null);
  const refPassword = React.useRef<HTMLInputElement>(null);
  const refValidationPassword = React.useRef<HTMLInputElement>(null);
  const refWhastapp = React.useRef<HTMLInputElement>(null);
  const refAddress = React.useRef<HTMLInputElement>(null);

  const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // if (loading) {
    //   return;
    // }
    // if (!document || !name || !password || !email) {
    //   alert("Por favor, rellene todos los campos");
    //   return;
    // }
    // setLoading(true);

    // const customer: Customer = {
    //   id: "",
    //   document: document,
    //   name: name,
    //   email: email,
    //   password: password,
    //   phone: "",
    //   whatsapp: "",
    //   addresses: [],
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    //   totalOrders: 0
    // };

    // const success = register(customer);
    // if (!success) {
    //   alert("Error al registrar");
    //   setLoading(false);
    //   return;
    // }
    // setDocument("");
    // setName("");
    // setPassword("");
    // setEmail("");
    // setLoading(false);
    // setIsDialogOpen(false);
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
      <div className="w-full flex items-center justify-center">
        <form className="space-y-4 py-4" onSubmit={handleRegister}>
          <div className="space-y-4">
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

          <div>
            <Label className="text-foreground font-medium">N° de Documento <span className="text-red-500 text-base">*</span></Label>
            <Input
              ref={refDocument}
              type="text"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              className="mt-1 bg-muted border-border text-foreground"
              placeholder="0000000"
            />
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="phone"
                className="text-foreground font-medium"
              >
                Número de celular <span className="text-red-500 text-base">*</span>
              </Label>
              <Input
                id="phone"
                ref={refPhone}
                type={isMobile ? "tel" : "text"}
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                onKeyDown={!isMobile ? keyNumberPhone : undefined}
                className="bg-muted border-border text-foreground mt-2"
              />
            </div>

            <div>
              <Label
                htmlFor="whatsapp"
                className="text-foreground font-medium"
              >
                WhatsApp <span className="text-red-500 text-base">*</span>
              </Label>
              <Input
                id="whatsapp"
                ref={refWhastapp}
                type={isMobile ? "tel" : "text"}
                value={whatsapp}
                onChange={(e) =>
                  setWhatsapp(e.target.value)
                }
                onKeyDown={!isMobile ? keyNumberPhone : undefined}
                className="bg-muted border-border text-foreground mt-2"
                placeholder="Ej: +51999888777"
              />
            </div>
          </div>
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
              className="bg-muted border-border text-foreground mt-2"
            />
          </div>

          <div>
            <Label
              htmlFor="password"
              className="text-foreground font-medium"
            >
              Contraseña de la cuenta <span className="text-red-500 text-base">*</span>
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

          <div>
            <Label
              htmlFor="validationPassword"
              className="text-foreground font-medium"
            >
              Validar contraseña <span className="text-red-500 text-base">*</span>
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

          <DialogFooter>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
            >
              {loading ? "Registrando..." : "Crear Cuenta"}
            </Button>
          </DialogFooter>
        </form>
      </div>
    </Container>
  );
}
