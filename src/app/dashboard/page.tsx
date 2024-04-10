'use client';
import { useAuth } from "@/Context/UserContext"
import Filters from "@/components/Filters/Filters";
import ArticleTable from "@/components/Table/ArticleTable";

const dashboard = () => {
  const {isLoggedIn} = useAuth()
  return (
    <>
    {isLoggedIn &&
      <div className="p-8 space-y-10 w-full bg-slate-50 h-full">
        <h1 className="font-semibold text-3xl">
          Articles
        </h1>
        <Filters/>
        <div className="w-full flex flex-col items-center justify-center ">
          <div className="w-[90%]">
          <ArticleTable/>
          </div>
        </div>
      </div>
    }
    </>
  )
}

export default dashboard