<script setup>

</script>

<template>
  <v-app>
    <v-app-bar color="primary" elevation="2" height="100">
      <div class="header-content">
        <div class="main-title font-weight-bold">Môj zoznam úloh</div>

        <nav class="header-navigation">
          <v-btn to="/" variant="text" color="white" size="small">
            <v-icon start size="26">mdi-format-list-checks</v-icon>
            Úlohy
          </v-btn>

          <v-btn to="/about" variant="text" color="white" size="small">
            <v-icon start size="26">mdi-information-outline</v-icon>
            O projekte
          </v-btn>
        </nav>
      </div>
    </v-app-bar>

    <v-main>
       <RouterView />
    </v-main>

    <v-footer class="app-footer">
      <v-container>
        <v-row align="center" justify="space-between">
          <v-col cols="12" md="6" class="text-center text-md-left">
            <div class="footer-title">Moj TODO List</div>
            <div class="footer-subtitle">Organizujte svoje úlohy. Plánujte svoj čas.</div>
          </v-col>

          <v-col cols="12" md="6" class="text-center text-md-right">
            <div class="footer-copyright">© 2026 Môj TODO List</div>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<style scoped></style>
