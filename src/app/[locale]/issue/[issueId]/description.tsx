"use client";
import MarkdownPreview from "@uiw/react-markdown-preview";

const Description = ({ body }: { body?: string }) => {
  return (
    <MarkdownPreview
      className=" w-full rounded p-6"
      source={body || "No description provided."}
    />
  );
};

export default Description;
