import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AuthHeader } from "@/features/auth/components/Header";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const VerifyEmailPage = () => {
  const { verifyEmail, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");
    const verificationKey = `verification_${userId}_${secret}`;

    // Verificar si ya se realizó la verificación
    const hasVerified = localStorage.getItem(verificationKey);

    if (userId && secret && !isVerifying && !hasVerified) {
      handleVerification(userId, secret, verificationKey);
    } else if (hasVerified) {
      // Si ya se verificó, redirigir según el estado de autenticación
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, user]);

  const handleVerification = async (
    userId: string,
    secret: string,
    verificationKey: string
  ) => {
    if (isVerifying) return;

    setIsVerifying(true);
    try {
      await verifyEmail(userId, secret);
      setVerificationStatus("success");
      // Marcar como verificado en localStorage
      localStorage.setItem(verificationKey, "true");

      toast.success("¡Correo verificado!", {
        description: "Tu correo ha sido verificado exitosamente.",
      });

      // Si el usuario ya está autenticado, redirigir al dashboard
      if (user) {
        navigate("/dashboard");
      } else {
        // Si no está autenticado, redirigir al login
        navigate("/login");
      }
    } catch (error) {
      console.error("Error al verificar el correo:", error);
      setVerificationStatus("error");
      toast.error("Error de verificación", {
        description:
          "No se pudo verificar tu correo. Por favor, intenta de nuevo.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthHeader />
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>Verificación de Correo</CardTitle>
            <CardDescription>
              {verificationStatus === "pending" &&
                "Verificando tu correo electrónico..."}
              {verificationStatus === "success" &&
                "¡Correo verificado exitosamente!"}
              {verificationStatus === "error" && "Error al verificar el correo"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {verificationStatus === "pending" && (
              <div className="space-y-4">
                <Skeleton className="h-4 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>
            )}
            {verificationStatus === "success" && (
              <div className="text-green-600">
                <p>Serás redirigido automáticamente...</p>
              </div>
            )}
            {verificationStatus === "error" && (
              <div className="text-red-600">
                <p>Hubo un error al verificar tu correo.</p>
                <button
                  onClick={() => navigate("/register")}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Volver al registro
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
