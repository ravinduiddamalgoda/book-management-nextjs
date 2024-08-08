// components/Navbar.js

import Link from 'next/link';
import styles from './Navbar.module.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import withAuth from '../auth/withAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/pages/auth/login'); // Redirect to login page after logout
  };
  return (
    <nav className={styles.navbar}>
     <div className={styles.left}>
     
     </div>
      <div className={styles.right}>
      {user ? (
        <div className={styles.userSection}>
          <p className={styles.username}>Welcome, {user.username}</p>
          {/* <Link href="/pages/auth/login" className={styles.link}>Login</Link>
        <Link href="/pages/auth/register" className={styles.link}>Register</Link> */}
          <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
        
      </div>      
    </nav>
  );
};

export default Navbar;
