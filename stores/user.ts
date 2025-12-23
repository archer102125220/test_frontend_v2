import type { User } from '@/types/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    userList: useState<User[]>('user_store_user_list', (): User[] => []).value,
    loading: false,
    error: useState<string | null>('user_store_error', () => null).value,
  }),

  actions: {
    setUsers(userList: User[]) {
      this.userList = userList
    },

    addUser(user: User) {
      this.userList.push(user)
    },

    updateUser(updatedUser: User) {
      const index = this.userList.findIndex((user) => user.id === updatedUser.id)
      if (index !== -1) {
        this.userList[index] = updatedUser
      }
    },

    removeUser(userId: number) {
      this.userList = this.userList.filter((user) => user.id !== userId)
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
      return state.userList.find((u) => u.id === id)
    },

    totalUsers: (state) => state.userList.length,
  },

  hydrate(state) {
    state.userList = useState<User[]>('user_store_user_list', (): User[] => []).value
    state.error = useState<string | null>('user_store_error', () => null).value
  },
})
