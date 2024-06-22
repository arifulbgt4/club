"use client";
import MarkdownPreview from "@uiw/react-markdown-preview";

const Readme = ({ source }: { source: string }) => {
  return (
    <MarkdownPreview source={source} style={{ padding: 30, borderRadius: 6 }} />
  );
};

export default Readme;
