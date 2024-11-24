import './Header.css';

const Header = () => {
return (
    <header>
        <h1><a href="/">Delivery Note</a></h1>
        <nav>
            <ul>
                <li><a href="/login">Iniciar sesión</a></li>
                <li><a href="/register">Registro</a></li>
            </ul>
        </nav>
    </header>
);
};

export default Header;