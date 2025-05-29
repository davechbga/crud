export interface Resource {
  $id: string;
  title: string;
  description: string;
  category: string;
  fileUrl?: string;
  fileId?: string;
  linkUrl?: string;
  createdAt: string;
  userId: string;
}