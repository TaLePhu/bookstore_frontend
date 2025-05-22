import { my_request } from './Request';
import BookModel from '../models/BookModel';

interface SearchResult {
    result: BookModel[];
    totalPages: number;
    totalBook: number;
}

/**
 * Tìm kiếm sách với từ khóa gần đúng
 * @param keyword Từ khóa tìm kiếm
 * @param page Số trang
 * @param size Số lượng sách mỗi trang
 * @returns Kết quả tìm kiếm bao gồm danh sách sách, tổng số trang và tổng số sách
 */
export async function searchProducts(
    keyword: string,
    page: number = 0,
    size: number = 5
): Promise<SearchResult> {
    const result: BookModel[] = [];
    
    // Endpoint tìm kiếm
    const endpoint = `http://localhost:8080/books/search/by-keyword?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}&sort=bookId,desc`;
    
    try {
        const response = await my_request(endpoint);
        
        // Xử lý dữ liệu trả về
        const responseData = response._embedded?.books ?? response.content ?? [];
        const totalPages = response.page?.totalPages ?? response.totalPages ?? 0;
        const totalBook = response.page?.totalElements ?? response.totalElements ?? 0;

        // Chuyển đổi dữ liệu thành BookModel
        for (const key in responseData) {
            result.push({
                bookId: responseData[key].bookId,
                bookName: responseData[key].bookName,
                authorName: responseData[key].authorName,
                isbn: responseData[key].isbn,
                description: responseData[key].description,
                listedPrice: responseData[key].listedPrice,
                salePrice: responseData[key].salePrice,
                quantity: responseData[key].quantity,
                averageRating: responseData[key].averageRating,
                supplier: responseData[key].supplier,
                numberOfPages: responseData[key].numberOfPages,
                publisher: responseData[key].publisher,
                sold: responseData[key].sold
            });
        }

        return {
            result: result,
            totalPages: totalPages,
            totalBook: totalBook
        };
    } catch (error) {
        console.error('Error searching products:', error);
        return {
            result: [],
            totalPages: 0,
            totalBook: 0
        };
    }
} 