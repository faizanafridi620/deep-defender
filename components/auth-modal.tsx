"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";

const LoadingSpinner = () => (
  <div className="animate-spin h-5 w-5 border-4 border-t-transparent border-solid border-white rounded-full" 
  role="status">
    <span className="sr-only">Loading...</span>
    </div>
);

export default function AuthModal({children, isOpen, onClose} : {children: React.ReactNode, isOpen: boolean, onClose: () => void}) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    // console.log("Form data:", formData); // Debugging line
    
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (isLogin) {
        // Redirect to the dashboard after successful login
        sessionStorage.setItem("authtoken", data.token);
        console.log("Token saved:", data.token); // Debugging line        
        router.push("/dashboard");
      } else {
        // Show success message or redirect after signup
        alert("Account created successfully! Please log in.");
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally{
      setIsLoading(false);
    }

    // // Simulate login or signup logic here
    // if (isLogin) {
    //   // Redirect to the dashboard after login
    //   router.push("/dashboard");
    // } else {
    //   // Handle signup logic (if needed)
    //   console.log("Sign up logic here");
    // }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}

        {/* <Button variant="outline" size="sm">
          {isLogin ? "Login" : "Sign Up"}
        </Button> */}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isLogin ? (
              <div className="flex items-center space-x-2 text-3xl font-bold">
                <span>Login to Your Account</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-3xl font-bold">
                <span>Create a New Account</span>
              </div>
            )}
          </DialogTitle>
          <VisuallyHidden>
            <DialogDescription>
              {isLogin
                ? "Enter your email and password to access your account."
                : "Fill in the form to create a new account."}
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleChange}
                required
                
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                onChange={handleChange}
                required
                
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-lime-800 hover:bg-lime-700 text-white m-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : isLogin ? ("Login") : ("Sign Up")
            }
              
            </Button>
          </DialogFooter>
          {error && (
            <div className="mt-4 text-red-500 text-center">
            {error}
            </div>
          )}
        </form>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-lime-800 underline hover:text-lime-700"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-lime-800 underline hover:text-lime-700"
              >
                Login
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
