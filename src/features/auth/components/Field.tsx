import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Componente para el campo de entrada
export const FormField = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  minLength,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  minLength?: number;
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      minLength={minLength}
    />
  </div>
);
