export type EmploymentType = 'full-time' | 'part-time' | 'contractor';
export type EmployeeStatus = 'active' | 'inactive' | 'on-leave';

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dni: string;
  department: string;
  position: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  startDate: string;
  salary: number;
  photoUrl?: string;
  workExperience: WorkExperience[];
  skills: string[];
}

export type EmployeeFormValue = Omit<Employee, 'id'>;
