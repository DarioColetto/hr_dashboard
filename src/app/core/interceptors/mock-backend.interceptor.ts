import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { Employee } from '../models/employee.model';
import { ApiResponse } from '../models/api-response.model';

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1', firstName: 'Marías', lastName: 'González', email: 'maria.gonzalez@empresa.com',
    phone: '11-4444-5555', dni: '28456789', photoUrl: '', department: 'Tecnología',
    position: 'Frontend Developer', employmentType: 'full-time', status: 'active',
    startDate: '2022-03-01', salary: 800000, skills: [],
    workExperience: [{ company: 'Tech Solutions SA', position: 'Jr Developer', startDate: '2019-01-01', endDate: '2022-02-28', description: 'Desarrollo de aplicaciones web con Angular y React.' }],
  },
  {
    id: '2', firstName: 'Carlos', lastName: 'Ramírez', email: 'carlos.ramirez@empresa.com',
    phone: '11-3333-7777', dni: '32567890', photoUrl: '', department: 'RRHH',
    position: 'HR Manager', employmentType: 'full-time', status: 'active',
    startDate: '2020-06-15', salary: 950000, skills: ['Gestión de personas', 'Selección', 'Payroll'],
    workExperience: [{ company: 'Recursos Humanos Plus', position: 'HR Specialist', startDate: '2018-05-01', endDate: '2020-06-14', description: 'Gestión de selección y onboarding de personal.' }],
  },
  {
    id: '3', firstName: 'Laura', lastName: 'Sánchez', email: 'laura.sanchez@empresa.com',
    phone: '11-5555-1234', dni: '35678901', photoUrl: '', department: 'Comercial',
    position: 'Sales Executive', employmentType: 'part-time', status: 'on-leave',
    startDate: '2021-09-01', salary: 450000, skills: ['CRM', 'Negociación', 'Cierre de ventas'],
    workExperience: [{ company: 'Ventas Dinámicas SA', position: 'Sales Representative', startDate: '2019-03-01', endDate: '2021-08-31', description: 'Gestión de cartera de clientes y cierre de ventas.' }],
  },
  {
    id: '4', firstName: 'Juan', lastName: 'Martínez', email: 'juan.martinez@empresa.com',
    phone: '11-2222-8888', dni: '25789012', photoUrl: '', department: 'Tecnología',
    position: 'Backend Developer', employmentType: 'full-time', status: 'active',
    startDate: '2021-01-10', salary: 850000, skills: ['Node.js', 'Python', 'SQL', 'Docker'],
    workExperience: [{ company: 'Sistemas Avanzados', position: 'Backend Developer', startDate: '2019-06-01', endDate: '2021-01-09', description: 'Desarrollo de APIs REST con Node.js y bases de datos SQL.' }],
  },
  {
    id: '5', firstName: 'Ana', lastName: 'López', email: 'ana.lopez@empresa.com',
    phone: '11-6666-2222', dni: '29890123', photoUrl: '', department: 'Finanzas',
    position: 'Accountant', employmentType: 'full-time', status: 'active',
    startDate: '2020-02-01', salary: 720000, skills: ['Contabilidad', 'SAP', 'Excel', 'Auditoría'],
    workExperience: [{ company: 'Contabilidad Integral', position: 'Junior Accountant', startDate: '2017-08-01', endDate: '2020-01-31', description: 'Asientos contables, impuestos y auditoría interna.' }],
  },
  {
    id: '6', firstName: 'Pedro', lastName: 'García', email: 'pedro.garcia@empresa.com',
    phone: '11-7777-3333', dni: '30901234', photoUrl: '', department: 'Tecnología',
    position: 'DevOps Engineer', employmentType: 'full-time', status: 'active',
    startDate: '2022-07-15', salary: 950000, skills: ['AWS', 'Kubernetes', 'Docker', 'CI/CD'],
    workExperience: [{ company: 'Cloud Infrastructure Ltd', position: 'Junior DevOps Engineer', startDate: '2021-01-01', endDate: '2022-07-14', description: 'Gestión de infraestructura en AWS y despliegues automatizados.' }],
  },
  {
    id: '7', firstName: 'Sofía', lastName: 'Rodríguez', email: 'sofia.rodriguez@empresa.com',
    phone: '11-8888-4444', dni: '33012345', photoUrl: '', department: 'Marketing',
    position: 'Marketing Manager', employmentType: 'full-time', status: 'active',
    startDate: '2019-11-01', salary: 880000, skills: ['Marketing Digital', 'SEO', 'Google Analytics'],
    workExperience: [{ company: 'Agencia Digital Marketing', position: 'Marketing Specialist', startDate: '2017-03-01', endDate: '2019-10-31', description: 'Campañas digitales, social media y análisis de ROI.' }],
  },
  {
    id: '8', firstName: 'Roberto', lastName: 'Fernández', email: 'roberto.fernandez@empresa.com',
    phone: '11-9999-5555', dni: '27123456', photoUrl: '', department: 'Comercial',
    position: 'Business Development', employmentType: 'full-time', status: 'inactive',
    startDate: '2023-01-15', salary: 800000, skills: ['Negociación', 'B2B', 'Estrategia Comercial'],
    workExperience: [{ company: 'Global Trading Solutions', position: 'Commercial Manager', startDate: '2020-05-01', endDate: '2023-01-14', description: 'Desarrollo de nuevas líneas de negocio y alianzas estratégicas.' }],
  },
  {
    id: '9', firstName: 'Gabriela', lastName: 'Morales', email: 'gabriela.morales@empresa.com',
    phone: '11-1111-6666', dni: '31234567', photoUrl: '', department: 'Operaciones',
    position: 'Operations Coordinator', employmentType: 'full-time', status: 'active',
    startDate: '2021-05-01', salary: 580000, skills: ['Logística', 'Gestión de Inventario', 'Excel'],
    workExperience: [{ company: 'Logística Express', position: 'Logistics Assistant', startDate: '2020-01-01', endDate: '2021-04-30', description: 'Coordinación de envíos y gestión de inventario.' }],
  },
  {
    id: '10', firstName: 'Diego', lastName: 'Castillo', email: 'diego.castillo@empresa.com',
    phone: '11-2222-7777', dni: '34345678', photoUrl: '', department: 'Tecnología',
    position: 'QA Engineer', employmentType: 'full-time', status: 'active',
    startDate: '2022-04-01', salary: 650000, skills: ['Selenium', 'JUnit', 'Bug Tracking'],
    workExperience: [{ company: 'Quality Assurance Pro', position: 'QA Tester', startDate: '2020-08-01', endDate: '2022-03-31', description: 'Testing automatizado y manual, reporte de bugs.' }],
  },
  {
    id: '11', firstName: 'Valentina', lastName: 'Acosta', email: 'valentina.acosta@empresa.com',
    phone: '11-3333-8888', dni: '36456789', photoUrl: '', department: 'RRHH',
    position: 'Recruiter', employmentType: 'full-time', status: 'active',
    startDate: '2023-02-01', salary: 620000, skills: ['Reclutamiento', 'LinkedIn', 'Onboarding'],
    workExperience: [{ company: 'Talent Solutions', position: 'Junior Recruiter', startDate: '2022-06-01', endDate: '2023-01-31', description: 'Búsqueda y selección de candidatos.' }],
  },
  {
    id: '12', firstName: 'Alejandro', lastName: 'Torres', email: 'alejandro.torres@empresa.com',
    phone: '11-4444-9999', dni: '26567890', photoUrl: '', department: 'Finanzas',
    position: 'Finance Manager', employmentType: 'full-time', status: 'active',
    startDate: '2019-09-01', salary: 1100000, skills: ['Finanzas Corporativas', 'Presupuestos', 'SAP'],
    workExperience: [{ company: 'International Finance Group', position: 'Senior Accountant', startDate: '2016-01-01', endDate: '2019-08-31', description: 'Gestión financiera, presupuestos y reportes.' }],
  },
];

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const match = req.url.match(/\/employees(\/([^?]+))?/);
  if (!match) return next(req);

  const id = match[2];
  const params = req.params;

  if (req.method === 'GET' && !id) {
    let list = [...MOCK_EMPLOYEES];

    const q = params.get('q')?.toLowerCase();
    if (q) list = list.filter(e =>
      `${e.firstName} ${e.lastName} ${e.email}`.toLowerCase().includes(q)
    );

    const dept = params.get('department');
    if (dept) list = list.filter(e => e.department === dept);

    const status = params.get('status');
    if (status) list = list.filter(e => e.status === status);

    if (params.has('_page')) {
      const page = Number(params.get('_page') ?? 1);
      const perPage = Number(params.get('_per_page') ?? 10);
      const pages = Math.ceil(list.length / perPage);
      const data = list.slice((page - 1) * perPage, page * perPage);
      const body: ApiResponse<Employee[]> = {
        data, items: list.length, pages,
        first: 1, last: pages,
        prev: page > 1 ? page - 1 : null,
        next: page < pages ? page + 1 : null,
      };
      return of(new HttpResponse({ status: 200, body }));
    }

    return of(new HttpResponse({ status: 200, body: list }));
  }

  if (req.method === 'GET' && id) {
    const emp = MOCK_EMPLOYEES.find(e => String(e.id) === id);
    return of(new HttpResponse({ status: emp ? 200 : 404, body: emp ?? null }));
  }

  if (req.method === 'POST') {
    const body = { ...req.body, id: String(Date.now()) };
    return of(new HttpResponse({ status: 201, body }));
  }

  if (req.method === 'PUT' && id) {
    const existing = MOCK_EMPLOYEES.find(e => String(e.id) === id);
    return of(new HttpResponse({ status: 200, body: { ...existing, ...req.body, id } }));
  }

  if (req.method === 'DELETE') {
    return of(new HttpResponse({ status: 200, body: null }));
  }

  return next(req);
};
