import { gql } from '@apollo/client';

export const GET_BOOKS_QUERY = gql`
  query GetBooks {
    books {
      id
      title
      author
      publishedYear
      genre
    }
  }
`;



export const GET_USER_QUERY = gql`
  query GetUser($id: Int!) {
    user(id: $id) {
      id
      username
      email
    }
  }
`;

export const CREATE_BOOK_MUTATION = gql`
  mutation CreateBook($createBookInput: CreateBookInput!) {
    createBook(createBookInput: $createBookInput) {
      id
      title
      author
      publishedYear
      genre
    }
  }
`;



export const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser($registerInput: RegisterUserInput!) {
    register(registerInput: $registerInput) {
      username
    }
  }
`;

export const LOGIN_USER_MUTATION = gql`
  mutation LoginUser($loginInput: LoginUserInput!) {
    login(loginInput: $loginInput) {
      access_token
    }
  }
`;

export const GET_BOOK_QUERY = gql`
  query Book($id: Int!) {
    book(id: $id) {
      id
      title
      author
      publishedYear
      genre
    }
  }
`;

export const UPDATE_BOOK_MUTATION = gql`
  mutation UpdateBook($updateBookInput: UpdateBookInput!) {
    updateBook(updateBookInput: $updateBookInput) {
      id
      title
      author
      publishedYear
      genre
    }
  }
`;

export const DELETE_BOOK_MUTATION = gql`
  mutation RemoveBook($id: Int!) {
    removeBook(id: $id) {
      id
    }
  }
`;