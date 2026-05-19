import TeamsHero from '../components/TeamsPage/TeamsHero';
import TeamsAbout from '../components/TeamsPage/TeamsAbout';
import CoachesSection from '../components/TeamsPage/CoachesSection';
import TeamsBridge from '../components/TeamsPage/TeamsBridge';
import useSEO from '../hooks/useSEO';

const TeamsPage = () => {
  useSEO(
    "Our Expert Coaches | No Limits CrossFit Hyderabad",
    "Meet the elite coaches at No Limits CrossFit in Hyderabad. Our expert personal trainers in Nizampet provide customized protocols to transform your body and mindset."
  );

  return (
    <div className="teams-page">
      <TeamsHero />
      <div className="grudge-texture">
        <TeamsAbout />
        <CoachesSection />
        <TeamsBridge />
      </div>
    </div>
  );
};


export default TeamsPage;

