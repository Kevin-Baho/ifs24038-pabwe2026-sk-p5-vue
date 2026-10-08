import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '@/test-utils';
import UsersPage from './UsersPage.vue';
import { useUsersStore } from '../states/usersStore';
import { nextTick } from 'vue';

describe('UsersPage', () => {
  it('renders users list on mount', async () => {
    const { getByText } = renderWithProviders(UsersPage);
    const store = useUsersStore();
    store.users = [{ id: 1, name: 'Budi Test', email: 'budi@test.com' }];
    store.loading = false;
    
    await nextTick();
    expect(getByText('Daftar Pengguna')).toBeInTheDocument();
  });
});

