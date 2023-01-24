import type { Project } from '@/types/Project';
import nushBookings0Sm from '@/assets/images/nush-bookings-0-sm.png';
import nushBookings0 from '@/assets/images/nush-bookings-0.png';
import thinkingCApp0Sm from '@/assets/images/thinking-capp-0-sm.png';
import thinkingCApp0 from '@/assets/images/thinking-capp-0.png';
import javaChess0Sm from '@/assets/images/JavaChess-0-sm.png';
import javaChess0 from '@/assets/images/JavaChess-0.png';

export const projects: Project[] = [
  {
    id: 0,
    title: 'nush-bookings',
    description:
      'A tour booking site I made for my schools open house. I was the team lead for this project. Built in vue with a firebase backend, the app offers a streamlined and carefully designed sign up procedure, as well as a separate admin panel for tour guides to view and edit the list of participants. To handle concurrent requests from around 3000 visitors, we designed an optimized database schema.',
    tags: 'Web dev',
    coverImageSmall: nushBookings0Sm,
    images: [nushBookings0],
    siteUrl: '',
    githubUrl: 'https://github.com/appventure-nush/nush-bookings',
  },
  {
    id: 1,
    title: 'thinking-capp',
    description:
      "A question-answer forum I'm building for my high school. It is available as a mobile app made with flutter, however I am rewriting the site in Vue to make it easily available on the web. This site has not been released.",
    tags: 'Flutter',
    coverImageSmall: thinkingCApp0Sm,
    images: [thinkingCApp0],
    siteUrl: '',
    githubUrl: 'https://github.com/appventure-nush/thinking-capp',
  },
  {
    id: 2,
    title: 'JavaChess',
    description:
      'An online chess application I made for my year 3 CS project. JavaFX is used to build the client application while Spring Boot is used to manage the backend. I used sockets to enable real time communication between the client and server, and MongoDB to store player and game data.',
    tags: 'JavaFX',
    coverImageSmall: javaChess0Sm,
    images: [javaChess0],
    siteUrl: null,
    githubUrl: 'https://github.com/appventure-nush/thinking-capp',
  },
  {
    id: 3,
    title: 'discourse',
    description: '',
    tags: 'Flutter',
    coverImageSmall: nushBookings0Sm,
    images: [nushBookings0],
    siteUrl: null,
    githubUrl: 'https://github.com/mkofdwu/discourse',
  },
  {
    id: 4,
    title: 'this website',
    description: 'My personal website',
    tags: 'Web dev',
    coverImageSmall: nushBookings0Sm,
    images: [nushBookings0],
    siteUrl: null,
    githubUrl: 'https://github.com/mkofdwu/website',
  },
];
