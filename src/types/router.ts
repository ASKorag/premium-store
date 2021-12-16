export type TRouteCallback = (...args: any[]) => void;

/**
 * @param path relative path route
 * @param callback callback function for route
 * @param isCalled indicator whether this route has been called
 */

export type TRoute = {
  path: string;
  title: string;
  callback: TRouteCallback;
  isCalled: boolean;
};
