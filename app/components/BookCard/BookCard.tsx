import Link from 'next/link';
import styles from './BookCard.module.css';
import { Book } from '../../types/book';
import { ClassNames } from '@emotion/react';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  return (
    <div className={styles.card}>
      <h3>{book.title}</h3>
      <p>{book.author}</p>
      <div className={styles.options}>
        <Link href={`/pages/books/${book.id}`} className={styles.link}>
          View
        </Link>
      </div>
    </div>
  );
};

export default BookCard;
