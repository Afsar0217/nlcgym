import React, { useState, useEffect } from 'react';
import '../styles/GetFitPage.css';
import { submitEnquiryForm } from '../api';
import useSEO from '../hooks/useSEO';

const GetFitPage = () => {
  useSEO(
    "Start Your Fitness Journey | Gym Membership Hyderabad",
    "Join No Limits CrossFit today. Sign up for personal training, CrossFit classes, and weight loss programs in Nizampet, Hyderabad. Transform your life now."
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    training_mode: '',
    fitness_goals: 'Fat loss',
    message: ''
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      await submitEnquiryForm(formData);

      setStatus({ loading: false, success: true, error: null });
      setFormData({ name: '', email: '', phone: '', age: '', gender: '', training_mode: '', fitness_goals: 'Fat loss', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 5000);
    } catch (error) {
      console.error("Submission error:", error);
      setStatus({ 
        loading: false, 
        success: false, 
        error: error.message || 'Something went wrong. Please try again.' 
      });
    }
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="getfit-page">
      
      {/* Hero Section — matching Teams/Blog hero style */}
      <section className="getfit-hero">
        <div className="getfit-hero__bg">
          <div className="getfit-hero__bg-overlay"></div>
          <img src="/images/getfit_herobg.jpg" alt="Get Fit" className="getfit-hero__bg-img" />
        </div>

        <div className={`getfit-hero__content ${isVisible ? 'getfit-hero__content--visible' : ''}`}>
          <div className="getfit-hero__about">
            <h1 className="getfit-hero__title">GET FIT</h1>
            <div className="getfit-hero__arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8.5 5L15.5 12L8.5 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className="getfit-hero__tagline">
            YOUR JOURNEY TO A STRONGER YOU STARTS HERE
          </div>
        </div>

        <div className="getfit-hero__scroll-indicator">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 8.5L12 15.5L19 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      {/* Form Section */}
      <section className="getfit-form-section">
        <div className="getfit-form__container">
          <div className="getfit-form__text">
            <h2>Contact Form</h2>
            <p>
              Leave your details below and our fitness consultants will reach out to design the perfect protocol for your goals. 
              We are excited to welcome you into the No Limits CrossFit family!
            </p>
          </div>

          <div className="getfit-form__wrapper">
            {status.success ? (
              <div className="getfit-form__success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <h3>Thank you for showing interest!</h3>
                <p>We'll get back to you soon, eager to get you into our gym family.</p>
              </div>
            ) : (
              <form className="getfit-form" onSubmit={handleSubmit}>
                {status.error && <div className="getfit-form__error">{status.error}</div>}
                
                <div className="getfit-form__group">
                  <label htmlFor="name">Full Name *</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="getfit-form__row">
                  <div className="getfit-form__group">
                    <label htmlFor="email">Email Address *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="getfit-form__group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      required 
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="getfit-form__row">
                  <div className="getfit-form__group">
                    <label htmlFor="age">Age</label>
                    <input 
                      type="number" 
                      id="age" 
                      name="age" 
                      placeholder="e.g. 25"
                      value={formData.age}
                      onChange={handleChange}
                      min="10"
                      max="100"
                    />
                  </div>
                  <div className="getfit-form__group">
                    <label htmlFor="gender">Gender</label>
                    <select 
                      id="gender" 
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="getfit-form__group" style={{ marginBottom: '24px' }}>
                  <label>Are you looking for online/offline training?</label>
                  <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'normal', color: '#ccc' }}>
                      <input 
                        type="radio" 
                        name="training_mode" 
                        value="Online" 
                        checked={formData.training_mode === 'Online'} 
                        onChange={handleChange} 
                        style={{ width: 'auto', accentColor: '#DD3028' }}
                      />
                      Online Training
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'normal', color: '#ccc' }}>
                      <input 
                        type="radio" 
                        name="training_mode" 
                        value="Offline" 
                        checked={formData.training_mode === 'Offline'} 
                        onChange={handleChange} 
                        style={{ width: 'auto', accentColor: '#DD3028' }}
                      />
                      Offline Training
                    </label>
                  </div>
                </div>

                <div className="getfit-form__group">
                  <label htmlFor="fitness_goals">Fitness Goals</label>
                  <select 
                    id="fitness_goals" 
                    name="fitness_goals"
                    value={formData.fitness_goals}
                    onChange={handleChange}
                  >
                    <option value="Fat loss">Fat loss</option>
                    <option value="Weight gain">Weight gain</option>
                    <option value="Strength">Strength</option>
                    <option value="Functional training">Functional training</option>
                  </select>
                </div>

                <div className="getfit-form__group">
                  <label htmlFor="message">Anything Else We Should Know?</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="4" 
                    placeholder="Tell us about your fitness goals, past injuries, or preferred timing..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="cta-button getfit-form__submit"
                  disabled={status.loading}
                >
                  <span>{status.loading ? 'Submitting...' : 'Claim Your Spot'}</span>
                  <span className="cta-arrow">→</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GetFitPage;
