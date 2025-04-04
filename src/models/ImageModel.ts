class Image {
    imageId: number;
    imageName?: string;
    isIcon?: boolean;
    path?: string;
    imageData?: string;
    
    constructor(
        imageId: number,
        imageName: string,
        isIcon: boolean,
        path: string,
        imageData: string,
    ) {
        this.imageId = imageId;
        this.imageName = imageName;
        this.isIcon = isIcon;
        this.path = path;
        this.imageData = imageData;
    }

}

export default Image;