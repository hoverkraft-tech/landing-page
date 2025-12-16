/**
 * English training course: CI/CD Experts: Github / Gitlab
 */

import type { TrainingCourse } from '../types';
import { icon, image, instructor, slug } from './common';

export const course: TrainingCourse = {
  slug,
  title: 'CI/CD Experts: Github / Gitlab',
  description:
    'Become an expert in modern CI/CD pipelines with GitHub Actions and GitLab CI. Advanced automation, security, and workflow optimization.',
  icon,
  tags: ['CI/CD', 'GitHub Actions', 'GitLab CI', 'GitOps', 'Supply chain'],
  metadata: {
    duration: '3 day(s)',
    hours: '21 hours',
    instructor,
    audience: 'DevOps, ops, developers',
    ratio: '50% theory / 50% hands-on',
    availability: 'On demand',
  },
  context:
    'This training aims to train experts capable of designing, implementing, and optimizing advanced CI/CD pipelines. Trainees will learn to automate their workflows, secure their deployments, and master advanced features of GitHub Actions and GitLab CI.',
  objectives: [
    {
      title: 'Master GitHub Actions and GitLab CI',
      description: 'Syntax, advanced concepts, and best practices',
    },
    {
      title: 'Design optimized pipelines',
      description: 'Caching, parallelization, and efficient build strategies',
    },
    {
      title: 'Secure CI/CD workflows',
      description: 'Secrets management, signing, SBOM, and supply chain security',
    },
    {
      title: 'Implement GitOps and continuous deployment',
      description: 'Deployment strategies and automated rollbacks',
    },
    {
      title: 'Create reusable actions/jobs',
      description: 'Develop custom components for your pipelines',
    },
    {
      title: 'Monitor and debug pipelines',
      description: 'Observability, logging, and advanced troubleshooting',
    },
  ],
  outline: [
    {
      title: 'Day #1: CI/CD Fundamentals',
      description:
        'Introduction to modern pipelines\nGitHub Actions: workflows, jobs, steps\nGitLab CI: .gitlab-ci.yml and runners\nLabs: first build and test pipelines',
    },
    {
      title: 'Day #2: Optimization and security',
      description:
        'Caching and artifacts strategies\nParallelization and matrices\nSecurity: secrets, signing, SBOM\nLabs: optimize an existing pipeline',
    },
    {
      title: 'Day #3: Deployment and production',
      description:
        'GitOps and continuous deployment\nEnvironments and release strategies\nMonitoring and observability\nFinal evaluation (on demand)',
    },
  ],
  prerequisites:
    'Be comfortable with a shell, know Git, and have basic CI/CD experience. Docker knowledge is recommended.',
  inclusions: [
    { title: 'Coffee breaks', icon: 'tabler:coffee' },
    { title: 'Electronic course materials', icon: 'tabler:file-text' },
    { title: 'Cloud lab platform', icon: 'tabler:cloud' },
    { title: 'Assessment quizzes', icon: 'tabler:clipboard-check' },
  ],
  image,
};
