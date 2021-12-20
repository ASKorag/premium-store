export type TRouteCallback = (...args: any[]) => void;

/**
 * @param hash hash route
 * @param title title of browser tab
 * @param callback callback function for route
 * @param isCalled indicator whether this route has been called
 */

export type THRoute = {
  hash: string;
  title: string;
  callback: TRouteCallback;
  isCalled: boolean;
};
