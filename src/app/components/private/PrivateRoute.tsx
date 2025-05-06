"use client";
import { useRouter } from "next/navigation";  // para redirecionar
import { useAuth } from "@/app/contexts/authContext";
import { useEffect } from "react";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>; // Pode colocar um carregando enquanto verifica o estado
  }

  return <>{children}</>; // Se o usuário estiver autenticado, renderiza os filhos (a página interna)
}