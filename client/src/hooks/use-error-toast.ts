"use client"

import { getErrorMessage } from "@/utils/toast/error-toast"
import { useToast } from "./use-toast"


export function useErrorToast() {
  const { toast } = useToast()

  const errorToast = (error: unknown, description?: string) => {
    toast({
      title: getErrorMessage(error),
      description,
      variant: "negative",
    })
  }

  const successToast = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "positive",
    })
  }

  return {
    errorToast,
    successToast,
    toast,
  }
}
