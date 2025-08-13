// utils/contact.ts

/**
 * Detecta si el usuario está en un dispositivo móvil
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth <= 768;
};

/**
 * Formatea número de teléfono para enlaces tel:
 * Ejemplo: "+51 123 456 789" -> "+51123456789"
 */
export const formatPhoneForTel = (phone: string): string => {
  return phone.replace(/[\s\-\(\)]/g, '');
};

/**
 * Formatea número para WhatsApp (sin el + inicial)
 * Ejemplo: "+51 123 456 789" -> "51123456789"
 */
export const formatPhoneForWhatsApp = (phone: string): string => {
  return phone.replace(/[\s\-\(\)+]/g, '');
};

/**
 * Maneja la acción de llamar
 */
export const handleCall = (phone: string): void => {
  const formattedPhone = formatPhoneForTel(phone);

  window.location.href = `tel:${formattedPhone}`;
  
  // if (isMobileDevice()) {
  //   // En móvil: abrir app de llamadas directamente
  //   window.location.href = `tel:${formattedPhone}`;
  // } else {
  //   // En web: mostrar opciones o copiar número
  //   if (navigator.clipboard) {
  //     navigator.clipboard.writeText(formattedPhone).then(() => {
  //       alert(`Número copiado: ${phone}\n\nPuedes usar tu teléfono para llamar o una aplicación de llamadas web.`);
  //     }).catch(() => {
  //       // Fallback si no se puede copiar
  //       prompt('Número de teléfono (Ctrl+C para copiar):', phone);
  //     });
  //   } else {
  //     // Fallback para navegadores sin clipboard API
  //     prompt('Número de teléfono (Ctrl+C para copiar):', phone);
  //   }
  // }
};

/**
 * Maneja la acción de WhatsApp
 */
export const handleWhatsApp = (phone: string, message?: string): void => {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const encodedMessage = message ? encodeURIComponent(message) : '';
  
  if (isMobileDevice()) {
    // En móvil: intentar abrir la app nativa primero
    const whatsappURL = `whatsapp://send?phone=${formattedPhone}&text=${encodedMessage}`;
    const webURL = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    
    // Intentar abrir la app nativa
    window.location.href = whatsappURL;
    
    // Fallback a web si la app no está disponible
    setTimeout(() => {
      window.open(webURL, '_blank');
    }, 500);
  } else {
    // En web: abrir WhatsApp Web directamente
    const webURL = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    window.open(webURL, '_blank');
  }
};

/**
 * Genera mensaje predeterminado para WhatsApp
 */
export const getDefaultWhatsAppMessage = (restaurantName: string): string => {
  return `¡Hola! Me interesa conocer más sobre ${restaurantName}. ¿Podrían ayudarme con información sobre su menú y pedidos?`;
};

/**
 * Hook personalizado para manejar acciones de contacto
 */
export const useContact = () => {
  return {
    handleCall: handleCall,
    handleWhatsapp: handleWhatsApp,
    isMobile: isMobileDevice(),
    formatPhoneForTel,
    formatPhoneForWhatsApp,
    getDefaultMessage: getDefaultWhatsAppMessage
  };
};