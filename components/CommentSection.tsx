import { useState } from "react";

interface CommentSectionProps {
    postId: string;
    userSubscription: {
      tier: string;
      is_premium: boolean;
    };
  }
  
  export default function CommentSection({ postId, userSubscription }: CommentSectionProps) {
    const [comments, setComments] = useState<any[]>([]);
  
    // Only premium users can comment
    const canComment = userSubscription.is_premium;
  
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        
        {/* Comment form - Only shown to premium users */}
        {canComment ? (
          <form className="mb-4">
            <textarea
              placeholder="Add a comment..."
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Post Comment
            </button>
          </form>
        ) : (
          <div className="bg-gray-100 p-4 rounded mb-4">
            Upgrade to premium to join the discussion
          </div>
        )}
  
        {/* Comments list */}
        <div className="space-y-4">
          {comments.map((comment: any) => (
            <div key={comment.id} className="border p-4 rounded">
              <div>{comment.content}</div>
              
              {/* Moderation controls - Only shown to moderators */}
              {comment.canModerate && (
                <div className="mt-2 space-x-2">
                  <button className="text-green-500">Approve</button>
                  <button className="text-red-500">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  