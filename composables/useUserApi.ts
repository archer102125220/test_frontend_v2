import { request } from '@/utils/request'
import type {
  GetUserInfo200Response,
  CreateUserInfo200Response,
  MainResponse,
  MainGetUserInfoResp,
  MainCreateUserInfoReq,
  MainUpdateUserInfoReq,
} from '@/types/api/api'

export function useGetUsers() {
  return useAsyncData('user_list', async function () {
    const response = await request.get<GetUserInfo200Response>('/user')
    if (response.data?.code !== 200) {
      throw new Error(response.data?.message)
    }
    return response.data?.data
  })
}

export async function createUser(user: MainCreateUserInfoReq): Promise<MainGetUserInfoResp> {
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

export async function updateUser(user: MainUpdateUserInfoReq): Promise<MainGetUserInfoResp> {
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
