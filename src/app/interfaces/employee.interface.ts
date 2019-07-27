export interface Employee {
  id: number;
  name: string;
  surname: string;
  birthdate: Date;
  salary: number;
  oversees: Employee[];
}