import type { RouterContext } from "@/types"
import { redirect } from "@tanstack/react-router"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const requireAuth = (ctx: RouterContext) => {
  if (!ctx.isLoggedIn) throw redirect({ to: "/login" });
}

export const redirectBasedOnRole = (ctx: RouterContext) => {
  if (!ctx.isLoggedIn) throw redirect({ to: "/login" });
  const role = ctx.user?.role;
  if (role === 'Doctor') {
    throw redirect({ to: "/patients" });
  } else if (role === 'assistant') {
    throw redirect({ to: "/assistant" });
  }
}
