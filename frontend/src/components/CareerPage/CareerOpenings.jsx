import { useState, useEffect, useRef } from 'react';
import { getJobOpenings, applyForJob } from '../../api';
import '../../styles/CareerOpenings.css';

const ApplicationModal = ({ job, onClose }) => {
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', additional_info: '' });
  const [resume, setResume] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [hasCertification, setHasCertification] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!formData.phone.trim()) {
      setError('Phone number is required.');
      setSubmitting(false);
      return;
    }
    if (!resume) {
      setError('Resume is required.');
      setSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('full_name', formData.full_name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('additional_info', formData.additional_info);
      if (resume) data.append('resume', resume);
      if (hasCertification && certificates.length > 0) {
        certificates.forEach(file => data.append('certificates', file));
      }

      await applyForJob(job.id, data);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="application-modal-overlay" onClick={onClose}>
        <div className="application-modal" onClick={e => e.stopPropagation()}>
          <div className="application-success">
            <div className="application-success-icon">✓</div>
            <h3>Application Submitted!</h3>
            <p>Thank you for applying. We'll review your application and get back to you soon.</p>
            <button className="job-card__apply" onClick={onClose}>
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="application-modal-overlay" onClick={onClose}>
      <div className="application-modal" onClick={e => e.stopPropagation()}>
        <div className="application-modal-header">
          <h3>Apply for {job.title}</h3>
          <button className="application-modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="application-form">
          <div className="application-form-group">
            <label>Full Name *</label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={e => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Your full name"
            />
          </div>
          <div className="application-form-group">
            <label>Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
            />
          </div>
          <div className="application-form-group">
            <label>Phone *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 XXXXXXXXXX"
            />
          </div>
          <div className="application-form-group">
            <label>Resume (PDF/Image) *</label>
            <input
              type="file"
              required
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={e => setResume(e.target.files[0])}
            />
          </div>
          <div className="application-form-group">
            <label>Do you have any certifications?</label>
            <div className="certification-toggle">
              <button
                type="button"
                className={`cert-btn ${hasCertification === true ? 'cert-btn--active' : ''}`}
                onClick={() => setHasCertification(true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={`cert-btn ${hasCertification === false ? 'cert-btn--active' : ''}`}
                onClick={() => { setHasCertification(false); setCertificates([]); }}
              >
                No
              </button>
            </div>
          </div>
          {hasCertification && (
            <div className="application-form-group">
              <label>Upload Certificates (PDF/Image) — you can select multiple</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={e => setCertificates(Array.from(e.target.files))}
              />
              {certificates.length > 0 && (
                <div className="cert-file-list">
                  {certificates.map((f, i) => (
                    <span key={i} className="cert-file-tag">{f.name}</span>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="application-form-group">
            <label>Additional Info</label>
            <textarea
              value={formData.additional_info}
              onChange={e => setFormData({ ...formData, additional_info: e.target.value })}
              placeholder="Any additional information you'd like to share..."
              rows={3}
            />
          </div>
          {error && <p className="application-error">{error}</p>}
          <button type="submit" className="job-card__apply" disabled={submitting}>
            <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

const JobCard = ({ title, type, description, job, onApply }) => {
  return (
    <div className="job-card">
      <div className="job-card__header">
        <h3 className="job-card__title">{title}</h3>
        <span className="job-card__type">[ {type} ]</span>
      </div>
      <p className="job-card__description">{description}</p>
      <button className="job-card__apply" onClick={() => onApply(job)}>
        <span>Apply Now</span>
      </button>
    </div>
  );
};

const CareerOpenings = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobOpenings();
        setJobs(data);
      } catch (err) {
        console.error('Failed to load job openings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="career-openings" ref={sectionRef}>
        <div className={`career-openings__container ${isVisible ? 'visible' : ''}`}>
          <div className="career-openings__header">
            <h2 className="career-openings__title">
              Current <span className="pink-text">Openings</span>
            </h2>
            <p className="career-openings__intro">
              We help people completely change their lives. If you are professional, hardworking, and ready to work in the best facility in the city, we want to hear from you.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>
              Loading openings...
            </div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>
              No current openings at this time. Check back later!
            </div>
          ) : (
            <div className="career-openings__grid">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  title={job.title}
                  type={job.type}
                  description={job.description}
                  job={job}
                  onApply={setSelectedJob}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedJob && (
        <ApplicationModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </>
  );
};

export default CareerOpenings;
