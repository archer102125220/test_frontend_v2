import { request } from '@/utils/request'
import type { GetUserInfo200Response } from '@/types/api/api'

export function useGetUsers() {
  return useAsyncData('user_list', async function () {
    const response = await request.get<GetUserInfo200Response>('/user')
    if (response.data?.code !== 200) {
      throw new Error(response.data?.message)
    }
    return response.data?.data
  })
}
