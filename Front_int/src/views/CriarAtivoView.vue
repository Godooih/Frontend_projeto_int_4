<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';


import CubeOutline from 'vue-material-design-icons/CubeOutline.vue';
import Domain from 'vue-material-design-icons/Domain.vue';
import BarcodeScan from 'vue-material-design-icons/BarcodeScan.vue';
import ShapeOutline from 'vue-material-design-icons/ShapeOutline.vue';
import TextShort from 'vue-material-design-icons/TextShort.vue';

const router = useRouter();


const nome = ref('');
const codigo = ref('');
const descricao = ref('');
const ambienteId = ref('');
const categoriaId = ref('');


const listaAmbientes = ref<any[]>([]);
const listaCategorias = ref<any[]>([]);
const loading = ref(false);


onMounted(async () => {
  try {

    const [resAmb, resCat] = await Promise.all([
      api.get('/environment/'),
      api.get('/category/')
    ]);


    listaAmbientes.value = resAmb.data.results || resAmb.data;
    listaCategorias.value = resCat.data.results || resCat.data;
  } catch (error) {
    console.error("Erro ao carregar listas:", error);
    alert("Não foi possível carregar ambientes e categorias.");
  }
});

const handleSubmit = async () => {
  try {
    loading.value = true;

    await api.post('/equipment/', {
      name: nome.value,
      code: codigo.value,
      description: descricao.value,
      environment_FK: ambienteId.value || null,
      category_FK: categoriaId.value || null
    });
    
    alert('Ativo cadastrado com sucesso!');
    router.push({ name: 'home' }); 
  } catch (error) {
    console.error(error);
    alert('Erro ao cadastrar o ativo. Verifique os dados.');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="criar-ativo-view">
    <div class="form-box">
      <h2>Criar novo ativo</h2>
      
      <form @submit.prevent="handleSubmit">
        
        <div class="form-group">
          <label for="nome">Nome do ativo</label>
          <div class="input-with-icon">
            <CubeOutline color="#888" />
            <input 
              type="text" 
              id="nome" 
              v-model="nome" 
              placeholder="Ex: Torno CNC 2000" 
              required
            >
          </div>
        </div>

        <div class="form-group">
          <label for="codigo">Código de Patrimônio/Série</label>
          <div class="input-with-icon">
            <BarcodeScan color="#888" />
            <input 
              type="text" 
              id="codigo" 
              v-model="codigo" 
              placeholder="Ex: PAT-00123" 
              required
            >
          </div>
        </div>
        
        <div class="form-group">
          <label for="ambiente">Ambiente</label>
          <div class="input-with-icon">
            <Domain color="#888" />
            <select id="ambiente" v-model="ambienteId">
              <option value="" disabled>Selecione o ambiente</option>
              <option v-for="amb in listaAmbientes" :key="amb.id" :value="amb.id">
                {{ amb.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="categoria">Categoria</label>
          <div class="input-with-icon">
            <ShapeOutline color="#888" />
            <select id="categoria" v-model="categoriaId">
              <option value="" disabled>Selecione a categoria</option>
              <option v-for="cat in listaCategorias" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="descricao">Descrição</label>
          <div class="input-with-icon textarea-container">
            <TextShort color="#888" class="icon-top" />
            <textarea 
              id="descricao" 
              v-model="descricao" 
              rows="3" 
              placeholder="Detalhes adicionais sobre o equipamento..."
              required
            ></textarea>
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Salvando...' : 'Cadastrar Ativo' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.criar-ativo-view {
  max-width: 700px;
  margin: 20px auto;
}

.form-box {
  background-color: #fff;
  padding: 40px;
  border-radius: 20px;
  border: 1px solid #e9eef2;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}

h2 {
  text-align: center;
  margin-bottom: 35px;
  color: #333;
  font-weight: 700;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

.input-with-icon {
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding-left: 15px;
  transition: border-color 0.3s, box-shadow 0.3s;
  background-color: #fff;
}

.input-with-icon:focus-within {
  border-color: #333;
  box-shadow: 0 0 0 3px rgba(0,0,0, 0.05);
}

.input-with-icon input,
.input-with-icon select,
.input-with-icon textarea {
  flex-grow: 1;
  border: none;
  outline: none;
  padding: 14px 12px;
  font-size: 1rem;
  background: none;
  color: #333;
  width: 100%;
}

/* Ajustes para Textarea */
.textarea-container {
  align-items: flex-start; /* Alinha ícone no topo */
}
.icon-top {
  margin-top: 14px;
}
textarea {
  resize: vertical;
  font-family: inherit;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 10px;
  background-color: #2ecc71;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 15px;
}

.submit-btn:hover {
  background-color: #27ae60;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>