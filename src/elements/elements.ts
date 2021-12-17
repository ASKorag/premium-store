window.addEventListener('load', countPadding);
window.addEventListener('resize', countPadding);

function countPadding() {
    const $headerHeight: number | undefined = document.querySelector('header')?.offsetHeight;
    const $main: HTMLElement | null = document.querySelector('main');
    if ($main) {
        $main.style.paddingTop = `${$headerHeight}px`;
    }
}