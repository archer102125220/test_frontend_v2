import { request } from '@/utils/request'
import type { User } from '@/types/user'
import type {
  CreateUserInfo200Response,
  MainResponse,
  MainCreateUserInfoReq,
  MainUpdateUserInfoReq,
} from '@/types/api/api'

export async function createUser(user: MainCreateUserInfoReq): Promise<User> {
  const response = await request.post<CreateUserInfo200Response>('/user', user)
  if (response.data?.code !== 200) {
    throw new Error(response.data?.message)
  }
  return {
    id: response.data?.data?.id,
    name: user.name,
    age: user.age,
  }
}

export async function updateUser(user: MainUpdateUserInfoReq): Promise<User> {
  const response = await request.put<MainResponse>('/user', user)
  if (response.data?.code !== 200) {
    throw new Error(response.data?.message)
  }
  return {
    id: user.id,
    name: user.name,
    age: user.age,
  }
}

export async function deleteUser(userId: number): Promise<MainResponse> {
  const response = await request.delete<MainResponse>(`/user`, {
    data: { id: userId },
  })
  if (response.data?.code !== 200) {
    throw new Error(response.data?.message)
  }
  return response.data
}
