'use client'

import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

type Login = {
  email: string
  password: string
}

const FormSchema = yup.object({
  email: yup
    .string()
    .min(2, "Електронна пошта повинна містити не менше 2 символів.")
    .required("Електронна пошта є обов'язковою."),
  password: yup
    .string()
    .min(6, "Пароль повинен містити не менше 6 символів.")
    .matches(/[a-z]/, "Пароль повинен містити хоча б одну малу літеру.")
    .matches(/[A-Z]/, "Пароль повинен містити хоча б одну велику літеру.")
    .matches(/[0-9]/, "Пароль повинен містити хоча б одну цифру.")
    .matches(/[\W_]/, "Пароль повинен містити хоча б один спеціальний символ.")
    .required("Пароль є обов'язковим."),
})

export default function LoginPage() {
  const { toast } = useToast()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<Login>({
    resolver: yupResolver(FormSchema),
  })

  async function onSubmit(data: yup.InferType<typeof FormSchema>) {
    try {
      console.log("✌️data --->", data)
      toast({
        title: "Увійшли успішно",
        description: "Ласкаво просимо назад!",
        variant: "positive",
      })
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Щось пішло не так. Спробуйте ще раз.",
        variant: "negative",
      })
    }
  }

  return (
    <div className="h-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-[600px] mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Увійти</CardTitle>
          <CardDescription>Введіть свою електронну пошту та пароль для доступу до вашого акаунту</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Електронна пошта</Label>
              <Input
                id="email"
                {...register("email")}
                type="email"
                placeholder="Введіть вашу електронну пошту"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.email.message}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                {...register("password")}
                type="password"
                placeholder="Введіть ваш пароль"
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.password.message}</AlertDescription>
                </Alert>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Авторизація..." : "Увійти"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
