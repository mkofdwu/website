import type { ChalInfo } from '@/types/ChalInfo';

export const chals: { [slug: string]: ChalInfo } = {
  'the-other-obligatory-pyjail': {
    title: 'the other obligatory pyjail',
    subtitle: 'Author: quasar',
    description:
      'nowadays, setattr jails seem to be all the hype, and everyone loves builtins, so enjoy a setattr jail with builtins :>',
    cat: 'misc',
    numSolves: 6,
    numPoints: 400,
    attachments: [
      {
        name: 'jail.py',
        url: 'http://34.27.167.72/dl/?misc/the%20other%20obligatory%20pyjail/jail.py'
      }
    ],
    sourceUrl: ''
  },
  'disk-archaeology': {
    title: 'Disk Archaeology',
    subtitle: 'TISC Level 1',
    description: `Unknown to the world, the sinister organization PALINDROME has been crafting a catastrophic malware that threatens to plunge civilization into chaos. Your mission, if you choose to accept it, is to infiltrate their secret digital lair, a disk image exfiltrated by our spies. This disk holds the key to unraveling their diabolical scheme and preventing the unleashing of a suspected destructive virus.

You will be provided with the following file:
- md5(challenge.tar.xz) = 80ff51568943a39de4975648e688d6a3

Notes:
- challenge.tar.xz decompresses into challenge.img
- FLAG FORMAT is TISC{<some text you have to find>}`,
    cat: 'forensics',
    numSolves: 327,
    numPoints: 0,
    attachments: [
      {
        name: 'challenge.tar.xz',
        url: 'https://api.tisc.csit-events.sg/file?id=clmdixhae2mx10886l94sz8p6&name=challenge.tar.xz'
      }
    ],
    sourceUrl: ''
  },
  'reckless-mistake': {
    title: "XIPHEREHPIX's Reckless Mistake",
    subtitle: 'TISC Level 2',
    description: `Our sources told us that one of PALINDROME's lieutenants, XIPHEREHPIX, wrote a special computer program for certain members of PALINDROME. We have somehow managed to get a copy of the source code and the compiled binary. The intention of the program is unclear, but we think encrypted blob inside the program could contain a valuable secret.`,
    cat: 'crypto',
    numSolves: 140,
    numPoints: 0,
    attachments: [
      {
        name: 'prog.c',
        url: 'https://api.tisc.csit-events.sg/file?id=clmdizzh52n03088618eflcgi&name=prog.c'
      },
      {
        name: 'XIPHEREHPIX',
        url: 'https://api.tisc.csit-events.sg/file?id=clmdizzk12n0m08863nocse1o&name=XIPHEREHPIX'
      }
    ],
    sourceUrl: ''
  },
  kpa: {
    title: 'KPA',
    subtitle: 'TISC Level 3',
    description: `We've managed to grab an app from a suspicious device just before it got reset! The copying couldn't finish so some of the last few bytes got corrupted... But not all is lost! We heard that the file shouldn't have any comments in it! Help us uncover the secrets within this app!`,
    cat: 'mobile',
    numSolves: 86,
    numPoints: 0,
    attachments: [
      {
        name: 'kpa.apk',
        url: 'https://api.tisc.csit-events.sg/file?id=clmgec1pa2x3908868ief82yt&name=kpa.apk'
      }
    ],
    sourceUrl: ''
  },
  rubg: {
    title: 'Really Unfair Battleships Game',
    subtitle: 'TISC Level 4',
    description: `After last year's hit online RPG game "Slay The Dragon", the cybercriminal organization PALINDROME has once again released another seemingly impossible game called "Really Unfair Battleships Game" (RUBG). This version of Battleships is played on a 16x16 grid, and you only have one life. Once again, we suspect that the game is being used as a recruitment campaign. So once again, you're up!

Things are a little different this time. According to the intelligence we've gathered, just getting a VICTORY in the game is not enough.

PALINDROME would only be handing out flags to hackers who can get a FLAWLESS VICTORY.

You are tasked to beat the game and provide us with the flag (a string in the format TISC{xxx}) that would be displayed after getting a FLAWLESS VICTORY. Our success is critical to ensure the safety of Singapore's cyberspace, as it would allow us to send more undercover operatives to infiltrate PALINDROME.

Godspeed!

You will be provided with the following:

1) Windows Client (.exe)
    - Client takes a while to launch, please wait a few seconds.
    - If Windows SmartScreen pops up, tell it to run the client anyway.
    - If exe does not run, make sure Windows Defender isn't putting it on quarantine.

2) Linux Client (.AppImage)
    - Please install fuse before running, you can do "sudo apt install -y fuse"
    - Tested to work on Ubuntu 22.04 LTS`,
    cat: 'misc',
    numSolves: 79,
    numPoints: 0,
    attachments: [
      {
        name: 'rubg-1.0.0.AppImage',
        url: 'https://api.tisc.csit-events.sg/file?id=clmdj4qc82n8z0886vjgmdvbt&name=rubg-1.0.0.AppImage'
      },
      {
        name: 'rubg-1.0.0.exe',
        url: 'https://api.tisc.csit-events.sg/file?id=clmdj4rw02n9i0886g19l29d5&name=rubg_1.0.0.exe'
      }
    ],
    sourceUrl: ''
  },
  'palindromes-invitation': {
    title: "PALINDROME's Invitation",
    subtitle: 'TISC Level 5',
    description: `Valuable intel suggests that PALINDROME has established a secret online chat room for their members to discuss on plans to invade Singapore's cyber space. One of their junior developers accidentally left a repository public, but he was quick enough to remove all the commit history, only leaving some non-classified files behind. One might be able to just dig out some secrets of PALINDROME and get invited to their secret chat room...who knows?

Start here: https://github.com/palindrome-wow/PALINDROME-PORTAL`,
    cat: 'misc',
    numSolves: 58,
    numPoints: 0,
    attachments: [],
    sourceUrl: ''
  },
  'the-chosen-ones': {
    title: 'The Chosen Ones',
    subtitle: 'TISC Level 6',
    description: `We have discovered PALINDROME's recruitment site. Infiltrate it and see what you can find!

http://chals.tisc23.ctf.sg:51943`,
    cat: 'web',
    numSolves: 52,
    numPoints: 0,
    attachments: [],
    sourceUrl: ''
  },
  devsecmeow: {
    title: 'DevSecMeow',
    subtitle: 'TISC Level 7',
    description: `Palindrome has accidentally exposed one of their onboarding guide! Sneak in as a new developer and exfiltrate any meaningful intelligence on their production system.

https://d3mg5a7c6anwbv.cloudfront.net/

Note: Concatenate flag1 and flag2 to form the flag for submission.`,
    cat: 'cloud',
    numSolves: 28,
    numPoints: 0,
    attachments: [],
    sourceUrl: ''
  },
  'blind-sql-injection': {
    title: 'Blind SQL Injection',
    subtitle: 'TISC Level 8',
    description: `As part of the anti-PALINDROME task force, you find yourself face to face with another task.

"We found this horribly made website on their web servers," your superior tells you. "It's probably just a trivial SQL injection vulnerability to extract the admin password. I'm expecting this to be done in about an hour."

You ready your fingers on the keyboard, confident that you'll be able to deliver.

http://chals.tisc23.ctf.sg:28471/`,
    cat: 'cloud',
    numSolves: 18,
    numPoints: 0,
    attachments: [
      {
        name: 'Dockerfile',
        url: 'https://api.tisc.csit-events.sg/file?id=clmdje3ze2oee088694zub7xx&name=Dockerfile'
      },
      {
        name: 'server.js',
        url: 'https://api.tisc.csit-events.sg/file?id=clmdje4292oex08860d9xddn2&name=server.js'
      },

      {
        name: 'db-init.sql',
        url: 'https://api.tisc.csit-events.sg/file?id=clmdje4592ofg0886nr2wi4xd&name=db-init.sql'
      }
    ],
    sourceUrl: ''
  }
};
