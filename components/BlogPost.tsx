import { useState, useEffect } from "react";
import CommentSection from "./CommentSection";
import { api } from "@/lib/api";

interface BlogPostProps {
  id: string;
  userSubscription: {
    tier: string;
    is_premium: boolean;
  };
}

export default function BlogPost({ id, userSubscription }: BlogPostProps) {
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await api.getBlogPost(id);
        setPost(data);
      } catch (err: any) {
        setError(err.message);
      }
    }
    loadPost();
  }, [id]);

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        {error === "Access denied to this content" ? (
          <>
            <h3 className="font-bold">Premium Content</h3>
            <p>This content requires a premium subscription to access.</p>
          </>
        ) : (
          error
        )}
      </div>
    );
  }

  if (!post) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

      {/* Premium content badge */}
      {post.type === "premium" && !userSubscription.is_premium && (
        <div className="bg-yellow-100 p-2 mb-4 rounded">⭐ Premium Content</div>
      )}

      {/* Content */}
      <div className="prose max-w-none">
        {isEditing ? (
          <textarea
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            className="w-full p-2 border rounded"
          />
        ) : (
          <div>{post.content}</div>
        )}
      </div>

      <div className="mt-4 space-x-2">
        {post.canEdit && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        )}

        {post.canDelete && (
          <button
            onClick={() => {
                
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        )}
      </div>

      {/* Comments section */}
      <CommentSection postId={id} userSubscription={userSubscription} />
    </div>
  );
}
