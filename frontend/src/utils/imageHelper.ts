const IMAGES_BASE_URL = import.meta.env.VITE_IMAGES_BASE_URL;

export function getMenuImageUrl(path?: string): string {
  if (!path) {
    return "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=60";
  }

  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  return `${IMAGES_BASE_URL}/${cleanPath}`;
}
