"use client"
import { Button } from "./ui/button";
import { Clock, Contact, MapPin, Phone, CreditCard, DollarSign, Smartphone } from "lucide-react";
import { useContact } from "@/lib/contact";
import { useRouter } from "next/navigation";
import { Branch, Company, Whatsapp } from "@/types/api-type";

interface FooterProps {
  company: Company;
  whatsapp: Whatsapp;
  branch: Branch;
}

export default function Footer({ company, branch }: FooterProps) {
  const router = useRouter();
  const { handleCall, isMobile } = useContact();

  const handleCallClick = () => {
    handleCall(branch.phone);
  };

  const handleContactClick = () => {
    router.push("/contact");
  };

  const handleMapClick = () => {
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

  // Lista de métodos de pago (puedes reemplazar con branch.paymentMethods si existe en tu API)
  const paymentMethods = [
    { name: "Tarjetas de crédito/débito", icon: <CreditCard className="w-4 h-4 text-primary flex-shrink-0" /> },
    { name: "Efectivo", icon: <DollarSign className="w-4 h-4 text-primary flex-shrink-0" /> },
    { name: "Transferencia bancaria", icon: <Smartphone className="w-4 h-4 text-primary flex-shrink-0" /> },
    { name: "Yape/Plin", icon: <Smartphone className="w-4 h-4 text-primary flex-shrink-0" /> },
  ];

  return (
    <footer className="bg-card border-t border-border py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Restaurant Info */}
          <div className="md:col-span-2">
            <div className="text-2xl font-bold mb-4">
              <span className="text-foreground">{company.name}</span>
            </div>
            <p className="text-muted-foreground mb-2 leading-relaxed">
              {company.information}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Button
                onClick={handleCallClick}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                {isMobile ? 'Llamar Ahora' : 'Llamar'}
                <span className="text-xs opacity-80">{branch.phone}</span>
              </Button>
              <Button
                onClick={handleContactClick}
                variant="outline"
              >
                <Contact className="w-4 h-4" />
                Contactar
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contacto</h3>
            <div className="space-y-3 text-sm">
              <button
                onClick={handleMapClick}
                className="flex items-start space-x-2 text-left hover:text-primary transition-colors cursor-pointer group"
              >
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-muted-foreground group-hover:text-primary">
                  {branch.address}
                </span>
              </button>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{branch.schedule}</span>
              </div>
              <button
                onClick={handleCallClick}
                className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer group"
              >
                <Phone className="w-4 h-4 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-muted-foreground group-hover:text-primary">
                  {branch.phone}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Links: Métodos de pago */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Métodos de pago</h3>
            <div className="space-y-2 text-sm">
              {paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center space-x-2 text-muted-foreground">
                  {method.icon}
                  <span>{method.name}</span>
                </div>
              ))}
            </div>
            {/* <div className="mt-4 pt-4 border-t border-border">
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleContactClick}
                  variant="ghost"
                  size="sm"
                  className="justify-start p-0 h-auto text-green-600 hover:text-green-700"
                >
                  💬 Pedidos por WhatsApp
                </Button>
                <Button
                  onClick={() => router.push('/complaints-book')}
                  variant="ghost"
                  size="sm"
                  className="justify-start p-0 h-auto text-muted-foreground hover:text-primary"
                >
                  📖 Libro de reclamaciones
                </Button>
              </div>
            </div> */}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} {company.name}. Todos los derechos reservados.
          </div>
          <div className="flex items-center space-x-2">
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
        </div>
      </div>
    </footer>
  );
}
