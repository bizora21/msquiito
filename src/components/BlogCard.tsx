import React from "react";
import { Link } from "react-router-dom";
import { Article } from "@/lib/blog-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BlogCard({ article }: { article: Article }) {
  return (
    <Card className="hover:shadow-lg transition">
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
        <CardDescription>{new Date(article.date).toLocaleDateString("pt-PT", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-slate-700">{article.excerpt}</p>
        <Link to={`/blog/${article.slug}`}>
          <Button size="sm" className="mt-4">Leia mais</Button>
        </Link>
      </CardContent>
    </Card>
  );
}