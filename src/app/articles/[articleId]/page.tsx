"use client";
import { useArticle } from "@/Context/ArticleContext";
import { PersonIcon } from "@radix-ui/react-icons";


const page = ({ params }: { params: { articleId: string } }) => {
  const {articles} = useArticle()
  const filteredArticles = articles.filter((article) => article.id === params.articleId)
  const article = filteredArticles[0]

  return (
    <div className="flex p-3">
      {article && (
        <>
          <img
            src={article.image}
            alt="image"
            className="border border-slate-500 rounded-xl max-h-[300px]"
          />
          <div className="p-6 space-y-8">
            <div className="space-y-6">
              <h1 className="font-bold text-3xl">{article.title}</h1>
              <div className="flex items-center space-x-3">
                <div className="border border-slate-300 rounded-full h-12 w-12 bg-slate-800 flex items-center justify-center">
                  <PersonIcon width={25} height={25} color="white"/>
                </div>
                <div>
                <h1 className="text-slate-600 font-semibold">
                  {article.user.name}
                </h1>
                <h1>
                    {new Date(article.publishedAt).toDateString()}
                </h1>
                </div>
              </div>
            </div>
            <h1 dangerouslySetInnerHTML={{ __html: article.description }}></h1>
          </div>
        </>
      )}
    </div>
  );
};

export default page;
