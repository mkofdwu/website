import type { Project } from '@/types/Project';
import image from '@/assets/images/nush-bookings-0-lg.png';

export const projects: Project[] = [
  {
    id: 0,
    title: 'nush-bookings',
    description:
      'Diam aliquet mi non consectetur accumsan eget. Integer risus orci elementum lacus nulla diam orci etiam. Egestas in nullam integer rutrum sed pellentesque velit ipsum egestas.',
    tags: 'Web dev',
    images: [image],
    siteUrl: '',
    githubUrl: '',
  },
  {
    id: 1,
    title: 'thinking-capp',
    description:
      'Quis in vivamus id nullam. Donec lorem augue sit magna turpis sodales molestie pharetra. Mattis et donec pulvinar nibh.',
    tags: 'Flutter',
    images: [image],
    siteUrl: '',
    githubUrl: '',
  },
  {
    id: 2,
    title: 'JavaChess',
    description:
      'Fames dictumst lacus nulla aenean in facilisis risus. Pharetra curabitur sit eu sagittis nam a penatibus. Eu eu neque lorem a blandit nunc sed fusce consequat.',
    tags: 'JavaFX',
    images: [image],
    siteUrl: '',
    githubUrl: '',
  },
];
