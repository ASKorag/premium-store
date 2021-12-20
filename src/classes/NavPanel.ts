/**
 * @module NavPanel
 */

/**
 * Класс для работы с навигационной панелью
 */

class NavPanel {
  /**
   * Метод для создания навигационной панели
   */

  static createMainNavContainer(): HTMLElement {
    const $mainNavContainer = document.createElement('div');
    $mainNavContainer.classList.add('main-nav-container');
    $mainNavContainer.innerHTML = `       
            <a class="main-nav-logo" href="https://worldoftanks.com/"></a>
            <nav class="main-nav-links">
                <a class="main-nav-link hash-link" href="#all" data-filter="All">all</a>
                <a class="main-nav-link hash-link" href="#vehicles" data-filter="Technique">vehicles</a>
                <a class="main-nav-link hash-link" href="#gold" data-filter="Gold">gold</a>
                <a class="main-nav-link hash-link" href="#premium" data-filter="Premium">premium account</a>
                <a class="main-nav-link hash-link" href="#provisions" data-filter="Provisions">Consumables</a>
            </nav>       
    `;
    return $mainNavContainer;
  }

  /**
   * Метод для показа навигационной панели
   */

  static showMainNavContainer() {
    const $mainContainer: HTMLElement | null =
      document.getElementById('main-container-id');
    const $mainVisualContainer = document.createElement('div');
    $mainVisualContainer.id = 'main-visual-container';
    if ($mainContainer) {
      $mainContainer.innerHTML = '';
      $mainContainer.append(this.createMainNavContainer());
      $mainContainer.append($mainVisualContainer);
    }
  }
}

export default NavPanel;
