import type { TrainingCourse } from '~/data/trainings';

type TrainingLang = 'fr' | 'en';

type TrainingCoursesByLang = Record<TrainingLang, TrainingCourse[]>;

let _coursesByLang: TrainingCoursesByLang | undefined;

const toCourses = (modules: Record<string, unknown>): TrainingCourse[] =>
  Object.values(modules)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((module) => (module as any).course as TrainingCourse)
    .sort((a, b) => a.slug.localeCompare(b.slug));

export const loadTrainingCoursesByLang = (): TrainingCoursesByLang => {
  if (_coursesByLang) return _coursesByLang;

  const frModules = import.meta.glob('../data/trainings/*/fr.ts', { eager: true });
  const enModules = import.meta.glob('../data/trainings/*/en.ts', { eager: true });

  _coursesByLang = {
    fr: toCourses(frModules),
    en: toCourses(enModules),
  };

  return _coursesByLang;
};

export const fetchTrainingCourses = ({
  lang,
  fallbackLang = 'fr',
}: {
  lang: string;
  fallbackLang?: TrainingLang;
}): TrainingCourse[] => {
  const resolvedLang: TrainingLang = lang === 'en' || lang === 'fr' ? lang : fallbackLang;
  return loadTrainingCoursesByLang()[resolvedLang] ?? [];
};
