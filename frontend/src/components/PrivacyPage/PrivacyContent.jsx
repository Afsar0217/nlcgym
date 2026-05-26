import { useState, useEffect, useRef } from 'react';
import '../../styles/PrivacyContent.css';

const TermsContent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const terms = [
    { id: 1, text: 'Management reserves the right to admission.', bold: true },
    { id: 2, text: 'Memberships are non-transferable, non-refundable, and non-freezable unless approved by management under special conditions.', bold: true },
    { id: 3, text: 'Gym timings, holidays, classes, trainers, and services may change when required. Members are requested to check notices and updates regularly.' },
    { id: 4, text: 'Management reserves the right to add, remove, or modify any equipment, facility, service, package, pricing, rules, or policies without prior notice.' },
    { id: 5, text: 'In case of unforeseen situations such as natural calamities, strikes, fire, technical issues, government restrictions, or emergency situations, management will not be responsible for extensions or refunds.', boldPhrase: 'management will not be responsible for extensions or refunds.' },
    { id: 6, text: 'Members use all gym facilities and equipment at their own risk. Management will not be responsible for any injury, accident, or health issue occurring inside or around the premises.', boldPhrase: 'at their own risk.' },
    { id: 7, text: 'Management is not responsible for any loss, theft, or damage of personal belongings.', bold: true },
    { id: 8, text: 'Parking is entirely at the member\'s own risk.' },
    { id: 9, text: 'All payments must be made through authorized payment methods only. Members are advised to keep payment receipts safely.' },
    { id: 10, text: 'Change of trainer or staff does not qualify for refund or package cancellation.', boldPhrase: 'does not qualify for refund or package cancellation.' },
    { id: 11, text: 'Membership may be terminated without refund if a member violates gym rules, misbehaves, damages equipment, or creates disturbance inside the gym.', boldPhrase: 'without refund' },
    { id: 12, text: 'Smoking, alcohol, tobacco, drugs, abusive language, fighting, or disrespectful behavior are strictly prohibited.', bold: true },
    { id: 13, text: 'Payments made for any package, service, or product cannot be adjusted against another package or service.', boldPhrase: 'cannot be adjusted' },
    { id: 14, text: 'Membership activation is subject to successful payment realization.' },
    { id: 15, text: 'Package upgrades are allowed only within 5 days from the date of activation.', boldPhrase: 'Package upgrades are allowed only within 5 days' },
    { id: 16, text: 'Membership transfer, if approved by management, is allowed only to a non-member client with applicable transfer charges.' },
    { id: 17, text: '2% additional charges applicable on credit card payments.', bold: true },
    { id: 18, text: 'Shoes are mandatory inside the gym premises.', bold: true },
    { id: 19, text: 'Members must rerack weights after use and maintain gym discipline.', boldPhrase: 'rerack weights after use' },
    { id: 20, text: 'Management reserves the right to update or modify these rules and policies at any time.' },
  ];

  const renderTermText = (term) => {
    if (term.bold) {
      return <strong>{term.text}</strong>;
    }
    if (term.boldPhrase) {
      const parts = term.text.split(term.boldPhrase);
      return (
        <>
          {parts[0]}<strong>{term.boldPhrase}</strong>{parts[1] || ''}
        </>
      );
    }
    return term.text;
  };

  return (
    <section className="privacy-content" ref={sectionRef}>
      <div className={`privacy-content__container ${isVisible ? 'visible' : ''}`}>
        <div className="privacy-section">
          <h2 className="privacy-section__title">Gym Rules & Policies</h2>
          <div className="privacy-section__content">
            <ol className="terms-list">
              {terms.map((term) => (
                <li key={term.id} className="terms-list__item">
                  <span className="terms-list__number">{String(term.id).padStart(2, '0')}</span>
                  <p className="terms-list__text">{renderTermText(term)}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="privacy-section">
          <h2 className="privacy-section__title">POSH Policy</h2>
          <div className="privacy-section__content">
            <p>
              No Limits CrossFit follows a <strong>zero‑tolerance POSH (Prevention of Sexual Harassment) policy</strong>. 
              Any form of verbal, physical, visual, or digital harassment will lead to <strong>immediate action</strong>, 
              including termination of membership, as decided by management.
            </p>
            <p>
              Members must maintain <strong>professional behavior and mutual respect</strong> toward trainers, 
              staff, and fellow members at all times.
            </p>
          </div>
        </div>

        <div className="privacy-section">
          <h2 className="privacy-section__title">No Fight / Personal Liability Clause</h2>
          <div className="privacy-section__content">
            <ul>
              <li>Fighting, physical aggression, verbal abuse, or arguments inside the gym premises are <strong>strictly prohibited</strong>.</li>
              <li>Any injury, dispute, or incident arising from <strong>personal negligence, rule violations, or non‑disclosure of medical conditions</strong> shall be the <strong>sole responsibility of the member</strong>.</li>
              <li>No Limits CrossFit, its trainers, staff, or management <strong>shall not be held responsible</strong> for such incidents.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsContent;
