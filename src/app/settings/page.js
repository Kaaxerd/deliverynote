"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RedirectToHomePage() {
    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        // Redirige automáticamente a la página principal
        router.push("/");
    }, [router]);

    return null; // No muestra contenido mientras redirige
}
