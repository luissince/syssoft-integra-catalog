"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Eye, LucideMapPinHouse, Minus, PhoneCall, Play, Plus, QrCode, TimerIcon } from "lucide-react";
import { FaCcAmex, FaCcMastercard, FaCcVisa, FaMotorcycle, FaWhatsapp } from "react-icons/fa";
import { ShoppingCart } from "lucide-react";
import { ReactNode } from "react";

interface CartButtonProps {
    itemCount: number;
    onClick: () => void;
    className?: string;
}

const CartButton = ({ itemCount, onClick, className = "" }: CartButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`relative p-2 rounded-md bg-orange-600 border-2 border-orange-600 text-white hover:bg-orange-700 transition-colors ${className}`}
        >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                </span>
            )}
        </button>
    );
};

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    footer?: ReactNode;
    className?: string;
}

export const BaseModal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    className = "",
}: BaseModalProps) => {
    // Efecto para bloquear/desbloquear el scroll del fondo
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"; // Bloquea el scroll
        } else {
            document.body.style.overflow = "auto"; // Desbloquea el scroll
        }
        // Limpieza: Asegura que el scroll se reactive si el componente se desmonta
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div
                className={`bg-[#212121] rounded-lg w-full max-w-md max-h-[90vh] flex flex-col relative ${className}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-[#404040]">
                    {title && (
                        <h2 className="text-white text-xl font-bold">{title}</h2>
                    )}
                    <button
                        onClick={onClose}
                        className="text-gray-300 hover:text-white text-xl"
                    >
                        &times;
                    </button>
                </div>

                {/* Body (scrollable) */}
                <div className="overflow-y-auto px-6 pb-6 flex-1">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-4 border-t border-[#404040]">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

enum PlateType {
    SOUP = "Sopa",
    MENU = "Menú",
    SPECIALS = "Especiales",
    DRINKS = "Bebidas",
    COFFE = "Café",
    CACAO = "Cacao",
    WINES = "Vinos",
    BREADS = "Panes",
    FRUIT = "Frutas",
    EGG = "Huevos",
    DAIRY = "Lacteos",
    JUICES = "Jugos",
    JAM = "Mermeladas",
    CREAMS = "Cremas",
}

interface OptionButtonProps {
    option: PlateType;
    activeOption: PlateType;
    onChange: (option: PlateType) => void;
    label: string;
}

const OptionButton = ({ option, activeOption, onChange, label }: OptionButtonProps) => (
    <button
        onClick={() => onChange(option)}
        className={`text-white text-base px-4 rounded-md ${activeOption === option ? "bg-[#212121]" : "bg-[#404040]"
            }`}
    >
        <p
            className={`h-full p-2 ${activeOption === option ? "border-b-2 border-orange-500" : ""
                }`}
        >
            {label}
        </p>
    </button>
);

interface PlateIncludedProps {
    name: string
}

interface PlateCardProps {
    image: string
    name: string
    description: string
    price: number
    isOffer: boolean
    quantity: number
    type: PlateType
    includes: PlateIncludedProps[]
}

const listPlates: PlateCardProps[] = [
    {
        image: "soup/aguadito-de-pollo.jpeg",
        name: "Aguadito de pollo",
        description: "Ají de gallina, arroz chaufa y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.SOUP,
        includes: [
            {
                name: "Aguadito de pollo",
            },
            {
                name: "Papa a la huancaína",
            },
            {
                name: "Arroz chaufa",
            },
            {
                name: "Ají de gallina",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "soup/caldo-de-gallina.jpeg",
        name: "Caldo de gallina",
        description: "Ají de gallina, arroz chaufa y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.SOUP,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "soup/chairo-andino.jpeg",
        name: "Chairo andino",
        description: "Ají de gallina, arroz chaufa y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.SOUP,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "soup/chupe-de-camarones.jpeg",
        name: "Chupe de camarones",
        description: "Ají de gallina, arroz chaufa y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.SOUP,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "soup/chupe-de-pescado.jpeg",
        name: "Chupe de pescado",
        description: "Ají de gallina, arroz chaufa y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.SOUP,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "soup/inchicapi.jpeg",
        name: "Inchicapi",
        description: "Ají de gallina, arroz chaufa y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.SOUP,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "soup/patasca.jpeg",
        name: "Patasca",
        description: "Ají de gallina, arroz chaufa y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.SOUP,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "soup/sancochado.jpeg",
        name: "Sancochado",
        description: "Ají de gallina, arroz chaufa y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.SOUP,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "soup/sopa-criolla.jpeg",
        name: "Sopa criolla",
        description: "Ají de gallina, arroz chaufa y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.SOUP,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "soup/sopa-quinua.jpeg",
        name: "Sopa quinua",
        description: "Ají de gallina, arroz chaufa y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.SOUP,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },

    {
        image: "menu/seco-de-res.jpeg",
        name: "Seco de res",
        description: "Ají de gallina, arroz chaufa y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.MENU,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "menu/aji-de-gallina.jpeg",
        name: "Aji de Gallina",
        description: "Ají de gallina, arroz chaufa y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.MENU,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "menu/arroz-con-marisco.jpeg",
        name: "Arroz con marisco",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.MENU,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "menu/arroz-con-pollo.jpeg",
        name: "Arroz con pollo",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.MENU,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "menu/arroz-tapado.jpeg",
        name: "Arroz tapado",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.MENU,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "menu/carapulcra.jpeg",
        name: "Carapulcra",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.MENU,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "menu/causa-de-lima.jpeg",
        name: "Causa de limeña",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.MENU,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "menu/pachamanca-ala-olla.jpeg",
        name: "Pachamanca ala olla",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.MENU,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "menu/papa-rellena.jpeg",
        name: "Papa rellena",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.MENU,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "menu/rocoto-relleno-con-pure.jpeg",
        name: "Rocoto relleno con pure",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.MENU,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "menu/tallarin-rojo.jpeg",
        name: "Tallarin rojo",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.MENU,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },

    {
        image: "specials/tallain-verde-con-bistec.jpeg",
        name: "Tallain verde con bistec",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.SPECIALS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "specials/pollo-ala-braza.jpeg",
        name: "Pollo a la braza",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.SPECIALS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "specials/arroz-chaufa.jpeg",
        name: "Arroz Chaufa",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.SPECIALS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "specials/chancho-ala-caja-china.jpeg",
        name: "Chancho a la caja china",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.SPECIALS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "specials/chicharron.jpeg",
        name: "Chicharon",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.SPECIALS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "specials/lomo-saltado.jpeg",
        name: "Lomo Saltado",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.SPECIALS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "specials/milanesa-con-papas.jpeg",
        name: "Milanesa con papas",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.SPECIALS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },

    {
        image: "wines/vino.jpeg",
        name: "Vino Seco",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.WINES,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "wines/vino-blanco.jpeg",
        name: "Vino Blanco",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.WINES,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "wines/vino-dulce.jpeg",
        name: "Vino dulce",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.WINES,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },

    {
        image: "drinks/agua.jpeg",
        name: "Agua",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.DRINKS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "drinks/chicha-morada.jpeg",
        name: "Chicha morada",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.DRINKS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "drinks/emoliente.jpeg",
        name: "Emoliente",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.DRINKS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "drinks/pisco-saur.jpeg",
        name: "Pisco saur",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.DRINKS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "drinks/refresco-de-maracuya.jpeg",
        name: "Refresco de maracuya",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.DRINKS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "drinks/te-de-coca.jpeg",
        name: "Te de coca",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.DRINKS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "drinks/infusiones.jpeg",
        name: "Infusiones",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.DRINKS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },


    {
        image: "cafe/cafe-con-leche.jpeg",
        name: "Café con leche",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.COFFE,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "cafe/cafe.jpeg",
        name: "Café",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.COFFE,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "cafe/leche-con-cafe.jpeg",
        name: "Leche con cafe",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.COFFE,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },

    {
        image: "cacao/cacao-con-leche.jpeg",
        name: "Leche con cafe",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.CACAO,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },

    {
        image: "breads/brioche.jpeg",
        name: "Brioche",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.BREADS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "breads/cornetto.jpeg",
        name: "Cornetto",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.BREADS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "breads/hokaido.jpeg",
        name: "Pan hokaido",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.BREADS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "breads/muffin-cacao.jpeg",
        name: "Muffin de cacao",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.BREADS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "breads/muffin.jpeg",
        name: "Muffin",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.BREADS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "breads/pan-masa-madre-salvado.jpeg",
        name: "Pan masa madre con salvado",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.BREADS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "breads/pasa-masa-madre-blanco.jpeg",
        name: "Pasa masa madre blanco",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.BREADS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "breads/pica-donna.jpeg",
        name: "Pica Donna",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.BREADS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },

    {
        image: "frutas/arandono.jpeg",
        name: "Arandono",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.FRUIT,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "frutas/ciruela.jpeg",
        name: "Ciruela",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.FRUIT,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "frutas/frambuesa.jpeg",
        name: "Frambuesa",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.FRUIT,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "frutas/fresas.jpeg",
        name: "Fresas",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.FRUIT,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "frutas/higos.jpeg",
        name: "Higos",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.FRUIT,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "frutas/moras.jpeg",
        name: "Moras",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.FRUIT,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "frutas/uvas-negras.jpeg",
        name: "Uvas Negras",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.FRUIT,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },

    {
        image: "huevos/omelet.jpeg",
        name: "Omelet",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.EGG,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },

    {
        image: "juegos/papaya.jpeg",
        name: "Papaya",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.JUICES,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },

    {
        image: "lacteos/leche.jpeg",
        name: "Leche",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.DAIRY,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "lacteos/queso.jpeg",
        name: "Queso",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.DAIRY,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "lacteos/yogurt-griego.jpeg",
        name: "Yogurt Griego",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.DAIRY,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "lacteos/yogurt-natural.jpeg",
        name: "Yogurt Natural",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.DAIRY,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },

    {
        image: "mermeladas/fresa-con-higos.jpeg",
        name: "Fresa con higos",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.JAM,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
    {
        image: "mermeladas/piña-con-naranja.jpeg",
        name: "Piña con naranja",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.JAM,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },

    {
        image: "cremas/crema-de-palta.jpeg",
        name: "Crema de palta",
        description: "Arroz chaufa, ají de gallina y papa a la huancaína.",
        price: 25.90,
        isOffer: true,
        quantity: 1,
        type: PlateType.CREAMS,
        includes: [
            {
                name: "Aguadito de pollo",
            }
        ] as PlateIncludedProps[],
    },
]

const PlateCard = (plate: PlateCardProps) => {
    const [isImageFullscreen, setIsImageFullscreen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);

    const handleAddToCart = (quantity: number, note: string) => {
        console.log(`Agregado al carrito: ${plate.name}, Cantidad: ${quantity}, Nota: ${note}`);
        // Aquí iría la lógica para agregar al carrito (usando un contexto o estado global)
    };

    return (
        <>
            <div className="group overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="relative flex items-center justify-center overflow-hidden">
                    <img
                        src={plate.image}
                        alt={plate.name}
                        className="w-full h-36 object-cover"
                        onClick={() => setIsImageFullscreen(true)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center rounded-md transition-all duration-200 cursor-pointer"
                        onClick={() => setIsImageFullscreen(true)}>
                        <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                    {plate.isOffer && (
                        <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                            Oferta
                        </span>
                    )}
                </div>
                <div className="py-3">
                    <h4 className="font-bold text-white text-xl mb-1">{plate.name}</h4>
                    <p className="text-[#797979] text-sm mb-2">{plate.description}</p>
                    <div className="flex justify-between items-center">
                        <p className="text-orange-600 font-semibold text-lg">S/ {plate.price}</p>
                        <span className="text-[#797979] text-xs px-2 py-1 rounded-full">
                            {plate.quantity} porción
                        </span>
                    </div>
                    <div className="flex flex-row items-center justify-end gap-2">
                        <button
                            onClick={() => setIsAddToCartModalOpen(true)}
                            className="px-3 py-2 bg-orange-600 border-solid border-orange-600 border-2 text-white rounded-md hover:bg-orange-700 transition-colors">
                            <Plus className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-3 py-2 bg-[#161616] border-solid border-[#797979] border-2 text-white rounded-md hover:bg-orange-700 transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <PlateDetailModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    image={plate.image}
                    name={plate.name}
                    description={plate.description}
                    price={plate.price}
                    includes={plate.includes}
                />

                <AddToCartModal
                    isOpen={isAddToCartModalOpen}
                    onClose={() => setIsAddToCartModalOpen(false)}
                    image={plate.image}
                    name={plate.name}
                    price={plate.price}
                    onAddToCart={handleAddToCart}
                />
            </div>

            {/* Modal de imagen en pantalla completa */}
            {isImageFullscreen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[60] p-4"
                    onClick={() => setIsImageFullscreen(false)}
                >
                    <button
                        onClick={() => setIsImageFullscreen(false)}
                        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
                    >
                        &times;
                    </button>
                    <img
                        src={plate.image}
                        alt={plate.name}
                        className="max-w-full max-h-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
};

interface PlateDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    image: string;
    name: string;
    description: string;
    price: number;
    includes: PlateIncludedProps[];
}


const PlateDetailModal = ({
    isOpen,
    onClose,
    image,
    name,
    description,
    price,
    includes,
}: PlateDetailModalProps) => {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title={name}>
            {/* Imagen del plato */}
            <div className="flex justify-center mb-4">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-64 object-cover rounded-md"
                />
            </div>

            {/* Precio */}
            <p className="text-orange-500 font-semibold text-xl mb-4 text-center">
                S/ {price}
            </p>

            {/* Descripción */}
            <div className="bg-[#161616] p-4 rounded-md mb-4">
                <h3 className="text-white text-base font-semibold mb-2">
                    Descripción:
                </h3>
                <p className="text-gray-300 text-justify">{description}</p>
            </div>

            {/* Incluye */}
            <div className="bg-[#161616] p-4 rounded-md">
                <h3 className="text-white text-base font-semibold mb-2">
                    Incluye:
                </h3>
                <ul>
                    {includes.map((include, index) => (
                        <li key={index} className="text-gray-300 text-justify text-sm">
                            {index + 1}. {include.name}
                        </li>
                    ))}
                </ul>
            </div>
        </BaseModal>
    );
};

interface AddToCartModalProps {
    isOpen: boolean;
    onClose: () => void;
    image: string;
    name: string;
    price: number;
    onAddToCart: (quantity: number, note: string) => void;
}


const AddToCartModal = ({
    isOpen,
    onClose,
    image,
    name,
    price,
    onAddToCart,
}: AddToCartModalProps) => {
    const [quantity, setQuantity] = useState(1);
    const [note, setNote] = useState("");

    const handleIncrement = () => setQuantity(quantity + 1);
    const handleDecrement = () => setQuantity(Math.max(1, quantity - 1));

    const handleAddToCart = () => {
        onAddToCart(quantity, note);
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={name}
            footer={
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition-colors"
                >
                    Agregar al carrito
                </button>
            }
        >
            {/* Imagen */}
            <div className="flex justify-center mb-4">
                <img
                    src={image}
                    alt={name}
                    className="w-32 h-32 object-cover rounded-md"
                />
            </div>

            {/* Precio */}
            <p className="text-orange-500 font-semibold text-xl mb-4 text-center">
                S/ {price}
            </p>

            {/* Cantidad */}
            <div className="flex items-center justify-center gap-4 mb-4">
                <button
                    onClick={handleDecrement}
                    className="bg-[#404040] text-white w-8 h-8 rounded-full flex items-center justify-center"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <span className="text-white text-lg">{quantity}</span>
                <button
                    onClick={handleIncrement}
                    className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {/* Nota */}
            <div className="mb-4">
                <label className="block text-white text-sm font-semibold mb-2">
                    Nota (opcional):
                </label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ej: Sin cebolla, picante, etc."
                    className="w-full p-2 bg-[#161616] text-white rounded-md border border-[#797979] focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                />
            </div>
        </BaseModal>
    );
};

export default function HomeChicken() {

    const [activeOption, setActiveOption] = useState<PlateType>(PlateType.MENU);

    const handleOptionChange = (option: PlateType) => {
        setActiveOption(option);
    };

    return (
      <>
      <style>{`
        body {
            background-color: #161616;
        }
      `}</style>
        <div className="relative">
            {/* Background */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-center -z-10 bg-black opacity-40">
                <img
                    src="https://thumbs.dreamstime.com/b/gambas-de-pollo-costillas-cerdo-y-salchicha-en-una-barbacoa-banner-panor%C3%A1mico-tambores-marinado-picante-sobre-parrilla-el-fuego-178404213.jpg?w=3072"
                    alt="logo"
                    className="h-96 w-full object-cover"
                />
            </div>

            {/* Main: Cuerpo */}
            <main className="container mx-auto px-4 md:px-6 py-8 max-w-screen-2xl relative">

                {/* Section: Header */}
                {/* Diseño mobil y desktop */}
                <section className="flex flex-col items-center justify-center mt-4 mb-14">
                    <p className="italic text-gray-200 font-playfair font-light text-xl md:text-2xl mb-2">Delicias</p>
                    <h3 className="font-bold text-8xl md:text-9xl font-greatvibes bg-clip-text text-transparent bg-gradient-to-t from-orange-600 to-yellow-500 px-4 pt-3">
                        Pollos
                    </h3>
                    <h4 className="font-bold text-white text-4xl md:text-5xl -mt-5 mb-4">& Parrillas</h4>
                    <div className="flex items-center gap-4">
                        <button className="w-full bg-[#161616] border-solid border-[#797979] border-2 text-white text-base font-normal py-2 px-4 rounded-md flex items-center justify-center gap-2">
                        <Play className="w-4 h-4 mr-2" />
                        Ver Video Tutorial
                        </button>
                        <CartButton itemCount={0} onClick={() => { }} className="px-4 md:flex hidden" />
                    </div>
                </section>

                {/* Section: Información */}
                {/* Diseño mobil y desktop */}
                <section className="flex flex-col items-center justify-center gap-y-1 mb-8 md:hidden">
                    <div className="bg-[#212121] rounded-xl p-4 border-solid border-[#797979] border-4 flex items-center justify-center">
                        <Image src="logo-chicken.png" alt="lo˝go" width={100} height={100} />
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-3xl">Chicken</h2>
                        <p className="text-gray-400 text-base font-light">Polleria & Parrilla</p>
                    </div>
                </section>

                {/* Section: Opciones */}
                {/* Diseño mobil */}
                <section className="flex flex-col items-center justify-center mb-4 md:hidden">
                    <div className="flex gap-2 overflow-x-auto w-full bg-[#404040] text-muted-foreground p-2 rounded-lg scrollbar-thin scrollbar-thumb-[#212121] scrollbar-track-transparent">
                        {Object.values(PlateType).map((typePlate, index) => (
                            <OptionButton
                                key={index}
                                option={typePlate}
                                activeOption={activeOption}
                                onChange={handleOptionChange}
                                label={typePlate}
                            />
                        ))}
                    </div>
                </section>

                {/* Section: Lista de platos */}
                {/* Diseño mobil */}
                <section className="mb-[76px] md:hidden">
                    <h3 className="text-white text-2xl font-bold mb-4">Promos del día</h3>
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {
                            listPlates.filter(plate => plate.type === activeOption).map((plate, index) => {
                                return (
                                    <PlateCard key={index} {...plate} />
                                );
                            })
                        }
                    </div>
                </section>

                {/* Section: Menú */}
                {/* Diseño desktop */}
                <div className="hidden md:flex flex-row justify-center text-white gap-x-6">
                    {/* Información izquierda */}
                    <div className="w-[30%] relative -mt-28">

                        <div className="flex flex-col items-center justify-center gap-y-1 mb-8">
                            <div className="bg-[#212121] rounded-xl p-4 border-solid border-[#797979] border-4 flex items-center justify-center">
                                <Image src="logo-chicken.png" alt="lo˝go" width={100} height={100} />
                            </div>
                            <div>
                                <h2 className="font-bold text-white text-3xl">Chicken</h2>
                                <p className="text-gray-400 text-base font-light">Polleria & Parrilla</p>
                            </div>
                        </div>

                        <div className="bg-[#222222] flex flex-col gap-4 rounded-md p-4 mb-8">
                            <div className="flex items-center gap-2">
                                <TimerIcon className="w-6 h-6" />
                                <div>
                                    <p className="text-[#797979] text-sm">HORARIO</p>
                                    <p className="text-white text-base">10:00pm - 11:00pm</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <FaMotorcycle className="w-6 h-6" />
                                <div>
                                    <p className="text-[#797979] text-sm">Delivery</p>
                                    <p className="text-white text-base">+51 999 9999 9999</p>
                                    <p className="text-white text-base">+51 999 9999 9999</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <LucideMapPinHouse className="w-6 h-6" />
                                <div>
                                    <p className="text-[#797979] text-sm">Dirección</p>
                                    <p className="text-white text-base">Av. de la República, 100, Madrid, España</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-center gap-4 mb-8">
                            <button className="w-full bg-orange-600 border-solid border-orange-600 border-2 text-white text-base font-normal py-2 px-4 rounded-md flex items-center justify-center gap-2">
                                <FaWhatsapp className="w-4 h-4" />
                                <span>WhatsApp</span>
                            </button>

                            <button className="w-full bg-[#161616] border-solid border-[#797979] border-2 text-white text-base font-normal py-2 px-4 rounded-md flex items-center justify-center gap-2">
                                <PhoneCall className="w-4 h-4" />
                                <span>Llamar</span>
                            </button>
                        </div>

                        <div className="flex flex-row items-center justify-center gap-4">
                            <button>
                                <FaCcVisa className="w-6 h-6" />
                            </button>

                            <button>
                                <FaCcMastercard className="w-6 h-6" />
                            </button>

                            <button>
                                <FaCcAmex className="w-6 h-6" />
                            </button>

                            <button>
                                <QrCode className="w-6 h-6" />
                            </button>
                        </div>

                    </div>

                    {/* Información derecha */}
                    <div className="w-[70%] mt-10">

                        {/* Section: Opciones */}
                        <div className="flex gap-2 overflow-x-auto w-full bg-[#404040] text-muted-foreground p-2 rounded-lg mb-4">
                            {
                                Array.from(Object.values(PlateType)).map((typePlate, index) => (
                                    <OptionButton
                                        key={index}
                                        option={typePlate}
                                        activeOption={activeOption}
                                        onChange={handleOptionChange}
                                        label={typePlate}
                                    />
                                ))
                            }
                        </div>

                        {/* Titulo */}
                        <h3 className="text-white text-2xl font-bold mb-4">Promos del día</h3>

                        {/* Listado de platos */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                            {
                                listPlates.filter(plate => plate.type === activeOption).map((plate, index) => {
                                    return (
                                        <PlateCard key={index} {...plate} />
                                    );
                                })
                            }
                        </div>

                    </div>
                </div>
            </main>

            {/* Section: Contacto */}
            {/* Diseño mobil */}
            <section className="fixed bottom-0 left-0 right-0 bg-[#161616] md:hidden">
                <div className="container mx-auto px-4 max-w-screen-xl">
                    <div className="flex justify-between items-center py-4 gap-4">
                        <button className="w-full bg-orange-600 border-solid border-orange-600 border-2 text-white text-sm font-normal py-2 px-4 rounded-md flex items-center justify-center gap-2">
                            <FaWhatsapp className="w-4 h-4" />
                            <span>WhatsApp</span>
                        </button>

                        <button className="w-full bg-[#161616] border-solid border-[#797979] border-2 text-white text-sm font-normal py-2 px-4 rounded-md flex items-center justify-center gap-2">
                            <PhoneCall className="w-4 h-4" />
                            <span>Llamar</span>
                        </button>

                        <CartButton itemCount={0} onClick={() => { }} className="w-12 h-10 flex items-center justify-center" />
                    </div>
                </div>
            </section>
        </div>
      </>
    );
}
