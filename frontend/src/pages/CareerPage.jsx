import CareerHero from '../components/CareerPage/CareerHero';
import CareerOpenings from '../components/CareerPage/CareerOpenings';
import useSEO from '../hooks/useSEO';

const CareerPage = () => {
  useSEO(
    "Fitness Careers & Gym Jobs in Hyderabad | No Limits CrossFit",
    "Join the team at No Limits CrossFit. We are hiring passionate fitness coaches, personal trainers, and gym staff in Nizampet, Hyderabad."
  );

  return (
    <div className="career-page">
      <CareerHero />
      <div className="grudge-texture">
        <CareerOpenings />
      </div>
    </div>
  );
};


export default CareerPage;
