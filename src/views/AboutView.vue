<script setup>
const technologies = [
  {
    name: 'Vue 3',
    description: 'JavaScript framework na tvorbu používateľského rozhrania.',
  },
  {
    name: 'Vuetify 4',
    description: 'Knižnica UI komponentov založená na Material Design.',
  },
  {
    name: 'FullCalendar',
    description: 'Knižnica na zobrazovanie úloh v kalendári.',
  },
  {
    name: 'Vite',
    description: 'Nástroj na vývoj a zostavenie aplikácie.',
  },
  {
    name: 'Material Design Icons',
    description: 'Knižnica ikon použitých v používateľskom rozhraní.',
  },
  {
    name: 'HTML5, CSS3 a JavaScript',
    description: 'Základné webové technológie použité pri tvorbe aplikácie.',
  },
];
</script>

<template>
  <v-container id="about" class="about-section py-12">
    <div class="text-center mb-10">
      <h2 class="about-title mb-3">O projekte</h2>
      <p class="text-body-1 text-medium-emphasis">
        Jednoduchý a prehľadný spôsob správy každodenných úloh.
      </p>
    </div>

    <v-row justify="center" align="stretch">
      <v-col cols="12" md="4">
        <v-card class="about-card pa-5 h-100" elevation="2" rounded="lg">
          <v-icon size="36" color="primary" class="mb-4"> mdi-calendar-check </v-icon>

          <h3 class="about-card-title mb-3">Majte vo veciach prehľad</h3>

          <p>
            Majte všetky úlohy na jednom mieste, nastavujte termíny a organizujte si každodenné
            povinnosti.
          </p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="about-card pa-5 h-100" elevation="2" rounded="lg">
          <v-icon size="36" color="primary" class="mb-4"> mdi-chart-timeline-variant </v-icon>

          <h3 class="about-card-title mb-3">Sledujte svoj pokrok</h3>

          <p>
            Spravujte svoje úlohy pomocou stavov Na spracovanie, Rozpracované a Dokončené a sledujte
            svoj pokrok.
          </p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="about-card pa-5 h-100" elevation="2" rounded="lg">
          <v-icon size="36" color="primary" class="mb-4"> mdi-calendar-month </v-icon>

          <h3 class="about-card-title mb-3">Plánujte dopredu</h3>

          <p>
            Využívajte kalendár na prehľad úloh, sledovanie blížiacich sa termínov a plánovanie
            svojho času.
          </p>
        </v-card>
      </v-col>
    </v-row>

    <div class="text-center mt-10">
      <p class="about-description">
        Aplikácia vytvorená na jednoduchšiu, prehľadnejšiu a menej stresujúcu správu úloh.
      </p>
    </div>

    <v-divider class="my-8" />

    <div class="text-center">
      <h3 class="text-h5 font-weight-bold mb-4">Použité technológie a zdroje</h3>

      <v-row justify="center">
        <v-col v-for="technology in technologies" :key="technology.name" cols="12" sm="6" md="4">
          <v-card class="pa-4 h-100" rounded="lg" elevation="1">
            <h4 class="text-h6 font-weight-bold mb-2">
              {{ technology.name }}
            </h4>

            <p class="text-body-2 text-medium-emphasis">
              {{ technology.description }}
            </p>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
