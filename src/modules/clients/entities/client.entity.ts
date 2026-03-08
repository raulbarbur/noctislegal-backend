export class Client {
  id: string;
  name: string;
  contact: string | null;
  whatsapp: string | null;
  tags: string[];
  notes: string | null;
  archived: boolean;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  files_count?: number;
}