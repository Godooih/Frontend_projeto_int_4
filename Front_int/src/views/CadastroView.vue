<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import api from '@/services/api';

const router = useRouter();


const nomeCompleto = ref('');
const email = ref('');
const nif = ref('');
const password = ref('');
const loading = ref(false);

const fazerCadastro = async () => {
  try {
    loading.value = true;
    

    await api.post('/auth/users/', {
      name: nomeCompleto.value,
      email: email.value,
      nif: nif.value,
      password: password.value
    });

    alert('Cadastro realizado com sucesso! Faça login para continuar.');
    router.push({ name: 'login' });

  } catch (error: any) {
    console.error(error);

    let msg = 'Erro ao realizar cadastro.';
    if (error.response?.data) {

      const errors = Object.values(error.response.data).flat().join('\n');
      msg = `Erro:\n${errors}`;
    }
    alert(msg);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="logo-section">
      <div class="logo-wrapper">
        <img src="@/assets/images/logo.png" alt="Logo Nexus Tech" class="logo-image" />
        <span class="logo-text"></span>
      </div>
    </div>

    <div class="form-section">
      <div class="form-wrapper">
        <h2>Faça seu cadastro</h2>
        <form @submit.prevent="fazerCadastro">
          
          <div class="input-group">
            <input 
              type="text" 
              placeholder="Nome Completo" 
              v-model="nomeCompleto" 
              required
            >
          </div>

          <div class="input-group">
            <input 
              type="text" 
              placeholder="NIF / Documento" 
              v-model="nif" 
              required
            >
          </div>

          <div class="input-group">
            <input 
              type="email" 
              placeholder="E-mail" 
              v-model="email" 
              required
            >
          </div>
          
          <div class="input-group">
            <input 
              type="password" 
              placeholder="Senha" 
              v-model="password" 
              required
            >
          </div>
          
          <button type="submit" class="btn-acessar" :disabled="loading">
            {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
          </button>
        </form>

        <p class="cadastro-link">
          Já tem uma conta? <RouterLink to="/">Entrar</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.login-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.logo-section,
.form-section {
  width: 50%;
  height: 100%;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-section {
  background-color: #f8f9fa;
  flex-direction: column;
}

.form-section {
  background: linear-gradient(135deg, #FF8C00, #FFA500, #FFD700);
}

.logo-wrapper, .form-wrapper {
  width: 100%;
  max-width: 450px;
  text-align: center;
}

.logo-image {
  width: 250px;
  max-width: 100%;
  height: auto;
  margin-bottom: 25px;
}

.form-wrapper h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 2.5rem;
  text-align: left;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group input {
  width: 100%;
  padding: 16px 25px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: white;
  font-size: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: border-color 0.3s;
}

.input-group input:focus {
  outline: none;
  border-color: #F39C12;
}

.btn-acessar {
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
  margin-top: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-acessar:hover {
  background-color: #E67E22;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn-acessar:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}

.cadastro-link {
  text-align: left;
  margin-top: 1.5rem;
  color: #333;
}

.cadastro-link a {
  color: #333;
  font-weight: bold;
  text-decoration: none;
  margin-left: 5px;
}

.cadastro-link a:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .login-container {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }

  .logo-section,
  .form-section {
    width: 100%;
    height: auto;
    min-height: 50vh;
  }

  .form-wrapper h2, .cadastro-link {
    text-align: center;
  }
}
</style>