import './StudentTable.scss'
import React from 'react'

const StudentTable = () => {
  return (
    <div className='student-table'>
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Lead ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>User ID</th>
            <th>DOB</th>
            <th>Address</th>
            <th>Enroll Status</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>201</td>
                <td>John</td>
                <td>Doe</td>
                <td>john@example.com</td>
                <td>1234567890</td>
                <td>101</td>
                <td>1990-01-01</td>
                <td>123 Main St, Anytown, USA</td>
                <td>Enrolled</td>
                <td>2021-01-01</td>
                <td>2021-01-01</td>
                <td>
                    <button><i class="ri-edit-fill"></i></button>
                    <button><i class="ri-delete-bin-line"></i></button>
                </td>
            </tr>
            <tr>
                <td colSpan="13">No customers found</td>
            </tr>
        </tbody>
      </table>
    </div>
  )
}

export default StudentTable