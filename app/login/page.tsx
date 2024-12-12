'use client'
import { useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { loginUser } from '@/services/userServices'
import { toast } from 'react-toastify'

const formSchema = z.object({
  username: z.string().min(8, { message: 'Username must be at least 8 characters' }).max(20, { message: 'Username must not exceed 20 characters' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }).max(20, { message: 'Password must not exceed 20 characters' }),
})

export default function LoginPage() {


  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  function checkCookie() {
    const user = sessionStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      const now = Date.now();

      // Kiểm tra nếu đã hết hạn
      if (now > parsedUser.expiry) {
        sessionStorage.removeItem('user');
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(parsedUser.isAuthenticated);
      }
    }
  }

  useEffect(() => {
    // Kiểm tra session khi component được mount
    checkCookie();

    // Thiết lập interval để kiểm tra session mỗi giây
    const intervalId = setInterval(() => {
      const user = sessionStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        const now = Date.now();

        if (now > parsedUser.expiry) {
          sessionStorage.removeItem('user');
          setIsAuthenticated(false);
          console.log('Session expired. User data removed.');
        }
      }
    }, 1000); // Kiểm tra mỗi giây

    // Xóa interval khi component bị unmount
    return () => clearInterval(intervalId);
  }, []);

  console.log('isAuthenticated login page:', isAuthenticated);
  if (isAuthenticated === true) {
    window.location.href = '/';
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await loginUser(values.username, values.password);

      if (response && response.status === 200) {
        const serverData = response.data;
        const token = serverData.result.token;

        // Lưu dữ liệu vào sessionStorage với thời gian hết hạn (15 giây)
        const data = {
          message: 'Login successful',
          isAuthenticated: true,
          token: token,
        };
        const ttl = 60 * 60 * 1000; // 1h
        const now = Date.now();

        sessionStorage.setItem('user', JSON.stringify({ data, expiry: now + ttl }));

        toast.success('Login successful. Redirecting to the home page...');
        window.location.href = '/';
      } else {
        console.log('Invalid login credentials');
      }
    } catch (error) {
      console.log('Login failed:', error);
      toast.error('Login failed. Please check your username and password and try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-indigo-600">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-indigo-600 hover:underline">
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

