import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useArticle } from "@/Context/ArticleContext";
import Spinner from "../ui/Spinner";

const ArticleTable = () => {
  const { articles, page, hasMore, setPage, loading } = useArticle();
  const router = useRouter();

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Author</TableHead>
          </TableRow>
        </TableHeader>
        {loading ? (
          <TableRow>
            <TableCell />
            <TableCell />
            <TableCell
              colSpan={5}
              className="flex justify-end items-center p-5"
            >
              <Spinner />
            </TableCell>
          </TableRow>
        ) : (
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>
                  <div className="p-3 border border-slate-400 rounded-xl w-fit">
                    <img
                      src={article.image}
                      alt="image"
                      width={90}
                      height={90}
                    />
                  </div>
                </TableCell>
                <TableCell className="max-w-[350px]">
                  <h1
                    className="text-blue-700 underline hover:text-blue-500 cursor-pointer"
                    onClick={() => router.push(`/articles/${article.id}`)}
                  >
                    {article.title}
                  </h1>
                </TableCell>
                <TableCell className="truncate max-w-[500px]">
                  <div
                    className="truncate max-w-[95%]"
                    dangerouslySetInnerHTML={{
                      __html:
                        article.description.length > 200
                          ? `${article.description.slice(0, 200)}...`
                          : article.description,
                    }}
                  ></div>
                </TableCell>
                <TableCell>{article.category}</TableCell>
                <TableCell>{article.user.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      <div className="flex p-8 items-center justify-center w-[100%] space-x-6">
        <Button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Prev
        </Button>
        <div className="bg-slate-800 text-white w-8 h-8 flex items-center justify-center rounded-full">
          {page}
        </div>
        <Button
          disabled={!hasMore || loading}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default ArticleTable;
