'use client';
import { useAuth } from "@/Context/UserContext"

const dashboard = () => {
  const {isLoggedIn} = useAuth()
  return (
    <>
    {isLoggedIn &&
      <div className="p-8 space-y-4">
        <h1 className="font-semibold text-3xl">
          Articles
        </h1>
      </div>
    }
    </>
  )
}

export default dashboard