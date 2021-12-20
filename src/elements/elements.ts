const $login = document.getElementById('login');
const $popup = document.getElementById('popupWrapper');

function countPadding() {
  const $headerHeight: number | undefined =
    document.querySelector('header')?.offsetHeight;
  const $main: HTMLElement | null = document.querySelector('main');
  if ($main) {
    $main.style.paddingTop = `${$headerHeight}px`;
  }
}

if (window.innerWidth < 720) {
  $login?.classList.add('login');
}

function load() {
  countPadding();
}

window.addEventListener('load', load);
window.addEventListener('resize', load);

