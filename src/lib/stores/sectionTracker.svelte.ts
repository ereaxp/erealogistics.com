import { ScrollTrigger } from '$lib/animations/gsap';

export interface Section {
  id: string;
  label: string;
  num: string;
  status: string;
}

const sections: Section[] = [
  { id: 'about', label: 'About', num: '01', status: 'ASSESSING' },
  { id: 'methodology', label: 'Value', num: '02', status: 'DESIGNING' },
  { id: 'transformation', label: 'Transform', num: '03', status: 'DESIGNING' },
  { id: 'impact', label: 'Impact', num: '04', status: 'MEASURING' },
  { id: 'questions', label: 'Audit', num: '05', status: 'IMPLEMENTING' },
  { id: 'team', label: 'Team', num: '06', status: 'IMPLEMENTING' },
  { id: 'contact', label: 'Contact', num: '07', status: 'ENGAGING' },
];

let activeIndex = $state(0);
let visible = $state(false);
let triggers: ScrollTrigger[] = [];
let initialized = false;

function init() {
  if (initialized || typeof document === 'undefined') return;
  initialized = true;

  const heroEl = document.getElementById('hero');
  const footerEl = document.querySelector('footer');

  if (heroEl) {
    triggers.push(
      ScrollTrigger.create({
        trigger: heroEl,
        start: 'bottom 20%',
        onEnterBack: () => { if (visible) visible = false; },
        onLeave: () => { if (!visible) visible = true; },
      })
    );
  }

  if (footerEl) {
    triggers.push(
      ScrollTrigger.create({
        trigger: footerEl,
        start: 'top 90%',
        onEnter: () => { if (visible) visible = false; },
        onLeaveBack: () => { if (!visible) visible = true; },
      })
    );
  }

  sections.forEach((section, i) => {
    const el = document.getElementById(section.id);
    if (!el) {
      if (import.meta.env.DEV) console.warn(`sectionTracker: section "#${section.id}" not found`);
      return;
    }
    triggers.push(
      ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => { if (activeIndex !== i) activeIndex = i; },
        onEnterBack: () => { if (activeIndex !== i) activeIndex = i; },
      })
    );
  });
}

function destroy() {
  triggers.forEach(t => t.kill());
  triggers = [];
  activeIndex = 0;
  visible = false;
  initialized = false;
}

export const sectionTracker = {
  get sections() { return sections; },
  get activeIndex() { return activeIndex; },
  get visible() { return visible; },
  get activeSection() { return sections[activeIndex]; },
  init,
  destroy,
};
