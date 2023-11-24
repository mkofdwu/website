import type { Project } from '@/types/Project';
import nushBookingsCover from '@/assets/images/nush-bookings-cover.png';
import nushBookings0 from '@/assets/images/nush-bookings-0.png';
import nushBookings1 from '@/assets/images/nush-bookings-1.png';
import nushBookings2 from '@/assets/images/nush-bookings-2.png';
import nushBookings3 from '@/assets/images/nush-bookings-3.png';
import thinkingCAppCover from '@/assets/images/thinking-capp-cover.png';
import thinkingCApp0 from '@/assets/images/thinking-capp-0.png';
import javaChessCover from '@/assets/images/JavaChess-cover.png';
import javaChess0 from '@/assets/images/JavaChess-0.png';
// import discourseCover from '@assets/images/discourse-cover.png';
import personalWebsiteCover from '@/assets/images/personal-website-cover.png';

export const projects: Project[] = [
  {
    id: 0,
    title: 'nush-bookings',
    description:
      'A tour booking site I made for my schools open house. I was the team lead for this project. Built in vue with a firebase backend, the app offers a streamlined and carefully designed sign up procedure, as well as a separate admin panel for tour guides to view and edit the list of participants. To handle concurrent requests from around 3000 visitors, we designed an optimized database schema.',
    tags: 'web dev',
    coverImage: nushBookingsCover,
    images: [nushBookings0, nushBookings1, nushBookings2, nushBookings3],
    siteUrl: '',
    githubUrl: 'https://github.com/appventure-nush/nush-bookings'
  },
  {
    id: 1,
    title: 'JavaChess',
    description:
      'An online chess application I made for my year 3 CS project. JavaFX is used to build the client application while Spring Boot is used to manage the backend. I used sockets to enable real time communication between the client and server, and MongoDB to store player and game data.',
    tags: 'javafx',
    coverImage: javaChessCover,
    images: [javaChess0],
    siteUrl: null,
    githubUrl: 'https://github.com/appventure-nush/thinking-capp'
  },
  {
    id: 2,
    title: 'discourse',
    description:
      'A fully featured messaging app similar to WhatsApp. To increase privacy, email and password authentication is used instead of phone number, and users can customize permissions for different groups of friends. I originally created this app to gain a better understanding of flutter.',
    tags: 'flutter',
    coverImage: nushBookingsCover,
    images: [nushBookings0],
    siteUrl: null,
    githubUrl: 'https://github.com/mkofdwu/discourse'
  },
  {
    id: 3,
    title: 'personal website',
    description:
      "The website you are currently on. It's made in Vue.js 3 and tailwind css. You can check out the source code on GitHub.",
    tags: 'web dev',
    coverImage: personalWebsiteCover,
    images: [personalWebsiteCover],
    siteUrl: '/',
    githubUrl: 'https://github.com/mkofdwu/website'
  }
  // {
  //   id: 1,
  //   title: 'thinking-capp',
  //   description:
  //     "A question-answer forum I'm building for my high school. It is available as a mobile app made with flutter, however I am rewriting the site in Vue to make it easily available on the web. This site has not been released.",
  //   tags: 'flutter',
  //   coverImage: thinkingCAppCover,
  //   images: [thinkingCApp0],
  //   siteUrl: '',
  //   githubUrl: 'https://github.com/appventure-nush/thinking-capp'
  // },
];
