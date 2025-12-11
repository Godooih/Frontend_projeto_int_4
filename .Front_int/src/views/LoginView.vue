<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import api from '@/services/api';

const email = ref('');
const password = ref('');
const router = useRouter();
const userStore = useUserStore();

const fazerLogin = async () => {
  try {

    const response = await api.post('/auth/token/login/', { 
      email: email.value,
      password: password.value,
    });


    const token = response.data.auth_token;

    localStorage.setItem('token', token);


    const userResponse = await api.get('/auth/users/me/');


    userStore.setUser({
      name: userResponse.data.name,
      photoUrl: userResponse.data.photo || '',
    });

    router.push({ name: 'home' });
  } catch (err) {
    console.error(err);
    alert('Login inválido! Verifique email e senha.');
  }
};
</script>

<template>
  <div class="login-container">

    <div class="logo-section">
      <img src="@/assets/images/logo.png" class="logo-image" />
      <span class="logo-text"></span>
    </div>

    <div class="form-section">
      <div class="form-wrapper">
        <h2>Faça seu login</h2>

        <form @submit.prevent="fazerLogin">
          <div class="input-group">
            <input type="email" placeholder="E-mail" v-model="email" required />
          </div>

          <div class="input-group">
            <input type="password" placeholder="Senha" v-model="password" required />
          </div>

          <button type="submit" class="btn-acessar">Acessar</button>
        </form>

        <p class="cadastro-link">
          Não tem uma conta?
          <RouterLink to="/cadastro">Cadastre-se</RouterLink>
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
  width: 50%;
  max-width: 50%;
  min-width: 50%;
  background-color: #ffffff;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  height: 100%;
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
  width: 300px;
  max-width: 100%;
  height: auto;
  margin-bottom: 25px;
}

.logo-text {
  font-size: 3.5rem;
  font-weight: 700;
  color: #343a40;
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

.cadastro-link {
  text-align: left;
  margin-top: 1.5rem;
  color: #333;
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
