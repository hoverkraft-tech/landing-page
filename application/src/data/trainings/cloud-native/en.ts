/**
 * English training course: Cloud Native Apps
 */

import type { TrainingCourse } from '../types';
import { icon, image, instructor, slug } from './common';

export const course: TrainingCourse = {
  slug,
  title: 'Cloud Native Apps',
  description:
    'Design and deploy resilient cloud-native applications. Distributed architecture, modern patterns, and advanced observability.',
  icon,
  tags: ['Cloud-native', 'Microservices', 'Observability', 'Resilience', 'Security'],
  metadata: {
    duration: '3 day(s)',
    hours: '21 hours',
    instructor,
    audience: 'Developers, architects',
    ratio: '50% theory / 50% hands-on',
    availability: 'On demand',
  },
  context:
    'This training aims to train developers and architects capable of designing cloud-native applications. Trainees will learn to build resilient distributed systems, implement modern patterns, and manage the complete lifecycle of containerized applications in production.',
  objectives: [
    {
      title: 'Understand cloud-native principles',
      description: '12-factor app, microservices, and distributed architecture',
    },
    {
      title: 'Implement application resilience',
      description: 'Circuit breakers, retries, timeouts, and graceful degradation',
    },
    {
      title: 'Manage configuration and secrets',
      description: 'Config management, service discovery, and secrets rotation',
    },
    {
      title: 'Implement observability',
      description: 'Logging, metrics, distributed tracing, and dashboards',
    },
    {
      title: 'Optimize performance',
      description: 'Caching, async patterns, and resource management',
    },
    {
      title: 'Secure cloud applications',
      description: 'Zero-trust, mTLS, and supply chain security',
    },
  ],
  outline: [
    {
      title: 'Day #1: Cloud-native architecture',
      description:
        'Cloud-native principles and patterns\nMicroservices and inter-service communication\nConfiguration and service discovery\nLabs: refactoring a monolithic app',
    },
    {
      title: 'Day #2: Resilience and observability',
      description:
        'Resilience patterns\nObservability: logs, metrics, traces\nHealthchecks and readiness probes\nLabs: instrument an application',
    },
    {
      title: 'Day #3: Production and security',
      description:
        'Deployment and release strategies\nSecurity and zero-trust\nOptimizations and performance\nFinal evaluation (on demand)',
    },
  ],
  prerequisites: 'Have experience in web application development. Basic knowledge of Docker and REST APIs recommended.',
  inclusions: [
    { title: 'Coffee breaks', icon: 'tabler:coffee' },
    { title: 'Electronic course materials', icon: 'tabler:file-text' },
    { title: 'Cloud lab platform', icon: 'tabler:cloud' },
    { title: 'Assessment quizzes', icon: 'tabler:clipboard-check' },
  ],
  image,
};
