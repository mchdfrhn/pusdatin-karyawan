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
          className="h-11 w-full rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-500 cursor-pointer shadow-lg hover:shadow-indigo-600/20 transition-all duration-200"
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
      <div className="hidden w-1/2 flex-col justify-between bg-slate-900 p-10 text-white lg:flex relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
          <svg
            className="absolute inset-0 h-full w-full opacity-[0.03]"
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
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>

        <div className="z-20 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-xl">
            <div className="h-3 w-3 rounded-sm bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-100">
            Dashboard Pegawai
          </span>
        </div>

        <div className="z-20 max-w-lg">
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-white">
            Kelola Data Kepegawaian dengan{" "}
            <span className="text-indigo-400">Mudah & Cepat</span>.
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Platform terintegrasi untuk manajemen data pegawai, statistik, dan
            pelaporan yang efisien.
          </p>
        </div>

        <div className="z-20 text-sm text-slate-400">
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
