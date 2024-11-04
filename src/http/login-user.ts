export interface LoginUserRequest {
    email: string
    password: string
  }
  
  export async function loginUser({
    email,
    password
  }: LoginUserRequest): Promise<any> {
    const response = await fetch('http://localhost:8000/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    })
    
    if (!response.ok) {
      if (response.status == 400) {
          throw new Error("Invalid Credentials.");
      } else {
          throw new Error("Error while trying to login, please try again.");
      }
  }

    return response.json()
  }
  