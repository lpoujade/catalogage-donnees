<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { logout, user } from "$lib/stores/auth";
  import paths from "$lib/paths";
  import { Maybe } from "$lib/util/maybe";

  type NavItem = {
    label: string;
    href: string;
  };

  const navigationItems: NavItem[] = [
    {
      label: "Accueil",
      href: paths.home,
    },
    {
      label: "Rechercher",
      href: paths.datasetSearch,
    },
    {
      label: "Contribuer",
      href: paths.contribute,
    },
  ];

  $: path = $page.url.pathname;

  const onClickLogout = async () => {
    logout();
    await goto("/login");
  };
</script>

<header role="banner" class="fr-header">
  <div class="fr-header__body">
    <div class="fr-container">
      <div class="fr-header__body-row">
        <div class="fr-header__brand fr-enlarge-link">
          <div class="fr-header__brand-top">
            <div class="fr-header__logo">
              <p class="fr-logo">
                Catalogage
                <br />des
                <br />données
              </p>
            </div>
            <div class="fr-header__navbar">
              <button
                class="fr-btn--menu fr-btn"
                data-fr-opened="false"
                aria-controls="modal-menu"
                aria-haspopup="menu"
                title="Menu"
                id="fr-btn-menu-mobile"
              >
                Menu
              </button>
            </div>
          </div>
          <div class="fr-header__service">
            <a
              href={paths.home}
              title="Accueil - Catalogue Interministériel des Données"
            >
              <p class="fr-header__service-title">
                Catalogue Interministériel des Données
              </p>
            </a>
          </div>
        </div>
        <div class="fr-header__tools">
          <div class="fr-header__tools-links">
            {#if Maybe.Some($user)}
              <p>
                {$user.email}
              </p>
              <ul class="fr-links-group">
                <li>
                  <button
                    class="fr-link fr-link--icon-left fr-fi-logout-box-r-line"
                    on:click={onClickLogout}
                  >
                    Déconnexion
                  </button>
                </li>
              </ul>
            {:else}
              <ul class="fr-links-group">
                <li>
                  <a href={paths.login} class="fr-link" title="Se connecter">
                    Se connecter
                  </a>
                </li>
              </ul>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="fr-header__menu fr-modal"
    id="modal-menu"
    data-fr-js-modal="true"
    data-fr-js-header-modal="true"
  >
    <div class="fr-container">
      <button
        class="fr-link--close fr-link"
        aria-controls="modal-menu"
        data-fr-js-modal-button="true">Fermer</button
      >

      <div class="fr-header__menu-links" />

      {#if Maybe.Some($user)}
        <nav
          class="fr-nav"
          role="navigation"
          aria-label="Menu principal"
          id="header-navigation"
          data-fr-js-navigation="true"
        >
          <ul class="fr-nav__list">
            {#each navigationItems as { label, href }}
              <li class="fr-nav__item" data-fr-js-navigaton-item="true">
                <a
                  {href}
                  class="fr-nav__link"
                  aria-current={href === path ? "page" : undefined}
                >
                  {label}
                </a>
              </li>
            {/each}
          </ul>
        </nav>
      {/if}
    </div>
  </div>
</header>

<style>
  header {
    overflow-x: hidden; /* Prevent beta banner from overflowing */
  }

  header::after {
    /* Beta corner banner */
    position: absolute;
    float: right;
    top: 1.5em;
    right: -3em;
    padding: 0.5em 3em;
    transform: rotate(45deg);
    background-color: var(--background-action-low-pink-tuile);
    content: "Version bêta";
  }
</style>
