"use client";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import { type ClassNameValue } from "tailwind-merge";
import { cn } from "~/lib/utils";

const Markdown = ({
  body,
  className,
}: {
  body?: string;
  className?: ClassNameValue;
}) => {
  return (
    <div className={cn(className, "flex-1")}>
      <ReactMarkdown
        className=" prose max-w-fit"
        remarkPlugins={[gfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
