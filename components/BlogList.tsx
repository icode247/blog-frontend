"use client";
import { BlogCard } from "./BlogCard";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { BlogPost } from "@/lib/types";

export function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .getBlogPosts()
      .then((response) => {
        setPosts(response.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
