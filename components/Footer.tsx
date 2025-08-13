// import restaurantData from "@/data/restaurant-data.json";
import { Button } from "./ui/button";
import { Clock, MapPin, Phone, MessageCircle, CreditCard, ExternalLink } from "lucide-react";
import { useContact } from "@/lib/contact";
import { useRouter } from "next/navigation";
import { Branch, Category, Company, Whatsapp } from "@/types/api-type";
import Image from "next/image";

interface FooterProps {
  company: Company;
  categories: Category[];
  whatsapp: Whatsapp;
  branch: Branch;
  setSelectedCategory: (category: string) => void;
}

export default function Footer({ company, categories, whatsapp, branch, setSelectedCategory }: FooterProps) {
  const router = useRouter();
  const { handleCall, handleWhatsapp, getDefaultMessage, isMobile } = useContact();

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
    <footer className="bg-card border-t border-border py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Restaurant Info */}
          <div className="md:col-span-2">
            <div className="text-2xl font-bold font-display mb-4">
              {/* <span className="text-primary">{restaurantData.restaurant.owner}</span>{" "}
              <span className="text-foreground">{restaurantData.restaurant.name}</span> */}
              <span className="text-foreground">{company.name}</span>
            </div>
            <p className="text-muted-foreground mb-2 leading-relaxed">
              {/* {restaurantData.restaurant.description} */}
              {company.information}
            </p>
            {/* <p className="text-muted-foreground mb-6 leading-relaxed">
              {restaurantData.restaurant.typeDocument}: {restaurantData.restaurant.document}
            </p> */}

            {/* Botones de contacto principales */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Button
                onClick={handleCallClick}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                {isMobile ? 'Llamar Ahora' : 'Llamar'}
                <span className="text-xs opacity-80">
                  {/* {restaurantData.restaurant.phone} */}
                  {branch.phone}
                </span>
              </Button>

              <Button
                onClick={handleWhatsAppClick}
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
                <span className="text-xs opacity-80">
                  {/* {restaurantData.restaurant.whatsapp} */}
                  {whatsapp.number}
                </span>
              </Button>
            </div>

            {/* Botón de Métodos de Pago */}
            {/* <div className="mb-4">
              <Button
                onClick={handlePaymentMethodsClick}
                variant="outline"
                className="w-full sm:w-auto border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Ver Métodos de Pago
                <ExternalLink className="w-3 h-3" />
              </Button>
              <p className="text-xs text-muted-foreground mt-1 text-center sm:text-left">
                Yape, Plin, transferencias bancarias y más
              </p>
            </div> */}

            {/* Información de contacto rápido */}
            {/* <div className="text-sm text-muted-foreground">
              {isMobile ? (
                <div className="space-y-1">
                  <p>📱 Toca para llamar o escribir por WhatsApp</p>
                  <p>🗺️ Toca la dirección para ver en mapas</p>
                  <p>💳 Ve todos nuestros métodos de pago</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p>💻 En móvil: llamadas y WhatsApp directos</p>
                  <p>🖱️ Click en dirección para abrir mapas</p>
                  <p>💳 Revisa nuestras opciones de pago</p>
                </div>
              )}
            </div> */}
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 font-display">Contacto</h3>
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

              <button
                onClick={handleWhatsAppClick}
                className="flex items-center space-x-2 hover:text-green-600 transition-colors cursor-pointer group mt-2"
              >
                <MessageCircle className="w-4 h-4 text-green-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-muted-foreground group-hover:text-green-600">
                  {/* WhatsApp: {restaurantData.restaurant.whatsapp} */}
                  WhatsApp: {whatsapp.number}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 font-display">Menú</h3>
            <div className="space-y-2 text-sm">
              {/* {restaurantData.categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))} */}
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {/* <span>{category.icon}</span>
                  <span>{category.name}</span> */}
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={20}
                    height={20}
                  />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* <div className="mt-6">
              <h4 className="font-medium text-foreground mb-2">Aceptamos</h4>
              <div className="flex flex-wrap gap-2">
                {restaurantData.paymentMethods
                  .filter((method) => method.available)
                  .slice(0, 6) // Mostrar solo los primeros 6
                  .map((method) => (
                    <span
                      key={method.id}
                      className="text-lg bg-muted/30 p-1 rounded"
                      title={method.name}
                    >
                      {method.icon}
                    </span>
                  ))}
                {restaurantData.paymentMethods.filter(m => m.available).length > 6 && (
                  <button
                    onClick={handlePaymentMethodsClick}
                    className="text-xs text-primary hover:text-primary/80 bg-muted/30 px-2 py-1 rounded transition-colors"
                  >
                    +{restaurantData.paymentMethods.filter(m => m.available).length - 6} más
                  </button>
                )}
              </div>
            </div> */}

            {/* Enlaces sociales adicionales */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleWhatsAppClick}
                  variant="ghost"
                  size="sm"
                  className="justify-start p-0 h-auto text-green-600 hover:text-green-700"
                >
                  💬 Pedidos por WhatsApp
                </Button>
                {/* <Button
                  onClick={handleCallClick}
                  variant="ghost"
                  size="sm"
                  className="justify-start p-0 h-auto text-primary hover:text-primary/80"
                >
                  📞 Reservas telefónicas
                </Button> */}
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
            {/* © {new Date().getFullYear()} {restaurantData.restaurant.name}. Todos los derechos reservados. */}
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