"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ClientProjectsPage() {
    const params = useParams();
    const router = useRouter();
    const { client } = params;

    useEffect(() => {
        if (client) {
            // Redirige automáticamente a la página del cliente
            router.push(`/clients/${client}`);
        } else {
            console.error("No client ID provided in the URL.");
        }
    }, [client, router]);

    return null; // No muestra contenido mientras redirige
}
