import { request } from '@/utils/request'
import type {
  User,
  getUsersResponse,
  createUserResponse,
  updateUserResponse,
  deleteUserResponse,
} from '@/types/user'

export function useGetUsers() {
  return useAsyncData('user_list', async function () {
    const response = await request.get<getUsersResponse>('/user')
    if (response.data?.code !== 200) {
      throw new Error(response.data?.message)
    }
    return response.data?.data
  })
}
export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  const response = await request.post<createUserResponse>('/user', user)
  console.log(response.data)
  if (response.data?.code !== 200) {
    throw new Error(response.data?.message)
  }
  return {
    id: response.data?.data.id,
    name: user.name,
    age: user.age,
  }
}
export async function updateUser(user: User): Promise<User> {
  const response = await request.put<updateUserResponse>('/user', user)
  if (response.data?.code !== 200) {
    throw new Error(response.data?.message)
  }
  return {
    id: response.data?.data.id,
    name: user.name,
    age: user.age,
  }
}
export async function deleteUser(userId: number): Promise<deleteUserResponse> {
  const response = await request.delete<deleteUserResponse>(`/user`, {
    data: { id: userId },
  })
  if (response.data?.code !== 200) {
    throw new Error(response.data?.message)
  }
  return response.data
}
