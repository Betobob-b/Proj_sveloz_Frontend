import {Link, useNavigate} from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
    const { accessToken, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.navLinks}>
                {accessToken && <Link to="/">Meus Projetos</Link>}
            </div>
            
            <div className={styles.navLinks}>
                {accessToken ? (
                    <>
                        <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Registrar</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;