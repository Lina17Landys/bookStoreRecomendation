import Landing from '../../components/Landing/Landing';
import Barra from '../../components/barra/barra';
import Features from '../../components/features/features';
import BooksFamosos from '../../components/booksFamosos/booksfamosos';
import PasosGuia from '../../components/pasosGuia/pasosGuia';
import Footer from '../../components/footer/footer';
import "./landing.css"

const LandingPage = () => {
  return (
    <div>
      <Barra />
      <Landing />
      <Features />
      <BooksFamosos />


      <div className='section-landing'>
        <hr className="divider" />
        <p className="quote-final">
          <strong>No más libros que abandonas en la página 10. </strong>
          Entra, responde y recibe tu siguiente lectura.
        </p>
      </div>

      <PasosGuia />
      <Footer />
    </div>
  );
};

export default LandingPage;