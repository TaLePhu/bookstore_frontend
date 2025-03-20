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
    
    for(const key in responseData) {
        result.push({
            bookId: responseData[key].bookId,
            bookName: responseData[key].bookName,
            authorName: responseData[key].authorName,
            description: responseData[key].description,
            isbn: responseData[key].isbn,
            averageRating: responseData[key].averageRating,
            listedPrice: responseData[key].listedPrice,
            quantity: responseData[key].quantity,
            salePrice: responseData[key].salePrice,

        });
    }

    return result;
}