"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RFHForm } from "@/components/RFH/RFHForm"
import { RFHInput } from "@/components/RFH/RFHInput"
import { useEffect } from "react"
import cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useLoginMutation } from "@/store/auth"
import { ROUTES } from "@/routes"
import { useErrorToast } from "@/hooks/use-error-toast"

type Login = {
  username: string
  password: string
}

const FormSchema = yup.object({
  username: yup.string().required("Електронна пошта є обов'язковою."),
  password: yup.string().required("Пароль є обов'язковим."),
})

const defaultValues = {
  username: "",
  password: "",
}

export default function Page() {
  const { errorToast, successToast } = useErrorToast()
  const router = useRouter()
  const [login, { isLoading }] = useLoginMutation()

  const form = useForm<Login>({
    resolver: yupResolver(FormSchema),
    defaultValues,
  })

  const { isSubmitting } = form.formState

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log("Field changed:", name, value, type)
    })
    return () => subscription.unsubscribe()
  }, [form])

  async function onSubmit(data: Login) {
    try {
      const result = await login({
        username: data.username,
        password: data.password,
      }).unwrap()

      console.log("Login result:", result)

      if (result.accessToken) {
        cookies.set("accessToken", result.accessToken, {
          expires: 7,
          path: "/",
        })

        if (result.refreshToken) {
          cookies.set("refreshToken", result.refreshToken, {
            expires: 30,
            path: "/",
          })
        }

        successToast("Увійшли успішно", "Ласкаво просимо!")

        router.push(ROUTES.ALL_APARTMENTS)
      }
    } catch (error) {
      errorToast(error)
    }
  }

  return (
    <div className="h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-[600px] mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Увійти</CardTitle>
        </CardHeader>
        <CardContent>
          <RFHForm form={form} onSubmit={onSubmit}>
            <RFHInput
              name="username"
              label="Електронна пошта"
              type="username"
              placeholder="Введіть вашу електронну пошту"
              required
            />

            <RFHInput name="password" label="Пароль" type="password" placeholder="Введіть ваш пароль" required />

            <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
              {isLoading ? "Авторизація..." : "Увійти"}
            </Button>
          </RFHForm>
        </CardContent>
      </Card>
    </div>
  )
}
