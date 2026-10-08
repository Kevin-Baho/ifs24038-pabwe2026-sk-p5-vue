// File: src/features/aucations/components/SidebarComponent.test.js
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '@/test-utils';
import SidebarComponent from './SidebarComponent.vue';
import { nextTick } from 'vue';

const routes = [
  { path: '/', component: { template: '<div />' } },
  { path: '/users', component: { template: '<div />' } },
  { path: '/profile', component: { template: '<div />' } },
];

describe('SidebarComponent', () => {
  it('renders all nav links with text', () => {
    const { getByText } = renderWithProviders(SidebarComponent, { routes });
    expect(getByText('Dashboard')).toBeInTheDocument();
    expect(getByText('Pengguna')).toBeInTheDocument();
    expect(getByText('Profil Saya')).toBeInTheDocument();
  });

  it('applies active indigo class to Dashboard link on / route', async () => {
    const { container, router } = renderWithProviders(SidebarComponent, {
      routes,
      initialRoute: '/',
    });
    await router.isReady();
    await nextTick();
    const links = container.querySelectorAll('a');
    const dashboardLink = Array.from(links).find(l => l.textContent.includes('Dashboard'));
    expect(dashboardLink.className).toContain('bg-indigo-50');
  });

  it('applies inactive class to Pengguna when on / route', async () => {
    const { container, router } = renderWithProviders(SidebarComponent, {
      routes,
      initialRoute: '/',
    });
    await router.isReady();
    await nextTick();
    const links = container.querySelectorAll('a');
    const usersLink = Array.from(links).find(l => l.textContent.includes('Pengguna'));
    expect(usersLink.className).toContain('text-gray-600');
  });

  it('applies active class to Pengguna link on /users route', async () => {
    const { container, router } = renderWithProviders(SidebarComponent, { routes });
    await router.push('/users');
    await router.isReady();
    await nextTick();
    await nextTick();
    const links = container.querySelectorAll('a');
    const usersLink = Array.from(links).find(l => l.textContent.includes('Pengguna'));
    expect(usersLink.className).toContain('bg-indigo-50');
  });

  it('applies active class to Profil Saya link on /profile route', async () => {
    const { container, router } = renderWithProviders(SidebarComponent, { routes });
    await router.push('/profile');
    await router.isReady();
    await nextTick();
    await nextTick();
    const links = container.querySelectorAll('a');
    const profileLink = Array.from(links).find(l => l.textContent.includes('Profil Saya'));
    expect(profileLink.className).toContain('bg-indigo-50');
  });

  it('applies inactive class to Dashboard when on /users route', async () => {
    const { container, router } = renderWithProviders(SidebarComponent, { routes });
    await router.push('/users');
    await router.isReady();
    await nextTick();
    await nextTick();
    const links = container.querySelectorAll('a');
    const dashboardLink = Array.from(links).find(l => l.textContent.includes('Dashboard'));
    expect(dashboardLink.className).toContain('text-gray-600');
  });
});
