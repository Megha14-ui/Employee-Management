
  export type Address = {
    address: string;
    pincode: string;
    location: string;
    contact: string;
  };
  
//   export type Employee = {
//     id: string;
//     name: string;
//     organization: string;
//     position: string;
//     addresses: Address[];
//   };
//   // types/employee.ts
export interface Employee {
    id: string;
    employeeId: string;
    name: string;
    organization: string;
    position: string;
  }
  
  