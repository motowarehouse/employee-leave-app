import EmployeeForm from '@/components/employees/EmployeeForm'

export default function NewEmployeePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#001A21' }}>Add Employee</h1>
        <p style={{ fontSize: 13, color: '#888888', marginTop: 2 }}>Create a new employee record</p>
      </div>
      <EmployeeForm />
    </div>
  )
}
