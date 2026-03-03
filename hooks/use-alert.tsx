import AlertKit, { alertKit } from "alert-kit";

AlertKit.setGlobalDefaults({
    headerClassName: 'bg-transparent px-4 py-3 border-b border-border',
    headerTitle: 'Catálogo',
    showCloseButton: false,
    primaryButtonClassName: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
    cancelButtonClassName: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-green-500 active:bg-green-600',
    acceptButtonClassName: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-red-500 active:bg-red-600',
    defaultTexts: {
        success: 'Éxito',
        error: 'Error',
        warning: 'Advertencia',
        info: 'Información',
        question: 'Confirmación',
        accept: 'Aceptar',
        cancel: 'Cancelar',
        ok: 'Aceptar'
    }
});

export const useAlert = () => {
    return alertKit;
};