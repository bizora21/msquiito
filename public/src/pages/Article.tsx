import React from "react";
import { useParams, Link } from "react-router-dom";
import { getArticleBySlug } from "@/lib/blog-data";
import { Button } from "@/components/ui/button";
import HomeButton from "@/components/HomeButton";

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticleBySlug(slug);

  React.useEffect(() => {
    if (article) {
      document.title = `${article.title} — LojaRápida`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", article.excerpt);
    }
  }, [article]);

  if (!article) {
    return (
      <main className="pt-24 min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
        <div className="text-center px-4">
          <HomeButton className="mx-auto max-w-max" />
          <h2 className="text-2xl font-semibold">Artigo não encontrado</h2>
          <Link to="/blog">
            <Button className="mt-4">Voltar ao Blog</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 max-w-3xl mx-auto px-4 prose prose-slate bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
      <HomeButton />
      <article>
        <h1>{article.title}</h1>
        <p className="text-sm text-slate-500">
          {new Date(article.date).toLocaleDateString("pt-PT", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>
      <Link to="/blog">
        <Button className="mt-6">Voltar ao Blog</Button>
      </Link>
    </main>
  );
}