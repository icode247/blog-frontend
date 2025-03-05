export async function getBlogPost(id: string) {
    const res = await fetch(`/api/blog-posts/${id}`, {
      headers: {
        'x-user-location': localStorage.getItem('userLocation') || '', // For ABAC location check
      }
    });
    
    if (!res.ok) {
      if (res.status === 403) {
        throw new Error('Access denied to this content');
      }
      throw new Error('Failed to fetch blog post');
    }
    
    return res.json();
  }
  
  export async function updateBlogPost(id: string, data: any) {
    const res = await fetch(`/api/blog-posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-location': localStorage.getItem('userLocation') || '',
      },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      throw new Error('Failed to update blog post');
    }
  
    return res.json();
  }
  