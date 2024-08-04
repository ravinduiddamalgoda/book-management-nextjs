'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import gqlClientConnect from '@/src/config/apollo-client';
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Box,
  Alert,
} from '@mui/material';

import styles from './page.module.css';
import { CREATE_BOOK_MUTATION } from '@/src/graphql/schema';
import withAuth from '@/app/components/auth/withAuth';

const AddBookPage: React.FC = () => {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [genre, setGenre] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newBook = {
      title,
      author,
      publishedYear: parseFloat(publishedYear), // Convert to Float
      genre
    };

    try {
      await gqlClientConnect().mutate({
        mutation: CREATE_BOOK_MUTATION,
        variables: { createBookInput: newBook } // Pass as `createBookInput`
      });
      router.push('/pages/books');
    } catch (err) {
      console.error('Error adding book:', err);
      setError('Failed to add book. Please try again.');
    }
  };

  const handleHome = () => {
    router.push('/');
  };

  return (
    <Container maxWidth="sm" className={styles.container}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button
          variant="contained"
          className={styles.homeBtn}
          onClick={handleHome}
        >
          Home
        </Button>
      </Box>
      <Typography variant="h4" component="h1" gutterBottom className={styles.title}>
        Add New Book
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Author"
              variant="outlined"
              fullWidth
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Published Year"
              variant="outlined"
              type="number"
              fullWidth
              value={publishedYear}
              onChange={(e) => setPublishedYear(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Genre"
              variant="outlined"
              fullWidth
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className={styles.submitButton}
              sx={{ backgroundColor: 'black', color: 'white' }}
            >
              Add Book
            </Button>
          </Grid>
        </Grid>
      </form>
      {error && <Alert severity="error" className={styles.error}>{error}</Alert>}
    </Container>
  );
};

export default withAuth(AddBookPage);
