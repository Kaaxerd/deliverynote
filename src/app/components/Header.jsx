// components/Header.js

"use client"; // Necesario para usar localStorage y el enrutador de Next.js en el lado del cliente

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import './Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está logeado al montar el componente
    const token = localStorage.getItem('jwt');
    setIsLoggedIn(!!token); // Si hay token, está logeado
  }, []);

  const handleLogout = () => {
    // Eliminar el token de localStorage y redirigir al home
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    router.push('/'); // Redirigir a la página principal
  };

  return (
    <header>
      <h1><a href="/">Delivery Note</a></h1>
      <nav>
        <ul>
          {!isLoggedIn ? (
            <>
              <li><a href="/login">Iniciar sesión</a></li>
              <li><a href="/register">Registrarse</a></li>
            </>
          ) : (
            <>
              <li><a href="/clients">Panel de control</a></li>
              <li><button onClick={handleLogout}>Cerrar sesión</button></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
