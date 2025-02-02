// src/components/BlogCard.tsx
import Link from 'next/link';
import { BlogPost } from '@/lib/types';

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <Link href={`/blog/${post.documentId}`}>
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
        {post.type === 'premium' && (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
            Premium
          </span>
        )}
        <p className="text-gray-600 mt-2">
          {post.content.substring(0, 150)}...
        </p>
      </Link>
    </div>
  );
}



