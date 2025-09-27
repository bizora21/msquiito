import React from "react";
import { articles } from "@/lib/blog-data";
import BlogCard from "@/components/BlogCard";

export default function Blog() {
  React.useEffect(() => {
    document.title = "Blog — LojaRápida";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Dicas, novidades e artigos sobre comércio local em Moçambique."
      );
    }
  }, []);

  return (
    <main className="pt-24 max-w-5xl mx-auto px-4 space-y-6">
      <h1 className="text-3xl font-semibold">Blog</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {articles.map((a) => (
          <BlogCard key={a.slug} article={a} />
        ))}
      </div>
    </main>
  );
}