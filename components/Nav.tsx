import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Menu, Phone, Settings, MessageCircle, MapPin } from "lucide-react";
import { LoginCard } from "./LoginCard";
// import restaurantData from "@/data/restaurant-data.json";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useContact } from "@/lib/contact";
import { Branch, Category, Company, Whatsapp } from "@/types/api-type";
import Image from "next/image";

const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === "true" ? true : false;

interface NavPrimaryProps {
    company: Company;
    categories: Category[];
    whatsapp: Whatsapp;
    branch: Branch;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}

export function NavPrimary({ company, categories, whatsapp, branch, selectedCategory, setSelectedCategory }: NavPrimaryProps) {
    const router = useRouter();
    const { isAuthenticated, logout } = useAuth();
    const { handleCall, handleWhatsapp, getDefaultMessage, isMobile } = useContact();

    const handleCallClick = () => {
        handleCall(branch.phone);
        // call(restaurantData.restaurant.phone);
    };

    const handleWhatsAppClick = () => {
        // const message = getDefaultMessage(restaurantData.restaurant.name);
        const message = getDefaultMessage(company.name);
        handleWhatsapp(whatsapp.number, message);
        // handleWhatsapp(restaurantData.restaurant.whatsapp, message);
    };

    return (
        <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <div className="text-2xl font-bold font-display">
                            {/* <span className="text-primary">{company.name}</span> */}
                            <Image
                                src={company.logo || "/placeholder.svg"}
                                alt={company.name}
                                width={120}
                                height={40}
                            />
                            {/* <div className="text-sm text-foreground">{company.name}</div> */}
                            {/* <span className="text-primary">{restaurantData.restaurant.owner}</span>
                            <div className="text-sm text-foreground">{restaurantData.restaurant.name}</div> */}
                        </div>
                        <nav className="hidden md:flex space-x-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="flex items-center">
                                        <Menu className="mr-2 h-4 w-4" />
                                        Categorías
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    {categories.map((category) => (
                                        <DropdownMenuItem
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className="flex items-center space-x-2 cursor-pointer"
                                        >
                                            {/* <span>{category.icon}</span> */}
                                            <Image
                                                src={category.image || "/placeholder.svg"}
                                                alt={category.name}
                                                width={20}
                                                height={20}
                                            />
                                            <span>{category.name}</span>
                                        </DropdownMenuItem>
                                    ))}
                                    {/* {restaurantData.categories.map((category) => (
                                        <DropdownMenuItem
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className="flex items-center space-x-2 cursor-pointer"
                                        >
                                            <span>{category.icon}</span>
                                            <span>{category.name}</span>
                                        </DropdownMenuItem>
                                    ))} */}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </nav>
                    </div>

                    <div className="flex items-center space-x-2 md:space-x-4 text-sm">
                        {/* Botones de contacto - Desktop */}
                        <div className="hidden lg:flex items-center space-x-2">
                            <Button
                                onClick={handleCallClick}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                size="sm"
                            >
                                <Phone className="w-4 h-4 mr-2" />
                                Llamar
                            </Button>
                            <Button
                                onClick={handleWhatsAppClick}
                                variant="outline"
                                size="sm"
                                className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                WhatsApp
                            </Button>
                        </div>

                        {/* Dropdown de contacto - Tablet/Mobile */}
                        <div className="lg:hidden">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        <Phone className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem onClick={handleCallClick} className="cursor-pointer">
                                        <Phone className="w-4 h-4 mr-2 text-primary" />
                                        <div className="flex flex-col">
                                            <span>Llamar</span>
                                            {/* <span className="text-xs text-muted-foreground">
                                                {restaurantData.restaurant.phone}
                                            </span> */}
                                            <span className="text-xs text-muted-foreground">
                                                {branch.phone}
                                            </span>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleWhatsAppClick} className="cursor-pointer">
                                        <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                                        <div className="flex flex-col">
                                            <span>WhatsApp</span>
                                            {/* <span className="text-xs text-muted-foreground">
                                                {restaurantData.restaurant.whatsapp}
                                            </span> */}
                                            <span className="text-xs text-muted-foreground">
                                                {whatsapp.number}
                                            </span>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            // const address = encodeURIComponent(restaurantData.restaurant.address);
                                            const address = encodeURIComponent(branch.address);

                                            const url = isMobile
                                                ? `maps://?q=${address}`
                                                : `https://maps.google.com/maps?q=${address}`;

                                            if (isMobile) {
                                                window.location.href = url;
                                                setTimeout(() => {
                                                    window.open(`https://maps.google.com/maps?q=${address}`, '_blank');
                                                }, 500);
                                            } else {
                                                window.open(url, '_blank');
                                            }
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                                        <div className="flex flex-col">
                                            <span>Ubicación</span>
                                            {/* <span className="text-xs text-muted-foreground truncate">
                                                {restaurantData.restaurant.address}
                                            </span> */}
                                            <span className="text-xs text-muted-foreground truncate">
                                                {branch.address}
                                            </span>
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <ThemeToggle />

                        {authEnabled && (
                            isAuthenticated ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="flex items-center">
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => router.push("/admin")} className="cursor-pointer">
                                            <Settings className="w-4 h-4 text-primary mr-2" />
                                            <span>Administrar</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                                            <LogOut className="w-4 h-4 text-primary mr-2" />
                                            <span>Cerrar Sesión</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <LoginCard />
                            )
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden mt-4">
                    <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                        <TabsList className="bg-muted w-full overflow-auto gap-x-2">
                            {/* {restaurantData.categories.map((category) => (
                                <TabsTrigger key={category.id} value={category.id} className="flex-1 text-xs">
                                    <span className="mr-1">{category.icon}</span>
                                    {category.name}
                                </TabsTrigger>
                            ))} */}
                            {categories.map((category) => (
                                <TabsTrigger key={category.id} value={category.id} className="flex-1 text-xs">
                                    {/* <span className="mr-1">{category.icon}</span> */}
                                    <Image
                                        src={category.image || "/placeholder.svg"}
                                        alt={company.name}
                                        width={20}
                                        height={20}
                                    />
                                    {category.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
            </div>
        </header>
    );
}

interface NavSecondaryProps {
    title?: string;
}

export function NavSecondary({ title = "Finalizar Pedido" }: NavSecondaryProps) {
    const router = useRouter();
    const { isAuthenticated, logout } = useAuth();

    return (
        <div className="bg-card border-b border-border p-4 sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between">
                <Button className="hidden md:flex" onClick={() => router.push("/")} variant="outline">
                    ← Volver al Menú
                </Button>
                <h1 className="text-2xl font-bold font-display text-primary">{title}</h1>
                <div className="flex items-center space-x-4">
                    <ThemeToggle />
                    {authEnabled && (
                        isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="flex items-center">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => router.push("/admin")} className="cursor-pointer">
                                        <Settings className="w-4 h-4 text-primary mr-2" />
                                        <span>Administrar</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                                        <LogOut className="w-4 h-4 text-primary mr-2" />
                                        <span>Cerrar Sesión</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <LoginCard />
                        )
                    )}
                </div>
            </div>
        </div>
    );
}