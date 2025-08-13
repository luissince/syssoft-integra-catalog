import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RegisterCard } from "./RegisterCard";

export function LoginCard() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (!email || !password) {
      alert("Por favor, rellene todos los campos");
      return;
    }

    setLoading(true);

    const success = login(email, password);
    if (!success) {
      alert("Credenciales incorrectas");
      setLoading(false);
      return;
    }

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
          <DialogTitle className="font-display text-xl">Iniciar Sesión</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4 py-4" onSubmit={handleLogin}>
          <div>
            <Label className="text-foreground font-medium">Email</Label>
            <Input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 bg-muted border-border text-foreground"
              placeholder="Ingrese su usuario"
            />
          </div>
          <div>
            <Label className="text-foreground font-medium">Contraseña</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 bg-muted border-border text-foreground"
              placeholder="Ingrese su contraseña"
            />
          </div>
          <DialogFooter>
            <div className="flex justify-between w-full">
              <RegisterCard />
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
