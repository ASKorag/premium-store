export type TPage = 'wishlist' | 'shopping list';

type TTagAtrs = {
  classes: string[];
  id?: string;
};

export type TBtnAtrs = TTagAtrs & {
  text: string;
};
