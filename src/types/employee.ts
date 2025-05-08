
export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Employee {
  id: number;
  employeeId: string;
  name: string;
  organization: string;
  position: string;
  addresses: Address[];
}

export type EmployeeInput = Omit<Employee, 'id'>;

export type ServerStatus = 'online' | 'offline' | 'checking';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
//   export type Employee = {
//     id: string;
//     name: string;
//     organization: string;
//     position: string;
//     addresses: Address[];
//   };
//   // types/employee.ts
export interface Employee {
    id: number;
    employeeId: string;
    name: string;
    organization: string;
    position: string;
  }
  
  