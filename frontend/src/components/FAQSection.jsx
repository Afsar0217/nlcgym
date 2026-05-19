import { useState, useEffect, useRef } from 'react';
import '../styles/FAQSection.css';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const answerRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0, rootMargin: '200px' }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      question: 'Is No Limits CrossFit suitable for beginners or those with high weight-loss goals?',
      answer: 'Absolutely. We are a transformation hub where every body type is respected, having successfully guided members through 50kg+ weight-loss journeys and age-defying resets.',
    },
    {
      question: 'How is the nutrition plan customized?',
      answer: 'Our certified nutritionists create personalized meal plans based on your body composition, fitness goals, dietary preferences, and metabolic profile. Plans are adjusted every 4 weeks based on your progress.',
    },
    {
      question: 'Is there 24/7 facility access?',
      answer: 'Yes, all premium members enjoy round-the-clock access to our facilities, including the gym floor, cardio zone, and recovery areas. Basic members have access during standard operating hours.',
    },
    {
      question: 'What makes this different from a standard gym?',
      answer: 'We combine elite coaching, data-driven protocols, and a community-first mindset. Every member gets personalized programming, regular assessments, and access to our transformation support system.',
    },
    {
      question: 'Do you offer group classes or only personal training?',
      answer: 'We offer both. Our schedule includes high-energy group CrossFit classes, yoga, and conditioning sessions. Personal training is available for those wanting a fully tailored program.',
    },
    {
      question: 'How do I get started?',
      answer: "Simply reach out via our contact form or visit us in person. We'll schedule a free orientation session to understand your goals and recommend the right program for you.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="faq" ref={sectionRef}>
      <div className={`faq__content ${isVisible ? 'faq__content--visible' : ''}`}>
        <div className="faq__heading">
          <h2 className="faq__title">Frequently Asked Questions</h2>
          <p className="faq__subtitle">
            Clear answers for those ready to commit. We strip away the complexity so you can focus on the performance. If your question isn't here, contact the hub directly.
          </p>
        </div>

        <div className="faq__list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                className={`faq__item ${isOpen ? 'faq__item--open' : ''}`}
                key={index}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq__question">
                  <span className="faq__question-text">{faq.question}</span>
                  <span className={`faq__icon ${isOpen ? 'faq__icon--open' : ''}`}>+</span>
                </div>
                {/* Answer stays in DOM — transitions via max-height for zero-jank animation */}
                <div
                  className={`faq__answer-wrapper ${isOpen ? 'faq__answer-wrapper--open' : ''}`}
                  ref={el => answerRefs.current[index] = el}
                >
                  <p className="faq__answer">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
