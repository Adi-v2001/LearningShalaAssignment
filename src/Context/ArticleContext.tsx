/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { toast } from "@/components/ui/use-toast";
import { Article, User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface useUser {
    user: User;
  }
  
type ArticleAndUser = Article & useUser;

interface ArticleContext {
    articles: ArticleAndUser[],
    page: number,
    hasMore: boolean,
    setPage: Dispatch<SetStateAction<number>>,
    setSearch: Dispatch<SetStateAction<string>>,
    setCategory: Dispatch<SetStateAction<string>>,
    setAuthor: Dispatch<SetStateAction<string>>,
    refreshArticles: () => void,
    loading: boolean
}

const articleContext = createContext<ArticleContext>({
    articles: [],
    page: 1,
    hasMore: true,
    setPage: () => {},
    setSearch: () => {},
    setCategory: () => {},
    setAuthor: () => {},
    refreshArticles: () => {},
    loading: true
});

export function ArticleProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
    const [articles, setArticles] = useState<ArticleAndUser[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true)
    const [category, setCategory] = useState('')
    const [author, setAuthor] = useState('')
    const [search, setSearch] = useState('')
    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(true)
    const [value] = useDebounce(search, 500)

    const refreshArticles = () => {
      setRefresh(prev => !prev)
    }

    useEffect(() => {
        const getArticles = async () => {
          setLoading(true)
          const res = await axios.get(`/api/GetArticles?pageNumber=${page}&search=${value}&category=${category}&author=${author}`);
          if(!res.data.hasMore){
            setHasMore(false)
          } else {
            setHasMore(true)
          }
          setArticles(res.data.articles);
        };
        getArticles().catch((err) => console.log("An error occured", err)).finally(() => setLoading(false));
      }, [page, value, category, author, refresh]);

  return (
    <articleContext.Provider value={{ articles, page, hasMore, setPage, setSearch, setCategory, setAuthor, refreshArticles, loading }}>
      {children}
    </articleContext.Provider>
  );
}

export const useArticle = () => useContext(articleContext);
