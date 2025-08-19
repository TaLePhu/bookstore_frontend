export interface Role {
    roleName: string;
}

export default interface UserModel {
    userId: number;
    lastName: string;
    firstName: string;
    username: string;
    email: string;
    phoneNumber: string;
    isActivated: boolean;
    roles: string[];
    password?: string;
} 