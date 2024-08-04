'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from '@mui/material';
import {jwtDecode} from 'jwt-decode';
import { LOGIN_USER_MUTATION } from '@/src/graphql/schema';
import gqlClientConnect from '@/src/config/apollo-client';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Must be at least 3 characters')
        .required('Username is required'),
      password: Yup.string()
        .min(8, 'Must be at least 8 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      setSubmitError(null);
      try {
        const { data } = await gqlClientConnect().mutate({
          mutation: LOGIN_USER_MUTATION,
          variables: {
            loginInput: {
              username: values.username,
              password: values.password,
            },
          },
        });

        const token = data.login.access_token;
        console.log( token);
        localStorage.setItem('token', token);

        const decodedUser = jwtDecode(token);
        console.log('User logged in:', decodedUser);
        alert('Login successful!');
        window.location.href = '/'; 
        // Optionally, redirect to another page after successful login
      } catch (error: any) {
        setSubmitError(error?.message || 'Login failed. Please try again.');
        console.log(error?.message);
      }
    },
  });

  return (
    <div className={styles.container}>
      <form className={styles.authForm} onSubmit={formik.handleSubmit}>
        <h2 className={styles.title}>Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.username && formik.errors.username ? (
          <div className={styles.error}>{formik.errors.username}</div>
        ) : null}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password ? (
          <div className={styles.error}>{formik.errors.password}</div>
        ) : null}

        {submitError && <div className={styles.error}>{submitError}</div>}

        <button type="submit">Login</button>
        <Link href="/pages/auth/register" underline="hover" className={styles.linkStyle}>New user? Click here to Register</Link>
      </form>
    </div>
  );
};

export default LoginPage;
