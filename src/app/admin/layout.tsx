import AdminLayout from '@/_components/admin/AdminLayout'
import ManageProducts from '@/_components/admin/ManageProducts'
import ManageUsers from '@/_components/admin/ManageUsers'
import React from 'react'

function layout() {
  return (
    <div>
      <AdminLayout/>
      <ManageProducts/>
      <ManageUsers/>
    </div>
  )
}

export default layout