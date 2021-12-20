import { IUser } from '@type/user';
import { IProduct } from '@type/product';

export interface IUserLocalStorageData {
  data: IUser;
  dateAdded: number;
}

export interface IProductLocalStorageData {
  data: IProduct[];
  dateAdded: number;
}
export type TLocalData =
  | IUserLocalStorageData
  | IProductLocalStorageData
  | null;

export type TCurrency = '' | 'BYN' | 'RUB';
