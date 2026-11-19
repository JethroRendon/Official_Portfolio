type Slide = { title: string; images: string[]; presentation?: 'mobile' | 'page' | 'logo' };
type Showcase = { label: string; url: string; kind: 'website' | 'github' | 'figma'; summary: string; slides: Slide[] };
const image = (name: string) => `/projects/${name}.webp`;
export const projectMedia: Record<string, Showcase> = {
 'vec-pro': { label: 'Visit Website', url: 'https://vecprolanding.vercel.app/', kind: 'website', summary: 'A thesis platform combining AEDIFY Web for vector surveillance and AEDEX Mobile for mosquito breeding-site reporting.', slides: [
  { title: 'AEDIFY · Surveillance overview', images: [image('vecpro-1')] },
  { title: 'AEDIFY · Health analytics', images: [image('vecpro-2')] },
  { title: 'AEDIFY · Live risk map', images: [image('vecpro-3')] },
 ] },
 'synt-ask': { label: 'Visit Website', url: 'https://amogus-nlp.vercel.app/', kind: 'website', summary: 'A real-time multiplayer social-deduction game with character selection, shared lobbies, and NLP-based impostor detection.', slides: [
  { title: 'SYNT-ASK · Welcome screen', images: [image('amogus-1')] },
  { title: 'Choose your character', images: [image('amogus-2')] },
  { title: 'Browse game servers', images: [image('amogus-3')] },
  { title: 'Shared room lobby', images: [image('amogus-4')] },
  { title: 'Semantic analysis results', images: [image('amogus-5')] },
 ] },
 strayspot: { label: 'Visit Figma', url: 'https://www.figma.com/design/0Yo7UbsM4zDt6y2m3Wcxtq/SOFTENG---STRAYSAFE--CS2B-?node-id=0-1&p=f&t=Sm4pNtFcEV9Zrfhn-0', kind: 'figma', summary: 'A centralized animal-shelter and rescue platform for Iloilo City, designed around pet discovery and the adoption journey.', slides: [
  { title: 'StraySpot · Landing page design', images: [image('strayspot-page')], presentation: 'page' },
  { title: 'StraySpot · Brand identity', images: [image('strayspot-logo')], presentation: 'logo' },
 ] },
 groupify: { label: 'View GitHub', url: 'https://github.com/JethroRendon/Groupify---CC-206-Final-Project', kind: 'github', summary: 'A student collaboration app that brings project groups, assigned tasks, shared files, and team communication into one workspace.', slides: [
  { title: 'Prototype · Dashboard & recent activity', images: [image('groupify-27'), image('groupify-28')], presentation: 'mobile' },
  { title: 'Prototype · Task assignment & progress', images: [image('groupify-31'), image('groupify-32')], presentation: 'mobile' },
  { title: 'Prototype · Task details & status', images: [image('groupify-35'), image('groupify-36')], presentation: 'mobile' },
  { title: 'Prototype · Shared files', images: [image('groupify-39'), image('groupify-40')], presentation: 'mobile' },
  { title: 'Prototype · Team members & roles', images: [image('groupify-43')], presentation: 'mobile' },
 ] },
};
