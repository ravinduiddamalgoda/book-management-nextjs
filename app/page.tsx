'use client';

import Link from 'next/link';
import Navbar from './components/Navbbar/Navbar';
import styles from './page.module.css';
import React from 'react';
import { useRouter } from 'next/navigation';
import withAuth from './components/auth/withAuth';
import { useAuth } from '@/src/context/AuthContext';

const Home: React.FC = () => {

  return (
    <div className={styles.main_class}>
      <Navbar />
     
      <h1 className={styles.title}>Book Management System</h1>
      <section className={styles.linklist}>
        <Link href="/pages/books/add" className={styles.link}>Add Book</Link>
        <Link href="/pages/books" className={styles.link}>View Books</Link>
      </section>
    </div>
  );
};

export default withAuth(Home);
