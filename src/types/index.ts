export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export interface UploadedPhoto {
  key: string;
  url: string;
  name: string;
  uploadedAt: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

export interface GuestbookInsertPayload {
  name: string;
  password: string;
  message: string;
}
