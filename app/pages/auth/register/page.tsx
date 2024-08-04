'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from "next/navigation";
import { REGISTER_USER_MUTATION } from '@/src/graphql/schema';
import gqlClientConnect from '@/src/config/apollo-client';
import styles from './page.module.css';

const RegisterPage: React.FC = () => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      email: '',
      phoneNo: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Must be at least 3 characters')
        .required('Username is required'),
      password: Yup.string()
        .min(8, 'Must be at least 8 characters')
        .required('Password is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      phoneNo: Yup.string()
        .matches(/^\d+$/, 'Must be only digits')
        .min(9, 'Must be at least 9 digits')
        .required('Phone number is required'),
    }),
    onSubmit: async (values) => {
      setSubmitError(null);
      try {
        const { data } = await gqlClientConnect().mutate({
          mutation: REGISTER_USER_MUTATION,
          variables: {
            registerInput: {
              username: values.username,
              password: values.password,
              email: values.email,
              phoneNo: parseInt(values.phoneNo, 9),
            },
          },
        });

        const username = await data.username;
        console.log('Registered user:', username);
        alert('Registration successful');
        router.push('/pages/auth/login');
        // Optionally, redirect to another page after successful registration
      } catch (error: any) {
        console.error(error?.message);
        setSubmitError(error?.message || 'Registration failed. Please try again.');
      }
    },
  });

  return (
    <form className={styles.authForm} onSubmit={formik.handleSubmit}>
      <h2 className={styles.title}>Register</h2>
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

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.email && formik.errors.email ? (
        <div className={styles.error}>{formik.errors.email}</div>
      ) : null}

      <input
        type="text"
        name="phoneNo"
        placeholder="Phone Number"
        value={formik.values.phoneNo}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.phoneNo && formik.errors.phoneNo ? (
        <div className={styles.error}>{formik.errors.phoneNo}</div>
      ) : null}

      {submitError && <div className={styles.error}>{submitError}</div>}

      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterPage;
