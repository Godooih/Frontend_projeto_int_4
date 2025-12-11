import { defineStore } from 'pinia'


export const useUserStore = defineStore('user', {

  state: () => ({
    name: '',
    photoUrl: ''
  }),


  actions: {

    setUser(userData: { name: string; photoUrl: string }) {
      this.name = userData.name;
      this.photoUrl = userData.photoUrl;
    },
    

    clearUser() {
      this.name = '';
      this.photoUrl = '';
    }
  }
})