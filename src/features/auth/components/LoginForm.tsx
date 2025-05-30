// Componente para el formulario de inicio de sesión

import { Button } from "@/components/ui/button";
import { FormField } from "./Field";
import type { LoginData } from "@/interfaces/auth";

export const LoginForm = ({
  data,
  onChange,
  onSubmit,
  loading,
}: {
  data: LoginData;
  onChange: (field: keyof LoginData, value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <FormField
      id="login-email"
      label="Email"
      type="email"
      value={data.email}
      onChange={(value) => onChange("email", value)}
      placeholder="tu@email.com"
      required
    />
    <FormField
      id="login-password"
      label="Contraseña"
      type="password"
      value={data.password}
      onChange={(value) => onChange("password", value)}
      placeholder="••••••••"
      required
    />
    <Button type="submit" className="w-full" disabled={loading}>
      {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
    </Button>
  </form>
);
