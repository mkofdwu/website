export type Project = {
  id: number;
  title: string;
  description: string;
  tags: string;
  coverImage: string;
  images: string[];
  siteUrl: string | null;
  githubUrl: string;
};
