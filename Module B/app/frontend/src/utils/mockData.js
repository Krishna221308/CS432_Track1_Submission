/**
 * Mock data for admin dashboard
 * This data will be replaced with API calls to the backend
 * Attributes match the database schema exactly
 */

// Mock Orders Data - attributes: order_id, member_id, order_date, pickup_time, order_status, total_amount
export const mockOrders = [
  {
    order_id: 'ORD-001',
    member_id: 'MEM-001',
    order_date: '2025-03-10',
    pickup_time: '10:00 AM',
    order_status: 'completed',
    total_amount: 22.50,
  },
  {
    order_id: 'ORD-002',
    member_id: 'MEM-002',
    order_date: '2025-03-13',
    pickup_time: '02:00 PM',
    order_status: 'processing',
    total_amount: 45.00,
  },
  {
    order_id: 'ORD-003',
    member_id: 'MEM-003',
    order_date: '2025-03-14',
    pickup_time: '11:00 AM',
    order_status: 'pending',
    total_amount: 15.00,
  },
  {
    order_id: 'ORD-004',
    member_id: 'MEM-004',
    order_date: '2025-03-08',
    pickup_time: '03:00 PM',
    order_status: 'completed',
    total_amount: 30.00,
  },
  {
    order_id: 'ORD-005',
    member_id: 'MEM-005',
    order_date: '2025-03-11',
    pickup_time: '09:00 AM',
    order_status: 'processing',
    total_amount: 75.00,
  },
];

// Mock Payments Data - attributes: payment_id, order_id, payment_mode, payment_amount, payment_date
export const mockPayments = [
  {
    payment_id: 'PAY-001',
    order_id: 'ORD-001',
    payment_mode: 'credit_card',
    payment_amount: 22.50,
    payment_date: '2025-03-10',
  },
  {
    payment_id: 'PAY-002',
    order_id: 'ORD-002',
    payment_mode: 'debit_card',
    payment_amount: 45.00,
    payment_date: '2025-03-13',
  },
  {
    payment_id: 'PAY-003',
    order_id: 'ORD-003',
    payment_mode: 'cash',
    payment_amount: 15.00,
    payment_date: null,
  },
  {
    payment_id: 'PAY-004',
    order_id: 'ORD-004',
    payment_mode: 'credit_card',
    payment_amount: 30.00,
    payment_date: '2025-03-08',
  },
  {
    payment_id: 'PAY-005',
    order_id: 'ORD-005',
    payment_mode: 'upi',
    payment_amount: 75.00,
    payment_date: null,
  },
];

// Mock Feedbacks Data - attributes: feedback_id, member_id, order_id, rating, comments, feedback_date
export const mockFeedbacks = [
  {
    feedback_id: 'FB-001',
    member_id: 'MEM-001',
    order_id: 'ORD-001',
    rating: 5,
    comments: 'Excellent service! Very satisfied with the quality.',
    feedback_date: '2025-03-12',
  },
  {
    feedback_id: 'FB-002',
    member_id: 'MEM-002',
    order_id: 'ORD-002',
    rating: 4,
    comments: 'Good service but took a bit longer than expected.',
    feedback_date: '2025-03-13',
  },
  {
    feedback_id: 'FB-003',
    member_id: 'MEM-003',
    order_id: 'ORD-003',
    rating: 3,
    comments: 'Service was okay, but items could have been pressed better.',
    feedback_date: '2025-03-14',
  },
  {
    feedback_id: 'FB-004',
    member_id: 'MEM-004',
    order_id: 'ORD-004',
    rating: 5,
    comments: 'Outstanding! Fast delivery and great quality.',
    feedback_date: '2025-03-10',
  },
];

// Mock Members Data - attributes: member_id, member_name, email, phone, registration_date
export const mockMembers = [
  {
    member_id: 'MEM-001',
    member_name: 'Alice Roberts',
    email: 'alice.roberts@email.com',
    phone: '555-1001',
    registration_date: '2024-06-15',
  },
  {
    member_id: 'MEM-002',
    member_name: 'Bob Thompson',
    email: 'bob.thompson@email.com',
    phone: '555-1002',
    registration_date: '2024-08-20',
  },
  {
    member_id: 'MEM-003',
    member_name: 'Carol Martinez',
    email: 'carol.martinez@email.com',
    phone: '555-1003',
    registration_date: '2024-09-10',
  },
  {
    member_id: 'MEM-004',
    member_name: 'David Lee',
    email: 'david.lee@email.com',
    phone: '555-1004',
    registration_date: '2024-10-05',
  },
  {
    member_id: 'MEM-005',
    member_name: 'Emma White',
    email: 'emma.white@email.com',
    phone: '555-1005',
    registration_date: '2024-11-12',
  },
];

// Mock Employees Data - attributes: employee_id, employee_name, role, contact_number, joining_date
export const mockEmployees = [
  {
    employee_id: 'EMP-001',
    employee_name: 'Sarah Johnson',
    role: 'Laundry Specialist',
    contact_number: '555-0101',
    joining_date: '2024-01-15',
  },
  {
    employee_id: 'EMP-002',
    employee_name: 'David Chen',
    role: 'Delivery Agent',
    contact_number: '555-0102',
    joining_date: '2024-02-20',
  },
  {
    employee_id: 'EMP-003',
    employee_name: 'Maria Garcia',
    role: 'Quality Inspector',
    contact_number: '555-0103',
    joining_date: '2023-11-10',
  },
  {
    employee_id: 'EMP-004',
    employee_name: 'James Wilson',
    role: 'Manager',
    contact_number: '555-0104',
    joining_date: '2024-01-05',
  },
];

// Mock Lost Items Data - attributes: lost_id, order_id, item_description, reported_date, compensation_amount
export const mockLostItems = [
  {
    lost_id: 'LOST-001',
    order_id: 'ORD-001',
    item_description: 'Blue Cotton Shirt',
    reported_date: '2025-03-12',
    compensation_amount: 25.00,
  },
  {
    lost_id: 'LOST-002',
    order_id: 'ORD-003',
    item_description: 'Silk Tie (Black)',
    reported_date: '2025-03-11',
    compensation_amount: 75.00,
  },
  {
    lost_id: 'LOST-003',
    order_id: 'ORD-002',
    item_description: 'Wool Sweater',
    reported_date: '2025-03-13',
    compensation_amount: 50.00,
  },
];

// Mock Member Assignments Data - links members to employees for order handling
export const mockMemberAssignments = [
  {
    assignment_id: 'MEMASN-001',
    member_id: 'MEM-001',
    employee_id: 'EMP-001',
    assigned_date: '2025-03-01',
  },
  {
    assignment_id: 'MEMASN-002',
    member_id: 'MEM-002',
    employee_id: 'EMP-002',
    assigned_date: '2025-03-02',
  },
  {
    assignment_id: 'MEMASN-003',
    member_id: 'MEM-003',
    employee_id: 'EMP-001',
    assigned_date: '2025-03-03',
  },
  {
    assignment_id: 'MEMASN-004',
    member_id: 'MEM-004',
    employee_id: 'EMP-003',
    assigned_date: '2025-03-04',
  },
  {
    assignment_id: 'MEMASN-005',
    member_id: 'MEM-005',
    employee_id: 'EMP-002',
    assigned_date: '2025-03-05',
  },
];

// Mock Order Assignments Data - attributes: assignment_id, order_id, employee_id, assigned_role, assigned_date
export const mockOrderAssignments = [
  {
    assignment_id: 'ASS-001',
    order_id: 'ORD-001',
    employee_id: 'EMP-001',
    assigned_role: 'Laundry Handler',
    assigned_date: '2025-03-10',
  },
  {
    assignment_id: 'ASS-002',
    order_id: 'ORD-002',
    employee_id: 'EMP-002',
    assigned_role: 'Delivery Agent',
    assigned_date: '2025-03-13',
  },
  {
    assignment_id: 'ASS-003',
    order_id: 'ORD-003',
    employee_id: 'EMP-001',
    assigned_role: 'Quality Inspector',
    assigned_date: '2025-03-14',
  },
  {
    assignment_id: 'ASS-004',
    order_id: 'ORD-004',
    employee_id: 'EMP-003',
    assigned_role: 'Laundry Handler',
    assigned_date: '2025-03-08',
  },
  {
    assignment_id: 'ASS-005',
    order_id: 'ORD-005',
    employee_id: 'EMP-002',
    assigned_role: 'Delivery Agent',
    assigned_date: '2025-03-11',
  },
];

// Mock utility functions for CRUD operations on local storage
const STORAGE_KEY_EMPLOYEES = 'freshwash_employees';

export const getEmployees = () => {
  const stored = localStorage.getItem(STORAGE_KEY_EMPLOYEES);
  return stored ? JSON.parse(stored) : mockEmployees;
};

export const saveEmployees = (employees) => {
  localStorage.setItem(STORAGE_KEY_EMPLOYEES, JSON.stringify(employees));
};

export const addEmployee = (employee) => {
  const employees = getEmployees();
  const newEmployee = {
    ...employee,
    employee_id: `EMP-${Date.now()}`,
  };
  employees.push(newEmployee);
  saveEmployees(employees);
  return newEmployee;
};

export const updateEmployee = (id, updates) => {
  const employees = getEmployees();
  const index = employees.findIndex((e) => e.employee_id === id);
  if (index !== -1) {
    employees[index] = { ...employees[index], ...updates };
    saveEmployees(employees);
  }
  return employees[index];
};

export const deleteEmployee = (id) => {
  const employees = getEmployees();
  const filtered = employees.filter((e) => e.employee_id !== id);
  saveEmployees(filtered);
};

// Helper functions for employee dashboard
export const getOrdersAssignedToEmployee = (employeeId) => {
  // Get orders from direct order assignments
  const orderAssignments = mockOrderAssignments.filter((a) => a.employee_id === employeeId);
  const directOrderIds = new Set(orderAssignments.map((a) => a.order_id));

  // Get orders from member assignments (all orders of assigned members)
  const memberAssignments = mockMemberAssignments.filter((a) => a.employee_id === employeeId);
  const assignedMemberIds = new Set(memberAssignments.map((a) => a.member_id));
  const memberOrderIds = new Set(
    mockOrders.filter((o) => assignedMemberIds.has(o.member_id)).map((o) => o.order_id)
  );

  // Combine both direct assignments and member-based assignments
  const allAssignedOrderIds = new Set([...directOrderIds, ...memberOrderIds]);
  return mockOrders.filter((o) => allAssignedOrderIds.has(o.order_id));
};

export const getPaymentsForAssignedOrders = (employeeId) => {
  const assignedOrders = getOrdersAssignedToEmployee(employeeId);
  const assignedOrderIds = new Set(assignedOrders.map((o) => o.order_id));
  return mockPayments.filter((p) => assignedOrderIds.has(p.order_id));
};

export const getFeedbacksForAssignedOrders = (employeeId) => {
  const assignedOrders = getOrdersAssignedToEmployee(employeeId);
  const assignedOrderIds = new Set(assignedOrders.map((o) => o.order_id));
  return mockFeedbacks.filter((f) => assignedOrderIds.has(f.order_id));
};

export const getLostItemsForAssignedOrders = (employeeId) => {
  const assignedOrders = getOrdersAssignedToEmployee(employeeId);
  const assignedOrderIds = new Set(assignedOrders.map((o) => o.order_id));
  return mockLostItems.filter((i) => assignedOrderIds.has(i.order_id));
};

// Helper functions for member-employee assignments
const STORAGE_KEY_MEMBER_ASSIGNMENTS = 'freshwash_member_assignments';

export const getMemberAssignments = () => {
  const stored = localStorage.getItem(STORAGE_KEY_MEMBER_ASSIGNMENTS);
  return stored ? JSON.parse(stored) : mockMemberAssignments;
};

export const saveMemberAssignments = (assignments) => {
  localStorage.setItem(STORAGE_KEY_MEMBER_ASSIGNMENTS, JSON.stringify(assignments));
};

export const assignMemberToEmployee = (memberId, employeeId) => {
  const assignments = getMemberAssignments();
  
  // Remove existing assignment for this member
  const filtered = assignments.filter((a) => a.member_id !== memberId);
  
  // Add new assignment
  const newAssignment = {
    assignment_id: `MEMASN-${Date.now()}`,
    member_id: memberId,
    employee_id: employeeId,
    assigned_date: new Date().toISOString().split('T')[0],
  };
  
  filtered.push(newAssignment);
  saveMemberAssignments(filtered);
  return newAssignment;
};

export const removeMemberAssignment = (memberId) => {
  const assignments = getMemberAssignments();
  const filtered = assignments.filter((a) => a.member_id !== memberId);
  saveMemberAssignments(filtered);
};

export const getAssignedMembersForEmployee = (employeeId) => {
  const assignments = getMemberAssignments();
  const assignedMemberIds = new Set(
    assignments.filter((a) => a.employee_id === employeeId).map((a) => a.member_id)
  );
  return mockMembers.filter((m) => assignedMemberIds.has(m.member_id));
};

export const getAssignedEmployeeForMember = (memberId) => {
  const assignments = getMemberAssignments();
  const assignment = assignments.find((a) => a.member_id === memberId);
  if (!assignment) return null;
  return mockEmployees.find((e) => e.employee_id === assignment.employee_id);
};
