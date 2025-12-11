<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api';

// Importando ícones
import CubeOutline from 'vue-material-design-icons/CubeOutline.vue';
import Domain from 'vue-material-design-icons/Domain.vue';
import AccountOutline from 'vue-material-design-icons/AccountOutline.vue';
import AccountGroupOutline from 'vue-material-design-icons/AccountGroupOutline.vue';
import AlertOutline from 'vue-material-design-icons/AlertOutline.vue';
import CalendarOutline from 'vue-material-design-icons/CalendarOutline.vue';
import ChevronLeft from 'vue-material-design-icons/ChevronLeft.vue';
import ChevronRight from 'vue-material-design-icons/ChevronRight.vue';
import CloseIcon from 'vue-material-design-icons/Close.vue';

const route = useRoute();
const chamadoId = route.params.id;


const task = ref<any>(null);
const timeline = ref<any[]>([]);
const loading = ref(true);
const showStatusModal = ref(false); 


const novoStatus = ref('ONGOING');
const novoComentario = ref('');


const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(date);
};

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

const translateUrgency = (urgency: string) => {
  const map: Record<string, string> = {
    'LOW': 'Baixa',
    'MEDIUM': 'Média',
    'HIGH': 'Alta',
    'EXTRA_HIGH': 'Crítica'
  };
  return map[urgency?.toUpperCase()] || urgency;
};

const getStatusClass = (status: string) => {
  const s = status?.toLowerCase();
  if (s === 'ongoing') return 'andamento';
  if (s === 'waiting_assignee') return 'aguardando';
  if (s === 'done') return 'concluido';
  if (s === 'cancelled') return 'cancelado';
  return '';
};


const getImageUrl = (path: string) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `http://127.0.0.1:8000${path}`;
};


const fetchTaskData = async () => {
  try {
    loading.value = true;

    const resTask = await api.get(`/tasks/${chamadoId}/`);
    task.value = resTask.data;

    const resTimeline = await api.get(`/tasks/status/?task_FK=${chamadoId}`);
    timeline.value = resTimeline.data.results || resTimeline.data;
  } catch (error) {
    console.error("Erro ao carregar chamado:", error);
    alert("Erro ao carregar detalhes do chamado.");
  } finally {
    loading.value = false;
  }
};

const updateStatus = async () => {
  try {
    await api.post('/tasks/status/', {
      task_FK: task.value.id,
      status: novoStatus.value,
      comment: novoComentario.value || 'Status atualizado pelo painel Web'
    });
    
    alert('Status atualizado com sucesso!');
    showStatusModal.value = false;
    novoComentario.value = '';

    fetchTaskData();
  } catch (error) {
    console.error(error);
    alert('Erro ao atualizar status.');
  }
};

onMounted(() => {
  fetchTaskData();
});
</script>

<template>
  <div class="detalhe-view" v-if="!loading && task">
    
    <div class="card chamado-header">
      <div class="header-info">
        <h2>Chamado #0{{ task.id }} - {{ task.name }}</h2>
        <span :class="['status', getStatusClass(task.current_status)]">
          {{ translateStatus(task.current_status) }}
        </span>
      </div>
      <div class="header-sub">
        <CubeOutline :size="20" color="#555" />
        <span>{{ task.equipment_name || 'Equipamento não identificado' }}</span>
      </div>
    </div>

    <div class="card descricao-galeria">
      <div class="descricao">
        <h3>Descrição do problema</h3>
        <p>{{ task.description }}</p>
      </div>
      
      <div class="galeria">
        <div class="foto-placeholder">
          <img 
            v-if="task.image" 
            :src="getImageUrl(task.image)" 
            alt="Foto do problema" 
            class="foto-chamado"
          />
          <div v-else class="sem-foto">
            <span>Sem foto anexada</span>
          </div>
        </div>
      </div>
    </div>

    <div class="detalhes-timeline">
      <div class="card detalhes">
        <h3>Informações</h3>
        <ul>
          <li><Domain /> <strong>Ambiente:</strong> {{ task.environment_name || 'N/A' }}</li>
          <li><AccountOutline /> <strong>Solicitante:</strong> {{ task.creator_FK?.name || 'Desconhecido' }}</li>
          <li>
            <AccountGroupOutline /> <strong>Responsáveis:</strong> 
            <span v-for="user in task.assignees_FK" :key="user.id">{{ user.name }} </span>
            <span v-if="!task.assignees_FK?.length">Nenhum</span>
          </li>
          <li><AlertOutline /> <strong>Urgência:</strong> {{ translateUrgency(task.urgency_level) }}</li>
          <li><CalendarOutline /> <strong>Abertura:</strong> {{ formatDate(task.creation_date) }}</li>
        </ul>
      </div>

      <div class="card timeline">
        <h3>Linha do tempo</h3>
        <ul>
          <li v-for="(item, index) in timeline" :key="item.id" 
              :class="['timeline-item', { active: index === timeline.length - 1 }]">
            <strong>{{ translateStatus(item.status) }}</strong>
            <p>{{ item.comment }}</p>
            <small>{{ item.user_FK?.name || 'Sistema' }} em {{ formatDate(item.status_date) }}</small>
          </li>
        </ul>
      </div>
    </div>
    
    <button class="update-status-btn" @click="showStatusModal = true">Atualizar status</button>

    <div v-if="showStatusModal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Atualizar Status</h3>
          <button @click="showStatusModal = false" class="close-btn"><CloseIcon /></button>
        </div>
        <div class="modal-body">
          <label>Novo Status:</label>
          <select v-model="novoStatus">
            <option value="ONGOING">Em andamento</option>
            <option value="WAITING_ASSIGNEE">Aguardando</option>
            <option value="DONE">Concluído</option>
            <option value="CANCELLED">Cancelado</option>
          </select>

          <label>Comentário:</label>
          <textarea v-model="novoComentario" rows="3" placeholder="Descreva o que foi feito..."></textarea>
        </div>
        <div class="modal-footer">
          <button @click="updateStatus" class="save-btn">Salvar</button>
        </div>
      </div>
    </div>

  </div>
  <div v-else class="loading-state">
    <p>Carregando informações do chamado...</p>
  </div>
</template>

<style scoped>
.detalhe-view { display: flex; flex-direction: column; gap: 25px; max-width: 1400px; margin: 0 auto; }
.card { background-color: #fff; padding: 25px; border-radius: 20px; border: 1px solid #e9eef2; box-shadow: 0 4px 8px rgba(0,0,0,0.03); }

.chamado-header .header-info { display: flex; align-items: center; gap: 15px; margin-bottom: 10px; }
.chamado-header h2 { font-size: 1.5rem; margin: 0; color: #333; }
.status { padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; background-color: #eee; color: #555; }
.status.andamento { background-color: #d1e7ff; color: #0d6efd; }
.status.concluido { background-color: #d4edda; color: #155724; }
.status.cancelado { background-color: #f8d7da; color: #721c24; }
.status.aguardando { background-color: #fff3cd; color: #856404; border: 1px solid #c3e6cb }

.header-sub { display: flex; align-items: center; gap: 8px; color: #555; font-weight: 500;}

.descricao-galeria { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
.descricao h3, .timeline h3, .detalhes h3 { margin-top: 0; margin-bottom: 15px; color: #444; }
.descricao p { color: #555; line-height: 1.6; }

.galeria { display: flex; justify-content: center; align-items: center; }
.foto-placeholder { 
  width: 100%; 
  height: 250px; 
  background-color: #f4f7fa; 
  border-radius: 15px; 
  overflow: hidden; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  border: 1px solid #e0e0e0;
}
.foto-chamado { width: 100%; height: 100%; object-fit: cover; }
.sem-foto { color: #aaa; font-weight: 500; }

.detalhes-timeline { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
.detalhes ul, .timeline ul { list-style: none; padding: 0; margin: 0; }
.detalhes li { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; color: #555; }
.detalhes li strong { color: #333; }

.timeline-item { position: relative; padding: 0 0 25px 25px; border-left: 2px solid #e9eef2; }
.timeline-item:last-child { border-left-color: transparent; }
.timeline-item::before { content: ''; width: 14px; height: 14px; background: #ccc; border-radius: 50%; position: absolute; left: -8px; top: 4px; border: 2px solid #fff; }
.timeline-item.active::before { background: #0d6efd; }
.timeline-item strong { display: block; margin-bottom: 5px; color: #333; }
.timeline-item p { margin: 0; margin-bottom: 5px; font-size: 0.95rem; color: #555;}
.timeline-item small { color: #888; font-size: 0.8rem; }

.update-status-btn { 
  align-self: center; 
  padding: 14px 40px; 
  border-radius: 30px; 
  border: none; 
  background-color: #F39C12; 
  color: white;
  cursor: pointer; 
  font-weight: bold; 
  font-size: 1rem;
  transition: background 0.3s;
}
.update-status-btn:hover { background-color: #e67e22; }

/* MODAL STYLES */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
}
.modal-card {
  background: white; padding: 30px; border-radius: 15px; width: 500px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.close-btn { background: none; border: none; cursor: pointer; }
.modal-body label { display: block; margin-bottom: 8px; font-weight: bold; color: #555; }
.modal-body select, .modal-body textarea {
  width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 8px;
}
.save-btn {
  width: 100%; padding: 12px; background: #2ecc71; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;
}
.save-btn:hover { background: #27ae60; }

.loading-state { text-align: center; margin-top: 50px; font-size: 1.2rem; color: #666; }

@media (max-width: 900px) {
  .descricao-galeria, .detalhes-timeline { grid-template-columns: 1fr; }
  .foto-placeholder { height: 200px; }
}
</style>