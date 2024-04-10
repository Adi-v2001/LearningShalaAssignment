"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import LoadingButton from "@/components/ui/LoadingButton";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "@/Context/UserContext";

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const { login, loading } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await login(data);
  };
  return (
    <div
      style={{
        backgroundImage: `url("https://www.dnnsoftware.com/Portals/0/Images/hero-background-4-1.jpg?ver=2017-08-17-190903-737")`,
        minHeight: "90.3vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
      className="w-full items-center justify-center flex flex-col"
    >
        <form
          className="space-y-5 p-10 w-[25%] bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border border-gray-100"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="font-semibold text-2xl text-white">Login</h1>
          <div className="space-y-2">
            <Input
              placeholder="Email"
              type="email"
              className="border-slate-600 bg-white"
              {...register("email", { required: "Email is required" })}
            />
            <p className="font-semibold text-xs text-red-600">
              {errors.email?.message}
            </p>
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Password"
              type="password"
              className="border-slate-600 bg-white"
              {...register("password", {
                required: "Password is required"
              })}
            />
            <p className="font-semibold text-xs text-red-600">
              {errors.password?.message}
            </p>
          </div>
          {loading ? (
            <LoadingButton text="Logging in" />
          ) : (
            <Button
              className="bg-slate-800 hover:bg-slate-700 w-full border border-white"
              type="submit"
            >
              Login
            </Button>
          )}
        </form>
      </div>
  );
};

export default Login;
