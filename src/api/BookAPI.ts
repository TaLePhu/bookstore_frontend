import { log } from "console";
import Book from "../models/Book";
import { my_request } from "./Request";

export async function getAllBook(): Promise<Book[]> {
    const result: Book[] = [];

    //xác định endpoint
    const path: string = 'http://localhost:8080/books';

    // call method my_request
    const response = await my_request(path);

    //get json books
    const responseData = response._embedded.books;
    console.log(responseData);
    

    return result;
}