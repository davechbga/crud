export interface Resource {
  $id: string;
  title: string;
  description: string;
  category: string;
  fileUrl?: string;
  fileId?: string;
  linkUrl?: string;
  createdAt: Date;
  userId: string;
}

export type ResourceData = Omit<Resource, "$id" | "createdAt">;
export type UpdateResourceData = Partial<Resource>;

export interface LoadingState {
  fetching: boolean;
  creating: boolean;
  updating: Record<string, boolean>;
  deleting: Record<string, boolean>;
}
