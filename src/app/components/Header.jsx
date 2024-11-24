import './Header.css';

const Header = () => {
return (
    <header>
        <h1><a href="/">Delivery Note</a></h1>
        <nav>
            <ul>
                <li><a href="/login">Iniciar sesión</a></li>
                <li><a href="/register">Registro</a></li>
                <li><a href="/dashboard">Panel de control</a></li>
                {/* Si está logeado que ponga Dashboard y Cerrar Sesión */}
            </ul>
        </nav>
    </header>
);
};

export default Header;