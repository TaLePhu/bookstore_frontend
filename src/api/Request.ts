// export async function my_request(path: string, method: string = 'GET', body?: any) {
//     try {
//         const options: RequestInit = {
//             method,
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         };

//         if (body) {
//             options.body = JSON.stringify(body);
//         }

//         const response = await fetch(path, options);

//         if (!response.ok) {
//             const errorMessage = `❌ Lỗi ${response.status}: ${response.statusText}`;
//             console.error(errorMessage);
//             throw new Error(errorMessage);
//         }

//         return await response.json();
//     } catch (error) {
//         console.error('⚠️ Lỗi khi gửi request:', error);
//         throw error; // Ném lỗi để xử lý ở nơi gọi hàm
//     }
// }

export async function my_request(path: string, method: string = 'GET', body?: any) {
    try {
        // Lấy token từ localStorage (hoặc nơi bạn lưu trữ)
        const token = localStorage.getItem('token');

        console.log('Request path:', path); // Debug log
        console.log('Request method:', method); // Debug log
        console.log('Request token:', token); // Debug log

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Thêm token vào header nếu có
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        console.log('Request headers:', headers); // Debug log

        const options: RequestInit = {
            method,
            headers,
            mode: 'cors', // Thêm mode CORS
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(path, options);
        console.log('Response status:', response.status); // Debug log

        if (!response.ok) {
            const errorMessage = `❌ Lỗi ${response.status}: ${response.statusText}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('⚠️ Lỗi khi gửi request:', error);
        throw error;
    }
}

export async function phu_request(duongDan: string) {
    //truy van endpoint
    const response = await fetch(duongDan);

    if (!response.ok) {
        throw new Error(`không thể truy cập ${duongDan}`);
    }
    return response.json();
}
