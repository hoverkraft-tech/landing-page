/**
 * Type definitions for training course data
 */

export interface TrainingMetadata {
  duration: string;
  hours: string;
  instructor: string;
  audience: string;
  ratio: string;
  availability: string;
}

export interface TrainingObjective {
  title: string;
  description: string;
}

export interface TrainingDay {
  title: string;
  description: string;
}

export interface TrainingInclusion {
  title: string;
  icon: string;
}

export interface TrainingCourse {
  slug: string;
  title: string;
  description: string;
  icon: string;
  tags?: string[];
  metadata: TrainingMetadata;
  context: string;
  objectives: TrainingObjective[];
  outline: TrainingDay[];
  prerequisites: string;
  inclusions: TrainingInclusion[];
  image: string;
}
