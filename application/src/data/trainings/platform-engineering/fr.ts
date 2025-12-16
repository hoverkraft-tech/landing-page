/**
 * French training course: Platform Engineering
 */

import type { TrainingCourse } from '../types';
import { icon, image, instructor, slug } from './common';

export const course: TrainingCourse = {
  slug,
  title: 'Platform Engineering',
  description:
    'Maîtrisez les fondamentaux du Platform Engineering : architecture, patterns, outillage et gouvernance pour construire une plateforme interne moderne.',
  icon,
  tags: ['Platform Engineering', 'IDP', 'Backstage', 'Gouvernance', 'DORA', 'SPACE'],
  metadata: {
    duration: '3 jour(s)',
    hours: '21 heures',
    instructor,
    audience: 'Architectes, ops, devs',
    ratio: '50% théorique / 50% pratique',
    availability: 'Sur simple demande',
  },
  context:
    "Cette formation vise à aider les apprenants à appréhender les concepts du Platform Engineering moderne. Les formés apprendront à concevoir une architecture plateforme, à sélectionner les bons outils, à définir une stratégie de gouvernance et à mesurer l'impact sur l'expérience développeur.",
  objectives: [
    {
      title: 'Comprendre les principes du Platform Engineering',
      description: 'Distinguer Platform Engineering, DevOps et SRE',
    },
    {
      title: 'Concevoir une architecture plateforme',
      description: 'Identifier les composants essentiels et leurs interactions',
    },
    {
      title: 'Mettre en œuvre un Internal Developer Platform',
      description: 'Sélectionner et intégrer les outils adaptés à votre contexte',
    },
    {
      title: 'Définir une stratégie de gouvernance',
      description: 'Équilibrer standardisation et autonomie des équipes',
    },
    {
      title: "Mesurer l'impact plateforme",
      description: "Utiliser les métriques DORA et SPACE pour piloter l'évolution",
    },
    {
      title: 'Gérer le Product Management plateforme',
      description: 'Construire une roadmap orientée besoins utilisateurs',
    },
  ],
  outline: [
    {
      title: 'Journée #1 : Fondamentaux et architecture',
      description:
        "Introduction au Platform Engineering\nLes composants d'une plateforme interne\nArchitecture de référence et patterns\nÉtude de cas : analyse de plateformes existantes",
    },
    {
      title: 'Journée #2 : Mise en œuvre et outillage',
      description:
        "Self-service developer portal\nCI/CD as a Platform\nObservabilité et monitoring\nTPs : déploiement d'un IDP de base",
    },
    {
      title: 'Journée #3 : Gouvernance et adoption',
      description:
        'Stratégies de gouvernance\nMétriques DORA/SPACE et tableaux de bord\nGestion du Product Management plateforme\nÉvaluation finale (sur demande)',
    },
  ],
  prerequisites:
    "Être à l'aise avec un shell, connaître le principe de fonctionnement des systèmes d'exploitation, avoir une connaissance du développement web en général.",
  inclusions: [
    { title: 'Pauses café', icon: 'tabler:coffee' },
    { title: 'Support de cours format électronique', icon: 'tabler:file-text' },
    { title: 'Plateforme cloud de travaux pratiques', icon: 'tabler:cloud' },
    { title: "Quiz d'évaluation", icon: 'tabler:clipboard-check' },
  ],
  image,
};
