<script setup>
  import { ref } from 'vue';
  import { getTasks } from './services/api.js';

  // store tasks
  const tasks = ref([]);
  const name = ref('');

  async function loadTasks(){
    try {
    tasks.value = await getTasks(name.value);
    } catch (error) {
      console.error(error);
    }
  }
</script>

<template>
  <v-app>
    <v-app-bar color="primary" elevation="2" height="110">
      <v-app-bar-title class="text-center app-bar-title">
        Moj TODO List
      </v-app-bar-title>
    </v-app-bar>
    
    <v-main>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="name"
            label="Student ID"
            placeholder="Enter your ID"
          />
        </v-col>
      </v-row>

      <v-container>
        <v-btn color="primary" @click="loadTasks()">
          Load tasks
        </v-btn>

        <v-row>
          <v-col>
            <v-card text="" title="">
              
            </v-card>
          </v-col>
          <v-col>
            <v-card text="" title="">
              
            </v-card>
            
          </v-col>
          <v-col>
            <v-card text="" title="">
              
            </v-card>
            
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>

</template>

<style scoped></style>
