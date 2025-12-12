export interface Hermandad {
  id?: number;
  name: string;
  domain?: string;
  officialEmail?: string | null;
  logoUrl?: string | null;
  users?: Array<{
    id: number;
    username: string;
    role: string;
    email?: string;
  }>;
}
