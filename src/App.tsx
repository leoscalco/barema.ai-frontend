import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Validation from './pages/Validation'
import Edicts from './pages/Edicts'
import Profile from './pages/Profile'

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="upload" element={<Upload />} />
          <Route path="validation" element={<Validation />} />
          <Route path="edicts" element={<Edicts />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </UserProvider>
  )
}

export default App
