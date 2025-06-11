export interface User {
  _id: string
  name: string
  email: string
  role: string
}

export interface Auth {
  access_token: string
  user: User
}
