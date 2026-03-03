import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { TypeDocument } from "@/types/api-type";

interface InfoStepProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  refs: any;
  listTypeDocument: TypeDocument[];
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  showValidationPassword: boolean;
  setShowValidationPassword: (value: boolean) => void;
  isMobile: boolean;
}

export const InfoStep: React.FC<InfoStepProps> = ({
  formData,
  setFormData,
  refs,
  listTypeDocument,
  showPassword,
  setShowPassword,
  showValidationPassword,
  setShowValidationPassword,
  isMobile,
}) => {
  return (
    <div className="space-y-6">
       <h3 className="font-semibold text-foreground">Información</h3>
      <div className="space-y-4">
        <Label className="text-foreground font-medium">Tipo de Documento *</Label>
        <Select
          value={formData.idTypeDocument}
          onValueChange={(value) => setFormData({ ...formData, idTypeDocument: value })}
        >
          <SelectTrigger ref={refs.typeDocument} className="bg-muted border-border text-foreground">
            <SelectValue placeholder="Selecciona el tipo de documento" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {listTypeDocument.map((typeDoc) => (
              <SelectItem key={typeDoc.id} value={typeDoc.id} className="text-foreground">
                {typeDoc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="document" className="text-foreground font-medium">N° de Documento *</Label>
        <Input
          id="document"
          ref={refs.document}
          type={isMobile ? "tel" : "text"}
          value={formData.document}
          onChange={(e) => setFormData({ ...formData, document: e.target.value })}
          className="bg-muted border-border text-foreground mt-2"
        />
      </div>
      <div>
        <Label htmlFor="name" className="text-foreground font-medium">Nombre completo *</Label>
        <Input
          id="name"
          ref={refs.name}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-muted border-border text-foreground mt-2"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone" className="text-foreground font-medium">Número de celular *</Label>
          <Input
            id="phone"
            ref={refs.phone}
            type={isMobile ? "tel" : "text"}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="bg-muted border-border text-foreground mt-2"
          />
        </div>
        <div>
          <Label htmlFor="whatsapp" className="text-foreground font-medium">WhatsApp *</Label>
          <Input
            id="whatsapp"
            ref={refs.whatsapp}
            type={isMobile ? "tel" : "text"}
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            className="bg-muted border-border text-foreground mt-2"
            placeholder="Ej: +51999888777"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="email" className="text-foreground font-medium">Correo Electrónico *</Label>
        <Input
          id="email"
          ref={refs.email}
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-muted border-border text-foreground mt-2"
        />
      </div>
      <div>
        <Label htmlFor="password" className="text-foreground font-medium">Contraseña *</Label>
        <div className="relative mt-2">
          <Input
            id="password"
            ref={refs.password}
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="bg-muted border-border text-foreground pr-10"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div>
        <Label htmlFor="validationPassword" className="text-foreground font-medium">Validar contraseña *</Label>
        <div className="relative mt-2">
          <Input
            id="validationPassword"
            ref={refs.validationPassword}
            type={showValidationPassword ? "text" : "password"}
            value={formData.validationPassword}
            onChange={(e) => setFormData({ ...formData, validationPassword: e.target.value })}
            className="bg-muted border-border text-foreground pr-10"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowValidationPassword(!showValidationPassword)}
          >
            {showValidationPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
