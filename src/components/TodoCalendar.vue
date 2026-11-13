
<script setup>
import { computed } from 'vue'
import FullCalendar from '@fullcalendar/vue3'

import dayGridPlugin from '@fullcalendar/vue3/daygrid'
import timeGridPlugin from '@fullcalendar/vue3/timegrid'
import interactionPlugin from '@fullcalendar/vue3/interaction'

import classicThemePlugin from '@fullcalendar/vue3/themes/classic'

import '@fullcalendar/vue3/skeleton.css'
import '@fullcalendar/vue3/themes/classic/theme.css'
import '@fullcalendar/vue3/themes/classic/palette.css'
const props = defineProps({
    tasks: {
        type: Array,
        required: true
    }
});

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, classicThemePlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  selectable: true,
  nowIndicator: true,
  height: 'auto',
  events: events.value,
  eventClick: (info) => {
  const task = info.event.extendedProps.task

  console.log(task)
}
}));

const events = computed(() => {
  return props.tasks.map(task => ({
    id: String(task.id),
    title: task.title,
    start: task.date_from.replace(' ', 'T'),
    end: task.date_to.replace(' ', 'T'),
    backgroundColor: task.is_finished ? '#735D78' : '#B392AC',
    borderColor: task.is_finished ? '#735D78' : '#B392AC',
    extendedProps: {
        task: task
    }
  }));
});

</script>

<template>
    <p>Tasks received: {{ props.tasks.length }}</p>
    <div class="calendar-container">
        <FullCalendar :options="calendarOptions" />
    </div>
</template>
