export async function my_request(path: string) {
    // truy cập đến đường dẫn
    const response = await fetch(path);

    if(!response.ok) {
        throw new Error(`failt to fetch${path}`);
    }

    return response.json();
}

