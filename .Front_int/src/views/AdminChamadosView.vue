<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';
import api from '@/services/api';

// Ícones
import Magnify from 'vue-material-design-icons/Magnify.vue';
import FilterVariant from 'vue-material-design-icons/FilterVariant.vue';
import CubeOutline from 'vue-material-design-icons/CubeOutline.vue';

// Estado
const chamados = ref<any[]>([]);
const loading = ref(true);
const termoPesquisa = ref('');
const translateStatus = (status: string) => {
  const map: Record<string, string> = {
    'OPEN': 'Aberto',
    'WAITING_ASSIGNEE': 'Aguardando',
    'ONGOING': 'Em andamento',
    'DONE': 'Concluído',
    'CLOSED': 'Fechado',
    'CANCELLED': 'Cancelado'
  };
  return map[status?.toUpperCase()] || status;
};

const getStatusClass = (status: string) => {
  const s = status?.toLowerCase();
  if (s === 'ongoing') return 'andamento';
  if (s === 'waiting_assignee' || s === 'open') return 'aguardando';
  if (s === 'done') return 'concluido';
  if (s === 'cancelled') return 'cancelado';
  return '';
};


const fetchChamados = async () => {
  try {
    loading.value = true;
    const response = await api.get('/tasks/');
    const data = response.data.results || response.data;
    
    chamados.value = data.map((task: any) => ({
      id: task.id,
      titulo: task.name,
      ativo: task.equipment_name || 'N/A',
      status: task.current_status,
      assetId: task.equipments_FK?.[0] || 0 
    }));
  } catch (error) {
    console.error("Erro ao carregar chamados:", error);
  } finally {
    loading.value = false;
  }
};

const chamadosFiltrados = computed(() => {
  if (!termoPesquisa.value) return chamados.value;
  
  const termo = termoPesquisa.value.toLowerCase();
  return chamados.value.filter(c => 
    c.titulo.toLowerCase().includes(termo) || 
    c.ativo.toLowerCase().includes(termo) ||
    translateStatus(c.status).toLowerCase().includes(termo)
  );
});

onMounted(() => {
  fetchChamados();
});
</script>

<template>
  <div class="admin-view">
    
    <div class="search-bar">
      <Magnify color="#888" />
      <input 
        type="text" 
        placeholder="Pesquisar por título, ativo ou status"
        v-model="termoPesquisa"
      >
      <button class="filter-button" title="Filtros avançados (Futuro)"><FilterVariant color="#555" /></button>
    </div>

    <div v-if="loading" class="loading">Carregando...</div>
    
    <div v-else class="chamados-list">
      <p v-if="chamadosFiltrados.length === 0" class="empty-msg">Nenhum chamado encontrado.</p>

      <RouterLink 
        v-for="chamado in chamadosFiltrados" 
        :key="chamado.id" 
        :to="`/app/chamado/${chamado.id}`" 
        class="chamado-card-link"
      >
        <div class="chamado-card">
          <div class="chamado-header">
            <strong>Chamado #0{{ chamado.id }}</strong>
            <span :class="['status', getStatusClass(chamado.status)]">
              {{ translateStatus(chamado.status) }}
            </span>
          </div>
          
          <div class="chamado-body">
            <p>{{ chamado.titulo }}</p>
          </div>
          
          <div class="chamado-footer">
            <CubeOutline :size="20" />
            <span class="asset-name">
              {{ chamado.ativo }}
            </span>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.chamado-card-link { text-decoration: none; color: inherit; }

.admin-view { display: flex; flex-direction: column; gap: 30px; max-width: 1200px; margin: 0 auto; }

.search-bar {
  display: flex; align-items: center; background-color: #fff; padding: 10px 20px;
  border-radius: 20px; border: 1px solid #e9eef2; box-shadow: 0 4px 8px rgba(0,0,0,0.03);
}
.search-bar input {
  flex-grow: 1; border: none; outline: none; margin: 0 15px; font-size: 1rem; background: none;
}
.filter-button { background: none; border: none; cursor: pointer; }

.chamados-list { display: flex; flex-direction: column; gap: 15px; }

.chamado-card {
  background-color: #fff; padding: 20px 25px; border-radius: 20px; border: 1px solid #e9eef2;
  box-shadow: 0 4px 8px rgba(0,0,0,0.03); transition: transform 0.2s, box-shadow 0.2s;
}
.chamado-card:hover { transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.06); }

.chamado-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.chamado-header strong { font-size: 1.1rem; color: #333; }

.status { padding: 5px 12px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; }
.status.aguardando { background-color: #fcf1ce; color: #a07a10; }
.status.andamento { background-color: #e0f2ff; color: #007bff; }
.status.cancelado { background-color: #ffe0e0; color: #d32f2f; }
.status.concluido { background-color: #d4edda; color: #155724; }

.chamado-body p { font-size: 1.05rem; margin: 0 0 12px 0; color: #333; }

.chamado-footer { color: #777; font-size: 0.9rem; display: flex; align-items: center; gap: 8px; }
.asset-name { font-weight: 500; }

.loading, .empty-msg { text-align: center; color: #888; margin-top: 20px; }
</style>