import type { PaginateFunction } from 'astro';

import { cleanSlug } from '~/utils/permalinks';
import { defaultLang, showDefaultLang, routes } from '~/i18n/ui';
import type { TrainingCourse } from '~/data/trainings';
import { fetchTrainingCourses as fetchTrainingCoursesFromLoader } from '~/loaders/training-courses-loader';

export const trainingsCoursesPerPage = 6;

export type TrainingTag = {
  slug: string;
  title: string;
};

const TRAININGS_TAG_BASE = 'tag';

const getTrainingsBaseParam = (lang: string): string => {
  const resolvedLang = lang && lang.length > 0 ? lang : defaultLang;
  const localizedSegment =
    (routes[resolvedLang as keyof typeof routes] ?? routes[defaultLang])?.trainings ?? 'trainings';

  if (resolvedLang === defaultLang && !showDefaultLang) {
    return localizedSegment;
  }

  return [resolvedLang, localizedSegment].filter(Boolean).join('/');
};

const getTrainingsTagBaseParam = (lang: string): string => {
  return [getTrainingsBaseParam(lang), TRAININGS_TAG_BASE].filter(Boolean).join('/');
};

export const fetchTrainingCourses = ({ lang }: { lang: string }): TrainingCourse[] => {
  return fetchTrainingCoursesFromLoader({
    lang: lang && lang.length > 0 ? lang : defaultLang,
    fallbackLang: defaultLang as 'fr' | 'en',
  });
};

export const getStaticPathsTrainingsList = async ({ paginate }: { paginate: PaginateFunction }) => {
  const paths = (['fr', 'en'] as const).flatMap((lang) => {
    const courses = fetchTrainingCourses({ lang });

    if (courses.length === 0) return [];

    return paginate(courses, {
      params: {
        trainings: getTrainingsBaseParam(lang),
      },
      pageSize: trainingsCoursesPerPage,
      props: {
        lang,
      },
    });
  });

  return paths;
};

export const getStaticPathsTrainingDetail = async () => {
  return (['fr', 'en'] as const).flatMap((lang) => {
    const courses = fetchTrainingCourses({ lang });
    const base = getTrainingsBaseParam(lang);

    return courses.map((course) => ({
      params: {
        trainings: [base, course.slug].filter(Boolean).join('/'),
      },
      props: {
        course,
        lang,
      },
    }));
  });
};

export const getStaticPathsTrainingsTag = async ({ paginate }: { paginate: PaginateFunction }) => {
  return (['fr', 'en'] as const).flatMap((lang) => {
    const courses = fetchTrainingCourses({ lang });

    const tagsBySlug = new Map<string, TrainingTag>();
    for (const course of courses) {
      for (const tag of course.tags ?? []) {
        const slug = cleanSlug(tag);
        if (!slug) continue;
        tagsBySlug.set(slug, { slug, title: tag });
      }
    }

    return Array.from(tagsBySlug.keys()).flatMap((tagSlug) => {
      const tag = tagsBySlug.get(tagSlug);
      if (!tag) return [];

      const taggedCourses = courses.filter((course) => (course.tags ?? []).some((t) => cleanSlug(t) === tagSlug));
      if (taggedCourses.length === 0) return [];

      return paginate(taggedCourses, {
        params: {
          trainings: getTrainingsTagBaseParam(lang),
          tag: tagSlug,
        },
        pageSize: trainingsCoursesPerPage,
        props: {
          tag,
          lang,
        },
      });
    });
  });
};
