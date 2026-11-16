import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  BarChart3,
  Trash2,
  Edit3,
  Eye,
  CheckCircle2,
  Clock,
  Building2,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  TrendingUp,
  Download,
  RefreshCw,
  Terminal,
  X,
  ChevronRight,
  ChevronLeft,
  Award,
  DollarSign,
  SlidersHorizontal,
  LayoutGrid,
  List,
  AlertTriangle,
  Globe,
  Code2,
  Check,
  Sparkles,
  Calendar,
  ArrowUpDown,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

// ============================================================================
// TypeScript Interfaces & Types
// ============================================================================

export type Department =
  | 'Engineering'
  | 'Design'
  | 'Product'
  | 'Analytics'
  | 'Operations'
  | 'HR';

export type EmployeeStatus = 'Active' | 'Remote' | 'On Leave' | 'Probation';

export type EmploymentType = 'Full-Time' | 'Contract' | 'Intern';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: Department;
  status: EmployeeStatus;
  employmentType: EmploymentType;
  location: string;
  salaryLpa: number;
  joinDate: string;
  performanceScore: number; // 1.0 - 5.0
  attendanceRate: number; // 0 - 100
  projectsCompleted: number;
  skills: string[];
  manager: string;
  bio: string;
  avatarBg: string;
}

export interface ApiLogEntry {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  status: number;
  latencyMs: number;
  summary: string;
  payloadPreview?: string;
}

export interface FilterState {
  search: string;
  department: string;
  status: string;
  employmentType: string;
  location: string;
  salaryBand: string;
  sortBy: 'name' | 'salaryDesc' | 'salaryAsc' | 'performance' | 'newest';
}

// ============================================================================
// Initial Seed Dataset
// ============================================================================

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-1001',
    firstName: 'Divyarajsinh',
    lastName: 'Thakor',
    email: 'divyarajsinh.thakor@workforce.io',
    phone: '+91 87587 25166',
    role: 'Frontend Developer',
    department: 'Engineering',
    status: 'Active',
    employmentType: 'Full-Time',
    location: 'Vadodara, GJ',
    salaryLpa: 6.8,
    joinDate: '2026-01-15',
    performanceScore: 4.9,
    attendanceRate: 98,
    projectsCompleted: 8,
    skills: ['React.js', 'TypeScript', 'Next.js', 'Tailwind CSS', 'REST API'],
    manager: 'Aarav Mehta',
    bio: 'Frontend Engineer specializing in modular React architectures, TypeScript interfaces, and responsive dashboard UI systems.',
    avatarBg: 'from-indigo-600 to-blue-500'
  },
  {
    id: 'EMP-1002',
    firstName: 'Aarav',
    lastName: 'Mehta',
    email: 'aarav.mehta@workforce.io',
    phone: '+91 98250 11420',
    role: 'Engineering Manager',
    department: 'Engineering',
    status: 'Active',
    employmentType: 'Full-Time',
    location: 'Vadodara, GJ',
    salaryLpa: 18.5,
    joinDate: '2023-06-10',
    performanceScore: 4.8,
    attendanceRate: 96,
    projectsCompleted: 24,
    skills: ['System Architecture', 'TypeScript', 'Node.js', 'Agile', 'Cloud'],
    manager: 'Vikramaditya Rao',
    bio: 'Leads core web platform engineering and mentors frontend and full-stack product squads across Gujarat and remote hubs.',
    avatarBg: 'from-slate-700 to-slate-900'
  },
  {
    id: 'EMP-1003',
    firstName: 'Ananya',
    lastName: 'Sharma',
    email: 'ananya.sharma@workforce.io',
    phone: '+91 97123 44890',
    role: 'Senior UI/UX Designer',
    department: 'Design',
    status: 'Remote',
    employmentType: 'Full-Time',
    location: 'Bengaluru, KA',
    salaryLpa: 11.2,
    joinDate: '2024-03-22',
    performanceScore: 4.7,
    attendanceRate: 95,
    projectsCompleted: 15,
    skills: ['Figma', 'Design Systems', 'CSS', 'Prototyping', 'Accessibility'],
    manager: 'Meera Nair',
    bio: 'Crafts accessible design systems, interactive prototypes, and high-contrast enterprise analytics interfaces.',
    avatarBg: 'from-violet-600 to-purple-500'
  },
  {
    id: 'EMP-1004',
    firstName: 'Rohan',
    lastName: 'Desai',
    email: 'rohan.desai@workforce.io',
    phone: '+91 99099 31204',
    role: 'Full Stack Developer',
    department: 'Engineering',
    status: 'Active',
    employmentType: 'Full-Time',
    location: 'Vadodara, GJ',
    salaryLpa: 8.4,
    joinDate: '2025-02-01',
    performanceScore: 4.5,
    attendanceRate: 94,
    projectsCompleted: 11,
    skills: ['React.js', 'Python', 'FastAPI', 'MySQL', 'REST API'],
    manager: 'Aarav Mehta',
    bio: 'Builds FastAPI microservices and connects relational MySQL schemas with reactive TypeScript frontends.',
    avatarBg: 'from-emerald-600 to-teal-500'
  },
  {
    id: 'EMP-1005',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@workforce.io',
    phone: '+91 98791 56321',
    role: 'Business Intelligence Analyst',
    department: 'Analytics',
    status: 'Active',
    employmentType: 'Full-Time',
    location: 'Ahmedabad, GJ',
    salaryLpa: 7.5,
    joinDate: '2024-11-12',
    performanceScore: 4.6,
    attendanceRate: 97,
    projectsCompleted: 14,
    skills: ['Power BI', 'SQL', 'MySQL', 'Excel Pivot Tables', 'Data Modeling'],
    manager: 'Siddharth Joshi',
    bio: 'Transforms workforce and revenue datasets into executive KPI dashboards and automated SQL reporting pipelines.',
    avatarBg: 'from-amber-500 to-orange-600'
  },
  {
    id: 'EMP-1006',
    firstName: 'Kabir',
    lastName: 'Verma',
    email: 'kabir.verma@workforce.io',
    phone: '+91 91672 88901',
    role: 'Product Manager',
    department: 'Product',
    status: 'Remote',
    employmentType: 'Full-Time',
    location: 'Mumbai, MH',
    salaryLpa: 15.0,
    joinDate: '2023-09-18',
    performanceScore: 4.8,
    attendanceRate: 93,
    projectsCompleted: 19,
    skills: ['Roadmapping', 'Product Analytics', 'User Research', 'SQL', 'Jira'],
    manager: 'Vikramaditya Rao',
    bio: 'Drives B2B SaaS product strategy, sprint prioritization, and cross-functional delivery across engineering and design.',
    avatarBg: 'from-blue-600 to-cyan-500'
  },
  {
    id: 'EMP-1007',
    firstName: 'Neha',
    lastName: 'Kulkarni',
    email: 'neha.kulkarni@workforce.io',
    phone: '+91 98201 77412',
    role: 'HR Operations Specialist',
    department: 'HR',
    status: 'Active',
    employmentType: 'Full-Time',
    location: 'Pune, MH',
    salaryLpa: 6.2,
    joinDate: '2024-07-04',
    performanceScore: 4.4,
    attendanceRate: 99,
    projectsCompleted: 12,
    skills: ['Talent Acquisition', 'HRIS', 'Onboarding', 'Payroll Compliance', 'People Analytics'],
    manager: 'simran.kaur@workforce.io',
    bio: 'Manages end-to-end technical recruitment, onboarding workflows, and employee engagement programs.',
    avatarBg: 'from-rose-500 to-pink-600'
  },
  {
    id: 'EMP-1008',
    firstName: 'Devansh',
    lastName: 'Solanki',
    email: 'devansh.solanki@workforce.io',
    phone: '+91 94265 10988',
    role: 'Frontend Engineer Intern',
    department: 'Engineering',
    status: 'Probation',
    employmentType: 'Intern',
    location: 'Vadodara, GJ',
    salaryLpa: 3.6,
    joinDate: '2026-08-01',
    performanceScore: 4.2,
    attendanceRate: 96,
    projectsCompleted: 3,
    skills: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Git'],
    manager: 'Aarav Mehta',
    bio: 'Final-year IT undergraduate building reusable UI components and assisting with REST API state integration.',
    avatarBg: 'from-cyan-600 to-sky-500'
  },
  {
    id: 'EMP-1009',
    firstName: 'Ishita',
    lastName: 'Choudhary',
    email: 'ishita.choudhary@workforce.io',
    phone: '+91 96641 22310',
    role: 'Operations Lead',
    department: 'Operations',
    status: 'On Leave',
    employmentType: 'Full-Time',
    location: 'Hyderabad, TS',
    salaryLpa: 10.4,
    joinDate: '2024-01-29',
    performanceScore: 4.5,
    attendanceRate: 89,
    projectsCompleted: 16,
    skills: ['Process Automation', 'Vendor Management', 'SLA Tracking', 'Excel', 'ERP'],
    manager: 'Vikramaditya Rao',
    bio: 'Oversees enterprise client onboarding, operational SLAs, and cross-regional resource allocation.',
    avatarBg: 'from-fuchsia-600 to-purple-600'
  },
  {
    id: 'EMP-1010',
    firstName: 'Karan',
    lastName: 'Malhotra',
    email: 'karan.malhotra@workforce.io',
    phone: '+91 98112 65094',
    role: 'QA Automation Consultant',
    department: 'Engineering',
    status: 'Remote',
    employmentType: 'Contract',
    location: 'Remote (India)',
    salaryLpa: 9.2,
    joinDate: '2025-06-14',
    performanceScore: 4.3,
    attendanceRate: 92,
    projectsCompleted: 9,
    skills: ['Playwright', 'TypeScript', 'REST API Testing', 'CI/CD', 'Jest'],
    manager: 'Aarav Mehta',
    bio: 'Automates end-to-end regression suites and validates REST API contract schemas across staging environments.',
    avatarBg: 'from-teal-600 to-emerald-600'
  }
];

const DEPARTMENTS: Department[] = [
  'Engineering',
  'Design',
  'Product',
  'Analytics',
  'Operations',
  'HR'
];

const STATUS_OPTIONS: EmployeeStatus[] = [
  'Active',
  'Remote',
  'On Leave',
  'Probation'
];

const EMPLOYMENT_TYPES: EmploymentType[] = [
  'Full-Time',
  'Contract',
  'Intern'
];

const AVATAR_GRADIENTS = [
  'from-indigo-600 to-blue-500',
  'from-emerald-600 to-teal-500',
  'from-violet-600 to-purple-500',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-blue-600 to-cyan-500',
  'from-slate-700 to-slate-900'
];

const MONTHLY_TREND_BASE = [
  { month: 'Jun', headcount: 6, hires: 1, avgProductivity: 88 },
  { month: 'Jul', headcount: 7, hires: 1, avgProductivity: 90 },
  { month: 'Aug', headcount: 8, hires: 1, avgProductivity: 91 },
  { month: 'Sep', headcount: 9, hires: 1, avgProductivity: 93 },
  { month: 'Oct', headcount: 9, hires: 0, avgProductivity: 94 },
  { month: 'Nov', headcount: 10, hires: 1, avgProductivity: 96 }
];

const DEPT_COLORS: Record<Department, string> = {
  Engineering: '#4f46e5',
  Design: '#8b5cf6',
  Product: '#0ea5e9',
  Analytics: '#f59e0b',
  Operations: '#10b981',
  HR: '#ec4899'
};

const STATUS_COLORS: Record<EmployeeStatus, string> = {
  Active: '#10b981',
  Remote: '#3b82f6',
  'On Leave': '#f59e0b',
  Probation: '#8b5cf6'
};

// ============================================================================
// Main Application Component
// ============================================================================

export default function App() {
  // Primary State
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem('emd_employees_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors in restricted environments
    }
    return INITIAL_EMPLOYEES;
  });

  const [activeTab, setActiveTab] = useState<'directory' | 'analytics' | 'api'>('directory');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Multi-Parameter Search & Filter State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    department: 'All',
    status: 'All',
    employmentType: 'All',
    location: 'All',
    salaryBand: 'All',
    sortBy: 'name'
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  // Modals & Drawers State
  const [inspectingEmployee, setInspectingEmployee] = useState<Employee | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[] | null>(null);

  // REST API Simulation & Activity Log State
  const [isSyncingApi, setIsSyncingApi] = useState<boolean>(false);
  const [apiLogs, setApiLogs] = useState<ApiLogEntry[]>([
    {
      id: 'REQ-901',
      timestamp: new Date().toLocaleTimeString(),
      method: 'GET',
      endpoint: '/api/v1/employees?limit=50&sort=name',
      status: 200,
      latencyMs: 42,
      summary: `Fetched ${INITIAL_EMPLOYEES.length} employee profile records`,
      payloadPreview: '{ "status": "ok", "count": 10, "source": "REST_API_STORE" }'
    }
  ]);

  // Toast Notification State
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info' | 'warning';
  } | null>(null);

  // Form State for Add / Edit Employee
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: 'Engineering' as Department,
    status: 'Active' as EmployeeStatus,
    employmentType: 'Full-Time' as EmploymentType,
    location: 'Vadodara, GJ',
    salaryLpa: '6.5',
    joinDate: '2026-11-16',
    performanceScore: '4.5',
    attendanceRate: '96',
    projectsCompleted: '5',
    skillsInput: 'React.js, TypeScript, CSS, REST API',
    manager: 'Aarav Mehta',
    bio: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('emd_employees_v1', JSON.stringify(employees));
    } catch {
      // ignore storage errors
    }
  }, [employees]);

  const showToast = useCallback(
    (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
      setToast({ message, type });
      setTimeout(() => {
        setToast((prev) => (prev?.message === message ? null : prev));
      }, 3500);
    },
    []
  );

  const appendApiLog = useCallback(
    (
      method: ApiLogEntry['method'],
      endpoint: string,
      status: number,
      summary: string,
      payloadPreview?: string
    ) => {
      const entry: ApiLogEntry = {
        id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: new Date().toLocaleTimeString(),
        method,
        endpoint,
        status,
        latencyMs: Math.floor(28 + Math.random() * 65),
        summary,
        payloadPreview
      };
      setApiLogs((prev) => [entry, ...prev.slice(0, 24)]);
    },
    []
  );

  // Unique Locations for Filter Dropdown
  const uniqueLocations = useMemo(() => {
    const locs = Array.from(new Set(employees.map((e) => e.location))).sort();
    return ['All', ...locs];
  }, [employees]);

  // Real-Time Dynamic Search & Multi-Parameter Record Filtering
  const filteredEmployees = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    const list = employees.filter((emp) => {
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      const matchesSearch =
        !q ||
        fullName.includes(q) ||
        emp.id.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.location.toLowerCase().includes(q) ||
        emp.skills.some((s) => s.toLowerCase().includes(q));

      const matchesDept =
        filters.department === 'All' || emp.department === filters.department;

      const matchesStatus =
        filters.status === 'All' || emp.status === filters.status;

      const matchesType =
        filters.employmentType === 'All' ||
        emp.employmentType === filters.employmentType;

      const matchesLocation =
        filters.location === 'All' || emp.location === filters.location;

      let matchesSalary = true;
      if (filters.salaryBand === 'under6') matchesSalary = emp.salaryLpa < 6;
      else if (filters.salaryBand === '6to12')
        matchesSalary = emp.salaryLpa >= 6 && emp.salaryLpa <= 12;
      else if (filters.salaryBand === 'over12') matchesSalary = emp.salaryLpa > 12;

      return (
        matchesSearch &&
        matchesDept &&
        matchesStatus &&
        matchesType &&
        matchesLocation &&
        matchesSalary
      );
    });

    return [...list].sort((a, b) => {
      if (filters.sortBy === 'name') {
        return `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        );
      }
      if (filters.sortBy === 'salaryDesc') return b.salaryLpa - a.salaryLpa;
      if (filters.sortBy === 'salaryAsc') return a.salaryLpa - b.salaryLpa;
      if (filters.sortBy === 'performance')
        return b.performanceScore - a.performanceScore;
      if (filters.sortBy === 'newest')
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      return 0;
    });
  }, [employees, filters]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  // Keep drawer employee synced with updates
  useEffect(() => {
    if (inspectingEmployee) {
      const updated = employees.find((e) => e.id === inspectingEmployee.id) || null;
      setInspectingEmployee(updated);
    }
  }, [employees, inspectingEmployee]);

  // ============================================================================
  // Workforce Analytics Aggregations
  // ============================================================================

  const kpiMetrics = useMemo(() => {
    const total = employees.length;
    const activeCount = employees.filter(
      (e) => e.status === 'Active' || e.status === 'Remote'
    ).length;
    const remoteCount = employees.filter((e) => e.status === 'Remote').length;
    const totalPayroll = employees.reduce((acc, e) => acc + e.salaryLpa, 0);
    const avgSalary = total > 0 ? totalPayroll / total : 0;
    const avgPerformance =
      total > 0
        ? employees.reduce((acc, e) => acc + e.performanceScore, 0) / total
        : 0;
    const avgAttendance =
      total > 0
        ? employees.reduce((acc, e) => acc + e.attendanceRate, 0) / total
        : 0;

    return {
      total,
      activeCount,
      remoteCount,
      totalPayroll: Number(totalPayroll.toFixed(1)),
      avgSalary: Number(avgSalary.toFixed(1)),
      avgPerformance: Number(avgPerformance.toFixed(2)),
      avgAttendance: Math.round(avgAttendance)
    };
  }, [employees]);

  const departmentChartData = useMemo(() => {
    return DEPARTMENTS.map((dept) => {
      const members = employees.filter((e) => e.department === dept);
      const count = members.length;
      const avgCtc =
        count > 0
          ? Number(
              (
                members.reduce((sum, e) => sum + e.salaryLpa, 0) / count
              ).toFixed(1)
            )
          : 0;
      const avgPerf =
        count > 0
          ? Number(
              (
                members.reduce((sum, e) => sum + e.performanceScore, 0) / count
              ).toFixed(2)
            )
          : 0;
      return {
        department: dept,
        headcount: count,
        avgCtc,
        avgPerf,
        fill: DEPT_COLORS[dept]
      };
    });
  }, [employees]);

  const statusDistributionData = useMemo(() => {
    return STATUS_OPTIONS.map((status) => ({
      name: status,
      value: employees.filter((e) => e.status === status).length,
      color: STATUS_COLORS[status]
    })).filter((d) => d.value > 0);
  }, [employees]);

  const growthTrendData = useMemo(() => {
    const updated = [...MONTHLY_TREND_BASE];
    updated[updated.length - 1] = {
      ...updated[updated.length - 1],
      headcount: employees.length,
      avgProductivity: kpiMetrics.avgAttendance
    };
    return updated;
  }, [employees.length, kpiMetrics.avgAttendance]);

  // ============================================================================
  // CRUD Handlers (Add, Edit, Delete, Status Patch, Live REST Fetch)
  // ============================================================================

  const openAddModal = () => {
    setEditingEmployee(null);
    setFormErrors({});
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '+91 ',
      role: 'Frontend Developer',
      department: 'Engineering',
      status: 'Active',
      employmentType: 'Full-Time',
      location: 'Vadodara, GJ',
      salaryLpa: '6.0',
      joinDate: new Date().toISOString().split('T')[0],
      performanceScore: '4.5',
      attendanceRate: '96',
      projectsCompleted: '4',
      skillsInput: 'React.js, TypeScript, CSS, REST API',
      manager: 'Aarav Mehta',
      bio: 'Focused on building clean, modular React components and responsive interfaces.'
    });
    setIsFormModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormErrors({});
    setFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone,
      role: emp.role,
      department: emp.department,
      status: emp.status,
      employmentType: emp.employmentType,
      location: emp.location,
      salaryLpa: String(emp.salaryLpa),
      joinDate: emp.joinDate,
      performanceScore: String(emp.performanceScore),
      attendanceRate: String(emp.attendanceRate),
      projectsCompleted: String(emp.projectsCompleted),
      skillsInput: emp.skills.join(', '),
      manager: emp.manager,
      bio: emp.bio
    });
    setIsFormModalOpen(true);
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      errs.email = 'Valid work email is required';
    }
    if (!formData.role.trim()) errs.role = 'Job role is required';
    if (!formData.location.trim()) errs.location = 'Location is required';

    const sal = parseFloat(formData.salaryLpa);
    if (isNaN(sal) || sal < 0 || sal > 150) {
      errs.salaryLpa = 'Enter a valid CTC between 0 and 150 LPA';
    }

    const perf = parseFloat(formData.performanceScore);
    if (isNaN(perf) || perf < 1 || perf > 5) {
      errs.performanceScore = 'Score must be between 1.0 and 5.0';
    }

    const att = parseFloat(formData.attendanceRate);
    if (isNaN(att) || att < 0 || att > 100) {
      errs.attendanceRate = 'Attendance must be between 0% and 100%';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const skillsArray = formData.skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingEmployee) {
      const updatedEmp: Employee = {
        ...editingEmployee,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || '+91 90000 00000',
        role: formData.role.trim(),
        department: formData.department,
        status: formData.status,
        employmentType: formData.employmentType,
        location: formData.location.trim(),
        salaryLpa: Number(parseFloat(formData.salaryLpa).toFixed(1)),
        joinDate: formData.joinDate,
        performanceScore: Number(
          parseFloat(formData.performanceScore).toFixed(1)
        ),
        attendanceRate: Math.round(parseFloat(formData.attendanceRate)),
        projectsCompleted: Math.max(
          0,
          parseInt(formData.projectsCompleted, 10) || 0
        ),
        skills: skillsArray.length ? skillsArray : ['React.js', 'TypeScript'],
        manager: formData.manager.trim() || 'Aarav Mehta',
        bio:
          formData.bio.trim() ||
          `${formData.role.trim()} in the ${formData.department} department.`
      };

      setEmployees((prev) =>
        prev.map((item) => (item.id === editingEmployee.id ? updatedEmp : item))
      );
      appendApiLog(
        'PUT',
        `/api/v1/employees/${editingEmployee.id}`,
        200,
        `Updated profile for ${updatedEmp.firstName} ${updatedEmp.lastName}`,
        JSON.stringify({
          id: updatedEmp.id,
          role: updatedEmp.role,
          status: updatedEmp.status,
          salaryLpa: updatedEmp.salaryLpa
        })
      );
      showToast(
        `Updated ${updatedEmp.firstName} ${updatedEmp.lastName} (${updatedEmp.id})`
      );
    } else {
      const maxNum = employees.reduce((max, emp) => {
        const num = parseInt(emp.id.replace('EMP-', ''), 10);
        return !isNaN(num) && num > max ? num : max;
      }, 1000);
      const nextId = `EMP-${maxNum + 1}`;
      const newEmp: Employee = {
        id: nextId,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || '+91 90000 00000',
        role: formData.role.trim(),
        department: formData.department,
        status: formData.status,
        employmentType: formData.employmentType,
        location: formData.location.trim(),
        salaryLpa: Number(parseFloat(formData.salaryLpa).toFixed(1)),
        joinDate: formData.joinDate,
        performanceScore: Number(
          parseFloat(formData.performanceScore).toFixed(1)
        ),
        attendanceRate: Math.round(parseFloat(formData.attendanceRate)),
        projectsCompleted: Math.max(
          0,
          parseInt(formData.projectsCompleted, 10) || 0
        ),
        skills: skillsArray.length ? skillsArray : ['React.js', 'TypeScript'],
        manager: formData.manager.trim() || 'Aarav Mehta',
        bio:
          formData.bio.trim() ||
          `${formData.role.trim()} in the ${formData.department} department.`,
        avatarBg:
          AVATAR_GRADIENTS[employees.length % AVATAR_GRADIENTS.length]
      };

      setEmployees((prev) => [newEmp, ...prev]);
      appendApiLog(
        'POST',
        '/api/v1/employees',
        201,
        `Created new employee record ${newEmp.id} (${newEmp.firstName} ${newEmp.lastName})`,
        JSON.stringify({
          id: newEmp.id,
          name: `${newEmp.firstName} ${newEmp.lastName}`,
          department: newEmp.department
        })
      );
      showToast(
        `Added ${newEmp.firstName} ${newEmp.lastName} (${newEmp.id}) to directory`
      );
    }

    setIsFormModalOpen(false);
    setEditingEmployee(null);
  };

  const confirmDeleteRecords = () => {
    if (!deleteTargetIds || deleteTargetIds.length === 0) return;
    const count = deleteTargetIds.length;
    const sampleId = deleteTargetIds[0];

    setEmployees((prev) =>
      prev.filter((emp) => !deleteTargetIds.includes(emp.id))
    );
    setSelectedIds((prev) =>
      prev.filter((id) => !deleteTargetIds.includes(id))
    );
    if (
      inspectingEmployee &&
      deleteTargetIds.includes(inspectingEmployee.id)
    ) {
      setInspectingEmployee(null);
    }

    appendApiLog(
      'DELETE',
      count === 1
        ? `/api/v1/employees/${sampleId}`
        : `/api/v1/employees/batch-delete`,
      204,
      `Deleted ${count} employee record${count > 1 ? 's' : ''}`,
      JSON.stringify({ deletedIds: deleteTargetIds })
    );
    showToast(
      `Removed ${count} employee record${count > 1 ? 's' : ''}`,
      'warning'
    );
    setDeleteTargetIds(null);
  };

  const handleQuickStatusChange = (emp: Employee, nextStatus: EmployeeStatus) => {
    setEmployees((prev) =>
      prev.map((item) =>
        item.id === emp.id ? { ...item, status: nextStatus } : item
      )
    );
    appendApiLog(
      'PATCH',
      `/api/v1/employees/${emp.id}/status`,
      200,
      `Patched ${emp.id} status to "${nextStatus}"`,
      JSON.stringify({ id: emp.id, status: nextStatus })
    );
    showToast(`${emp.firstName}'s status updated to ${nextStatus}`, 'info');
  };

  // Live REST API Fetch Integration (JSONPlaceholder with Fallback)
  const handleSyncExternalRestApi = async () => {
    setIsSyncingApi(true);
    const start = performance.now();
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users?_limit=3'
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      const maxNum = employees.reduce((max, emp) => {
        const num = parseInt(emp.id.replace('EMP-', ''), 10);
        return !isNaN(num) && num > max ? num : max;
      }, 1000);

      const importedRoles = [
        { role: 'Cloud Frontend Engineer', dept: 'Engineering' as Department, skills: ['React.js', 'TypeScript', 'REST API', 'CSS'] },
        { role: 'Product Operations Analyst', dept: 'Analytics' as Department, skills: ['SQL', 'Power BI', 'REST API', 'Data Viz'] },
        { role: 'UX Systems Architect', dept: 'Design' as Department, skills: ['Design Tokens', 'CSS', 'React.js', 'Figma'] }
      ];

      const newRecords: Employee[] = (Array.isArray(data) ? data.slice(0, 2) : []).map(
        (u: Record<string, any>, idx: number) => {
          const parts = String(u?.name || `External User ${idx + 1}`).split(' ');
          const firstName = parts[0] || 'Alex';
          const lastName = parts.slice(1).join(' ') || 'Rivera';
          const preset = importedRoles[idx % importedRoles.length];
          return {
            id: `EMP-${maxNum + idx + 1}`,
            firstName,
            lastName,
            email: String(u?.email || `${firstName.toLowerCase()}@workforce.io`).toLowerCase(),
            phone: '+91 98240 ' + String(10000 + Math.floor(Math.random() * 89999)),
            role: preset.role,
            department: preset.dept,
            status: 'Remote',
            employmentType: 'Contract',
            location: String(u?.address?.city ? `${u.address.city} (Remote)` : 'Remote (India)'),
            salaryLpa: Number((7.2 + idx * 1.8).toFixed(1)),
            joinDate: new Date().toISOString().split('T')[0],
            performanceScore: 4.4,
            attendanceRate: 95,
            projectsCompleted: 6,
            skills: preset.skills,
            manager: 'Aarav Mehta',
            bio: `Synced via external REST API endpoint (jsonplaceholder.typicode.com/users). Company: ${u?.company?.name || 'Enterprise Partner'}.`,
            avatarBg: AVATAR_GRADIENTS[(employees.length + idx) % AVATAR_GRADIENTS.length]
          };
        }
      );

      if (newRecords.length > 0) {
        setEmployees((prev) => [...newRecords, ...prev]);
        appendApiLog(
          'GET',
          'https://jsonplaceholder.typicode.com/users?_limit=2',
          200,
          `Synced ${newRecords.length} external staff records via live REST API (${Math.round(performance.now() - start)}ms)`,
          JSON.stringify(newRecords.map((r) => ({ id: r.id, name: `${r.firstName} ${r.lastName}` })))
        );
        showToast(`Synced ${newRecords.length} records from REST API endpoint`, 'success');
      }
    } catch {
      // Fallback simulated REST payload if sandbox/browser blocks external call
      const maxNum = employees.reduce((max, emp) => {
        const num = parseInt(emp.id.replace('EMP-', ''), 10);
        return !isNaN(num) && num > max ? num : max;
      }, 1000);
      const fallbackEmp: Employee = {
        id: `EMP-${maxNum + 1}`,
        firstName: 'Siddharth',
        lastName: 'Joshi',
        email: 'siddharth.joshi@workforce.io',
        phone: '+91 98980 45120',
        role: 'API Platform Engineer',
        department: 'Engineering',
        status: 'Remote',
        employmentType: 'Full-Time',
        location: 'Vadodara, GJ',
        salaryLpa: 9.6,
        joinDate: new Date().toISOString().split('T')[0],
        performanceScore: 4.7,
        attendanceRate: 97,
        projectsCompleted: 10,
        skills: ['TypeScript', 'React.js', 'REST API', 'FastAPI'],
        manager: 'Aarav Mehta',
        bio: 'Synced via mock REST API fallback payload.',
        avatarBg: 'from-indigo-600 to-blue-500'
      };
      setEmployees((prev) => [fallbackEmp, ...prev]);
      appendApiLog(
        'GET',
        '/api/v1/external-sync/employees',
        200,
        'Synced 1 employee record via fallback REST API service',
        JSON.stringify({ id: fallbackEmp.id, role: fallbackEmp.role })
      );
      showToast('Synced new employee record from REST service', 'info');
    } finally {
      setIsSyncingApi(false);
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'Employee ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Role',
      'Department',
      'Status',
      'Employment Type',
      'Location',
      'Salary (LPA)',
      'Join Date',
      'Performance Score',
      'Attendance (%)',
      'Skills'
    ];
    const rows = filteredEmployees.map((e) => [
      e.id,
      e.firstName,
      e.lastName,
      e.email,
      e.phone,
      `"${e.role}"`,
      e.department,
      e.status,
      e.employmentType,
      `"${e.location}"`,
      e.salaryLpa,
      e.joinDate,
      e.performanceScore,
      e.attendanceRate,
      `"${e.skills.join('; ')}"`
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `employee_records_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    appendApiLog(
      'GET',
      '/api/v1/employees/export.csv',
      200,
      `Exported ${filteredEmployees.length} filtered records to CSV`
    );
    showToast(`Exported ${filteredEmployees.length} employee records to CSV`);
  };

  const handleResetDemoData = () => {
    setEmployees(INITIAL_EMPLOYEES);
    setSelectedIds([]);
    setFilters({
      search: '',
      department: 'All',
      status: 'All',
      employmentType: 'All',
      location: 'All',
      salaryBand: 'All',
      sortBy: 'name'
    });
    appendApiLog(
      'POST',
      '/api/v1/system/reset-seed',
      200,
      'Restored default 10 employee seed records'
    );
    showToast('Restored default demo dataset (10 employees)', 'info');
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      department: 'All',
      status: 'All',
      employmentType: 'All',
      location: 'All',
      salaryBand: 'All',
      sortBy: 'name'
    });
  };

  const toggleSelectAllPage = () => {
    const pageIds = paginatedEmployees.map((e) => e.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const activeFilterCount = [
    filters.search.trim() !== '',
    filters.department !== 'All',
    filters.status !== 'All',
    filters.employmentType !== 'All',
    filters.location !== 'All',
    filters.salaryBand !== 'All'
  ].filter(Boolean).length;

  const getStatusBadgeStyle = (status: EmployeeStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Remote':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'On Leave':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Probation':
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Top Navigation & Project Identity Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                  Employee Management Dashboard
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Code2 className="w-3 h-3" />
                  React.js • TypeScript • CSS • REST API
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Centralized Staff Profile Directory, Multi-Parameter Search, Full CRUD & Workforce Analytics
              </p>
            </div>
          </div>

          {/* Primary Navigation Tabs & Action Controls */}
          <div className="flex items-center flex-wrap gap-2">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('directory')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'directory'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Employee Records ({employees.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('analytics')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Dashboard Analytics
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('api')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'api'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                REST API Console ({apiLogs.length})
              </button>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Add Employee
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border bg-slate-900 text-white border-slate-700 text-xs font-medium animate-in fade-in slide-in-from-bottom-3">
          {toast.type === 'success' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          {toast.type === 'info' && (
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
          )}
          {toast.type === 'warning' && (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 space-y-6">
        {/* Executive KPI Summary Strip */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Total Workforce
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {kpiMetrics.total}
              </p>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">
                {kpiMetrics.activeCount} active ({kpiMetrics.remoteCount} remote)
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Annual Payroll & Avg CTC
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                ₹{kpiMetrics.totalPayroll} <span className="text-sm font-semibold text-slate-500">LPA</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Avg Package: <strong className="text-slate-700">₹{kpiMetrics.avgSalary} LPA</strong>
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Avg Performance Rating
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {kpiMetrics.avgPerformance} <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
              </p>
              <p className="text-[11px] text-indigo-600 font-medium mt-1">
                Across {DEPARTMENTS.length} active departments
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Attendance & API Sync
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {kpiMetrics.avgAttendance}%
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                REST API calls logged: <strong className="text-slate-700">{apiLogs.length}</strong>
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* TAB 1: EMPLOYEE RECORDS, DYNAMIC SEARCH, FILTERING & CRUD         */}
        {/* ================================================================= */}
        {activeTab === 'directory' && (
          <div className="space-y-4">
            {/* Search & Multi-Parameter Filter Control Panel */}
            <section className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3.5">
              <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
                {/* Real-Time Dynamic Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, search: e.target.value }))
                    }
                    placeholder="Real-time search by employee name, ID (EMP-1001), role, skill (React.js, TypeScript), or city..."
                    className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                  {filters.search && (
                    <button
                      type="button"
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, search: '' }))
                      }
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Action Toolbar: Live API Sync, CSV Export, View Mode */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSyncExternalRestApi}
                    disabled={isSyncingApi}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Globe
                      className={`w-3.5 h-3.5 text-indigo-600 ${
                        isSyncingApi ? 'animate-spin' : ''
                      }`}
                    />
                    {isSyncingApi ? 'Syncing REST API...' : 'Sync REST API Users'}
                  </button>

                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </button>

                  <button
                    type="button"
                    onClick={handleResetDemoData}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent transition-all cursor-pointer"
                    title="Reset demo data"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset
                  </button>

                  <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setViewMode('table')}
                      aria-label="Table view"
                      className={`p-1.5 rounded-lg text-xs transition-all ${
                        viewMode === 'table'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      aria-label="Grid view"
                      className={`p-1.5 rounded-lg text-xs transition-all ${
                        viewMode === 'grid'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Multi-Parameter Filter Selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Department
                  </label>
                  <select
                    value={filters.department}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        department: e.target.value
                      }))
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-indigo-500"
                  >
                    <option value="All">All Departments</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Work Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, status: e.target.value }))
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-indigo-500"
                  >
                    <option value="All">All Statuses</option>
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Employment Type
                  </label>
                  <select
                    value={filters.employmentType}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        employmentType: e.target.value
                      }))
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-indigo-500"
                  >
                    <option value="All">All Types</option>
                    {EMPLOYMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Location
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        location: e.target.value
                      }))
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-indigo-500"
                  >
                    {uniqueLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc === 'All' ? 'All Locations' : loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Salary Band (CTC)
                  </label>
                  <select
                    value={filters.salaryBand}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        salaryBand: e.target.value
                      }))
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-indigo-500"
                  >
                    <option value="All">All Packages</option>
                    <option value="under6">Under ₹6.0 LPA</option>
                    <option value="6to12">₹6.0 – ₹12.0 LPA</option>
                    <option value="over12">Above ₹12.0 LPA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Sort Records By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: e.target.value as FilterState['sortBy']
                      }))
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-indigo-500"
                  >
                    <option value="name">Name (A → Z)</option>
                    <option value="salaryDesc">CTC (High → Low)</option>
                    <option value="salaryAsc">CTC (Low → High)</option>
                    <option value="performance">Performance Rating</option>
                    <option value="newest">Newest Joined</option>
                  </select>
                </div>
              </div>

              {/* Filter Status & Bulk Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-600">
                <div className="flex items-center flex-wrap gap-2">
                  <span>
                    Showing{' '}
                    <strong className="text-slate-900">
                      {filteredEmployees.length}
                    </strong>{' '}
                    of <strong className="text-slate-900">{employees.length}</strong>{' '}
                    staff records
                  </span>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                    >
                      <X className="w-3 h-3" />
                      Clear {activeFilterCount} active filter
                      {activeFilterCount > 1 ? 's' : ''}
                    </button>
                  )}
                </div>

                {selectedIds.length > 0 && (
                  <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl">
                    <span className="text-xs font-semibold text-rose-800">
                      {selectedIds.length} selected
                    </span>
                    <button
                      type="button"
                      onClick={() => setDeleteTargetIds(selectedIds)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Selected
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedIds([])}
                      className="text-[11px] text-slate-500 hover:text-slate-700 ml-1"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Empty State when no records match filter */}
            {filteredEmployees.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  No matching employee records found
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  No staff profiles matched your current search query or multi-parameter filter combination.
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800"
                  >
                    Reset All Filters
                  </button>
                  <button
                    type="button"
                    onClick={openAddModal}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  >
                    Add New Employee
                  </button>
                </div>
              </div>
            ) : viewMode === 'table' ? (
              /* TABLE VIEW */
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        <th className="py-3 px-4 w-9">
                          <input
                            type="checkbox"
                            aria-label="Select all on page"
                            checked={
                              paginatedEmployees.length > 0 &&
                              paginatedEmployees.every((e) =>
                                selectedIds.includes(e.id)
                              )
                            }
                            onChange={toggleSelectAllPage}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </th>
                        <th className="py-3 px-4">Employee</th>
                        <th className="py-3 px-4">Role & Department</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">CTC (LPA)</th>
                        <th className="py-3 px-4">Performance</th>
                        <th className="py-3 px-4 text-right">CRUD Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {paginatedEmployees.map((emp) => (
                        <tr
                          key={emp.id}
                          className={`hover:bg-slate-50/90 transition-colors ${
                            selectedIds.includes(emp.id) ? 'bg-indigo-50/40' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <input
                              type="checkbox"
                              aria-label={`Select ${emp.firstName} ${emp.lastName}`}
                              checked={selectedIds.includes(emp.id)}
                              onChange={() => toggleSelectOne(emp.id)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${emp.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}
                              >
                                {emp.firstName[0]}
                                {emp.lastName[0]}
                              </div>
                              <div className="min-w-0">
                                <button
                                  type="button"
                                  onClick={() => setInspectingEmployee(emp)}
                                  className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-left truncate block cursor-pointer"
                                >
                                  {emp.firstName} {emp.lastName}
                                </button>
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                  <span className="font-mono text-slate-600 font-semibold">
                                    {emp.id}
                                  </span>
                                  <span>•</span>
                                  <span className="truncate">{emp.email}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-800">
                              {emp.role}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] text-slate-500">
                                {emp.department}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="text-[11px] text-slate-500">
                                {emp.employmentType}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadgeStyle(
                                emp.status
                              )}`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {emp.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{emp.location}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            ₹{emp.salaryLpa.toFixed(1)} LPA
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800">
                                {emp.performanceScore.toFixed(1)}
                              </span>
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-indigo-600 rounded-full"
                                  style={{
                                    width: `${(emp.performanceScore / 5) * 100}%`
                                  }}
                                />
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {emp.attendanceRate}% attendance
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setInspectingEmployee(emp)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                                title="View full profile"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditModal(emp)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTargetIds([emp.id])}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <div>
                    Page <strong className="text-slate-900">{currentPage}</strong> of{' '}
                    <strong className="text-slate-900">{totalPages}</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Prev
                    </button>
                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* PROFILE CARD GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${emp.avatarBg} text-white font-bold text-sm flex items-center justify-center shrink-0`}
                          >
                            {emp.firstName[0]}
                            {emp.lastName[0]}
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => setInspectingEmployee(emp)}
                              className="font-bold text-slate-900 hover:text-indigo-600 text-sm text-left block cursor-pointer"
                            >
                              {emp.firstName} {emp.lastName}
                            </button>
                            <p className="text-xs text-slate-500">{emp.role}</p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadgeStyle(
                            emp.status
                          )}`}
                        >
                          {emp.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">
                            Department
                          </span>
                          <span className="font-semibold text-slate-700">
                            {emp.department}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">
                            Annual CTC
                          </span>
                          <span className="font-bold text-slate-900">
                            ₹{emp.salaryLpa.toFixed(1)} LPA
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">
                            Location
                          </span>
                          <span className="text-slate-600 truncate block">
                            {emp.location}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">
                            Rating & Attendance
                          </span>
                          <span className="font-semibold text-indigo-600">
                            ★ {emp.performanceScore} ({emp.attendanceRate}%)
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {emp.skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] text-slate-400">
                        {emp.id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setInspectingEmployee(emp)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        >
                          Profile
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(emp)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetIds([emp.id])}
                          className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: INTERACTIVE DASHBOARD ANALYTICS                            */}
        {/* ================================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Chart 1: Department Headcount & Average CTC (LPA) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Department Headcount & Average CTC (₹ LPA)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Live distribution across Engineering, Design, Product, Analytics, Operations & HR
                    </p>
                  </div>
                  <Building2 className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="relative h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={departmentChartData}
                      margin={{ top: 10, right: 16, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="department"
                        tick={{ fontSize: 11, fill: '#475569' }}
                      />
                      <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          fontSize: '12px'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Bar
                        dataKey="headcount"
                        name="Headcount"
                        fill="#4f46e5"
                        radius={[6, 6, 0, 0]}
                      />
                      <Bar
                        dataKey="avgCtc"
                        name="Avg CTC (₹ LPA)"
                        fill="#0ea5e9"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Workforce Status & Work-Mode Breakdown */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Workforce Status & Work-Mode Split
                    </h2>
                    <p className="text-xs text-slate-500">
                      Real-time breakdown of Active on-site, Remote, On Leave, and Probation staff
                    </p>
                  </div>
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="relative h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistributionData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={92}
                        paddingAngle={4}
                      >
                        {statusDistributionData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          fontSize: '12px'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 3: Workforce Growth & Attendance Velocity */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Workforce Headcount & Attendance Trend
                    </h2>
                    <p className="text-xs text-slate-500">
                      6-month organization growth and average attendance rate (%)
                    </p>
                  </div>
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="relative h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={growthTrendData}
                      margin={{ top: 10, right: 16, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: '#475569' }}
                      />
                      <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          fontSize: '12px'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Area
                        type="monotone"
                        dataKey="headcount"
                        name="Total Headcount"
                        stroke="#4f46e5"
                        fill="#e0e7ff"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="avgProductivity"
                        name="Attendance Rate (%)"
                        stroke="#10b981"
                        fill="#d1fae5"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Department Performance Matrix Table */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        Department Performance & Compensation Matrix
                      </h2>
                      <p className="text-xs text-slate-500">
                        Aggregated metrics dynamically recalculated from employee records
                      </p>
                    </div>
                    <Award className="w-4 h-4 text-amber-500" />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-[10px] font-semibold uppercase text-slate-400">
                          <th className="py-2 pr-3">Department</th>
                          <th className="py-2 px-3">Staff</th>
                          <th className="py-2 px-3">Avg CTC</th>
                          <th className="py-2 pl-3 text-right">Avg Rating</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {departmentChartData.map((d) => (
                          <tr key={d.department} className="hover:bg-slate-50">
                            <td className="py-2.5 pr-3 font-semibold text-slate-800 flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: d.fill }}
                              />
                              {d.department}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">
                              {d.headcount}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-slate-900">
                              ₹{d.avgCtc.toFixed(1)} LPA
                            </td>
                            <td className="py-2.5 pl-3 text-right font-bold text-indigo-600">
                              {d.avgPerf > 0 ? `★ ${d.avgPerf}` : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Top-rated department updates automatically as records change</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('directory')}
                    className="font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    Manage Records →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: REST API CONSOLE & NETWORK REQUEST INSPECTOR               */}
        {/* ================================================================= */}
        {activeTab === 'api' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  REST API Activity Log & Endpoint Inspector
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Every Create (`POST`), Read (`GET`), Update (`PUT`/`PATCH`), and Delete (`DELETE`) action dispatches a typed REST operation recorded below.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSyncExternalRestApi}
                  disabled={isSyncingApi}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer disabled:opacity-50"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Trigger GET /users Sync
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setApiLogs([
                      {
                        id: 'REQ-INIT',
                        timestamp: new Date().toLocaleTimeString(),
                        method: 'GET',
                        endpoint: '/api/v1/employees',
                        status: 200,
                        latencyMs: 31,
                        summary: 'Log cleared — watching active REST operations'
                      }
                    ])
                  }
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  Clear Log
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {apiLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs flex flex-col gap-1.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.method === 'GET'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : log.method === 'POST'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : log.method === 'DELETE'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {log.method}
                      </span>
                      <span className="text-indigo-300 font-semibold break-all">
                        {log.endpoint}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="text-emerald-400 font-semibold">
                        HTTP {log.status}
                      </span>
                      <span>{log.latencyMs} ms</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-slate-300 font-sans text-xs">
                    {log.summary}
                  </p>
                  {log.payloadPreview && (
                    <pre className="text-[11px] text-slate-400 bg-slate-950/80 p-2 rounded-lg overflow-x-auto">
                      {log.payloadPreview}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* =================================================================== */}
      {/* CENTRALIZED EMPLOYEE PROFILE DRAWER MODAL                           */}
      {/* =================================================================== */}
      {inspectingEmployee && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${inspectingEmployee.avatarBg} text-white font-bold text-lg flex items-center justify-center shadow-sm`}
                  >
                    {inspectingEmployee.firstName[0]}
                    {inspectingEmployee.lastName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">
                        {inspectingEmployee.firstName}{' '}
                        {inspectingEmployee.lastName}
                      </h2>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                        {inspectingEmployee.id}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-indigo-600 mt-0.5">
                      {inspectingEmployee.role} • {inspectingEmployee.department}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectingEmployee(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Status Switcher (PATCH REST API) */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Quick Status Update (PATCH /api/v1/employees/{inspectingEmployee.id}/status)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {STATUS_OPTIONS.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() =>
                        handleQuickStatusChange(inspectingEmployee, st)
                      }
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        inspectingEmployee.status === st
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio & Summary */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Profile Overview
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                  {inspectingEmployee.bio}
                </p>
              </div>

              {/* Contact & Employment Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block mb-0.5">Work Email</span>
                  <span className="font-semibold text-slate-800 break-all flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    {inspectingEmployee.email}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block mb-0.5">Phone</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    {inspectingEmployee.phone}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block mb-0.5">Location</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    {inspectingEmployee.location}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block mb-0.5">
                    Annual Compensation
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    ₹{inspectingEmployee.salaryLpa.toFixed(1)} LPA
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block mb-0.5">Joining Date</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    {inspectingEmployee.joinDate}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block mb-0.5">
                    Reporting Manager
                  </span>
                  <span className="font-semibold text-slate-800">
                    {inspectingEmployee.manager}
                  </span>
                </div>
              </div>

              {/* Performance & Attendance Metrics */}
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    Performance Evaluation Rating
                  </span>
                  <span className="font-bold text-indigo-700">
                    {inspectingEmployee.performanceScore.toFixed(1)} / 5.0
                  </span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-indigo-100">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{
                      width: `${(inspectingEmployee.performanceScore / 5) * 100}%`
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-semibold text-slate-700">
                    Attendance & Sprint Reliability
                  </span>
                  <span className="font-bold text-emerald-700">
                    {inspectingEmployee.attendanceRate}% ({inspectingEmployee.projectsCompleted} projects delivered)
                  </span>
                </div>
              </div>

              {/* Technical & Functional Skills */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Verified Skills & Competencies
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {inspectingEmployee.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setDeleteTargetIds([inspectingEmployee.id])}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Delete Record
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInspectingEmployee(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => openEditModal(inspectingEmployee)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* ADD / EDIT EMPLOYEE CRUD MODAL                                      */}
      {/* =================================================================== */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold">
                  {editingEmployee
                    ? `Edit Employee Profile (${editingEmployee.id})`
                    : 'Add New Employee Record'}
                </h2>
                <p className="text-xs text-slate-400">
                  {editingEmployee
                    ? `PUT /api/v1/employees/${editingEmployee.id}`
                    : 'POST /api/v1/employees — Full TypeScript validation'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, firstName: e.target.value }))
                    }
                    placeholder="e.g. Divyarajsinh"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                  {formErrors.firstName && (
                    <p className="text-[11px] text-rose-600 mt-1">
                      {formErrors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, lastName: e.target.value }))
                    }
                    placeholder="e.g. Thakor"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                  {formErrors.lastName && (
                    <p className="text-[11px] text-rose-600 mt-1">
                      {formErrors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="name@workforce.io"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-rose-600 mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, phone: e.target.value }))
                    }
                    placeholder="+91 98250 00000"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Job Role / Title *
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, role: e.target.value }))
                    }
                    placeholder="e.g. Frontend Developer"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                  {formErrors.role && (
                    <p className="text-[11px] text-rose-600 mt-1">
                      {formErrors.role}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        department: e.target.value as Department
                      }))
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        status: e.target.value as EmployeeStatus
                      }))
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employment Type
                  </label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        employmentType: e.target.value as EmploymentType
                      }))
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500"
                  >
                    {EMPLOYMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, location: e.target.value }))
                    }
                    placeholder="e.g. Vadodara, GJ"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                  {formErrors.location && (
                    <p className="text-[11px] text-rose-600 mt-1">
                      {formErrors.location}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Annual CTC Package (₹ LPA) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.salaryLpa}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, salaryLpa: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                  {formErrors.salaryLpa && (
                    <p className="text-[11px] text-rose-600 mt-1">
                      {formErrors.salaryLpa}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Performance Score (1.0 – 5.0) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.performanceScore}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        performanceScore: e.target.value
                      }))
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                  {formErrors.performanceScore && (
                    <p className="text-[11px] text-rose-600 mt-1">
                      {formErrors.performanceScore}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Attendance Rate (0 – 100%) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.attendanceRate}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        attendanceRate: e.target.value
                      }))
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                  {formErrors.attendanceRate && (
                    <p className="text-[11px] text-rose-600 mt-1">
                      {formErrors.attendanceRate}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skillsInput}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, skillsInput: e.target.value }))
                  }
                  placeholder="React.js, TypeScript, CSS, REST API"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Profile Bio / Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, bio: e.target.value }))
                  }
                  placeholder="Brief summary of responsibilities and key deliverables..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  {editingEmployee ? 'Save Changes' : 'Create Employee Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* IN-PAGE DELETE CONFIRMATION MODAL                                   */}
      {/* =================================================================== */}
      {deleteTargetIds && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Confirm Record Deletion
                </h3>
                <p className="text-xs text-slate-500">
                  DELETE /api/v1/employees/{deleteTargetIds.length === 1 ? deleteTargetIds[0] : 'batch'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently remove{' '}
              <strong className="text-slate-900">
                {deleteTargetIds.length} employee record
                {deleteTargetIds.length > 1 ? 's' : ''}
              </strong>{' '}
              from the directory? Workforce analytics and department headcount charts will update immediately.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetIds(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteRecords}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
