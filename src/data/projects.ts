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
import javaChess1 from '@/assets/images/JavaChess-1.png';
import javaChess2 from '@/assets/images/JavaChess-2.png';
import javaChess3 from '@/assets/images/JavaChess-3.png';
import discourseCover from '@/assets/images/discourse-cover.png';
import discourse0 from '@/assets/images/discourse-0.png';
import personalWebsiteCover from '@/assets/images/personal-website-cover.png';
import flutterAbbvCover from '@/assets/images/flutter_abbv-cover.png';
import flutterAbbv0 from '@/assets/images/flutter_abbv-0.png';

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
    title: 'flutter_abbv',
    description:
      "A vscode extension to speed up Flutter app development. It's basically like emmet abbreviation but for flutter, currently supporting 16 different widgets as well as allowing the user to define custom widgets. Check out the README on github for more details",
    tags: 'flutter, vscode',
    coverImage: flutterAbbvCover,
    images: [flutterAbbv0], // TODO: show video?
    siteUrl: '',
    githubUrl: 'https://github.com/mkofdwu/flutter_abbv'
  },
  {
    id: 2,
    title: 'JavaChess',
    description:
      'An online chess application I made for my year 3 CS project. JavaFX is used to build the client application while Spring Boot is used to manage the backend. I used sockets to enable real time communication between the client and server, and MongoDB to store player and game data.',
    tags: 'javafx',
    coverImage: javaChessCover,
    images: [javaChess0, javaChess1, javaChess2, javaChess3],
    siteUrl: null,
    githubUrl: 'https://github.com/mkofdwu/java-chess-client'
  },
  {
    id: 3,
    title: 'discourse',
    description:
      'A feature-rich chat application inspired by WhatsApp, built with Flutter. I made this app to practice structuring a more complex project than what I was normally used to.',
    tags: 'flutter',
    coverImage: discourseCover,
    images: [discourse0],
    siteUrl: null,
    githubUrl: 'https://github.com/mkofdwu/discourse'
  },
  {
    id: 4,
    title: 'personal website',
    description:
      "The website you are currently on. It's made in Vue.js 3 and tailwind css. You can check out the source code on GitHub.",
    tags: 'web dev',
    coverImage: personalWebsiteCover,
    images: [personalWebsiteCover],
    siteUrl: '/',
    githubUrl: 'https://github.com/mkofdwu/website'
  },
  {
    id: 5,
    title: 'thinking-capp',
    description:
      'A question-answer forum I built for my high school. It was first made as a Flutter app, however, I later built a web version using Vue, Tailwind, Oak and MySQL as part of my CS project. The platform only allows those with a NUS High email account to sign in. Unfortunately, due to concerns with content moderation, the website was never fully completed or released.',
    tags: 'flutter, web dev',
    coverImage: thinkingCAppCover,
    images: [thinkingCApp0],
    siteUrl: '',
    githubUrl: 'https://github.com/appventure-nush/thinking-capp/tree/flutter-redesign'
  }
];
