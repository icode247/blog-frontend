"use client";
import { useEffect, useState } from "react";
import { Subscription } from "@/lib/types";
import { api } from "@/lib/api";

export function SubscriptionBanner() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [articlesRead, setArticlesRead] = useState<number>(0);

  useEffect(() => {
    // Fetch user's subscription details
    api
      .getSubscription()
      .then(setSubscription as any)
      .catch(() => setSubscription(null));

    // Get articles read count from local storage or API
    const count = localStorage.getItem("articlesRead") || "0";
    setArticlesRead(parseInt(count, 10));
  }, []);

  if (!subscription) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold">Start Reading Premium Content</h3>
            <p className="text-sm text-gray-600">
              Subscribe to access premium articles and exclusive content.
            </p>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Subscribe Now
          </button>
        </div>
      </div>
    );
  }

  if (subscription.tier === "free") {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold">Free Plan</h3>
            <p className="text-sm text-gray-600">
              {5 - articlesRead} free articles remaining this month. Upgrade for
              unlimited access.
            </p>
          </div>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Upgrade to Premium
          </button>
        </div>
      </div>
    );
  }

  if (subscription.tier === "basic") {
    return (
      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold">Basic Plan</h3>
            <p className="text-sm text-gray-600">
              Upgrade to Premium for access to all premium content and features.
            </p>
          </div>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Upgrade to Premium
          </button>
        </div>
      </div>
    );
  }

  if (subscription.tier === "premium") {
    const expiryDate = new Date(subscription.expires_at);
    const daysLeft = Math.ceil(
      (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return (
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold">Premium Plan</h3>
            <p className="text-sm text-gray-600">
              {daysLeft > 0
                ? `Your premium access expires in ${daysLeft} days.`
                : "Your premium subscription has expired."}
            </p>
          </div>
          {daysLeft <= 7 && (
            <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              Renew Premium
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
