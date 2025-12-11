<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router';
import Home from 'vue-material-design-icons/Home.vue';
import ChartBar from 'vue-material-design-icons/ChartBar.vue';
import Cog from 'vue-material-design-icons/Cog.vue';
import PlusCircle from 'vue-material-design-icons/PlusCircle.vue';
import AccountCircle from 'vue-material-design-icons/AccountCircle.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <img src="@/assets/images/logo.png" alt="Nexus Tech Logo" class="sidebar-logo" />
      </div>

      <nav class="sidebar-nav">
        <RouterLink to="/app/home" class="nav-item"><Home :size="28" /></RouterLink>
        
        <RouterLink to="/app/admin/chamados" class="nav-item"><ChartBar :size="28" /></RouterLink>
        
        <RouterLink to="/app/novo-ativo" class="nav-item"><Cog :size="28" /></RouterLink>
      </nav>
      <div class="sidebar-footer">
        <RouterLink to="/app/novo-chamado" class="add-button">
          <PlusCircle :size="32" />
        </RouterLink>
      </div>
    </aside>

    <main class="main-content">
      <header class="main-header">
        <div class="user-info">
          <span>{{ userStore.name }}</span>
          <img v-if="userStore.photoUrl" :src="userStore.photoUrl" class="user-photo" alt="Foto do usuário">
          <AccountCircle v-else :size="32" />
        </div>
      </header>
      
      <div class="page-content">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>

.app-layout {
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: #f4f7fa;
  overflow: hidden;
}

/* --- Barra Lateral --- */
.sidebar {
  width: 80px;
  height: 100%;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}
.sidebar-header {
  margin-bottom: 40px;
}
.sidebar-logo {
  width: 40px;
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 25px;
}
.nav-item {
  color: #888;
  transition: color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nav-item:hover, .router-link-active {
  color: #1a73e8;
}
.sidebar-footer {
  margin-top: auto;
}
.add-button {
  background-color: #ffd700;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #333;
}

/* --- Área Principal --- */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.main-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 15px 30px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: #222222; 
  opacity: 1;      
}

.user-info span {
  color: #222222;
}
.user-photo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.page-content {
  padding: 30px;
  flex: 1;
}
</style>