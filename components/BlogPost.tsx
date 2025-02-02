// components/BlogPost.tsx
import { BlogPost as BlogPostType, User } from "@/lib/types";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import CommentSection from "./CommentSection";

interface BlogPostProps {
  post: BlogPostType;
  subscription: User["subscription"];
}

export function BlogPost({ post, subscription }: BlogPostProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const router = useRouter();

  const hasEditAccess = post.type === "author" || post.type === "editor";
  const canAccessContent =
    post.type === "free" || subscription?.is_premium || post.type === "author";

  const handleEdit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      await api.updateBlogPost(post.id, {
        content: editedContent,
      });
      setIsEditing(false);
      router.refresh(); // Refresh the page to show updated content
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Post Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        {/* Author and Date Info */}
        <div className="flex items-center text-gray-600 mb-4">
          <div className="mr-4">By {post.author?.username || "Anonymous"}</div>
          <div>
            {post.createdAt && format(new Date(post.createdAt), "MMM d, yyyy")}
          </div>
        </div>

        {/* Post Type Badge */}
        {post.type !== "free" && (
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 
            ${
              post.type === "premium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
          </div>
        )}
      </header>

      {/* Content Access Check */}
      {!canAccessContent ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Premium Content
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  This content is only available to premium subscribers. Please
                  upgrade your subscription to access this content.
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => router.push("/subscription")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                >
                  Upgrade Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Post Content */}
          <div className="prose max-w-none mb-8">
            {isEditing ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-64 p-4 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            )}
          </div>

          {/* Action Buttons */}
          {hasEditAccess && (
            <div className="flex space-x-4 mb-8">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {isEditing ? "Save" : "Edit"}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          )}

          {/* Comments section */}
          <CommentSection postId={post.id} userSubscription={subscription as any} />
        </>
      )}
    </article>
  );
}
