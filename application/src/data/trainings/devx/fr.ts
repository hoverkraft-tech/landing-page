/**
 * French training course: DevX - Developer Experience
 */

import type { TrainingCourse } from '../types';
import { icon, image, instructor, slug } from './common';

export const course: TrainingCourse = {
  slug,
  title: 'DevX - Developer Experience',
  description:
    "Apprenez à mesurer et améliorer l'expérience développeur. Métriques DORA/SPACE, Internal Developer Portals et stratégies d'adoption.",
  icon,
  tags: ['DevX', 'Expérience développeur', 'DORA', 'SPACE', 'Portail développeur'],
  metadata: {
    duration: '2 jour(s)',
    hours: '14 heures',
    instructor,
    audience: 'Tech leads, managers, platform engineers',
    ratio: '50% théorique / 50% pratique',
    availability: 'Sur simple demande',
  },
  context:
    "Cette formation vise à former des champions de l'expérience développeur. Les formés apprendront à identifier les points de friction, mesurer la productivité avec les bonnes métriques, et mettre en place des stratégies d'amélioration continue centrées sur les besoins des développeurs.",
  objectives: [
    {
      title: 'Comprendre les enjeux de la Developer Experience',
      description: 'Impact sur la productivité, rétention et time-to-market',
    },
    {
      title: 'Mesurer avec les métriques DORA et SPACE',
      description: 'Collecter, analyser et interpréter les indicateurs clés',
    },
    {
      title: 'Identifier les points de friction',
      description: "Méthodes d'enquête et d'analyse qualitative",
    },
    {
      title: 'Concevoir un Internal Developer Portal',
      description: "Architecture, composants et stratégie d'adoption",
    },
    {
      title: 'Mettre en place des feedback loops',
      description: 'Rituels et outils pour capturer les retours développeurs',
    },
    {
      title: "Piloter l'amélioration continue",
      description: 'Roadmap DevX et gouvernance des initiatives',
    },
  ],
  outline: [
    {
      title: 'Journée #1 : Mesure et diagnostic',
      description:
        'Introduction à la Developer Experience\nMétriques DORA et framework SPACE\nIdentification des points de friction\nTPs : audit DevX de votre organisation',
    },
    {
      title: 'Journée #2 : Amélioration et portails',
      description:
        "Internal Developer Portals (Backstage, etc.)\nStratégies d'amélioration et quick wins\nGouvernance et feedback loops\nÉvaluation finale (sur demande)",
    },
  ],
  prerequisites:
    "Avoir une expérience en développement logiciel ou en gestion d'équipes techniques. Connaissance de base des pratiques DevOps recommandée.",
  inclusions: [
    { title: 'Pauses café', icon: 'tabler:coffee' },
    { title: 'Support de cours format électronique', icon: 'tabler:file-text' },
    { title: 'Plateforme cloud de travaux pratiques', icon: 'tabler:cloud' },
    { title: "Quiz d'évaluation", icon: 'tabler:clipboard-check' },
  ],
  image,
};
