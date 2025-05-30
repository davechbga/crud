import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Componente para el campo de título
export const TitleField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="space-y-2">
    <Label htmlFor="title">Título *</Label>
    <Input
      id="title"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Ej: Guía de React Hooks"
      required
    />
  </div>
);
