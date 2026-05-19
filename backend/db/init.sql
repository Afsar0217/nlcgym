-- ============================================
-- No Limits CrossFit — Database Schema
-- ============================================

-- Create the database (run this manually first):
-- CREATE DATABASE nlc_gym;

-- Then connect to it and run the rest:
-- \c nlc_gym

-- ============================================
-- 1. COACHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS coaches (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    title           VARCHAR(255) NOT NULL,
    image_url       TEXT,
    transformations VARCHAR(50),
    hours           VARCHAR(50),
    specialty       VARCHAR(255),
    description     TEXT,
    bio             TEXT,
    start_date      DATE,
    end_date        DATE,
    display_order   INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. BLOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blogs (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(500) NOT NULL,
    slug            VARCHAR(500) UNIQUE NOT NULL,
    summary         TEXT,
    content         TEXT,
    image_url       TEXT,
    category        VARCHAR(100) NOT NULL DEFAULT 'General',
    author_name     VARCHAR(255) DEFAULT 'NLC Team',
    author_bio      TEXT,
    reading_time    VARCHAR(50) DEFAULT '5 min',
    is_featured     BOOLEAN DEFAULT false,
    is_published    BOOLEAN DEFAULT true,
    published_at    TIMESTAMP DEFAULT NOW(),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- Index for faster slug lookups and category filtering
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(is_published);

-- ============================================
-- 3. JOB OPENINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS job_openings (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    type            VARCHAR(100) NOT NULL DEFAULT 'Full-time',
    location        VARCHAR(255) DEFAULT 'On-site',
    description     TEXT NOT NULL,
    requirements    TEXT,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. JOB APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS job_applications (
    id              SERIAL PRIMARY KEY,
    job_opening_id  INTEGER NOT NULL REFERENCES job_openings(id) ON DELETE CASCADE,
    full_name       VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    phone           VARCHAR(50),
    resume_url      TEXT,
    certificate_url TEXT,
    additional_info TEXT,
    status          VARCHAR(50) DEFAULT 'pending',
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_job ON job_applications(job_opening_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON job_applications(status);

-- ============================================
-- 5. AUTO-UPDATE updated_at TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE OR REPLACE TRIGGER update_coaches_updated_at
    BEFORE UPDATE ON coaches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_blogs_updated_at
    BEFORE UPDATE ON blogs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_job_openings_updated_at
    BEFORE UPDATE ON job_openings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
