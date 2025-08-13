import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IngredientListProps {
  ingredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (index: number) => void;
}

export function IngredientList({ ingredients, onAddIngredient, onRemoveIngredient }: IngredientListProps) {
  const [newIngredient, setNewIngredient] = useState("");

  const handleAddIngredient = () => {
    if (newIngredient.trim() !== "") {
      onAddIngredient(newIngredient);
      setNewIngredient("");
    }
  };

  return (
    <div>
      <Label className="text-foreground font-medium">Ingredientes</Label>
      <div className="flex items-center gap-2 mt-2">
        <Input
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          className="bg-muted border-border text-foreground"
          placeholder="Agregar ingrediente"
        />
        <Button onClick={handleAddIngredient} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Agregar
        </Button>
      </div>
      <ul className="mt-2">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg border border-border/50">
            <span className="text-foreground">{ingredient}</span>
            <Button onClick={() => onRemoveIngredient(index)} className="bg-red-500 hover:bg-red-600 text-white">
              Eliminar
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
