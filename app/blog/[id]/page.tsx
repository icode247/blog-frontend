"use client";
import { Suspense, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { BlogPost, User } from "@/lib/types";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [subscription, setSubscription] = useState<User["subscription"]>();
  const [loading, setLoading] = useState(true);
  
  // Extract the ID outside of useEffect to avoid the params warning
  const postId = params.id;

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push(`/login?redirect=/blog/${postId}`);
      return;
    }

    // Fetch both post and subscription data
    Promise.all([api.getBlogPost(postId), api.getSubscription()])
      .then(([postResponse, subscriptionResponse]) => {
        setPost(postResponse.data);
        setSubscription(subscriptionResponse);
      })
      .catch((error) => {
        if (error.message.includes("Session expired")) {
          router.push(`/login?redirect=/blog/${postId}`);
        }
      })
      .finally(() => setLoading(false));
  }, [postId, router]); // Using postId instead of params.id

  if (loading) return <div>Loading...</div>;
  if (!post || !subscription) return <div>Content not found</div>;
  console.log(post);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
      </Suspense>
    </main>
  );
}