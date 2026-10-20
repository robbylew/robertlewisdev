export interface Project {
  name: string
  description: string
  /** UnoCSS icon class, e.g. `i-simple-icons-go`. */
  icon: string
  link?: string
  tags?: string[]
  /** Source isn't public; rendered with a "Private" badge instead of a link. */
  private?: boolean
  /** Shown on the home page. */
  featured?: boolean
}

export const projects: Record<string, Project[]> = {
  'Machine Learning & Data Engineering': [
    {
      name: 'Audify: Audio Fingerprinting System',
      link: 'https://github.com/robbylew/audify',
      description: 'Shazam-style song recognition in Go — real-time audio fingerprinting with FFmpeg preprocessing, Spotify/YouTube metadata and MongoDB/SQLite fingerprint storage.',
      icon: 'i-simple-icons-go',
      tags: ['Go', 'MongoDB', 'SQLite', 'FFmpeg'],
      featured: true,
    },
    {
      name: 'LLM-Driven Document Summarization',
      description: 'Scalable summarization of large document collections using LangChain prompts and Pinecone indexing, containerized and deployed serverlessly on AWS Fargate.',
      icon: 'i-simple-icons-amazonaws',
      tags: ['Python', 'LangChain', 'Pinecone', 'Docker', 'AWS'],
      private: true,
      featured: true,
    },
    {
      name: 'End-to-End MLOps Pipeline',
      description: 'Kubeflow pipeline for image classification with automated ETL, running on Kubernetes GPU clusters provisioned with Terraform.',
      icon: 'i-simple-icons-kubernetes',
      tags: ['Kubeflow', 'Kubernetes', 'Terraform'],
      private: true,
      featured: true,
    },
    {
      name: 'Twitter Sentiment Dashboard',
      description: 'Real-time Twitter sentiment analysis with BERT, containerized with Docker.',
      icon: 'i-simple-icons-docker',
      tags: ['BERT', 'Docker'],
      private: true,
    },
  ],
  'Data Science': [
    {
      name: 'San Francisco Crime Classification',
      link: 'https://www.kaggle.com/code/robbylew/predicting-crime-categories-using-random-forest',
      description: 'Predicting San Francisco crime categories with a Random Forest model.',
      icon: 'i-ri-police-badge-line',
      tags: ['Random Forest', 'Kaggle'],
    },
    {
      name: 'House Price Prediction with XGBoost',
      link: 'https://www.kaggle.com/code/robbylew/house-price-predictions-xgboost',
      description: 'House price regression using gradient-boosted trees.',
      icon: 'i-ri-home-4-line',
      tags: ['XGBoost', 'Kaggle'],
    },
  ],
  'Web Development': [
    {
      name: 'robertlewis.dev',
      link: 'https://github.com/robbylew/robertlewisdev-v2',
      description: 'This website — statically generated with Vue, Vite, TypeScript and UnoCSS.',
      icon: 'i-simple-icons-vuedotjs',
      tags: ['Vue', 'TypeScript', 'UnoCSS'],
    },
    {
      name: 'Previous Portfolio Site',
      link: 'https://github.com/robbylew/robertlewisdev-v1',
      description: 'My previous portfolio, built with Next.js, TypeScript and Tailwind CSS.',
      icon: 'i-simple-icons-nextdotjs',
      tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    },
    {
      name: 'Hacker News Clone',
      link: 'https://github.com/robbylew/hacker-news-clone',
      description: 'An open-source Hacker News clone built with React.',
      icon: 'i-simple-icons-react',
      tags: ['React'],
    },
  ],
  'Open Source': [
    {
      name: 'Flutter',
      link: 'https://github.com/flutter/flutter',
      description: 'Contributed to Google\'s Flutter UI toolkit.',
      icon: 'i-simple-icons-flutter',
    },
  ],
}

export const featuredProjects: Project[] = Object.values(projects).flat().filter(project => project.featured)
