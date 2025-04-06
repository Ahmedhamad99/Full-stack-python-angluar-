// api-service.service.ts
export interface User {
  id: number;
  username: string;
  firstName: string | null;  // Allow null
  lastName: string | null;   // Allow null
  email: string | null;       // Allow null
  mobile_phone: string | null; // Allow null
}