'use client';
import { notFound, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { Book } from '../../../types/book';
import Link from 'next/link';

import { DELETE_BOOK_MUTATION, GET_BOOK_QUERY, GET_BOOKS_QUERY } from '@/src/graphql/schema';
import gqlClientConnect from '@/src/config/apollo-client';
import withAuth from '@/app/components/auth/withAuth';

interface BookDetailsPageProps {
  params: {
    bookid: string;
  };
}

const BookDetailsPage: React.FC<BookDetailsPageProps> = ({ params }) => {
  const { bookid } = params;
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
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
        // setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookid]);

  // const handleDelete = async () => {
  //   const confirmed = window.confirm('Are you sure you want to delete this book?');
  //   if (confirmed) {
  //     try {
  //       await gqlClientConnect().mutate({
  //         mutation: DELETE_BOOK_MUTATION,
  //         variables: { id: parseInt(bookid) },
  //       });
  //       alert('Book deleted');
  //       router.push('/books');
  //     } catch (error) {
  //       console.error('Error deleting book:', error);
  //       alert('Failed to delete book');
  //     }
  //   }
  // };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading book data</div>;

  if (!book) {
    return <div className={styles.container}>Book not found</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{book.title}</h1>
      <p className={styles.author}>Author: {book.author}</p>
      <p className={styles.year}>Published Year: {book.publishedYear}</p>
      <p className={styles.genre}>Genre: {book.genre}</p>
      <div className={styles.buttons}>
        <Link href={`/pages/books/edit/${book.id}`} className={styles.editButton}>
          Edit
        </Link>
        {/* <button onClick={handleDelete} className={styles.deleteButton}>
          Delete
        </button> */}
      </div>
    </div>
  );
};

export default withAuth(BookDetailsPage);
