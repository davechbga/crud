// Componente para el formulario de registro

import { Button } from "@/components/ui/button";
import { FormField } from "./Field";
import type { RegisterData } from "@/interfaces/auth";

export const RegisterForm = ({
  data,
  onChange,
  onSubmit,
  loading,
}: {
  data: RegisterData;
  onChange: (field: keyof RegisterData, value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <FormField
      id="register-fullname"
      label="Nombre Completo"
      type="text"
      value={data.fullName}
      onChange={(value) => onChange("fullName", value)}
      placeholder="Juan Pérez"
      required
    />
    <FormField
      id="register-email"
      label="Email"
      type="email"
      value={data.email}
      onChange={(value) => onChange("email", value)}
      placeholder="tu@email.com"
      required
    />
    <FormField
      id="register-password"
      label="Contraseña"
      type="password"
      value={data.password}
      onChange={(value) => onChange("password", value)}
      placeholder="••••••••"
      required
      minLength={8}
    />
    <Button type="submit" className="w-full" disabled={loading}>
      {loading ? "Creando cuenta..." : "Crear Cuenta"}
    </Button>
  </form>
);
