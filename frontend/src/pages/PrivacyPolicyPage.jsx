import PrivacyHero from '../components/PrivacyPage/PrivacyHero';
import PrivacyContent from '../components/PrivacyPage/PrivacyContent';
import useSEO from '../hooks/useSEO';

const PrivacyPolicyPage = () => {
  useSEO(
    "Terms & Conditions | No Limits CrossFit",
    "Read the terms and conditions, gym rules and management disclaimer for No Limits CrossFit gym in Hyderabad."
  );

  return (
    <div className="privacy-policy-page">
      <PrivacyHero />
      <div className="grudge-texture">
        <PrivacyContent />
      </div>
    </div>
  );
};


export default PrivacyPolicyPage;
