export interface IAddEvent {
  (
    event: string,
    $element: HTMLElement,
    eventFunction: (...args: any[]) => void,
    once: boolean,
    params: any[],
  ): void;
}
