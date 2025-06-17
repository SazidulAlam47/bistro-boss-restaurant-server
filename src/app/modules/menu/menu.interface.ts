export interface IMenu {
    _id?: string;
    name: string;
    recipe: string;
    image: string;
    category: string;
    price: number;
    createdAt?: Date;
    updatedAt?: Date;
}
