export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  isActive: boolean;
  confirmationCode?: string;
}
