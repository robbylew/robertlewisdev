// Mirrors `public/Robert_Lewis_Resume.pdf` — update both together.
// The phone number from the PDF is intentionally not rendered in HTML.

export const resumePdf = '/Robert_Lewis_Resume.pdf'

export const resume = {
  summary: 'Motivated Data Engineering intern candidate pursuing an M.S. in Computer Science at Georgia Tech. Proficient in Python, SQL, cloud platforms (AWS, Azure, GCP) and big data frameworks (Spark, Hadoop, Kafka). Demonstrated experience in building scalable pipelines through hands-on projects.',
  education: [
    {
      school: 'Georgia Institute of Technology (Georgia Tech)',
      url: 'https://www.gatech.edu',
      degree: 'Master of Science in Computer Science',
      dates: 'August 2024 – Present',
      start: '2024-08',
      location: 'Atlanta, GA',
      courseworkLabel: 'Coursework',
      coursework: ['Advanced Database Concepts & Design', 'System Design for Cloud Computing', 'Data Analytics & Security', 'Computer Networks', 'Artificial Intelligence', 'Machine Learning for Trading'],
    },
    {
      school: 'University of California, Los Angeles (UCLA)',
      url: 'https://www.ucla.edu',
      degree: 'Bachelor of Science in Statistics and Data Science',
      dates: 'September 2019 – June 2023',
      start: '2019-09',
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

/** Highlights shown on the home page (all taken from the resume above). */
export const featuredSkills = ['Python', 'Go', 'SQL', 'TypeScript', 'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'Airflow', 'Spark', 'Kafka', 'dbt', 'PostgreSQL', 'MongoDB']
