// src/lib/types.ts
export interface User {
    id: string;
    email: string;
    username: string;
    subscription?: Subscription;
  }
  
  export interface Subscription {
    tier: 'free' | 'basic' | 'premium';
    is_premium: boolean;
    expires_at: string;
  }
  
  export interface BlogPost {
    documentId: string;
    id: string;
    title: string;
    content: string;
    type: 'free' | 'premium' | 'members-only';
    status: 'draft' | 'published' | 'archived';
    author: User;
    editors?: User[];
    region_restrictions?: string[];
    canEdit?: boolean;
    canDelete?: boolean;
  }
  
  export interface Comment {
    id: string;
    content: string;
    author: User;
    status: 'pending' | 'approved' | 'rejected';
    canModerate?: boolean;
  }

 export interface StrapiResponse<T> {
    data: T;
    meta: {
      pagination?: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  }