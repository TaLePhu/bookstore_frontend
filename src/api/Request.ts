export async function my_request(path: string, method: string = "GET", body?: any) {
    try {
        const options: RequestInit = {
            method,
            headers: {
                "Content-Type": "application/json",
            },
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
        console.error("⚠️ Lỗi khi gửi request:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
}
