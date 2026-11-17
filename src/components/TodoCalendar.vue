<script setup>
import { computed, watch, ref } from 'vue';
import FullCalendar from '@fullcalendar/vue3';

import dayGridPlugin from '@fullcalendar/vue3/daygrid';
import timeGridPlugin from '@fullcalendar/vue3/timegrid';
import interactionPlugin from '@fullcalendar/vue3/interaction';

import classicThemePlugin from '@fullcalendar/vue3/themes/classic';

import '@fullcalendar/vue3/skeleton.css';
import '@fullcalendar/vue3/themes/classic/theme.css';
import '@fullcalendar/vue3/themes/classic/palette.css';
const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['edit-task', 'create-task']);
const calendarRef = ref(null);

watch(
  () => props.tasks,
  (newTasks) => {
    const calendar = calendarRef.value?.getApi();

    if (!calendar) return;

    calendar.removeAllEvents();
    calendar.addEventSource(
      newTasks.map((task) => ({
        id: String(task.id),
        title: task.title,
        start: task.date_from,
        end: task.date_to,
        extendedProps: {
          task: task,
        },
      }))
    );
  },
  { deep: true }
);

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, classicThemePlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
  selectable: true,
  nowIndicator: true,

  displayEventTime: true,
  displayEventEnd: true,

  height: 'auto',
  events: events.value,
  eventClick: (info) => {
    const task = info.event.extendedProps.task;
    emit('edit-task', task);
  },
  select: (info) => {
    emit('create-task', {
      start: info.start,
      end: info.end,
    });
  },
  eventDidMount: (info) => {
    const isFinished = info.event.extendedProps.task.is_finished;
    const color = isFinished ? '#735D78' : '#B392AC';

    info.el.style.setProperty('background-color', color, 'important');
    info.el.style.setProperty('border-color', color, 'important');
    info.el.style.setProperty('color', '#344966', 'important');

    info.el.querySelectorAll('*').forEach((element) => {
      element.style.setProperty('color', 'white', 'important');
    });
  },
}));

const events = computed(() => {
  return props.tasks.map((task) => {
    const color = task.is_finished ? '#735D78' : '#B392AC';

    return {
      id: String(task.id),
      title: task.title,
      start: task.date_from,
      end: task.date_to,

      backgroundColor: color,
      borderColor: color,
      textColor: '#344966',

      extendedProps: {
        task: task,
      },
    };
  });
});
</script>

<template>
  <div class="calendar-legend">
    <span>
      <span class="legend-color unfinished"></span>
      Nedokončené
    </span>

    <span>
      <span class="legend-color finished"></span>
      Dokončené
    </span>
  </div>

  <div class="calendar-container">
    <FullCalendar ref="calendarRef" :options="calendarOptions" />
  </div>
</template>

<style>
.calendar-legend {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
}

.calendar-legend span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.unfinished {
  background-color: #b392ac;
}

.finished {
  background-color: #735d78;
}

.calendar-container .fc-event.task-pending,
.calendar-container .fc-event.task-pending .fc-event-main {
  background-color: #b392ac !important;
  border-color: #b392ac !important;
}

.calendar-container .fc-event.task-finished,
.calendar-container .fc-event.task-finished .fc-event-main {
  background-color: #735d78 !important;
  border-color: #735d78 !important;
}
</style>
