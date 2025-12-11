import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import CadastroView from '../views/CadastroView.vue'
import MainLayout from '../layouts/MainLayout.vue'
import HomeView from '../views/HomeView.vue'
import AdminChamadosView from '../views/AdminChamadosView.vue'
import DetalheChamadoView from '../views/DetalheChamadoView.vue'
import AbrirChamadoView from '../views/AbrirChamadoView.vue'
import AtivoDetalhesView from '../views/AtivoDetalhesView.vue';
import CriarAtivoView from '../views/CriarAtivoView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/', 
      name: 'login', 
      component: LoginView 
    },
    { 
      path: '/cadastro', 
      name: 'cadastro', 
      component: CadastroView 
    },

    {
      path: '/app',
      component: MainLayout, 
      children: [
        {
          path: 'home',
          name: 'home',
          component: HomeView
        },
        {
   path: 'chamado/:id',
          name: 'detalhe-chamado',
          component: DetalheChamadoView
        },
        {
          path: 'admin/chamados',
          name: 'admin-chamados',
 component: AdminChamadosView
        },
        {
         path: 'novo-chamado',
          name: 'novo-chamado',
          component: AbrirChamadoView
        },
        
        {
          path: 'ativo/:id',
          name: 'detalhe-ativo',
         component: AtivoDetalhesView
        },

        {
          path: 'novo-ativo',
          name: 'novo-ativo',
          component: CriarAtivoView
        }
      ] 
    } 
  ] 
})

export default router