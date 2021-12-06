import {genRespType, instance} from "./api";
import {IProduct} from "../type/typeProductApi";

export const productAPI = {
    getProductByID(id: string) {
        return instance.get<genRespType<IProduct>>(`/product?id=${id}`)
            .then(response => response.data)
    },
    getProductsByFilter(filter: string) {
        return instance.get<genRespType<IProduct[]>>(`/product/filter?filter=${filter}`)
            .then(response => response.data)
    },
    getProductsByList(listProductsID: string[]) {
        return instance.post<genRespType<IProduct[]>>('/products', {
            listProductsId: listProductsID,
        }).then(response => response.data)
    },
}
