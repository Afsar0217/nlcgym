import PrivacyHero from '../components/PrivacyPage/PrivacyHero';
import PrivacyContent from '../components/PrivacyPage/PrivacyContent';
import useSEO from '../hooks/useSEO';

const PrivacyPolicyPage = () => {
  useSEO(
    "Privacy Policy | No Limits CrossFit",
    "Read the privacy policy and terms of service for No Limits CrossFit gym in Hyderabad."
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
