export interface User {
  id?: number
  name: string
  age: number
}
export interface getUsersResponse {
  code: number
  data: User[]
  message: string
}
export interface createUserResponse {
  code: number
  data: {
    id: number
  }
  message: string
}
export interface updateUserResponse {
  code: number
  data: {
    id: number
  }
  message: string
}
export interface deleteUserResponse {
  code: number
  data: string
  message: string
}
