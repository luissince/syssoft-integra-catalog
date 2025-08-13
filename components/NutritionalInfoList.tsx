import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NutritionalInfoListProps {
  nutritionalInfo: { name: string; value: string | number }[];
  onAddNutritionalInfo: (info: { name: string; value: number }) => void;
  onRemoveNutritionalInfo: (index: number) => void;
}

export function NutritionalInfoList({ nutritionalInfo, onAddNutritionalInfo, onRemoveNutritionalInfo }: NutritionalInfoListProps) {
  const [newNutritionalInfo, setNewNutritionalInfo] = useState({ name: "", value: 0 });

  const handleAddNutritionalInfo = () => {
    if (newNutritionalInfo.name.trim() !== "") {
      onAddNutritionalInfo(newNutritionalInfo);
      setNewNutritionalInfo({ name: "", value: 0 });
    }
  };

  return (
    <div>
      <Label className="text-foreground font-medium">Información Nutricional</Label>
      <div className="flex items-center gap-2 mt-2">
        <Input
          value={newNutritionalInfo.name}
          onChange={(e) => setNewNutritionalInfo({ ...newNutritionalInfo, name: e.target.value })}
          className="bg-muted border-border text-foreground"
          placeholder="Nombre"
        />
        <Input
          value={newNutritionalInfo.value}
          onChange={(e) => setNewNutritionalInfo({ ...newNutritionalInfo, value: Number.parseFloat(e.target.value) })}
          className="bg-muted border-border text-foreground"
          placeholder="Valor"
        />
        <Button onClick={handleAddNutritionalInfo} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Agregar
        </Button>
      </div>
      <ul className="mt-2">
        {nutritionalInfo.map((info, index) => (
          <li key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg border border-border/50">
            <span className="text-foreground">{info.name}: {info.value}</span>
            <Button onClick={() => onRemoveNutritionalInfo(index)} className="bg-red-500 hover:bg-red-600 text-white">
              Eliminar
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}