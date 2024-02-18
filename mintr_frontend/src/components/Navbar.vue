<script setup>
import { RouterLink } from 'vue-router'
import WalletConnect from '@/components/WalletConnect.vue'
</script>

<template>
<nav class="navbar navbar-expand-lg bg-light">
  <div class="container justify-content-between">
    <div class="content-wrapper">
      <cite>
        <a href="https://icon-icons.com/icon/mint-leaf-plant-agriculture/220825">
          <img class="mintr-logo me-2" src="@/assets/mintr.svg" alt="Mintr logo. Author: https://blog.icon-icons.com/">
        </a>
      </cite>
      <RouterLink class="navbar-brand" :to="{ name: 'home' }">
          Mintr
      </RouterLink>
    </div>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav mx-auto btn-group" role="group" aria-label="Basic radio toggle button group">
        <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'marketplace-view' }">
                Buy
            </RouterLink>
        </li>
        <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'owned-view' }">
                Owned
            </RouterLink>
        </li>
        <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'mint-view' }">
                Mint
            </RouterLink>
        </li>
      </ul>
      <ul class="navbar-nav">
        <li class="nav-item">
            <WalletConnect />
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>
