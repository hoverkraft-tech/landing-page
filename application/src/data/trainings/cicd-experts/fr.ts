/**
 * French training course: CI/CD Experts : Github / Gitlab
 */

import type { TrainingCourse } from '../types';
import { icon, image, instructor, slug } from './common';

export const course: TrainingCourse = {
  slug,
  title: 'CI/CD Experts : Github / Gitlab',
  description:
    'Devenez expert des pipelines CI/CD modernes avec GitHub Actions et GitLab CI. Automatisation avancée, sécurité et optimisation de vos workflows.',
  icon,
  tags: ['CI/CD', 'GitHub Actions', 'GitLab CI', 'GitOps', 'Supply chain'],
  metadata: {
    duration: '3 jour(s)',
    hours: '21 heures',
    instructor,
    audience: 'DevOps, ops, développeurs',
    ratio: '50% théorique / 50% pratique',
    availability: 'Sur simple demande',
  },
  context:
    'Cette formation vise à former des experts capables de concevoir, implémenter et optimiser des pipelines CI/CD avancés. Les formés apprendront à automatiser leurs workflows, sécuriser leurs déploiements, et maîtriser les fonctionnalités avancées de GitHub Actions et GitLab CI.',
  objectives: [
    {
      title: 'Maîtriser GitHub Actions et GitLab CI',
      description: 'Syntaxe, concepts avancés et meilleures pratiques',
    },
    {
      title: 'Concevoir des pipelines optimisés',
      description: 'Cache, parallélisation et stratégies de build efficaces',
    },
    {
      title: 'Sécuriser les workflows CI/CD',
      description: 'Secrets management, signing, SBOM et supply chain security',
    },
    {
      title: 'Implémenter GitOps et déploiement continu',
      description: 'Stratégies de déploiement et rollback automatisés',
    },
    {
      title: 'Créer des actions/jobs réutilisables',
      description: 'Développer des composants custom pour vos pipelines',
    },
    {
      title: 'Monitorer et débugger les pipelines',
      description: 'Observabilité, logging et troubleshooting avancé',
    },
  ],
  outline: [
    {
      title: 'Journée #1 : Fondamentaux CI/CD',
      description:
        'Introduction aux pipelines modernes\nGitHub Actions : workflows, jobs, steps\nGitLab CI : .gitlab-ci.yml et runners\nTPs : premiers pipelines de build et test',
    },
    {
      title: 'Journée #2 : Optimisation et sécurité',
      description:
        'Stratégies de cache et artifacts\nParallélisation et matrices\nSécurisation : secrets, signing, SBOM\nTPs : optimiser un pipeline existant',
    },
    {
      title: 'Journée #3 : Déploiement et production',
      description:
        'GitOps et déploiement continu\nEnvironnements et stratégies de release\nMonitoring et observabilité\nÉvaluation finale (sur demande)',
    },
  ],
  prerequisites:
    "Être à l'aise avec un shell, connaître Git et avoir une expérience de base avec CI/CD. Une connaissance de Docker est recommandée.",
  inclusions: [
    { title: 'Pauses café', icon: 'tabler:coffee' },
    { title: 'Support de cours format électronique', icon: 'tabler:file-text' },
    { title: 'Plateforme cloud de travaux pratiques', icon: 'tabler:cloud' },
    { title: "Quiz d'évaluation", icon: 'tabler:clipboard-check' },
  ],
  image,
};
