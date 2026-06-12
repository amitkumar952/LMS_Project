import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetails from './pages/CourseDetails';
import Success from './pages/Success';
import Dashboard from './pages/Dashboard';
import Mentors from './pages/Mentors';
import Navbar from './components/Navbar';

// New system pages
import Profile from './pages/Profile';
import UserManagement from './pages/UserManagement';
import CouponManagement from './pages/CouponManagement';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';
import MockCheckout from './pages/MockCheckout';
import Presentation from './pages/Presentation';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<CourseCatalog />} />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/course/:id" element={<CourseDetails />} />
            <Route path="/success/:sessionId" element={<Success />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* New routes */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/coupons" element={<CouponManagement />} />
            <Route path="/create-course" element={<CreateCourse />} />
            <Route path="/edit-course/:id" element={<EditCourse />} />
            <Route path="/checkout/mock/:sessionId" element={<MockCheckout />} />
            {/* <Route path="/presentation" element={<Presentation />} /> */}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

