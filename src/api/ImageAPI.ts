import ImageModel from '../models/ImageModel';
import { my_request } from './Request';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_DIMENSION = 1920; // Max width/height in pixels

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

        // Kiểm tra xem dữ liệu trả về có phải là mảng hay không
        if (Array.isArray(responseData)) {
            responseData.forEach((image) => {
                // Kiểm tra và xử lý từng đối tượng hình ảnh
                if (image.imageId && image.imageData) {
                    result.push({
                        imageId: image.imageId,
                        imageName: image.imageName || '',
                        isIcon: image.isIcon || false,
                        path: image.path || '',
                        imageData: image.imageData,
                    });
                }
            });
        }
    } catch (error) {
        console.error('Lỗi khi lấy hình ảnh:', error);
    }

    return result;
}

export async function deleteImage(imageId: number): Promise<boolean> {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found');
            return false;
        }

        const response = await fetch(`http://localhost:8080/images/${imageId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('Delete failed with status:', response.status);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error deleting image:', error);
        return false;
    }
}

async function compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions while maintaining aspect ratio
                if (width > height && width > MAX_IMAGE_DIMENSION) {
                    height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
                    width = MAX_IMAGE_DIMENSION;
                } else if (height > MAX_IMAGE_DIMENSION) {
                    width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
                    height = MAX_IMAGE_DIMENSION;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                // Convert to blob with reduced quality
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        } else {
                            reject(new Error('Failed to compress image'));
                        }
                    },
                    'image/jpeg',
                    0.7 // Quality: 0.7 = 70%
                );
            };
            img.onerror = () => reject(new Error('Failed to load image'));
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
    });
}

export async function uploadImage(bookId: number, imageFile: File, isIcon: boolean = false): Promise<boolean> {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found');
            return false;
        }

        // Validate file size
        if (imageFile.size > MAX_FILE_SIZE) {
            console.log('Image too large, compressing...');
            try {
                imageFile = await compressImage(imageFile);
                console.log('Compressed image size:', imageFile.size);
            } catch (error) {
                console.error('Failed to compress image:', error);
                return false;
            }
        }

        // Lấy danh sách ảnh hiện tại của sách
        const currentImages = await getAllImage(bookId);
        
        // Xóa các ảnh cũ không phải icon (nếu đang upload ảnh chính)
        // hoặc xóa các ảnh icon (nếu đang upload ảnh icon)
        for (const image of currentImages) {
            if ((!isIcon && !image.isIcon) || (isIcon && image.isIcon)) {
                await deleteImage(image.imageId);
            }
        }

        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('bookId', bookId.toString());
        formData.append('isIcon', isIcon.toString());

        const response = await fetch('http://localhost:8080/images/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload failed with status:', response.status);
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const responseData = await response.json();
        console.log('Upload response:', responseData);
        
        if (!responseData.imageData) {
            console.error('No image data in response');
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error uploading image:', error);
        return false;
    }
}
