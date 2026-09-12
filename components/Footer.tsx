// components/Footer.tsx
'use client';

import { Button } from "./ui/button";
import { Clock, MapPin, Phone, MessageCircle } from "lucide-react";
import { useContact } from "@/lib/contact";
import { useRouter } from "next/navigation";
import { Branch, Company, Whatsapp } from "@/types/api-type";
import Container from "./Container";
import { useWhatsApp } from "@/context/WhatsAppContext";
import { APP_COMMIT, APP_VERSION } from "@/lib/version";

interface FooterProps {
  company: Company;
  branch: Branch;
}

export default function Footer({ company, branch }: FooterProps) {
  const router = useRouter();
  const { handleCall, handleWhatsapp, getDefaultMessage, isMobile } = useContact();
  const { whatsapp } = useWhatsApp();

  const handleCallClick = () => {
    // handleCall(restaurantData.restaurant.phone);
    handleCall(branch.phone);
  };

  const handleWhatsAppClick = () => {
    // const message = getDefaultMessage(restaurantData.restaurant.name);
    const message = getDefaultMessage(company.name);
    // handleWhatsapp(restaurantData.restaurant.whatsapp, message);
    handleWhatsapp(whatsapp.number, message);
  };

  const handleMapClick = () => {
    // const address = encodeURIComponent(restaurantData.restaurant.address);
    const address = encodeURIComponent(branch.address);

    if (isMobile) {
      const mapsURL = `maps://?q=${address}`;
      const googleMapsURL = `https://maps.google.com/maps?q=${address}`;
      window.location.href = mapsURL;
      setTimeout(() => {
        window.open(googleMapsURL, '_blank');
      }, 500);
    } else {
      const googleMapsURL = `https://maps.google.com/maps?q=${address}`;
      window.open(googleMapsURL, '_blank');
    }
  };

  const handlePaymentMethodsClick = () => {
    router.push('/payment-methods');
  };

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Restaurant Info */}
          <div className="col-span-1 md:col-span-6">
            <div className="text-2xl font-bold mb-4">
              <span className="text-foreground">{company.name}</span>
            </div>
            <p className="text-muted-foreground mb-2 leading-relaxed">
              {company.information}
            </p>
            {/* Botones de contacto principales */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Button
                onClick={handleCallClick}
                variant="outline"
              >
                <Phone className="w-4 h-4" />
                Llamar
                <span className="text-xs opacity-80">
                  {branch.phone}
                </span>
              </Button>

              <Button
                onClick={handleWhatsAppClick}
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
                <span className="text-xs opacity-80">
                  {/* {restaurantData.restaurant.whatsapp} */}
                  {whatsapp.number}
                </span>
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-span-1 md:col-span-3">
            <h3 className="font-semibold text-foreground mb-4">Contacto</h3>
            <div className="space-y-3 text-sm">
              <button
                onClick={handleMapClick}
                className="flex items-start space-x-2 text-left hover:text-primary transition-colors cursor-pointer group"
              >
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-muted-foreground group-hover:text-primary">
                  {/* {restaurantData.restaurant.address} */}
                  {branch.address}
                </span>
              </button>

              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">
                  {/* {restaurantData.restaurant.hours} */}
                  {branch.schedule}
                </span>
              </div>

              <button
                onClick={handleCallClick}
                className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer group"
              >
                <Phone className="w-4 h-4 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-muted-foreground group-hover:text-primary">
                  {/* {restaurantData.restaurant.phone} */}
                  {branch.phone}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-3">
            {/* <h3 className="font-semibold text-foreground mb-4">Menú</h3> */}
            <h3 className="font-medium text-foreground mb-4">Aceptamos</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                // onClick={() => handlePaymentMethod("TARJETA")}
                className="text-xs text-primary hover:text-primary/80 bg-muted/30 px-3 py-2 rounded transition-colors"
              >
                💳 Tarjeta
              </button>

              <button
                // onClick={() => handlePaymentMethod("BILLETERA")}
                className="text-xs text-primary hover:text-primary/80 bg-muted/30 px-3 py-2 rounded transition-colors"
              >
                📱 Billetera digital
              </button>

              <button
                // onClick={() => handlePaymentMethod("DEPOSITO")}
                className="text-xs text-primary hover:text-primary/80 bg-muted/30 px-3 py-2 rounded transition-colors"
              >
                🏦 Depósito bancario
              </button>

              <button
                // onClick={() => handlePaymentMethod("EFECTIVO")}
                className="text-xs text-primary hover:text-primary/80 bg-muted/30 px-3 py-2 rounded transition-colors"
              >
                💵 Efectivo
              </button>
            </div>

            {/* Enlaces sociales adicionales */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleWhatsAppClick}
                  variant="ghost"
                  size="sm"
                  className="justify-start p-0 h-auto text-gray-400 hover:text-gray-600"
                >
                  🏦 Numero de Cuentas
                </Button>
                <Button
                  onClick={handleCallClick}
                  variant="ghost"
                  size="sm"
                  className="justify-start p-0 h-auto text-gray-400 hover:text-gray-600"
                >
                  📚 Libro de Reclamaciones
                </Button>
                {/* <Button
                  onClick={handlePaymentMethodsClick}
                  variant="ghost"
                  size="sm"
                  className="justify-start p-0 h-auto text-blue-600 hover:text-blue-700"
                >
                  💳 Información de pagos
                </Button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} {company.name}. Todos los derechos reservados.
          </div>

          <div className="flex items-center space-x-1">
            <div className="text-sm text-muted-foreground">Creado por</div>

            <a
              href="https://www.syssoftintegra.com/"
              className="text-sm font-bold text-foreground hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              @SysSoft Integra
            </a>
          </div>

          <div className="text-xs text-muted-foreground">
            v{APP_VERSION} · {APP_COMMIT.slice(0, 7)}
          </div>
        </div>
      </Container>
    </footer>
  );
}