import {genRespType, instance} from "./api";

export interface IUser {
    id: string;
    name: string;
    wishlist: Array<string>;
    shoppingList: Array<string>;
}
export const userAPI = {
    getUserByID(id: string){
        return instance.get<genRespType<IUser>>(`/user?id=${id}`, {},)
            .then(response => response.data)
    },
    getAllUsers(){
        return instance.get<genRespType<IUser[]>>(`users`, {},)
            .then(response => response.data)
    },
    addUser(name: string) {
        return instance.post<genRespType<IUser>>('/user', { name },)
            .then(response => response.data)
    },
    changeWishlist(userID: string, productID: string) {
        return instance.post<genRespType<IUser>>(`user/wishlist`, {userId: userID, productId: productID,},)
            .then(response => response.data)
    },
    changePurchase(userID: string, productID: string, isAdd: boolean) {
        return instance.post<genRespType<IUser>>(`user/shopping`, {userId: userID,productId: productID,isAdd,},)
            .then(response => response.data)
    },
}
