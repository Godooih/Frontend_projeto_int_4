<script setup lang="ts">
import { useRoute, RouterLink } from 'vue-router';
// Importa os ícones
import CubeOutline from 'vue-material-design-icons/CubeOutline.vue';
import Domain from 'vue-material-design-icons/Domain.vue';
import ClockOutline from 'vue-material-design-icons/ClockOutline.vue'; // Ícone para o status

const route = useRoute();
const ativoId = route.params.id;

const ativo = {
  id: ativoId,
  nome: 'Torno CNC 2805',
  codigo: 'FP6X-01',
  local: 'Tornos - Célula A'
};

const historicoChamados = [
  { id: 1, titulo: 'Vazamento de óleo no Torno', ativo: 'Torno CNC 2805', status: 'aguardando', assetId: 1 }
];
</script>

<template>
  <div class="ativo-detalhes-view">
    <h2>Detalhes do ativo</h2>

    <div class="card ativo-info">
      <h3>{{ ativo.nome }}</h3>
      <p class="ativo-id">ID: {{ ativo.codigo }}</p>
      <div class="ativo-local">
        <Domain :size="20" />
        <span>{{ ativo.local }}</span>
      </div>
    </div>

    <h3>Histórico de chamados</h3>

    <div class="chamados-list">
      <RouterLink 
        v-for="chamado in historicoChamados" 
        :key="chamado.id" 
        :to="`/app/chamado/${chamado.id}`" 
        class="chamado-card-link"
      >
        <div class="chamado-card">
          <div class="chamado-header">
            <strong>Chamado #0{{ chamado.id }}</strong>
            <span class="status aguardando"><ClockOutline :size="14" /> Aguardando responsáveis</span>
          </div>
          <div class="chamado-body"><p>{{ chamado.titulo }}</p></div>
          <div class="chamado-footer">
            <CubeOutline :size="20" />
            <span>{{ chamado.ativo }}</span>
          </div>
        </div>
      </RouterLink>
    </div>

  </div>
</template>

<style scoped>
.ativo-detalhes-view {
  display: flex;
  flex-direction: column;
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  font-size: 1.8rem;
  color: #333;
}

h3 {
  font-size: 1.2rem;
  color: #555;
  margin: 0;
}

.card {
  background-color: #fff;
  padding: 25px;
  border-radius: 20px;
  border: 1px solid #e9eef2;
  box-shadow: 0 4px 8px rgba(0,0,0,0.03);
}

.ativo-info h3 {
  font-size: 1.5rem;
  margin: 0 0 5px 0;
}
.ativo-info .ativo-id {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 15px;
}
.ativo-info .ativo-local {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
  font-weight: 500;
}

.chamado-card-link {
  text-decoration: none;
  color: inherit;
}
.chamados-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.chamado-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
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
  gap: 6px;
}
.status.aguardando {
  background-color: #fcf1ce;
  color: #a07a10;
}
.chamado-body p {
  font-size: 1.05rem;
  margin: 0 0 12px 0;
  color: #333;
}
.chamado-footer {
  color: #777;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>