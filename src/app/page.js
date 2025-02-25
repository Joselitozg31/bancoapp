// ESTE ARCHIVO NO SE MODIFICA
'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user"); // Simula autenticación
    if (user) {
      router.push("/dashboard"); // Si está autenticado, lo envía al dashboard
    } else {
      router.push("/login"); // Si no está autenticado, lo manda a login
    }
  }, []);

  return <p>Redirigiendo...</p>; // Texto temporal mientras redirige
}
