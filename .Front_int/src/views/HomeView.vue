<script setup lang="ts">
import { ref, onMounted } from 'vue'; // Importar onMounted
import { RouterLink } from 'vue-router';
import Magnify from 'vue-material-design-icons/Magnify.vue';
import FilterVariant from 'vue-material-design-icons/FilterVariant.vue';
import CubeOutline from 'vue-material-design-icons/CubeOutline.vue';
import api from '@/services/api';


const chamados = ref([]);


const fetchChamados = async () => {
  try {
    const response = await api.get('/tasks/');

    const tasks = response.data.results || response.data; 


    chamados.value = tasks.map((task: any) => ({
      id: task.id,
      titulo: task.name,                
      ativo: task.equipment_name,       
      status: task.current_status.toLowerCase(),
      assetId: task.equipments_FK?.[0] || 0 
    }));
  } catch (error) {
    console.error("Erro ao buscar chamados:", error);
  }
};


onMounted(() => {
  fetchChamados();
});
</script>

<template>
  <div class="home-view">
    <div class="chamados-list">
      <p v-if="chamados.length === 0" style="text-align:center; color:#888">
        Nenhum chamado encontrado.
      </p>

      <RouterLink 
        v-for="chamado in chamados" 
        :key="chamado.id" 
        :to="`/app/chamado/${chamado.id}`" 
        class="chamado-card-link"
      >
        <div class="chamado-card">
          <div class="chamado-header">
            <strong>Chamado #0{{ chamado.id }}</strong>
            <span v-if="chamado.status === 'open'" class="status aguardando">Aberto</span>
            <span v-if="chamado.status === 'waiting_assignee'" class="status aguardando">Aguardando</span>
            <span v-if="chamado.status === 'ongoing'" class="status andamento">Em andamento</span>
            <span v-if="chamado.status === 'done'" class="status concluido">Concluído</span>
          </div>
          <div class="chamado-body"><p>{{ chamado.titulo }}</p></div>
          
          <div class="chamado-footer">
            <CubeOutline :size="20" />
            <span class="asset-link">{{ chamado.ativo }}</span>
          </div>
        </div>
      </RouterLink>
    </div>
    
    </div>
</template>

<style scoped>

.chamado-card-link {
  text-decoration: none;
  color: inherit;
}
.asset-link {
  text-decoration: none;
  color: inherit;
}
.asset-link:hover {
  text-decoration: underline;
}

.home-view {
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}
.status-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.card {
  flex: 1;
  min-width: 180px;
  background-color: #fff;
  padding: 20px 25px;
  border-radius: 20px;
  border: 1px solid #e9eef2;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}
.card h1 {
  font-size: 2.5rem;
  margin: 0;
  color: #333;
  line-height: 1;
  margin-bottom: 5px;
}
.card span {
  color: #555;
  font-weight: 500;
  font-size: 0.95rem;
}
.search-bar {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 10px 20px;
  border-radius: 20px;
  border: 1px solid #e9eef2;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.03);
}
.search-bar input {
  flex-grow: 1;
  border: none;
  outline: none;
  margin: 0 15px;
  font-size: 1rem;
  background: none;
  color: #333;
}
.search-bar input::placeholder {
  color: #888;
}
.filter-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
}
.chamados-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.chamado-card {
  background-color: #fff;
  padding: 20px 25px;
  border-radius: 20px;
  border: 1px solid #e9eef2;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s ease, box-shadow 0.2s ease; /* Adicionado efeito hover */
}
.chamado-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.06);
}
.chamado-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.chamado-header strong {
  font-size: 1.1rem;
  color: #333;
}
.status {
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}
.status.aguardando {
  background-color: #fcf1ce;
  color: #a07a10;
}
.status.andamento {
  background-color: #e0f2ff;
  color: #007bff;
}

.status.concluido { 
  background-color: #d4edda; 
  color: #155724; 
}

.chamado-body p {
  font-size: 1.05rem;
  margin: 0;
  margin-bottom: 12px;
  color: #333;
}
.chamado-footer {
  color: #777;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px; /* Espaçamento entre o ícone e o texto do link */
}
.view-all-button {
  align-self: center;
  padding: 12px 30px;
  border-radius: 20px;
  border: 1px solid #e9eef2;
  background-color: #fff;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.03);
  color: #555;
}
.view-all-button:hover {
  background-color: #f8f8f8;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
}
</style>