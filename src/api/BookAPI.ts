import { serialize } from 'v8';
import Book from '../models/BookModel';
import { my_request, phu_request } from './Request';
import Category from '../models/Category';
// import { getCategoriesOfBook } from "./CategoryAPI";

//phu-add
interface ResultInterface {
    result: Book[];
    totalPages: number;
    totalBook: number;
}

interface ResultBookCategoryInterface {
    result: Book[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

/**
 *
 * @param link
 * @description Hàm này dùng để lấy danh sách sách từ server
 * @returns result: Danh sách sách, totalPages: Tổng số trang, totalBook: Tổng số sách
 * @author phu
 */
async function getBook(link: string): Promise<ResultInterface> {
    const result: Book[] = [];

    const res = await phu_request(link);

    const responseData = res._embedded?.books ?? res.content ?? [];
    const totalPages = res.page?.totalPages ?? res.totalPages ?? 0;
    const totalBook = res.page?.totalElements ?? res.totalElements ?? 0;

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
            sold: responseData[key].sold, 
                  

        });
    }

    console.log('📦 Dữ liệu trả về từ API:', responseData);

    return { result: result, totalPages: totalPages, totalBook: totalBook };
}

/*  
* author: phu
   @param trang: số trang cần lấy
    @description: Hàm này dùng để lấy danh sách sách từ server
    @return: Danh sách sách, tổng số trang, tổng số sách
*/
// export async function layToanBoSach(trang: number): Promise<ResultInterface> {
//     // Xác định endpoint
//     const duongDan: string = `http://localhost:8080/books?sort=bookId,desc&size=8&page=${trang}`;

//     return getBook(duongDan);
// }

export async function layToanBoSach(trang: number, size: number = 5): Promise<ResultInterface> {
    const duongDan: string = `http://localhost:8080/books?sort=bookId,desc&size=${size}&page=${trang}`;
    return getBook(duongDan);
}

/**
 *
 * @param searchKey
 * @description dùng lấy danh sách sách theo tên sách, mã thể loại
 * @returns result: Danh sách sách, totalPages: Tổng số trang, totalBook: Tổng số sách
 * @author phu
 * endpoint:http://localhost:8080/books/search/findByBookNameContainingAndCategories_CategoryId?categoryId=1&bookName=k
 * endpoint: http://localhost:8080/books/search/findByCategories_CategoryId?categoryId=1
 */
// export async function findBook(searchKey: string, categoryId: number): Promise<ResultInterface> {
//     // Xác định endpoint
//     let duongDan: string = `http://localhost:8080/books?desc&size=8&page=0`;

//     if (searchKey !== '' && categoryId === 0) {
//         duongDan = `http://localhost:8080/books/search/findByBookNameContaining?sort=bookId,desc&size=8&bookName=${searchKey}`;
//     }

//     if (searchKey === '' && categoryId > 0) {
//         duongDan = `http://localhost:8080/books/search/findByCategories_CategoryId?sort=bookId,desc&size=8&categoryId=${categoryId}`;
//     }

//     if (searchKey !== '' && categoryId > 0) {
//         duongDan = `http://localhost:8080/books/search/findByBookNameContainingAndCategories_CategoryId?sort=bookId,desc&size=8&categoryId=${categoryId}&bookName=${searchKey}`;
//     }

//     return getBook(duongDan);
// }
// export async function findBook(
//     searchKey: string,
//     categoryId: number,
//     trang: number = 0,
//     size: number = 5
// ): Promise<ResultInterface> {
//     let duongDan: string = `http://localhost:8080/books?sort=bookId,desc&size=${size}&page=${trang}`;

//     if (searchKey !== '' && categoryId === 0) {
//         duongDan = `http://localhost:8080/books/search/findByBookNameContaining?sort=bookId,desc&size=${size}&page=${trang}&bookName=${searchKey}`;
//     }

//     if (searchKey === '' && categoryId > 0) {
//         duongDan = `http://localhost:8080/books/search/findByCategories_CategoryId?sort=bookId,desc&size=${size}&page=${trang}&categoryId=${categoryId}`;
//     }

//     if (searchKey !== '' && categoryId > 0) {
//         duongDan = `http://localhost:8080/books/search/findByBookNameContainingAndCategories_CategoryId?sort=bookId,desc&size=${size}&page=${trang}&categoryId=${categoryId}&bookName=${searchKey}`;
//     }

//     return getBook(duongDan);
// }

export async function findBook(
    searchKey: string,
    categoryId: number,
    trang: number = 0,
    size: number = 5,
): Promise<ResultInterface> {
    let duongDan: string ;

    if (searchKey !== '' && categoryId === 0) {
        duongDan = `http://localhost:8080/books/search/by-keyword?keyword=${searchKey}&page=${trang}&size=${size}&sort=bookId,desc`;
    } else if (searchKey !== '' && categoryId > 0) {
        duongDan = `http://localhost:8080/books/search/by-category-and-keyword?keyword=${searchKey}&categoryId=${categoryId}&page=${trang}&size=${size}&sort=bookId,desc`;
    } else if (searchKey === '' && categoryId > 0){
        duongDan = `http://localhost:8080/books/search/findByCategories_CategoryId?sort=bookId,desc&size=${size}&page=${trang}&categoryId=${categoryId}`;  
    }
    else {
        // fallback nếu không có keyword
        duongDan = `http://localhost:8080/books?page=${trang}&size=${size}&sort=bookId,desc`;
    }

    return getBook(duongDan);
}


/**
 * Xóa một cuốn sách theo ID
 * @param bookId ID của cuốn sách cần xóa
 * @returns Promise<boolean> true nếu xóa thành công, false nếu thất bại
 */
export async function deleteBook(bookId: number): Promise<boolean> {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found');
            return false;
        }

        const response = await fetch(`http://localhost:8080/books/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Delete failed with status:', response.status);
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        return true;
    } catch (error) {
        console.error('Error deleting book:', error);
        return false;
    }
}

/**
 * Cập nhật thông tin một cuốn sách theo ID
 * @param bookId ID của cuốn sách cần cập nhật
 * @param bookData Dữ liệu cập nhật của cuốn sách
 * @returns Promise<boolean> true nếu cập nhật thành công, false nếu thất bại
 */
export async function updateBook(bookId: number, bookData: Book): Promise<boolean> {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found');
            return false;
        }

        console.log('Updating book with data:', bookData);
        const response = await fetch(`http://localhost:8080/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(bookData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Update failed with status:', response.status);
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const responseData = await response.json();
        console.log('Update successful. Response:', responseData);
        return true;
    } catch (error) {
        console.error('Error updating book:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            console.error('Error stack:', error.stack);
        }
        return false;
    }
}

/**
<<<<<<< HEAD
 * Lấy thông tin một cuốn sách theo ID
 * @param bookId ID của sách cần lấy
 * @returns BookModel nếu tìm thấy, null nếu lỗi
 */
export async function getBookById(bookId: number): Promise<Book | null> {
    try {
        const response = await fetch(`http://localhost:8080/books/${bookId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const book: Book = {
            bookId: data.bookId,
            bookName: data.bookName,
            authorName: data.authorName,
            isbn: data.isbn,
            description: data.description,
            listedPrice: data.listedPrice,
            salePrice: data.salePrice,
            quantity: data.quantity,
            averageRating: data.averageRating,
            supplier: data.supplier,
            numberOfPages: data.numberOfPages,
            publisher: data.publisher,
            sold: data.sold,
        };

        return book;
    } catch (error) {
        console.error('Lỗi khi lấy sách theo ID:', error);
        return null;
    }
}

/**
 * Tìm kiếm sách theo từ khóa và danh sách ID thể loại
 * @param searchKey Từ khóa tìm kiếm
 * @param categoryIds Danh sách ID thể loại
 * @param trang Số trang (mặc định là 0)
 * @param size Kích thước trang (mặc định là 5)
 * @returns Promise<ResultInterface> Kết quả tìm kiếm
 */


// export async function findBookCategory(
//     keyword: string,
//     categoryIds: number[],
//     page: number,
//     size: number
// ): Promise<ResultInterface> {
//     const params = new URLSearchParams();

//     if (keyword.trim() !== '') {
//         params.append('keyword', keyword);
//     }

//     categoryIds.forEach(id => params.append('categoryIds', id.toString()));
//     params.append('page', page.toString());
//     params.append('size', size.toString());

//     const duongDan = `http://localhost:8080/books/search?${params.toString()}`;
//      console.log("🌐 URL gửi tới BE:", duongDan);
//     return getBook(duongDan);
// }

export async function findBookCategory(
    keyword: string,
    categoryIds: number[],
    page: number,
    size: number,
): Promise<ResultInterface> {
    const params = new URLSearchParams();

    if (keyword.trim() !== '') {
        params.append('keyword', keyword);
    }

    categoryIds.forEach((id) => params.append('categoryIds', id.toString()));
    params.append('page', page.toString());
    params.append('size', size.toString());

    const duongDan = `http://localhost:8080/books/search?${params.toString()}`;
    return getBook(duongDan);
}
/* Thêm một cuốn sách mới
 * @param bookData Dữ liệu của cuốn sách cần thêm
 * @returns Promise<Book | null> Dữ liệu sách đã tạo nếu thành công, null nếu thất bại
 */
export async function createBook(bookData: Book): Promise<Book | null> {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found');
            return null;
        }

        console.log('Creating book with data:', bookData);
        const response = await fetch('http://localhost:8080/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(bookData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Create failed with status:', response.status);
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const responseData = await response.json();
        console.log('Create successful. Response:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error creating book:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            console.error('Error stack:', error.stack);
        }
        return null;
    }
}
