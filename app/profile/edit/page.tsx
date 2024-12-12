"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { extractUserIdFromToken } from "@/services/jwtServices";
import { getUserProfile, updateUserProfile } from "@/services/userServices";
import Loading from "@/components/Loading";
import { toast } from 'react-toastify'
const formSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    bio: z
      .string()
      .max(160, { message: "Bio must be 160 characters or less" }),
    dob: z.string().min(1, { message: "Date of birth is required" }),
    avatar: z.any().optional(),
    currentPassword: z
      .string()
      .min(8, { message: "Current password is required" }),
    newPassword: z.string().optional(),
    confirmNewPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword) {
        return data.newPassword === data.confirmNewPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmNewPassword"],
    }
  );

export default function EditProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // Initialize router

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      bio: "",
      dob: "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = sessionStorage.getItem("user");
        if (!userData) throw new Error("No user data found");

        const parsedData = JSON.parse(userData);
        if (!parsedData.data?.token) throw new Error("No token found");

        const userId = await extractUserIdFromToken(
          parsedData.data.token,
          process.env.NEXT_PUBLIC_JWT_SIGNED_KEY
        );
        const response = await getUserProfile(userId);
        const profileData = response.result;
        setUserData(profileData);
        form.reset({
          firstName: profileData.firstName || "",
          lastName: profileData.lastName || "",
          bio: profileData.bio || "",
          dob: profileData.dob || new Date().toISOString().split("T")[0],
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } catch (error) {
        toast.error("Failed to fetch user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const onSubmit = async (values) => {
    try {
      if (!userData?.id) throw new Error("No user ID found");

      const updatePayload = {
        currentPassword: values.currentPassword,
        firstName: values.firstName,
        lastName: values.lastName,
        bio: values.bio, // Add this line
        dob: values.dob,
        password: values.newPassword || undefined,
      };

      if (values.avatar && values.avatar.length > 0) {
        const formData = new FormData();
        formData.append("file", values.avatar[0]);
        // Implement avatar upload service here
        // const avatarResponse = await uploadAvatar(formData);
        // updatePayload.avatarUrl = avatarResponse.url;
      }

      await updateUserProfile(userData.id, updatePayload);

      toast.success("Profile updated successfully");

      // Redirect after showing the toast
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={userData?.avatarUrl}
                    alt={userData?.username}
                  />
                  <AvatarFallback>{userData?.username?.[0]}</AvatarFallback>
                </Avatar>
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Picture</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            field.onChange(e.target.files);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}