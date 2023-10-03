export type ChalInfo = {
  title: string;
  subtitle: string;
  description: string;
  cat:
    | 'web'
    | 'misc'
    | 'crypto'
    | 'pwn'
    | 'rev'
    | 'forensics'
    | 'osint'
    | 'stego'
    | 'hardware'
    | 'mobile'
    | 'cloud';
  numSolves: number;
  numPoints: number;
  attachments: { name: string; url: string }[];
  sourceUrl: string;
};
