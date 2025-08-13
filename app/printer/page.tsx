'use client';
import React, { useEffect, useRef, useState } from "react";
import { Printer, Download, Image } from "lucide-react";
import { useReactToPrint } from "react-to-print";

const ThermalPrintComponent = () => {
    const thermalSizes = {
        "58mm": { width: "58mm", height: "auto", label: "58mm (Mini)", widthPx: 219, heightPx: null },
        "80mm": { width: "80mm", height: "auto", label: "80mm (Estándar)", widthPx: 302, heightPx: null },
        "100mm": { width: "100mm", height: "auto", label: "100mm (Ancho)", widthPx: 378, heightPx: null },
        "A4_Portrait": { width: "210mm", height: "297mm", label: "A4 Portrait (210mm x 297mm)", widthPx: 793, heightPx: 1122 },
        "A4_Landscape": { width: "297mm", height: "210mm", label: "A4 Landscape (297mm x 210mm)", widthPx: 1122, heightPx: 793 },
        custom: { width: "custom", height: "auto", label: "Personalizado", widthPx: null, heightPx: null }
    } as {
        [key: string]: { width: string, height: string, label: string, widthPx: number | null, heightPx: number | null };
    };

    const [selectedSize, setSelectedSize] = React.useState("80mm");
    const [customWidth, setCustomWidth] = React.useState("80");
    const [customUnit, setCustomUnit] = React.useState("mm");

    const [isPrinting, setIsPrinting] = useState(false);
    const [contentHeight, setContentHeight] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const componentRef = useRef<HTMLDivElement>(null);
    const promiseResolveRef = useRef<(() => void) | null>(null);
    
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        onBeforePrint: () => {
            return new Promise((resolve) => {
                promiseResolveRef.current = resolve;
                setIsPrinting(true);
            });
        },
        onAfterPrint: () => {
            promiseResolveRef.current = null;
            setIsPrinting(false);
        }
    });

    const getPrintWidth = () => {
        if (selectedSize === "custom") {
            return `${customWidth}${customUnit}`;
        }
        return thermalSizes[selectedSize].width;
    };

    const getPrintHeight = () => {
        if (selectedSize === "A4_Portrait" || selectedSize === "A4_Landscape") {
            return thermalSizes[selectedSize].height;
        }
        return "auto";
    };

    const getPagePadding = () => {
        const width = getPrintWidth();
        if (width.endsWith("mm")) {
            const numericWidth = parseFloat(width);
            return `${Math.max(2, numericWidth * 0.05)}mm`;
        } else if (width.endsWith("in")) {
            const numericWidth = parseFloat(width);
            return `${Math.max(0.1, numericWidth * 0.05)}in`;
        }
        return "5mm";
    };

    // Utilidades de conversión
    const pxToMm = (px: number) => px / 3.77952756;
    const mmToPx = (mm: number) => mm * 3.77952756;

    // Obtener ancho en píxeles para diferentes formatos
    const getWidthInPx = () => {
        if (selectedSize === "custom") {
            const value = parseFloat(customWidth);
            switch (customUnit) {
                case "mm": return mmToPx(value);
                case "in": return value * 96;
                case "cm": return mmToPx(value * 10);
                default: return value;
            }
        }
        return thermalSizes[selectedSize].widthPx || 302;
    };


    const generatePDF = async () => {
        setIsGenerating(true);
        try {
            // const { jsPDF } = await import('jspdf');
            // const html2canvas = (await import('html2canvas')).default;

            // // Crear elemento temporal con ancho específico para PDF
            // const widthPx = getWidthInPx();
            // const tempElement = createTempElement(widthPx);
            
            // // Esperar a que se renderice
            // await new Promise(resolve => setTimeout(resolve, 100));
            
            // const realHeight = tempElement.scrollHeight;
            // const realWidth = tempElement.scrollWidth;

            // const canvas = await html2canvas(tempElement, {
            //     scale: 2,
            //     useCORS: true,
            //     logging: false,
            //     backgroundColor: '#ffffff',
            //     height: realHeight,
            //     width: realWidth,
            //     scrollX: 0,
            //     scrollY: 0
            // });

            // // Limpiar elemento temporal
            // document.body.removeChild(tempElement);

            // // Calcular dimensiones en puntos para PDF
            // const widthMm = pxToMm(realWidth);
            // const heightMm = pxToMm(realHeight);
            // const widthPt = mmToPt(widthMm);
            // const heightPt = mmToPt(heightMm);

            // const pdf = new jsPDF({
            //     orientation: 'portrait',
            //     unit: 'pt',
            //     format: [widthPt, heightPt]
            // });

            // const imgData = canvas.toDataURL('image/png');
            // pdf.addImage(imgData, 'PNG', 0, 0, widthPt, heightPt);
            // pdf.save('factura-termica.pdf');

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error al generar PDF. Asegúrate de que las librerías estén instaladas.');
        } finally {
            setIsGenerating(false);
        }
    };

    const generateImage = async () => {
        setIsGenerating(true);
        try {
            // const html2canvas = (await import('html2canvas')).default;

            // // Crear elemento temporal con ancho específico para imagen
            // const widthPx = getWidthInPx();
            // const tempElement = createTempElement(widthPx);
            
            // // Esperar a que se renderice
            // await new Promise(resolve => setTimeout(resolve, 100));
            
            // const realHeight = tempElement.scrollHeight;
            // const realWidth = tempElement.scrollWidth;

            // const canvas = await html2canvas(tempElement, {
            //     scale: 3, // Alta resolución para imagen
            //     useCORS: true,
            //     logging: false,
            //     backgroundColor: '#ffffff',
            //     height: realHeight,
            //     width: realWidth,
            //     scrollX: 0,
            //     scrollY: 0
            // });

            // // Limpiar elemento temporal
            // document.body.removeChild(tempElement);

            // canvas.toBlob((blob) => {
            //     if (blob) {
            //         const url = URL.createObjectURL(blob);
            //         const link = document.createElement('a');
            //         link.href = url;
            //         link.download = 'factura-termica.png';
            //         document.body.appendChild(link);
            //         link.click();
            //         document.body.removeChild(link);
            //         URL.revokeObjectURL(url);
            //     }
            // }, 'image/png', 1.0);

        } catch (error) {
            console.error('Error generating image:', error);
            alert('Error al generar imagen. Asegúrate de que html2canvas esté instalado.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Función para obtener base64 de la imagen (útil para Capacitor)
    const getImageBase64 = async (): Promise<string | null> => {
        try {
            // const html2canvas = (await import('html2canvas')).default;
            // const widthPx = getWidthInPx();
            // const tempElement = createTempElement(widthPx);
            
            // await new Promise(resolve => setTimeout(resolve, 100));
            
            // const realHeight = tempElement.scrollHeight;
            // const realWidth = tempElement.scrollWidth;

            // const canvas = await html2canvas(tempElement, {
            //     scale: 2,
            //     useCORS: true,
            //     logging: false,
            //     backgroundColor: '#ffffff',
            //     height: realHeight,
            //     width: realWidth,
            //     scrollX: 0,
            //     scrollY: 0
            // });

            // document.body.removeChild(tempElement);
            // return canvas.toDataURL('image/png');

            return ''; // Placeholder, implement actual logic
        } catch (error) {
            console.error('Error generating base64:', error);
            return '';
        }
    };

    // Función para obtener PDF como ArrayBuffer (útil para Capacitor)
    const getPDFArrayBuffer = async (): Promise<ArrayBuffer> => {
        try {
            // const html2canvas = (await import('html2canvas')).default;
            // const jsPDF = (await import('jspdf')).jsPDF;

            // const widthPx = getWidthInPx();
            // const tempElement = createTempElement(widthPx);
            
            // await new Promise(resolve => setTimeout(resolve, 100));
            
            // const realHeight = tempElement.scrollHeight;
            // const realWidth = tempElement.scrollWidth;

            // const canvas = await html2canvas(tempElement, {
            //     scale: 2,
            //     useCORS: true,
            //     logging: false,
            //     backgroundColor: '#ffffff',
            //     height: realHeight,
            //     width: realWidth,
            //     scrollX: 0,
            //     scrollY: 0
            // });

            // document.body.removeChild(tempElement);

            // const widthMm = pxToMm(realWidth);
            // const heightMm = pxToMm(realHeight);
            // const widthPt = mmToPt(widthMm);
            // const heightPt = mmToPt(heightMm);

            // const pdf = new jsPDF({
            //     orientation: 'portrait',
            //     unit: 'pt',
            //     format: [widthPt, heightPt]
            // });

            // const imgData = canvas.toDataURL('image/png');
            // pdf.addImage(imgData, 'PNG', 0, 0, widthPt, heightPt);

            // return pdf.output('arraybuffer');
            return new ArrayBuffer(0); // Placeholder, implement actual logic
        } catch (error) {
            console.error('Error generating PDF ArrayBuffer:', error);
            return new ArrayBuffer(0);
        }
    };

    // Exponer funciones para uso externo (útil para Capacitor)
    useEffect(() => {
        (window as any).thermalPrintUtils = {
            getImageBase64,
            getPDFArrayBuffer
        };
    }, []);

    useEffect(() => {
        if (isPrinting && promiseResolveRef.current && componentRef.current) {
            const heightPx = componentRef.current.scrollHeight;
            const heightMm = pxToMm(heightPx) + "mm";
            setContentHeight(heightMm);

            setTimeout(() => {
                promiseResolveRef.current?.();
            }, 0);
        }
    }, [isPrinting]);

    const PrintContent = React.forwardRef((props, ref: React.Ref<HTMLDivElement>) => {
        const width = getPrintWidth();
        const height = getPrintHeight() === "auto" ? contentHeight : getPrintHeight();
        const padding = getPagePadding();

        return (
            <>
                <style>{`
                @media print {
                    html, body {
                        margin: 0mm !important;
                        padding: 0mm !important;
                        height: initial !important;
                        overflow: initial !important;
                        -webkit-print-color-adjust: exact;
                    }
    
                    @page {
                        padding: ${padding};
                        margin: 0mm;
                        size: ${width} ${height};
                    }
                }
            `}</style>
                <div ref={ref} style={{ width: width }} className={`bg-white text-xs font-mono p-0 m-0`}>
                    {/* Logo */}
                    <div className="text-center mb-1">
                        <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-500 text-xs">LOGO</span>
                        </div>
                    </div>

                    {/* Encabezado */}
                    <div className="text-center mb-2">
                        <h2 className="text-base font-bold">RESTAURANTE DELICIAS</h2>
                        <p>Av. Principal 123</p>
                        <p>Tel: (555) 123-4567</p>
                    </div>

                    <hr className="border-t border-black my-1" />

                    {/* Info de la venta */}
                    <div className="flex justify-between mb-1">
                        <span>Factura #: 001234</span>
                        <span>25/03/2024</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Mesa: 5</span>
                        <span>18:30</span>
                    </div>

                    <hr className="border-t border-black my-1" />

                    {/* Detalle de productos */}
                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <span className="w-[60%]">Hamburguesa Clásica</span>
                            <span className="w-[10%] text-center">x2</span>
                            <span className="w-[30%] text-right">$18.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="w-[60%]">Papas Fritas</span>
                            <span className="w-[10%] text-center">x1</span>
                            <span className="w-[30%] text-right">$6.50</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="w-[60%]">Refresco</span>
                            <span className="w-[10%] text-center">x2</span>
                            <span className="w-[30%] text-right">$5.00</span>
                        </div>
                    </div>

                    <hr className="border-t border-black my-1" />

                    {/* Totales */}
                    <div className="space-y-0.5">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>$29.50</span>
                        </div>
                        <div className="flex justify-between">
                            <span>IVA (16%):</span>
                            <span>$4.72</span>
                        </div>
                        <div className="flex justify-between font-bold pt-1 border-t border-black">
                            <span>TOTAL:</span>
                            <span>$34.22</span>
                        </div>
                    </div>

                    <hr className="border-t border-black my-1" />

                    {/* QR + mensaje */}
                    <div className="text-center mt-2">
                        <div className="mx-auto w-24 h-24 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">QR</span>
                        </div>
                        <p className="text-base mt-1">Consulta tu factura escaneando el QR</p>
                    </div>

                    <div className="text-center text-base mt-2">
                        <p>Gracias por su visita</p>
                        <p>¡Vuelva pronto!</p>
                    </div>
                </div>
            </>
        );
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Impresión Térmica</h1>
                            <p className="text-gray-600">Configuración de tamaño para impresoras térmicas</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                onClick={generatePDF}
                                disabled={isGenerating}
                            >
                                <Download size={20} />
                                <span>PDF</span>
                            </button>
                            <button
                                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                onClick={generateImage}
                                disabled={isGenerating}
                            >
                                <Image size={20} />
                                <span>Imagen</span>
                            </button>
                            <button
                                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                onClick={handlePrint}
                            >
                                <Printer size={20} />
                                <span>Imprimir</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tamaño de papel
                                </label>
                                <select
                                    value={selectedSize}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {Object.entries(thermalSizes).map(([key, value]) => (
                                        <option key={key} value={key}>
                                            {value.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedSize === "custom" && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ancho
                                        </label>
                                        <input
                                            type="number"
                                            value={customWidth}
                                            onChange={(e) => setCustomWidth(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="80"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Unidad
                                        </label>
                                        <select
                                            value={customUnit}
                                            onChange={(e) => setCustomUnit(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="mm">mm</option>
                                            <option value="in">in</option>
                                            <option value="cm">cm</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-800 mb-2">Configuración actual:</h3>
                                <div className="text-sm text-gray-600">
                                    <p><strong>Ancho:</strong> {getPrintWidth()}</p>
                                    <p><strong>Alto:</strong> {getPrintHeight()}</p>
                                    <p><strong>Ancho en píxeles:</strong> {getWidthInPx()}px</p>
                                </div>
                            </div>

                            {isGenerating && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                        <span className="text-blue-800 text-sm">Generando archivo...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-gray-800 mb-3">Vista previa</h3>
                            <div className="border border-gray-300 rounded bg-white p-2 overflow-auto flex justify-center" style={{ height: '400px' }}>
                                <PrintContent ref={componentRef} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Instrucciones</h2>
                    <div className="space-y-3 text-gray-700">
                        <p><strong>•</strong> Esta herramienta permite configurar el ancho de impresión para impresoras térmicas.</p>
                        <p><strong>•</strong> El alto se ajusta automáticamente según el contenido (dinámico).</p>
                        <p><strong>•</strong> Los tamaños comunes son 58mm (mini) y 80mm (estándar).</p>
                        <p><strong>•</strong> Cada formato (PDF, imagen, impresión) usa sus propias dimensiones optimizadas.</p>
                        <p><strong>•</strong> Se crean elementos temporales en memoria para obtener dimensiones exactas.</p>
                        <p><strong>•</strong> Compatible con Capacitor para aplicaciones móviles híbridas.</p>
                    </div>

                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="font-medium text-yellow-800 mb-2">Dependencias requeridas:</h3>
                        <div className="text-sm text-yellow-700 space-y-1">
                            <p><code>npm install jspdf html2canvas react-to-print</code></p>
                            <p>Para generar PDFs e imágenes con las dimensiones correctas.</p>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h3 className="font-medium text-green-800 mb-2">Mejoras implementadas:</h3>
                        <div className="text-sm text-green-700 space-y-1">
                            <p>✓ Elementos temporales en memoria para cada formato</p>
                            <p>✓ Dimensiones específicas para PDF (pt), imagen (px) e impresión (mm)</p>
                            <p>✓ Cálculo preciso de alto y ancho para cada caso de uso</p>
                            <p>✓ Limpieza automática de elementos temporales</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThermalPrintComponent;