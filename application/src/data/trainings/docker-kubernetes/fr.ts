/**
 * French training course: Docker et Kubernetes
 */

import type { TrainingCourse } from '../types';
import { icon, image, instructor, slug } from './common';

export const course: TrainingCourse = {
  slug,
  title: 'Docker et Kubernetes',
  description:
    "Maîtrisez la conteneurisation et l'orchestration. De la création d'images Docker optimisées au déploiement Kubernetes en production.",
  icon,
  tags: ['Docker', 'Kubernetes', 'Conteneurs', 'Orchestration', 'CI/CD'],
  metadata: {
    duration: '3 jour(s)',
    hours: '21 heures',
    instructor,
    audience: 'Architectes, administrateurs, développeurs',
    ratio: '50% théorique / 50% pratique',
    availability: 'Sur simple demande',
  },
  context:
    "Cette formation vise à aider les apprenants à appréhender les concepts derrière la conteneurisation d'applications. Les formés apprendront à construire leurs propres conteneurs, mettre en œuvre des conteneurs construits par d'autres, et savoir gérer des applications multi-conteneurs avec Kubernetes.",
  objectives: [
    {
      title: "Connaître les caractéristiques d'un conteneur Linux",
      description: 'Namespaces, cgroups et isolation',
    },
    {
      title: 'Installer et utiliser Docker',
      description: 'CLI, daemon et écosystème Docker',
    },
    {
      title: 'Maîtriser la création des images Docker et "Dockerfile"',
      description: 'Multi-stage builds, optimisation et sécurité',
    },
    {
      title: 'Intégrer avec le Docker Hub et registry privés',
      description: 'Push, pull et gestion des artifacts',
    },
    {
      title: 'Maîtriser les notions réseaux de Docker (networks, links)',
      description: 'Networking, DNS et exposition de services',
    },
    {
      title: 'Maîtriser la gestion des données avec Docker (volumes)',
      description: 'Persistence, backup et partage de données',
    },
    {
      title: 'Utiliser Docker Swarm, Docker Compose et Docker Machine',
      description: 'Orchestration basique et composition',
    },
    {
      title: 'Intégrer Docker au sein de vos projets',
      description: 'CI/CD et workflows de développement',
    },
    {
      title: 'Déployer Docker en production',
      description: 'Best practices, monitoring et troubleshooting',
    },
    {
      title: "Maîtriser Kubernetes pour l'orchestration",
      description: 'Pods, services, deployments et configurations',
    },
  ],
  outline: [
    {
      title: 'Journée #1 : Docker fondamentaux',
      description:
        'Introduction aux conteneurs logiciels\nCréer ses 1er conteneurs\nGestion des images de conteneurs\nIntégration CI/CD',
    },
    {
      title: 'Journée #2 : Docker avancé',
      description:
        'Docker et le réseau\nDocker et la persistance des données\nDocker Compose et multi-conteneurs\nDocker en production',
    },
    {
      title: 'Journée #3 : Kubernetes',
      description:
        "L'écosystème Docker\nConcepts avancés\nKubernetes : architecture et concepts\nÉvaluation (sur demande)",
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
