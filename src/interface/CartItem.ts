// types.ts
export interface CartItem {
    bookId: number;
    bookName: string;
    quantity: number;
    salePrice: number;
    stock: number; // số lượng còn lại
    image: string;
  }
  