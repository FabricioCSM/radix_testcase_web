import { Button } from "../components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from "react";
import { toast } from 'sonner'
import { Input } from "./ui/input";
import { createUser } from "../http/create-user";
import { loginUser } from "../http/login-user";
import { Label } from "./ui/label";
import { LogIn, DoorOpen } from 'lucide-react';
import { decodeAccessToken } from "../auth/auth";
import { useContext } from "react";
import AppContext from "../context/AppContext";

const createUserSchema = z.object({
    name: z.string().min(3, 'Name must be minimum 3 characters'),
    email: z.string().email('Insert a valid email'),
    password: z.string().min(5, 'Password must be minimum 5 characters'),
})

const loginSchema = z.object({
    email: z.string().email('Insert a valid email'),
    password: z.string().min(5, ''),
});

type CreateUserSchema = z.infer<typeof createUserSchema>;
type LoginSchema = z.infer<typeof loginSchema>;


export function Navbar() {
    const [isSignupMode, setIsSignupMode] = useState(false)
    const appContext = useContext(AppContext);

    const {
        register: registerSignup,
        handleSubmit: handleSignupSubmit,
        formState: { errors: signupErrors },
        reset: resetSignup,
    } = useForm<CreateUserSchema>({
        resolver: zodResolver(createUserSchema),
    })

    const {
        register: registerLogin,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors },
        reset: resetLogin,
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    async function handleCreateUser({
        name,
        email,
        password
    }: CreateUserSchema) {
        try {
            await createUser({
                name,
                email,
                password
            })

            resetSignup()

            toast.success('User created with success!')
        } catch {
            toast.error('Error signing up user, please try again!')
        }
    }

    async function handleLogin({ email, password }: LoginSchema) {
        try {
            const token = await loginUser({ email, password })
            if (token.access_token) {
                const { name } = decodeAccessToken(token.access_token)
                appContext?.setUserName?.(name)
                localStorage.setItem('access_token', token.access_token)
                console.log(appContext?.username)
                resetSignup();
                resetLogin();
                setIsSignupMode(false);
            }
        } catch (error) {
            if (error instanceof Error) {
                if(error.message.includes('Invalid')) toast.error('Invalid credentials');
            } else {
                console.error("Login error:", error);
                toast.error('Failed to load user, please try again!');
            }
        }
    }

    const handleDialogClose = () => {
        resetSignup();
        resetLogin();
        setIsSignupMode(false);
    };

    const handleLogout = () => {
        appContext?.setUserName?.('')
        localStorage.removeItem('access_token')
    }

    return (
        <div className="flex bg-customPurple justify-end">
            <div>
                {appContext?.username && appContext.username.length > 0 ? (
                    <div className="p-10 flex flex-row">
                        <p className="mr-6 font-serif text-lg text-white">Welcome {appContext?.username}</p>
                        <Button className="bg-customGreen p-4" onClick={handleLogout}>
                            <DoorOpen /> Logout
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-row p-4 h-32 mr-20">
                        <Dialog onOpenChange={handleDialogClose}>
                            <DialogTrigger>
                                <Button className="bg-customGreen p-4">
                                    <LogIn /> Login
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>{!isSignupMode ? 'Login' : 'Create User'}</DialogTitle>

                                {!isSignupMode ? (
                                    <div className="p-10">
                                        <form onSubmit={handleLoginSubmit(handleLogin)}>
                                            <Label htmlFor="loginEmail">User:</Label>
                                            <Input
                                                id="loginEmail"
                                                placeholder="Email"
                                                {...registerLogin('email')}
                                            />
                                            {loginErrors.email && <p className="text-red-500">{loginErrors.email.message}</p>}

                                            <Label htmlFor="loginPassword">Password:</Label>
                                            <Input
                                                id="loginPassword"
                                                type="password"
                                                placeholder="Password"
                                                {...registerLogin('password')}
                                            />

                                            <p className="mt-4 cursor-pointer" onClick={() => setIsSignupMode(true)}>Create an account</p>

                                            <DialogFooter className="mt-20">
                                                <Button type="submit" className="p-4">Login</Button>
                                                <DialogClose asChild>
                                                    <Button className="p-4">Cancel</Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="p-10">
                                        <form
                                            onSubmit={handleSignupSubmit(handleCreateUser)}
                                            className="flex-1 flex flex-col justify-between"
                                        >
                                            <div className="mt-6">
                                                <Input
                                                    id="name"
                                                    autoFocus
                                                    placeholder="Name"
                                                    {...registerSignup('name')}
                                                />
                                                {signupErrors.name && <p className="text-red-500">{signupErrors.name.message}</p>}
                                            </div>

                                            <div className="mt-6">
                                                <Input
                                                    id="email"
                                                    autoFocus
                                                    placeholder="Email"
                                                    {...registerSignup('email')}
                                                />
                                                {signupErrors.email && <p className="text-red-500">{signupErrors.email.message}</p>}
                                            </div>

                                            <div className="mt-6">
                                                <Input
                                                    id="password"
                                                    autoFocus
                                                    type="password"
                                                    placeholder="Password"
                                                    {...registerSignup('password')}
                                                />
                                                {signupErrors.password && <p className="text-red-500">{signupErrors.password.message}</p>}
                                            </div>

                                            <div className="flex items-center gap-3 mt-20">
                                                <DialogClose asChild>
                                                    <Button onClick={() => setIsSignupMode(false)} variant="secondary" className="flex-1">
                                                        Close
                                                    </Button>
                                                </DialogClose>

                                                <Button type="submit" className="flex-1">
                                                    Sign up
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>

            <div className="border-b border-gray-300" />
        </div>
    )
}