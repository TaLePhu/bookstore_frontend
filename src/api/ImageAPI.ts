import ImageModel from "../models/ImageModel";
import { my_request } from "./Request";


// export async function getAllImage(bookId: number): Promise<ImageModel[]> {
    
//     const result: ImageModel[] = [];

//     //xac dinh endpoint;
//     const path = `http://localhost:8080/books/${bookId}/list-images`;

//     const response = await my_request(path);

//     // console.log(response);
    
//     const responseData = response._embedded.images;

//     // console.log(responseData);
    
//     for(const key in responseData) {
//         result.push({
//             imageId: responseData[key].imageId,
//             imageName: responseData[key].imageName,
//             isIcon: responseData[key].isIcon,
//             path: responseData[key].path,
//             imageData: responseData[key].imageData
//         });
//     }


//     return result;
// }

// export async function getAllImage(bookId: number): Promise<ImageModel[]> {
//     const result: ImageModel[] = [];

//     // xác định endpoint
//     const path = `http://localhost:8080/books/${bookId}/list-images`;

//     try {
//         const response = await fetch(path);
//         const responseData = await response.json(); // Lấy dữ liệu từ API

//         const imageLinks = responseData._embedded.images;
//         for (const key in imageLinks) {
//             result.push({
//                 imageId: imageLinks[key].imageId,
//                 imageName: imageLinks[key].imageName,
//                 isIcon: imageLinks[key].isIcon,
//                 path: imageLinks[key].path,
//                 imageData: imageLinks[key].imageData,
//             });
//         }
//     } catch (error) {
//         console.error("Lỗi khi lấy hình ảnh:", error);
//     }

//     return result;
// }

export async function getAllImage(bookId: number): Promise<ImageModel[]> {
    const result: ImageModel[] = [];

    const path = `http://localhost:8080/books/${bookId}/images`;

    try {
        const response = await fetch(path);

        // Kiểm tra xem API có trả về dữ liệu hợp lệ không
        if (!response.ok) {
            throw new Error(`Lỗi API: ${response.statusText}`);
        }

        const responseData = await response.json();

        // Log toàn bộ responseData để kiểm tra
        console.log("Dữ liệu từ API:", responseData);

        // Kiểm tra xem dữ liệu trả về có phải là mảng hay không
        if (Array.isArray(responseData) && responseData.length > 0) {
            responseData.forEach(image => {
                // Kiểm tra và xử lý từng đối tượng hình ảnh
                if (image.imageId && image.imageName && image.path && image.imageData) {
                    result.push({
                        imageId: image.imageId,
                        imageName: image.imageName,
                        isIcon: image.isIcon,
                        path: image.path,
                        imageData: image.imageData,
                    });
                } else {
                    console.warn('Dữ liệu hình ảnh không hợp lệ', image);
                }
            });
        } else {
            throw new Error('Dữ liệu hình ảnh không có hoặc không hợp lệ.');
        }
    } catch (error) {
        console.error("Lỗi khi lấy hình ảnh:", error);
    }

    return result;
}

