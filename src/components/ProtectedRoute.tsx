// import { Navigate } from 'react-router-dom';

// interface ProtectedRouteProps {
//     children: React.ReactNode;
// }

// const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
//     const token = localStorage.getItem('token');
//     const user = localStorage.getItem('user');

//     if (!token || !user) {
//         return <Navigate to="/auth/dang-nhap" replace />;
//     }

//     const userData = JSON.parse(user);
//     if (userData.role !== 'ADMIN') {
//         return <Navigate to="/" replace />;
//     }

//     return <>{children}</>;
// };

// export default ProtectedRoute; 
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[]; // roles được phép truy cập
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
        return <Navigate to="/auth/dang-nhap" replace />;
    }

    const userData = JSON.parse(user);

    // Nếu có quy định allowedRoles → kiểm tra role
    if (allowedRoles && !allowedRoles.includes(userData.role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
