"use client";
import { BlogPost as BlogPostComponent } from "@/components/BlogPost";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { BlogPost, User } from "@/lib/types";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function BlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [subscription, setSubscription] = useState<User['subscription']>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push(`/login?redirect=/blog/${params.id}`);
      return;
    }

    // Fetch both post and subscription data
    Promise.all([
      api.getBlogPost(params.id),
      api.getSubscription()
    ])
      .then(([postResponse, subscriptionResponse]) => {
        setPost(postResponse.data);
        setSubscription(subscriptionResponse);
      })
      .catch((error) => {
        if (error.message.includes('Session expired')) {
          router.push(`/login?redirect=/blog/${params.id}`);
        }
      })
      .finally(() => setLoading(false));
  }, [params.id, router]);

  if (loading) return <div>Loading...</div>;
  if (!post || !subscription) return <div>Content not found</div>;

  return (
    <main className="container mx-auto px-4 py-8">
      <BlogPostComponent 
        post={post}
        subscription={subscription}
      />
    </main>
  );
}