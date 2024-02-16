import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    // profiles: ['CORPORATE_ADMIN'],
    label: 'DASHBOARD',
    icon: 'home',
    link: '/dashboard',
  },
  {
    // profiles: ['CORPORATE_ADMIN'],
    label: 'STANDARDS',
    icon: 'star',
    link: '/tra-client/all-standards',
  },
  {
    // profiles: ['CORPORATE_ADMIN'],
    label: 'CRITERIA',
    icon: 'star',
    link: '/tra-client/criteria',
  },
  {
    // profiles: ['CORPORATE_ADMIN'],
    label: 'My Requests',
    icon: 'award',
    link: '/tra-client/my-requests',
  },

  {
    // profiles: ['CORPORATE_ADMIN'],
    label: 'Reports & Results',
    icon: 'search',
    link: '/tra-client/report-results',
  },

  {
    // profiles: ['CORPORATE_ADMIN'],
    label: 'OUR TEAM',
    icon: 'users',
    link: '/tra-client/our-team',
  },
];
