/**
 * English training course: Platform Engineering
 */

import type { TrainingCourse } from '../types';
import { icon, image, instructor, slug } from './common';

export const course: TrainingCourse = {
  slug,
  title: 'Platform Engineering',
  description:
    'Master the fundamentals of Platform Engineering: architecture, patterns, tooling, and governance to build a modern internal platform.',
  icon,
  tags: ['Platform Engineering', 'IDP', 'Backstage', 'Governance', 'DORA', 'SPACE'],
  metadata: {
    duration: '3 day(s)',
    hours: '21 hours',
    instructor,
    audience: 'Architects, ops, devs',
    ratio: '50% theory / 50% hands-on',
    availability: 'On demand',
  },
  context:
    'This training aims to help learners understand the concepts of modern Platform Engineering. Trainees will learn to design a platform architecture, select the right tools, define a governance strategy, and measure the impact on developer experience.',
  objectives: [
    {
      title: 'Understand Platform Engineering principles',
      description: 'Distinguish Platform Engineering, DevOps, and SRE',
    },
    {
      title: 'Design a platform architecture',
      description: 'Identify essential components and their interactions',
    },
    {
      title: 'Implement an Internal Developer Platform',
      description: 'Select and integrate tools suited to your context',
    },
    {
      title: 'Define a governance strategy',
      description: 'Balance standardization and team autonomy',
    },
    {
      title: 'Measure platform impact',
      description: 'Use DORA and SPACE metrics to drive evolution',
    },
    {
      title: 'Manage platform Product Management',
      description: 'Build a user-needs-oriented roadmap',
    },
  ],
  outline: [
    {
      title: 'Day #1: Fundamentals and architecture',
      description:
        'Introduction to Platform Engineering\nInternal platform components\nReference architecture and patterns\nCase study: analysis of existing platforms',
    },
    {
      title: 'Day #2: Implementation and tooling',
      description:
        'Self-service developer portal\nCI/CD as a Platform\nObservability and monitoring\nLabs: deploying a basic IDP',
    },
    {
      title: 'Day #3: Governance and adoption',
      description:
        'Governance strategies\nDORA/SPACE metrics and dashboards\nPlatform Product Management\nFinal evaluation (on demand)',
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
