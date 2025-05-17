export async function my_request(path: string, method: string = 'GET', body?: any) {
    try {
        // Lấy token từ localStorage (hoặc nơi bạn lưu trữ)
        const token = localStorage.getItem('token');

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        };

        const options: RequestInit = {
            method,
            headers,
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(path, options);

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
