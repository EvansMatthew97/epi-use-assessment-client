/**
 * Represents a single employee.
 */
export interface Employee {
  id: number;
  name: string;
  surname: string;
  birthdate: Date;
  salary: number;
  oversees: number[];
  reportsTo?: number;
  role: number;
}
