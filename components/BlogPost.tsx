// components/BlogPost.tsx
import { BlogPost as BlogPostType, User } from "@/lib/types";
import { useState } from "react";

type BlogPostProps = {
  post: BlogPostType;
  subscription: User["subscription"];
};

export function BlogPost({ post, subscription }: BlogPostProps) {
  const [showPremiumAlert, setShowPremiumAlert] = useState(false);
  
  // Check if user has access to premium content
  const isPremium = post.type === 'premium';
  const hasAccess = !isPremium || (subscription && subscription.active);
  
  const handlePremiumContent = () => {
    if (isPremium && !hasAccess) {
      setShowPremiumAlert(true);
      setTimeout(() => setShowPremiumAlert(false), 3000);
      return;
    }
  };
  
  return (
    <div className="blog-post relative">
      <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
      
      <div className="flex items-center space-x-4 mb-6 text-gray-600">
        <div>
          By {post.author.username}
        </div>
        <div>•</div>
        <div>
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        {isPremium && (
          <>
            <div>•</div>
            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
              Premium
            </div>
          </>
        )}
      </div>
      
      {/* Premium alert */}
      {showPremiumAlert && (
        <div className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded text-sm">
          You are not authorized to view premium content
        </div>
      )}
      
      {isPremium && !hasAccess ? (
        <div className="border border-yellow-300 bg-yellow-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Premium Content</h2>
          <p className="mb-6">
            This content is exclusive to premium subscribers. Subscribe now to get access to this and other premium articles.
          </p>
          <button 
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md font-medium"
            onClick={handlePremiumContent}
          >
            Subscribe Now
          </button>
        </div>
      ) : (
        <div className="prose lg:prose-xl max-w-none">
          {/* Render content as HTML - IMPORTANT: Make sure content is sanitized before rendering */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      )}
      
      {/* Metadata section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div>
            <strong>Author:</strong> {post.author.username}
          </div>
          {post.editors && (
            <div>
              <strong>Editor:</strong> {post.editors.username}
            </div>
          )}
          {post.region_restrictions && (
            <div>
              <strong>Region Restrictions:</strong> {post.region_restrictions}
            </div>
          )}
        </div>
      </div>
      
      {/* Comments section */}
      {post?.comments && post?.comments.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Comments</h3>
          <div className="space-y-4">
            {post?.comments.map((comment) => (
              <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium">{comment.author.username}</div>
                <div>{comment.content}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}