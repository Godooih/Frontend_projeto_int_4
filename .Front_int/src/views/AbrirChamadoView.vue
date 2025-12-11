<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CloudUploadOutline from 'vue-material-design-icons/CloudUploadOutline.vue';
import api from '@/services/api';

const router = useRouter();


const titulo = ref('');
const descricao = ref('');
const urgencia = ref('LOW');
const ativoId = ref('');
const responsavelId = ref('');
const imagemFile = ref<File | null>(null); 


const listaAtivos = ref([]);
const listaUsuarios = ref([]);


onMounted(async () => {
  try {
    const [resAtivos, resUsers] = await Promise.all([
      api.get('/equipment/'),
      api.get('/custom-user/')
    ]);
    listaAtivos.value = resAtivos.data.results || resAtivos.data;
    listaUsuarios.value = resUsers.data.results || resUsers.data;
  } catch (error) {
    console.error("Erro ao carregar listas", error);
  }
});


const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    imagemFile.value = target.files[0];
  }
};

const handleSubmit = async () => {
  try {

    const formData = new FormData();
    formData.append('name', titulo.value);
    formData.append('description', descricao.value);
    formData.append('urgency_level', urgencia.value);
    formData.append('suggested_date', new Date().toISOString());
    formData.append('equipments_FK', ativoId.value);
    formData.append('assignees_FK', responsavelId.value);

    if (imagemFile.value) {
      formData.append('image', imagemFile.value);
    }

    await api.post('/tasks/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    alert('Chamado criado com sucesso!');
    router.push({ name: 'home' });
  } catch (error) {
    console.error(error);
    alert('Erro ao criar chamado.');
  }
};
</script>

<template>
  <div class="form-container">
    <h2>Abrir novo chamado</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Ativo associado</label>
        <select v-model="ativoId" required>
          <option value="" disabled>Selecione um ativo</option>
          <option v-for="ativo in listaAtivos" :key="ativo.id" :value="ativo.id">
            {{ ativo.name }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Título do chamado</label>
        <input type="text" v-model="titulo" required>
      </div>

      <div class="form-group">
        <label>Descrição</label>
        <textarea v-model="descricao" rows="4"></textarea>
      </div>

      <div class="form-group">
        <label>Urgência</label>
        <select v-model="urgencia">
          <option value="LOW">Baixa</option>
          <option value="MEDIUM">Média</option>
          <option value="HIGH">Alta</option>
        </select>
      </div>

      <div class="form-group">
        <label>Responsável</label>
        <select v-model="responsavelId" required>
          <option value="" disabled>Selecione o responsável</option>
          <option v-for="user in listaUsuarios" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Foto (opcional)</label>
        <div class="dropzone" @click="$refs.fileInput.click()">
          <CloudUploadOutline :size="48" color="#888" />
          <span v-if="!imagemFile">Clique para fazer upload</span>
          <span v-else style="color:green">{{ imagemFile.name }}</span>
          <input type="file" ref="fileInput" @change="handleFileUpload" style="display:none" accept="image/*">
        </div>
      </div>
      
      <button type="submit" class="submit-btn">Abrir Chamado</button>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 20px;
  border: 1px solid #e9eef2;
  box-shadow: 0 4px 8px rgba(0,0,0,0.03);
}

h2 {
  text-align: left;
  margin-bottom: 30px;
  color: #333;
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

input[type="text"],
textarea,
select {
  width: 100%;
  padding: 14px 20px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #fff;
  font-size: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input[type="text"]::placeholder,
textarea::placeholder {
  color: #aaa;
}

input[type="text"]:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #F39C12;
  box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.2);
}

textarea {
  resize: vertical;
}

select[multiple] {
  height: 120px;
}

.dropzone {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  background-color: #f9f9f9;
  color: #888;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dropzone:hover {
  background-color: #f0f0f0;
}

.dropzone span {
  margin-top: 10px;
  font-weight: 500;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  background-color: #F39C12;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.submit-btn:hover {
  background-color: #E67E22;
  transform: translateY(-2px);
}
</style>