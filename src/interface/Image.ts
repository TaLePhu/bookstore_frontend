export interface Image {
    imageId: number;
    bookId?: number;
    imageName?: string;
    isIcon?: boolean;
    path?: string;
    imageData?: string | null;
}
export default Image;