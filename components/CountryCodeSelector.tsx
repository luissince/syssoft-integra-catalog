// components/CountryCodeSelector.tsx
'use client';

import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Lista de países con sus códigos
const countries = [
  { code: '+51', name: 'Perú', flag: '🇵🇪' },
  { code: '+54', name: 'Argentina', flag: '🇦🇷' },
  { code: '+56', name: 'Chile', flag: '🇨🇱' },
  { code: '+57', name: 'Colombia', flag: '🇨🇴' },
  { code: '+58', name: 'Venezuela', flag: '🇻🇪' },
  { code: '+591', name: 'Bolivia', flag: '🇧🇴' },
  { code: '+593', name: 'Ecuador', flag: '🇪🇨' },
  { code: '+595', name: 'Paraguay', flag: '🇵🇾' },
  { code: '+598', name: 'Uruguay', flag: '🇺🇾' },
  { code: '+1', name: 'EE.UU./Canadá', flag: '🇺🇸' },
  { code: '+34', name: 'España', flag: '🇪🇸' },
  { code: '+52', name: 'México', flag: '🇲🇽' },
  // Agrega más países según necesites
];

interface CountryCodeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CountryCodeSelector({
  value,
  onChange,
  placeholder = "Número de WhatsApp",
  className = ""
}: CountryCodeSelectorProps) {
  const [selectedCountry, setSelectedCountry] = useState('+51'); // Perú por defecto
  const [phoneNumber, setPhoneNumber] = useState('');

  // Detectar país del usuario automáticamente
  useEffect(() => {
    // Intentar obtener el país por IP (opcional)
    const detectCountry = async () => {
      try {
        // Puedes usar una API como ipapi.co o similar
        // const response = await fetch('https://ipapi.co/country/');
        // const countryCode = await response.text();
        // Buscar el país en la lista y establecerlo

        // Por ahora, mantenemos Perú por defecto
        setSelectedCountry('+51');
      } catch (error) {
        console.error('Error detecting country:', error);
      }
    };

    detectCountry();
  }, []);

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    // Actualizar el valor completo
    const fullNumber = `${countryCode}${phoneNumber}`;
    onChange(fullNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo permitir números
    const numbers = e.target.value.replace(/\D/g, '');
    setPhoneNumber(numbers);
    const fullNumber = `${selectedCountry}${numbers}`;
    onChange(fullNumber);
  };

  return (
    <div>
      <Label
        htmlFor="whatsapp"
        className="text-foreground font-medium"
      >
        WhatsApp({phoneNumber.length ?? 0}) <span className="text-red-500 text-base">*</span>
      </Label>

      <div className={`space-y-2 ${className}`}>
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Selector de país */}
          <div className="w-full sm:w-1/3">
            <Select
              value={selectedCountry}
              onValueChange={handleCountryChange}
            >
              <SelectTrigger className="bg-muted border-border text-foreground">
                <SelectValue placeholder="Código" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border max-h-60 overflow-y-auto">
                {countries.map((country) => (
                  <SelectItem
                    key={country.code}
                    value={country.code}
                    className="text-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.code}</span>
                      <span className="text-xs text-muted-foreground">{country.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Input del número */}
          <div className="w-full sm:w-2/3">
            <Input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder={placeholder}
              className="bg-muted border-border text-foreground"
            />
          </div>
        </div>

        {/* Mostrar el número completo (opcional) */}
        {value && (
          <p className="text-xs text-muted-foreground mt-1">
            Número completo: {value}
          </p>
        )}
      </div>
    </div>
  );
}