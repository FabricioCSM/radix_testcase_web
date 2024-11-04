export interface CreateUserRequest {
    name: string
    email: string
    password: string
  }
  
  export async function createUser({
    name,
    email,
    password
  }: CreateUserRequest): Promise<void> {
    const response = await fetch('http://localhost:8000/signup/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password
      }),
    })
  
    if (!response.ok) {
      throw new Error('Error while creating user')
    }
  }
  