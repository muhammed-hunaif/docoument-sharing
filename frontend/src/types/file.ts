export interface FileItem {
  id: number;
  original_name: string;
  filename: string;
  size: number;
  mimetype: string;
  created_at: string;
  expires_at?: string;
  file_code?: string;
}
