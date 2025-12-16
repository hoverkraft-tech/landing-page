/**
 * French training course: Cloud Native Apps
 */

import type { TrainingCourse } from '../types';
import { icon, image, instructor, slug } from './common';

export const course: TrainingCourse = {
  slug,
  title: 'Cloud Native Apps',
  description:
    'Concevez et déployez des applications cloud-native résilientes. Architecture distribuée, patterns modernes et observabilité avancée.',
  icon,
  tags: ['Cloud-native', 'Microservices', 'Observabilité', 'Résilience', 'Sécurité'],
  metadata: {
    duration: '3 jour(s)',
    hours: '21 heures',
    instructor,
    audience: 'Développeurs, architectes',
    ratio: '50% théorique / 50% pratique',
    availability: 'Sur simple demande',
  },
  context:
    "Cette formation vise à former des développeurs et architectes capables de concevoir des applications cloud-native. Les formés apprendront à construire des systèmes distribués résilients, à implémenter les patterns modernes, et à gérer le cycle de vie complet d'applications conteneurisées en production.",
  objectives: [
    {
      title: 'Comprendre les principes cloud-native',
      description: '12-factor app, microservices et architecture distribuée',
    },
    {
      title: 'Implémenter la résilience applicative',
      description: 'Circuit breakers, retries, timeouts et graceful degradation',
    },
    {
      title: 'Gérer la configuration et les secrets',
      description: 'Config management, service discovery et secrets rotation',
    },
    {
      title: "Mettre en œuvre l'observabilité",
      description: 'Logging, metrics, tracing distribué et dashboards',
    },
    {
      title: 'Optimiser les performances',
      description: 'Caching, async patterns et resource management',
    },
    {
      title: 'Sécuriser les applications cloud',
      description: 'Zero-trust, mTLS et supply chain security',
    },
  ],
  outline: [
    {
      title: 'Journée #1 : Architecture cloud-native',
      description:
        "Principes et patterns cloud-native\nMicroservices et communication inter-services\nConfiguration et service discovery\nTPs : refactoring d'une app monolithique",
    },
    {
      title: 'Journée #2 : Résilience et observabilité',
      description:
        'Patterns de résilience\nObservabilité : logs, metrics, traces\nHealthchecks et readiness probes\nTPs : instrumenter une application',
    },
    {
      title: 'Journée #3 : Production et sécurité',
      description:
        'Déploiement et stratégies de release\nSécurité et zero-trust\nOptimisations et performance\nÉvaluation finale (sur demande)',
    },
  ],
  prerequisites:
    "Avoir une expérience en développement d'applications web. Connaissance de base de Docker et des APIs REST recommandée.",
  inclusions: [
    { title: 'Pauses café', icon: 'tabler:coffee' },
    { title: 'Support de cours format électronique', icon: 'tabler:file-text' },
    { title: 'Plateforme cloud de travaux pratiques', icon: 'tabler:cloud' },
    { title: "Quiz d'évaluation", icon: 'tabler:clipboard-check' },
  ],
  image,
};
