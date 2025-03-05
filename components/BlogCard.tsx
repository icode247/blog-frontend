'use client';

// src/components/BlogCard.tsx
import Link from 'next/link';
import { BlogPost } from '@/lib/types';
import { useState } from 'react';

export function BlogCard({ post }: { post: BlogPost }) {
  const [showAlert, setShowAlert] = useState(false);

  const handlePremiumClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAlert(true);
    
    // Hide the alert after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition relative">
      {post.type === 'premium' ? (
        // For premium posts, use a div with an onClick handler
        <div onClick={handlePremiumClick} className="cursor-pointer">
          <h2 className="text-xl font-bold mb-2">{post.title}</h2>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
            Premium
          </span>
          <p className="text-gray-600 mt-2">
            {post.content.substring(0, 150)}...
          </p>
          
          {/* Premium content alert */}
          {showAlert && (
            <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 rounded-t-lg text-center">
              You are not authorized to view premium content
            </div>
          )}
        </div>
      ) : (
        // For regular posts, use Link for navigation
        <Link href={`/blog/${post.documentId}`}>
          <h2 className="text-xl font-bold mb-2">{post.title}</h2>
          <p className="text-gray-600 mt-2">
            {post.content.substring(0, 150)}...
          </p>
        </Link>
      )}
    </div>
  );
}