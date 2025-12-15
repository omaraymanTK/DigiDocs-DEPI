import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Stethoscope } from 'lucide-react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import axios from 'axios';


export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigator = useNavigate();
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/Authentication`, { username, password });
            const sessionData = { id: res.data.userId, user: res.data.name, role: res.data.role, token: res.data.token };
            localStorage.setItem('session', JSON.stringify(sessionData));
            // update is logged in
            router.update({ context: { isLoggedIn: true, user: sessionData, session: sessionData } });
            await navigator({ to: "/", replace: true });
        }
        catch (e) {
            if (e instanceof Error) {
                toast.error(e.message);
            } else {
                // @ts-ignore
                toast.error(e.response?.data?.message || 'An error occurred');
            }
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-teal-50 px-4">
            <Card className="w-full max-w-md p-8 shadow-lg">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4">
                        <Stethoscope className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-gray-900">DigiDocs</h1>
                    <p className="text-gray-500 mt-1">Clinic Management System</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-7">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="rounded-lg bg-accent/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="rounded-lg bg-accent/50"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full rounded-lg bg-linear-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                    >
                        Login
                    </Button>
                </form>
            </Card>
        </div>
    );
}