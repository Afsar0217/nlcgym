import WofHero from '../components/WallOfFamePage/WofHero';
import HallOfFameSection from '../components/HallOfFameSection';
import WofServices from '../components/WallOfFamePage/WofServices';
import QuotesCardStack from '../components/WallOfFamePage/QuotesCardStack';
import MemberWords from '../components/WallOfFamePage/MemberWords';
import BridgeSection from '../components/BridgeSection';
import useSEO from '../hooks/useSEO';

const WallOfFamePage = () => {
  useSEO(
    "Wall of Fame | Real Gym Transformations in Hyderabad",
    "Explore real success stories and body transformations at No Limits CrossFit. See how our elite fitness programs in Nizampet, Hyderabad change lives."
  );

  return (
    <div className="wall-of-fame-page">
      <WofHero />
      <div className="grudge-texture">
        <HallOfFameSection />
        <WofServices />
        <QuotesCardStack />
        <MemberWords />
        <BridgeSection />
      </div>
    </div>
  );
};



export default WallOfFamePage;
