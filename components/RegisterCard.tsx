import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Customer } from "@/types";

export function RegisterCard() {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) {
      return;
    }
    if (!document || !name || !password || !email) {
      alert("Por favor, rellene todos los campos");
      return;
    }
    setLoading(true);

    const customer: Customer = {
      id: "",
      document: document,
      name: name,
      email: email,
      password: password,
      phone: "",
      whatsapp: "",
      addresses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalOrders: 0
    };

    const success = register(customer);
    if (!success) {
      alert("Error al registrar");
      setLoading(false);
      return;
    }
    setDocument("");
    setName("");
    setPassword("");
    setEmail("");
    setLoading(false);
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-xs">
          <UserPlus className="w-4 h-4 mr-2" />
          Crear Cuenta
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card text-card-foreground border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Crear Cuenta</DialogTitle>
           <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4 py-4" onSubmit={handleRegister}>
          <div>
            <Label className="text-foreground font-medium">N° de Documento *</Label>
            <Input
              type="text"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              className="mt-1 bg-muted border-border text-foreground"
              placeholder="0000000"
            />
          </div>
          <div>
            <Label className="text-foreground font-medium">Nombre Completo *</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 bg-muted border-border text-foreground"
              placeholder="Juan Pérez"
            />
          </div>
          <div>
            <Label className="text-foreground font-medium">Email *</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 bg-muted border-border text-foreground"
              placeholder="example@gmail.com"
            />
          </div>
          <div>
            <Label className="text-foreground font-medium">Contraseña *</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 bg-muted border-border text-foreground"
              placeholder="******"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
            >
              {loading ? "Registrando..." : "Crear Cuenta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
