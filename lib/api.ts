import { BlogPost, Comment, StrapiResponse, User } from "./types";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

function getAuthHeaders() {
  let token;

  // Check if we're in browser environment
  if (typeof window !== "undefined") {
    token = Cookies.get("token");
    console.log("Client Token:", token);
  }

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  console.log("Making request with headers:", headers);

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Permission denied");
    }
    if (response.status === 401) {
      // Only try to remove token if we're in browser
      if (typeof window !== "undefined") {
        Cookies.remove("token");
      }
      throw new Error("Session expired. Please login again.");
    }
    throw new Error("API request failed");
  }

  return response.json();
}

export const api = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password }),
    });
    const data = await response.json();

    if (data.jwt) {
      Cookies.set("token", data.jwt, {
        expires: 7,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }
    return data;
  },

  // Get current user
  async getMe(): Promise<User> {
    const user = await fetchWithAuth("/api/users/me?populate=subscription");
    const articlesRead = await fetchWithAuth("/api/users/me/articles-read");

    return {
      ...user,
      articles_read: articlesRead.count,
    };
  },
  // Blog Posts
  async getBlogPosts(): Promise<StrapiResponse<BlogPost[]>> {
    return fetchWithAuth("/api/blog-posts?populate=*");
  },

  async getBlogPost(id: string): Promise<StrapiResponse<BlogPost>> {
    return fetchWithAuth(`/api/blog-posts/${id}?populate=*`);
  },

  async createBlogPost(data: Partial<BlogPost>): Promise<BlogPost> {
    return fetchWithAuth("/api/blog-posts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    return fetchWithAuth(`/api/blog-posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Comments
  async getComments(postId: string): Promise<Comment[]> {
    return fetchWithAuth(`/api/comments?blog_post=${postId}`);
  },

  async createComment(postId: string, content: string): Promise<Comment> {
    return fetchWithAuth("/api/comments", {
      method: "POST",
      body: JSON.stringify({
        content,
        blog_post: postId,
      }),
    });
  },

  async moderateComment(
    id: string,
    status: Comment["status"]
  ): Promise<Comment> {
    return fetchWithAuth(`/api/comments/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },

  async getSubscription(): Promise<User["subscription"]> {
    return fetchWithAuth("/api/subscriptions");
  },
};
