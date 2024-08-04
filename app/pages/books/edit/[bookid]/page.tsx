'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from '../../../../types/book';
import styles from './page.module.css';
import { GET_BOOK_QUERY, UPDATE_BOOK_MUTATION } from '@/src/graphql/schema';
import gqlClientConnect from '@/src/config/apollo-client';
import withAuth from '@/app/components/auth/withAuth';

interface EditBookPageProps {
  params: {
    bookid: string;
  };
}

const EditBookPage: React.FC<EditBookPageProps> = ({ params }) => {
  const { bookid } = params;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await gqlClientConnect().query({
          query: GET_BOOK_QUERY,
          variables: { id: parseInt(bookid) },
        });
        setBook(data.book);
      } catch (err) {
        console.error(err);
        // setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookid]);

  const handleUpdateBook = async () => {
    try {
      await gqlClientConnect().mutate({
        mutation: UPDATE_BOOK_MUTATION,
        variables: {
          updateBookInput: {
            id: book!.id,
            title: book!.title,
            author: book!.author,
            publishedYear: book!.publishedYear,
            genre: book!.genre,
          },
        },
      });
      alert('Book details updated');
      router.push(`/pages/books`);
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Failed to update book');
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (book) {
      handleUpdateBook();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading book data</div>;

  if (!book) {
    return <div className={styles.container}>Book not found</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Book Details</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Title:
          <input
            type="text"
            value={book.title}
            onChange={(e) => setBook({ ...book, title: e.target.value })}
            className={styles.input}
            required
          />
        </label>
        <label className={styles.label}>
          Author:
          <input
            type="text"
            value={book.author}
            onChange={(e) => setBook({ ...book, author: e.target.value })}
            className={styles.input}
            required
          />
        </label>
        <label className={styles.label}>
          Published Year:
          <input
            type="number"
            value={book.publishedYear}
            onChange={(e) => setBook({ ...book, publishedYear: parseFloat(e.target.value) })}
            className={styles.input}
            required
          />
        </label>
        <label className={styles.label}>
          Genre:
          <input
            type="text"
            value={book.genre}
            onChange={(e) => setBook({ ...book, genre: e.target.value })}
            className={styles.input}
            required
          />
        </label>
        <button type="submit" className={styles.submitButton}>Save Changes</button>
      </form>
    </div>
  );
};

export default withAuth(EditBookPage);
