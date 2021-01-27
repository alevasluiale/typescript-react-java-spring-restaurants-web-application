export interface User { 
  accessToken: string
  email: string
  id: number
  roles: Array<{
    id: number,
    name: string
  }>
  tokenType: string
  username: string
}