export interface IMenu {
    _id?: string | import("mongodb").ObjectId;
    name: string;
    recipe: string;
    image: string;
    category: string;
    price: number;
}
