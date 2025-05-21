import { my_request } from './Request';

export interface Order {
    orderId: number;
    createdDate: string;
    billingAddress: string;
    shippingAddress: string;
    totalProductPrice: number;
    shippingFee: number;
    paymentFee: number;
    totalPrice: number;
    email: string;
    phoneNumber: string;
    confirmed: boolean;
    orderDate: string;
    deliveryDate: string;
    user: {
        userId: number;
        firstName: string;
        lastName: string;
    };
    paymentMethod: {
        paymentMethodId: number;
        paymentMethodName: string;
    };
    shippingMethod: {
        shippingMethodId: number;
        shippingMethodName: string;
    };
    orderDetails: {
        orderDetailId: number;
        quantity: number;
        salePrice: number;
        book: {
            bookId: number;
            bookName: string;
        };
    }[];
}

export async function getAllOrders(): Promise<Order[]> {
    try {
        const response = await my_request('http://localhost:8080/admin/orders');
        return response;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}

export async function getOrderById(orderId: number): Promise<Order> {
    try {
        const response = await my_request(`http://localhost:8080/admin/orders/${orderId}`);
        return response;
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
}

export async function updateOrder(orderId: number, orderData: Partial<Order>): Promise<Order> {
    try {
        const response = await my_request(`http://localhost:8080/admin/orders/${orderId}`, 'PUT', orderData);
        return response;
    } catch (error) {
        console.error('Error updating order:', error);
        throw error;
    }
}

export async function deleteOrder(orderId: number): Promise<boolean> {
    try {
        await my_request(`http://localhost:8080/admin/orders/${orderId}`, 'DELETE');
        return true;
    } catch (error) {
        console.error('Error deleting order:', error);
        return false;
    }
}
