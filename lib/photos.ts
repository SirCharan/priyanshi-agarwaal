export type Photo = {
  id: string;
  src: string;
  title: string;
  place?: string;
};

/**
 * Drop files into /public/images and list them here.
 * Gallery is empty until images are added.
 */
export const photos: Photo[] = [];
