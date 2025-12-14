import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddChild from './pages/AddChild';
import Children from './pages/Children';
import Curriculum from './pages/Curriculum';
import Books from './pages/Books';
import Subjects from './pages/Subjects';
import Timetable from './pages/Timetable';
import ChildDetail from './pages/ChildDetail';
import ProtectedRoute from './components/ProtectedRoute';
import AuthenticatedLayout from './components/AuthenticatedLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Dashboard />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-child"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <AddChild />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-child/:id"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <AddChild />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/children"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Children />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/curriculum"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Curriculum />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Books />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subjects"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Subjects />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/timetable"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Timetable />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/child/:id"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <ChildDetail />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

