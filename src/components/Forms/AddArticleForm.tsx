import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import LoadingButton from "../ui/LoadingButton";
import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

interface FormData {
  title: string;
  description: string;
  articleType: string;
  uploadImage: File;
}
const AddArticleForm = ({
  onSubmit,
  loading,
}: {
  onSubmit: any;
  loading: boolean;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const editorRef = useRef<any>(null);

  return (
    <form className="space-y-5 mt-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Input
          placeholder="Title"
          className="border-slate-500"
          {...register("title", {
            required: "Title is required",
            maxLength: {
              value: 50,
              message: "Maximum 50 characters are allowed!",
            },
          })}
        />
        <p className="font-semibold text-xs text-red-600">
          {errors.title?.message}
        </p>
      </div>
      <div className="space-y-2">
        <select
          {...register("articleType", {
            required: "Article category is required",
          })}
          className="p-1.5 border border-slate-500 w-full rounded-md"
        >
          <option value="" selected>
            Select Article Category
          </option>
          <option value="News">News</option>
          <option value="Editorial">Editorial</option>
          <option value="Guide">Guide</option>
          <option value="Review">Review</option>
        </select>
        <p className="font-semibold text-xs text-red-600">
          {errors.articleType?.message}
        </p>
      </div>
      <div className="space-y-2">
      <Input
        type="file"
        placeholder="Add an image to you article"
        {...register('uploadImage', {
          required: 'Image upload is required'
        })}
        className="border border-slate-500"
        />
        <p className="font-semibold text-xs text-red-600">
          {errors.uploadImage?.message}
        </p>
      </div>
      <div className="border border-slate-500 rounded-lg">
        <Editor
          onInit={(evt, editor) => (editorRef.current = editor)}
          apiKey="y7kqlz07oky243cycde7utdko7lr0smj9vs59uhuszppn9uo"
          initialValue="Start writing you article!"
          init={{
            height: 300,
            menubar: false,
            plugins: [
              "advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table paste code help wordcount",
            ],
            toolbar:
              "undo redo | formatselect | " +
              "bold italic backcolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
          onEditorChange={(content) => {
            setValue("description", content);
          }}
        />
      </div>
      {loading ? (
        <LoadingButton text="Creating" />
      ) : (
        <Button className="w-full" type="submit">
          Create Article
        </Button>
      )}
    </form>
  );
};

export default AddArticleForm;
