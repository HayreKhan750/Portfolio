-- Insert sample profile data
INSERT INTO profile (name, headline, bio, email, phone, location) VALUES
(
  'Hayredin Mohammed',
  'AI / ML Engineer',
  'Passionate about building intelligent systems that solve real-world problems. Experienced in full-stack development with a focus on AI/ML integration.',
  'hayredin@example.com',
  '+1 (555) 123-4567',
  'San Francisco, CA'
);

-- Insert sample skills (grouped by category)
INSERT INTO skills (category, name, proficiency, sort_order) VALUES
('Frontend', 'React', 95, 1),
('Frontend', 'TypeScript', 90, 2),
('Frontend', 'Tailwind CSS', 92, 3),
('Frontend', 'Next.js', 88, 4),
('Backend', 'Node.js', 85, 5),
('Backend', 'Python', 90, 6),
('Backend', 'PostgreSQL', 82, 7),
('Backend', 'Supabase', 87, 8),
('AI/ML', 'TensorFlow', 80, 9),
('AI/ML', 'PyTorch', 78, 10),
('AI/ML', 'OpenAI API', 85, 11),
('AI/ML', 'LangChain', 82, 12),
('DevOps', 'Docker', 75, 13),
('DevOps', 'AWS', 70, 14),
('DevOps', 'CI/CD', 72, 15);

-- Insert sample projects
INSERT INTO projects (title, description, technologies, project_url, featured, sort_order) VALUES
(
  'AI-Powered Portfolio',
  'A modern portfolio website with AI-driven content recommendations and dynamic skill visualization.',
  ARRAY['React', 'TypeScript', 'Supabase', 'OpenAI'],
  'https://example.com',
  true,
  1
),
(
  'Smart Task Manager',
  'Intelligent task management system with ML-based priority suggestions and deadline predictions.',
  ARRAY['Next.js', 'Python', 'TensorFlow', 'PostgreSQL'],
  'https://example.com',
  true,
  2
),
(
  'Real-time Analytics Dashboard',
  'High-performance dashboard for visualizing complex data streams in real-time.',
  ARRAY['React', 'D3.js', 'WebSockets', 'Node.js'],
  'https://example.com',
  false,
  3
);

-- Insert sample experience
INSERT INTO experience (company, position, description, start_date, end_date, current, sort_order) VALUES
(
  'Tech Innovations Inc.',
  'Senior Full-Stack Engineer',
  'Led development of AI-powered applications, mentored junior developers, and architected scalable cloud solutions.',
  '2022-01-01',
  NULL,
  true,
  1
),
(
  'Digital Solutions Ltd.',
  'Full-Stack Developer',
  'Developed and maintained multiple client-facing web applications using modern JavaScript frameworks.',
  '2020-03-01',
  '2021-12-31',
  false,
  2
);

-- Insert sample certificates
INSERT INTO certificates (name, issuer, issue_date, credential_url, sort_order) VALUES
(
  'AWS Certified Solutions Architect',
  'Amazon Web Services',
  '2023-06-15',
  'https://aws.amazon.com/certification/',
  1
),
(
  'TensorFlow Developer Certificate',
  'Google',
  '2023-03-20',
  'https://www.tensorflow.org/certificate',
  2
),
(
  'React Advanced Patterns',
  'Frontend Masters',
  '2022-11-10',
  'https://frontendmasters.com',
  3
);

-- Insert sample social links
INSERT INTO social_links (platform, url, icon, sort_order) VALUES
('LinkedIn', 'https://linkedin.com/in/hayredin', 'Linkedin', 1),
('GitHub', 'https://github.com/hayredin', 'Github', 2),
('Twitter', 'https://twitter.com/hayredin', 'Twitter', 3);
