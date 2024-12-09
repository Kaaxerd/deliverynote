//
// PÁGINA PRINCIPAL
//

import './home.css';
import Header from './components/Header';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="home-container">
      <Header />
      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Gestión Eficiente de Notas de Entrega</h1>
            <p>Simplifica y optimiza el proceso de entrega de tu empresa.</p>
            <button className="cta-button">Comienza Ahora</button>
          </div>
          <div className="hero-image">
            <Image src="/favicon.ico" alt="Notas de Entrega" width={500} height={300} />
          </div>
        </section>
        
        <section className="features">
          <h2>¿Por qué elegirnos?</h2>
          <div className="feature-grid">
            <div className="feature-item">
              <i className="feature-icon document-icon"></i>
              <h3>Creación Simplificada</h3>
              <p>Genera notas de entrega en segundos.</p>
            </div>
            <div className="feature-item">
              <i className="feature-icon money-icon"></i>
              <h3>Soluciones Rentables</h3>
              <p>Optimiza costos y mejora la eficiencia.</p>
            </div>
            <div className="feature-item">
              <i className="feature-icon support-icon"></i>
              <h3>Soporte 24/7</h3>
              <p>Asistencia continua para tu negocio.</p>
            </div>
          </div>
        </section>

        <section className="testimonials">
          <h2>Testimonios de Clientes</h2>
          <div className="testimonial-carousel">
            <div className="testimonial-item">
              <p>"¡Excelente servicio y fácil de usar!"</p>
              <footer>- María García, Empresa ABC</footer>
            </div>
            <div className="testimonial-item">
              <p>"Asequible y eficiente. Ha mejorado nuestra logística."</p>
              <footer>- Juan Pérez, Distribuidora XYZ</footer>
            </div>
          </div>
        </section>

        <section className="contact">
          <h2>Contáctenos</h2>
          <div className="contact-info">
            <p><i className="contact-icon email-icon"></i> soporte@servicionotasdeentrega.com</p>
            <p><i className="contact-icon phone-icon"></i> +123 456 7890</p>
          </div>
          <button className="contact-button">Solicitar Demostración</button>
        </section>
      </main>
    </div>
  );
}