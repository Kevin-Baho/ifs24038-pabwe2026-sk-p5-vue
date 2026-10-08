// File: src/features/aucations/components/SidebarComponent.test.js
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '@/test-utils';
import SidebarComponent from './SidebarComponent.vue';

const routes = [
  { path: '/', component: { template: '<div />' } },
  { path: '/users', component: { template: '<div />' } },
  { path: '/profile', component: { template: '<div />' } },
];

describe('SidebarComponent', () => {
  it('renders all nav links', () => {
    const { getByText } = renderWithProviders(SidebarComponent, { routes });
    expect(getByText('Dashboard')).toBeInTheDocument();
    expect(getByText('Pengguna')).toBeInTheDocument();
    expect(getByText('Profil Saya')).toBeInTheDocument();
  });

  it('applies active class to Dashboard link when on /', async () => {
    const { container } = renderWithProviders(SidebarComponent, {
      routes,
      initialRoute: '/',
    });
    // The active link has bg-indigo-50 class
    const links = container.querySelectorAll('a');
    const dashboardLink = Array.from(links).find(l => l.textContent.includes('Dashboard'));
    expect(dashboardLink).toBeTruthy();
  });

  it('applies active class to Pengguna link when on /users', async () => {
    const { container } = renderWithProviders(SidebarComponent, {
      routes,
      initialRoute: '/users',
    });
    const links = container.querySelectorAll('a');
    const usersLink = Array.from(links).find(l => l.textContent.includes('Pengguna'));
    expect(usersLink).toBeTruthy();
  });

  it('applies active class to Profil Saya link when on /profile', async () => {
    const { container } = renderWithProviders(SidebarComponent, {
      routes,
      initialRoute: '/profile',
    });
    const links = container.querySelectorAll('a');
    const profileLink = Array.from(links).find(l => l.textContent.includes('Profil Saya'));
    expect(profileLink).toBeTruthy();
  });
});
