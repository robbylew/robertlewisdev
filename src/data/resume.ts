// Source of truth for the resume page. `public/Robert_Lewis_Resume.pdf` is generated
// from that page — run `pnpm resume:pdf` after editing this file.

export const resumePdf = '/Robert_Lewis_Resume.pdf'

export interface ResumeRole {
  title: string
  type: string
  /** `YYYY-MM` */
  start: string
  /** `YYYY-MM`; omit for a current role. */
  end?: string
  highlights?: string[]
}

export interface ResumeExperience {
  company: string
  url: string
  location: string
  roles: ResumeRole[]
}

export interface ResumeEducation {
  school: string
  url: string
  degree: string
  specialization?: string
  /** `YYYY-MM` */
  start: string
  /** `YYYY-MM`; omit while enrolled. */
  end?: string
  location: string
  courseworkLabel: string
  coursework: string[]
}

export interface ResumeProject {
  name: string
  stack: string[]
  link?: string
  highlights: string[]
}

export const resume: {
  headline: string
  summary: string
  experience: ResumeExperience[]
  education: ResumeEducation[]
  skills: { label: string, items: string[] }[]
  projects: ResumeProject[]
  certifications: string[]
} = {
  headline: 'Data Engineer II at Honeywell Technologies',
  summary: 'Data Engineer II at Honeywell Technologies with an M.S. in Computer Science (specialization in Artificial Intelligence) from Georgia Tech and a B.S. in Statistics and Data Science from UCLA. Proficient in Python, SQL, cloud platforms (AWS, Azure, GCP) and big data frameworks (Spark, Hadoop, Kafka), with hands-on experience building scalable data and machine learning pipelines.',
  experience: [
    {
      company: 'Honeywell Technologies',
      url: 'https://www.honeywell.com',
      location: 'Atlanta, GA · Hybrid',
      roles: [
        { title: 'Data Engineer II', type: 'Full-time', start: '2026-05' },
        { title: 'Data Engineer Intern', type: 'Internship', start: '2025-05', end: '2025-08' },
      ],
    },
  ],
  education: [
    {
      school: 'Georgia Institute of Technology (Georgia Tech)',
      url: 'https://www.gatech.edu',
      degree: 'Master of Science in Computer Science',
      specialization: 'Specialization in Artificial Intelligence',
      start: '2024-07',
      end: '2026-06',
      location: 'Atlanta, GA',
      courseworkLabel: 'Coursework',
      coursework: ['Advanced Database Concepts & Design', 'System Design for Cloud Computing', 'Data Analytics & Security', 'Computer Networks', 'Artificial Intelligence', 'Machine Learning for Trading'],
    },
    {
      school: 'University of California, Los Angeles (UCLA)',
      url: 'https://www.ucla.edu',
      degree: 'Bachelor of Science in Statistics and Data Science',
      start: '2019-09',
      end: '2023-06',
      location: 'Los Angeles, CA',
      courseworkLabel: 'Relevant Coursework',
      coursework: ['Probability Theory', 'Deep Learning', 'Neural Networks', 'Bayesian Statistics', 'Computer Vision', 'Data Warehousing', 'Data Mining', 'Data Visualization', 'Data Structures & Algorithms'],
    },
  ],
  skills: [
    { label: 'Programming & Scripting', items: ['Python', 'Go', 'SQL', 'JavaScript', 'TypeScript', 'R', 'Bash'] },
    { label: 'Cloud & MLOps', items: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Airflow', 'CI/CD'] },
    { label: 'Data Engineering & Pipelines', items: ['Kafka', 'Hadoop', 'Spark', 'Hive', 'dbt', 'Apache Beam'] },
    { label: 'Databases & Storage', items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'S3', 'Cassandra'] },
  ],
  projects: [
    {
      name: 'Real-Time Audio Fingerprinting Engine',
      stack: ['Golang', 'MongoDB', 'FFmpeg', 'REST APIs'],
      link: 'https://github.com/robbylew/audify',
      highlights: [
        'Created a Golang pipeline to extract audio fingerprints for real-time song IDs.',
        'Integrated Spotify/YouTube APIs and FFmpeg for metadata retrieval and audio preprocessing.',
        'Enabled scalable matching with MongoDB and SQLite for efficient fingerprint storage and retrieval.',
      ],
    },
    {
      name: 'AI-Driven Document Summarization Suite',
      stack: ['Python', 'LangChain', 'Pinecone', 'Docker', 'AWS'],
      highlights: [
        'Streamlined retrieval of millions of documents (e.g., reports, articles) to speed up decision-making.',
        'Leveraged LangChain for LLM prompts and Pinecone for indexing; containerized with Docker.',
        'Deployed on AWS Fargate for serverless scaling, cutting latency by 30%.',
      ],
    },
    {
      name: 'Automated MLOps Pipeline for Image Analytics',
      stack: ['Kubeflow', 'Kubernetes', 'Terraform', 'ETL'],
      highlights: [
        'Developed an MLOps pipeline with Kubeflow for ETL in image classification tasks.',
        'Managed Kubernetes clusters via Terraform to enhance scalability and resource efficiency.',
        'Automated container orchestration with ETL workflows, minimizing manual oversight by 40%.',
      ],
    },
  ],
  certifications: ['CompTIA Network+', 'CompTIA Security+'],
}

const monthFormat = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })

/** `2026-05` -> `May 2026` (UTC, so server and client render identically). */
export function formatMonth(yearMonth: string): string {
  return monthFormat.format(new Date(`${yearMonth}-01T00:00:00Z`))
}
