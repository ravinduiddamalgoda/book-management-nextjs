"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { Book } from "../../types/book";
import { GET_BOOKS_QUERY, DELETE_BOOK_MUTATION } from "@/src/graphql/schema";
import gqlClientConnect from "@/src/config/apollo-client";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Button,
} from "@mui/material";
import withAuth from "@/app/components/auth/withAuth";

const BookListPage: React.FC = () => {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await gqlClientConnect().query({
          query: GET_BOOKS_QUERY,
        });
        setBooks(res.data.books);
        setFilteredBooks(res.data.books);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch books");
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const filterBooks = () => {
      if (searchTerm) {
        setFilteredBooks(
          books.filter((book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      } else {
        setFilteredBooks(books);
      }
    };

    filterBooks();
  }, [searchTerm, books]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (book: Book) => {
    router.push(`/pages/books/${book.id}`);
  };

  const handleDelete = async (book: Book) => {
    try {
      await gqlClientConnect().mutate({
        mutation: DELETE_BOOK_MUTATION,
        variables: { id: book.id },
      });
      setBooks(books.filter((b) => b.id !== book.id));
      setFilteredBooks(filteredBooks.filter((b) => b.id !== book.id));
    } catch (err) {
      setError("Failed to delete book");
    }
  };

  const navigateHome = () => {
    router.push('/');
  };

  const navigateAddBook = () => {
    router.push('/pages/books/add');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>All Books</h1>

      <div className={styles.actions}>
        <Button
          variant="contained"
          color="secondary"
          onClick={navigateHome}
          className={styles.homeButton}
        >
          Home
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={navigateAddBook}
          className={styles.homeButton}
        >
          Add Book
        </Button>
      </div>

      <div className={styles.filters}>
        <TextField
          label="Search by Title"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchField}
          InputProps={{
            style: { color: "black" }, // Change the color as needed
          }}
          InputLabelProps={{
            style: { color: "gray" }, // Change label color if needed
          }}
        />
      </div>

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={styles.tableHeader}>Title</TableCell>
              <TableCell className={styles.tableHeader}>Author</TableCell>
              <TableCell className={styles.tableHeader}>Published Year</TableCell>
              <TableCell className={styles.tableHeader}>Genre</TableCell>
              <TableCell className={styles.tableHeader}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.publishedYear}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleEdit(book)}
                      variant="contained"
                      color="primary"
                      className={styles.actionButton}
                    >
                      View
                    </Button>
                    <Button
                      onClick={() => handleDelete(book)}
                      variant="contained"
                      color="error"
                      className={styles.actionButton}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBooks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className={styles.pagination}
        />
      </TableContainer>
    </div>
  );
};

export default withAuth(BookListPage);
