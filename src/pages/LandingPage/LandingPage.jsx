import Landing from '../../components/Landing/Landing';
import Barra from '../../components/barra/barra';
import Features from '../../components/features/features';
import BooksFamosos from '../../components/booksFamosos/booksfamosos';

const LandingPage = () => {
  return (
    <div>
      <Barra />
      <Landing />
      <Features />
      <BooksFamosos />
    </div>
  );
};

export default LandingPage;