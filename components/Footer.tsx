// components/Footer.tsx
'use client';

import { Button } from "./ui/button";
import { Clock, MapPin, Phone, MessageCircle, Landmark, BookOpenCheck, CreditCard, Smartphone, Coins, Banknote } from "lucide-react";
import { useContact } from "@/lib/contact";
import { useRouter } from "next/navigation";
import Container from "./Container";
import { useWhatsApp } from "@/context/WhatsAppContext";
import { APP_COMMIT, APP_VERSION } from "@/lib/version";
import { useCompany } from "@/context/CompanyContext";
import { useBranch } from "@/context/BranchContext";

export default function Footer() {
  const router = useRouter();
  const { company } = useCompany();
  const { branch } = useBranch();

  const { handleCall, handleWhatsapp, getDefaultMessage } = useContact();
  const { whatsapp } = useWhatsApp();

  const handleCallClick = () => {
    handleCall(branch.phone);
  };

  const handleWhatsAppClick = () => {
    handleWhatsapp(whatsapp.number, getDefaultMessage(company.businessName));
  };

  const handlePaymentMethodsClick = () => {
    router.push('/payment-methods');
  };

  const handleComplaintsBookClick = () => {
    router.push('/complaints-book');
  };

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Restaurant Info */}
          <div className="col-span-1">
            <div className="mb-4">
              <span className="text-lg lg:text-xl font-bold text-foreground">{company.businessName}</span>
            </div>
            <p className="text-sm lg:text-base text-muted-foreground mb-2 leading-relaxed">{company.information}</p>
            {/* Botones de contacto principales */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Button
                onClick={handleCallClick}
                variant="outline"
              >
                <Phone className="w-4 h-4" />
                Llamar
                <span className="text-xs opacity-80">{branch.phone}</span>
              </Button>

              <Button
                onClick={handleWhatsAppClick}
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
                <span className="text-xs opacity-80">{whatsapp.number}</span>
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="font-semibold text-foreground mb-4">Contacto</h3>
            <div className="space-y-3 text-sm">
              <div
                className="flex items-start space-x-2 text-left hover:text-primary transition-colors cursor-pointer group"
              >
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-muted-foreground group-hover:text-primary">
                  {branch.address}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">
                  {branch.schedule}
                </span>
              </div>

              <div
                className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer group"
              >
                <Phone className="w-4 h-4 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-muted-foreground group-hover:text-primary">
                  {branch.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-medium text-foreground mb-4">Aceptamos</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
              <div
                className="flex items-center gap-3 py-2"
              >
                <CreditCard className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground text-sm">Tarjeta</span>
              </div>

              <div
                className="flex items-center gap-3 py-2"
              >
                <Smartphone className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground text-sm">Billetera digital</span>
              </div>

              <div
                className="flex items-center gap-3 py-2"
              >
                <Banknote className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground text-sm">Depósito bancario</span>
              </div>

              <div
                className="flex items-center gap-3 py-2"
              >
                <Coins className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground text-sm">Efectivo</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                <Button
                  onClick={handlePaymentMethodsClick}
                  size="sm"
                  variant="link"
                  className="p-0 justify-start gap-3 text-gray-400 hover:text-gray-600"
                >
                  <Landmark className="w-4 h-4" />
                  <span>Métodos de Pago</span>
                </Button>
                <Button
                  onClick={handleComplaintsBookClick}
                  size="sm"
                  variant="link"
                  className="p-0 justify-start gap-3 text-gray-400 hover:text-gray-600"
                >
                  <BookOpenCheck className="w-4 h-4" />
                  <span>Libro de Reclamaciones</span>
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
            © {new Date().getFullYear()} {company.businessName}. Todos los derechos reservados.
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