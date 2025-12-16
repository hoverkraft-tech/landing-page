/**
 * English training course: Docker and Kubernetes
 */

import type { TrainingCourse } from '../types';
import { icon, image, instructor, slug } from './common';

export const course: TrainingCourse = {
  slug,
  title: 'Docker and Kubernetes',
  description:
    'Master containerization and orchestration. From creating optimized Docker images to production Kubernetes deployment.',
  icon,
  tags: ['Docker', 'Kubernetes', 'Containers', 'Orchestration', 'CI/CD'],
  metadata: {
    duration: '3 day(s)',
    hours: '21 hours',
    instructor,
    audience: 'Architects, administrators, developers',
    ratio: '50% theory / 50% hands-on',
    availability: 'On demand',
  },
  context:
    'This training aims to help learners understand the concepts behind application containerization. Trainees will learn to build their own containers, work with containers built by others, and manage multi-container applications with Kubernetes.',
  objectives: [
    {
      title: 'Know the characteristics of a Linux container',
      description: 'Namespaces, cgroups, and isolation',
    },
    {
      title: 'Install and use Docker',
      description: 'CLI, daemon, and Docker ecosystem',
    },
    {
      title: 'Master Docker image creation and "Dockerfile"',
      description: 'Multi-stage builds, optimization, and security',
    },
    {
      title: 'Integrate with Docker Hub and private registries',
      description: 'Push, pull, and artifact management',
    },
    {
      title: 'Master Docker networking (networks, links)',
      description: 'Networking, DNS, and service exposure',
    },
    {
      title: 'Master data management with Docker (volumes)',
      description: 'Persistence, backup, and data sharing',
    },
    {
      title: 'Use Docker Swarm, Docker Compose, and Docker Machine',
      description: 'Basic orchestration and composition',
    },
    {
      title: 'Integrate Docker into your projects',
      description: 'CI/CD and development workflows',
    },
    {
      title: 'Deploy Docker in production',
      description: 'Best practices, monitoring, and troubleshooting',
    },
    {
      title: 'Master Kubernetes for orchestration',
      description: 'Pods, services, deployments, and configurations',
    },
  ],
  outline: [
    {
      title: 'Day #1: Docker fundamentals',
      description:
        'Introduction to software containers\nCreate your first containers\nManaging container images\nCI/CD integration',
    },
    {
      title: 'Day #2: Advanced Docker',
      description:
        'Docker and networking\nDocker and data persistence\nDocker Compose and multi-containers\nDocker in production',
    },
    {
      title: 'Day #3: Kubernetes',
      description:
        'The Docker ecosystem\nAdvanced concepts\nKubernetes: architecture and concepts\nEvaluation (on demand)',
    },
  ],
  prerequisites:
    'Be comfortable with a shell, know the operating principles of operating systems, and have general web development knowledge.',
  inclusions: [
    { title: 'Coffee breaks', icon: 'tabler:coffee' },
    { title: 'Electronic course materials', icon: 'tabler:file-text' },
    { title: 'Cloud lab platform', icon: 'tabler:cloud' },
    { title: 'Assessment quizzes', icon: 'tabler:clipboard-check' },
  ],
  image,
};
