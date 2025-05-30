import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Componente para el campo de descripción
export const DescriptionField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="space-y-2">
    <Label htmlFor="description">Descripción *</Label>
    <Textarea
      id="description"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Describe brevemente el contenido del recurso..."
      rows={3}
      required
    />
  </div>
);
