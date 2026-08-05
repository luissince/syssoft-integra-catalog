import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { set } from "date-fns";

export function LoginCard() {
  const router = useRouter();

  const { toast } = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const refEmail = useRef<HTMLInputElement>(null);
  const refPassword = useRef<HTMLInputElement>(null);

  const handleRegister = () => {
    setIsDialogOpen(false);
    router.push("/register");
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) {
      return;
    }

    // Validación del email
    if (!email) {
      toast({
        title: "Error",
        description: "Ingrese su correo electrónico",
        variant: "destructive", // Estilo de error
      });
      refEmail.current?.focus();
      return;
    }

    // Validación de la contraseña
    if (!password) {
      toast({
        title: "Error",
        description: "Ingrese su contraseña",
        variant: "destructive",
      });
      refPassword.current?.focus();
      return;
    }

    setLoading(true);
    const result = await login(email, password);

    // Error en la consulta
    if (typeof result === "string") {
      toast({
        title: "Error de autenticación",
        description: result,
        variant: "destructive",
      });
      setLoading(false);
      refEmail.current?.focus();
      return;
    }

    // Éxito
    setEmail("");
    setPassword("");
    setLoading(false);
    setIsDialogOpen(false);
  };


  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-xs">
          <User className="w-4 h-4 mr-2" />
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card text-card-foreground border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Iniciar Sesión</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4 py-4" onSubmit={handleLogin}>
          <div>
            <Label className="text-foreground font-medium">Correo Electrónico</Label>
            <Input
              type="text"
              ref={refEmail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-muted border-border text-foreground mt-2"
              placeholder="Ingrese su usuario"
            />
          </div>
          <div>
            <Label className="text-foreground font-medium">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                ref={refPassword}
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Ingrese su contraseña"
                onChange={(e) => setPassword(e.target.value)}
                className="bg-muted border-border text-foreground pr-10 mt-2"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
          <DialogFooter>
            <div className="flex justify-end w-full gap-3">
              <Button
                type="button"
                onClick={handleRegister}
                variant="outline"
                className="text-xs">
                <UserPlus className="w-4 h-4 mr-2" />
                Crear Cuenta
              </Button>

              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
              >
                {loading ? "Iniciando Sesión..." : "Iniciar Sesión"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
