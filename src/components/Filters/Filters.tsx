import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AddArticleForm from "../Forms/AddArticleForm";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import axios from "axios";
import { useAuth } from "@/Context/UserContext";
import { useArticle } from "@/Context/ArticleContext";
import Select from "react-select";

const categories = [
  { value: 1, label: "News" },
  { value: 2, label: "Editorial" },
  { value: 3, label: "Guide" },
  { value: 4, label: "Review" },
];

const Filters = () => {
  const [loading, setLoading] = useState(false);
  const { setSearch, setCategory, setAuthor, articles, refreshArticles } = useArticle();
  const [open, setOpen] = useState(false)
  const { user } = useAuth();
  const onSubmit: any = async (data: any) => {

    const image = data.uploadImage[0]
    //Checking file type
    if(image.type !== 'image/jpeg' && image.type !== 'image/jpg' && image.type !== 'image/png' && image.type !== 'image/avif'){
      toast({
        title: 'Only image files are allowed',
        description: 'Please upload a jpeg, jpg, png or avif',
        variant: 'destructive'
      })
      return;
    }
    //Checking description not null
    if (!data.description) {
      toast({
        title: "No description provided",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const fileData = new FormData()
      fileData.set('file', image)
      //Uploading file to server
      const response = await axios.post("/api/UploadFile", fileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if(response.status === 200){
        const mutatedData = {
            ...data,
            userId: user?.id,
        };
        delete mutatedData.uploadImage
        mutatedData.imageUrl = response.data.path

        try {
          //Creating article with file path in imageUrl
          const res = await axios.post("/api/CreateArticle", mutatedData);
          if (res.status === 200) {
            toast({
              title: res.data.statusText,
            });
            refreshArticles()
          } else {
            toast({
              title: res.data.statusText,
              variant: "destructive",
            });
          }
        } catch (err) {
          console.log("An error occured while api call", err);
        } finally {
          setLoading(false);
          setOpen(false)
        }
      }
    } catch (err: any) {
      toast({
        title: err.response.data.statusText,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  };

  const users = articles.map(article => article.user);

// Use Set to filter unique users based on user.id
const uniqueUsers = Array.from(new Set(users.map(user => user.id)))
  .map(userId => {
    const user = users.find(user => user.id === userId);
    return { value: user?.id, label: user?.name };
  });

  return (
    <div className="flex space-x-5">
      <div className="relative">
        <Input
          className="pl-8 border border-gray-400"
          placeholder="Search articles..."
          onChange={(val) => setSearch(val.target.value)}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <Select
        options={categories}
        isClearable
        className="w-56"
        placeholder="Select a category..."
        onChange={(selectedValue) =>
          setCategory(selectedValue?.label ? selectedValue.label : "")
        }
      />
      <Select
      options={uniqueUsers}
        isClearable
        className="w-56"
        placeholder="Select an author..."
        onChange={(selectedValue) =>
          setAuthor(selectedValue?.label ? selectedValue.label : "")
        }
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>+ Add article</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Add Article</DialogTitle>
          </DialogHeader>
          <AddArticleForm onSubmit={onSubmit} loading={loading} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Filters;
