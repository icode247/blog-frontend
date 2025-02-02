
import { BlogList } from '@/components/BlogList';
import { SubscriptionBanner } from '@/components/SubscriptionBanner';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <SubscriptionBanner />
      <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
      <BlogList />
    </main>
  );
}