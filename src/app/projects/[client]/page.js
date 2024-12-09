"use client";
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ClientPage = () => {
    const router = useRouter();
    const { client } = router.query;

    useEffect(() => {
        if (client) {
            router.push(`/clients/${client}`);
        }
    }, [client]);

    return null;
};

export default ClientPage;