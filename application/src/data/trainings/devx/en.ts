/**
 * English training course: DevX - Developer Experience
 */

import type { TrainingCourse } from '../types';
import { icon, image, instructor, slug } from './common';

export const course: TrainingCourse = {
  slug,
  title: 'DevX - Developer Experience',
  description:
    'Learn to measure and improve developer experience. DORA/SPACE metrics, Internal Developer Portals, and adoption strategies.',
  icon,
  tags: ['DevX', 'Developer Experience', 'DORA', 'SPACE', 'Internal Developer Portal'],
  metadata: {
    duration: '2 day(s)',
    hours: '14 hours',
    instructor,
    audience: 'Tech leads, managers, platform engineers',
    ratio: '50% theory / 50% hands-on',
    availability: 'On demand',
  },
  context:
    'This training aims to train developer experience champions. Trainees will learn to identify friction points, measure productivity with the right metrics, and implement continuous improvement strategies centered on developer needs.',
  objectives: [
    {
      title: 'Understand Developer Experience challenges',
      description: 'Impact on productivity, retention, and time-to-market',
    },
    {
      title: 'Measure with DORA and SPACE metrics',
      description: 'Collect, analyze, and interpret key indicators',
    },
    {
      title: 'Identify friction points',
      description: 'Survey and qualitative analysis methods',
    },
    {
      title: 'Design an Internal Developer Portal',
      description: 'Architecture, components, and adoption strategy',
    },
    {
      title: 'Implement feedback loops',
      description: 'Rituals and tools to capture developer feedback',
    },
    {
      title: 'Drive continuous improvement',
      description: 'DevX roadmap and initiative governance',
    },
  ],
  outline: [
    {
      title: 'Day #1: Measurement and diagnosis',
      description:
        'Introduction to Developer Experience\nDORA metrics and SPACE framework\nIdentifying friction points\nLabs: DevX audit of your organization',
    },
    {
      title: 'Day #2: Improvement and portals',
      description:
        'Internal Developer Portals (Backstage, etc.)\nImprovement strategies and quick wins\nGovernance and feedback loops\nFinal evaluation (on demand)',
    },
  ],
  prerequisites:
    'Have experience in software development or managing technical teams. Basic knowledge of DevOps practices recommended.',
  inclusions: [
    { title: 'Coffee breaks', icon: 'tabler:coffee' },
    { title: 'Electronic course materials', icon: 'tabler:file-text' },
    { title: 'Cloud lab platform', icon: 'tabler:cloud' },
    { title: 'Assessment quizzes', icon: 'tabler:clipboard-check' },
  ],
  image,
};
