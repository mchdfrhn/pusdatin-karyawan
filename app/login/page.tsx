"use client";

import { login } from "./login.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col justify-center space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Selamat Datang Kembali
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Masuk ke akun Anda untuk mengakses dashboard
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-neutral-700 dark:text-neutral-300"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="h-11 rounded-lg border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-neutral-700 dark:text-neutral-300"
              >
                Password
              </Label>
              <a
                href="#"
                className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                Lupa password?
              </a>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="h-11 rounded-lg border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-all duration-200"
            />
          </div>
        </div>

        <Button
          formAction={login}
          className="h-11 w-full rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500 cursor-pointer shadow-lg hover:shadow-blue-600/20 transition-all duration-200"
        >
          Masuk Dashboard
        </Button>
      </form>

      <p className="px-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Dengan mengklik lanjut, Anda setuju dengan{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400"
        >
          Syarat & Ketentuan
        </a>{" "}
        kami.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Abstract Background Side */}
      <div className="hidden w-1/2 flex-col justify-between bg-blue-600 p-10 text-white lg:flex relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-blue-700 to-indigo-900">
          <svg
            className="absolute inset-0 h-full w-full opacity-30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid-pattern"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 40L40 0H20L0 20M40 40V20L20 40"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-indigo-950/50 to-transparent" />
        </div>

        <div className="z-20 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-xl">
            <div className="h-4 w-4 rounded-full bg-white shadow-inner" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Dashboard Pegawai
          </span>
        </div>

        <div className="z-20 max-w-lg">
          <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight">
            Kelola Data Kepegawaian dengan Mudah & Cepat.
          </h1>
          <p className="text-lg text-blue-100">
            Platform terintegrasi untuk manajemen data pegawai, statistik, dan
            pelaporan yang efisien.
          </p>
        </div>

        <div className="z-20 text-sm text-blue-200">
          &copy; 2024 Pusdatin. All rights reserved.
        </div>
      </div>

      {/* Login Form Side */}
      <div className="flex w-full flex-col justify-center bg-white p-8 lg:w-1/2 dark:bg-neutral-950">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
