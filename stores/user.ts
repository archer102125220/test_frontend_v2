import type { User } from '@/types/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: useState<User[]>('user_store_users', (): User[] => []).value,
    loading: false,
    error: useState<string | null>('user_store_error', () => null).value,
  }),

  actions: {
    setUsers(users: User[]) {
      this.users = users
    },

    addUser(user: User) {
      this.users.push(user)
    },

    updateUser(updatedUser: User) {
      const index = this.users.findIndex((u) => u.id === updatedUser.id)
      if (index !== -1) {
        this.users[index] = updatedUser
      }
    },

    removeUser(userId: number) {
      this.users = this.users.filter((u) => u.id !== userId)
    },

    setLoading(loading: boolean) {
      this.loading = loading
    },

    setError(error: string | null) {
      this.error = error
    },
  },

  getters: {
    getUserById: (state) => (id: number) => {
      return state.users.find((u) => u.id === id)
    },

    totalUsers: (state) => state.users.length,
  },

  hydrate(state) {
    state.users = useState<User[]>('user_store_users', (): User[] => []).value
    state.error = useState<string | null>('user_store_error', () => null).value
  },
})
