// hooks/consultancy/interface.ts
export interface ConsultancyPayload {
  userId: string;
  name: string;
  email: string;
  date: string;
  time: string;
  topic: string;
  notes?: string;
}
