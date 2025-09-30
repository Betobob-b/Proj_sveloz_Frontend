import {Link, useNavigate} from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { accessToken, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#eee' }}>
            <Link to="/">Dashboard</Link>
        
            {accessToken ? (
                <>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Registrar</Link>
                </>
            )}
        </nav>
    );
}

export default Navbar;