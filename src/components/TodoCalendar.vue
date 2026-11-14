
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

const emit = defineEmits(['edit-task', 'create-task']);

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

  displayEventTime: true,
  displayEventEnd: true,

  height: 'auto',
  events: events.value,
  eventClick: (info) => {
    const task = info.event.extendedProps.task
    emit('edit-task', task)
  },
  select: (info) => {
    emit('create-task', {
      start: info.start,
      end: info.end
    })
  },
  // set colors to calendar tasks
  eventDidMount: (info) => {
    const isFinished = info.event.extendedProps.task.is_finished;

    info.el.style.setProperty(
        'background-color',
        isFinished ? '#735D78' : '#B392AC',
        'important'
    );

    info.el.style.setProperty(
        'border-color',
        isFinished ? '#735D78' : '#B392AC',
        'important'
    );

    info.el.style.setProperty('color', 'white', 'important');
  },
}));

const events = computed(() => {
    return props.tasks.map(task => {
        return {
            id: String(task.id),
            title: task.title,
            start: task.date_from,
            end: task.date_to,
            classNames: [
                task.is_finished ? 'task-finished' : 'task-pending'
            ],
            extendedProps: {
                task: task
            }
        };
    });
});

</script>

<template>
    <div class="calendar-legend">
      <div class="legend-item">
          <span class="legend-color pending"></span>
          <span>Not completed</span>
      </div>

      <div class="legend-item">
          <span class="legend-color finished"></span>
          <span>Completed</span>
      </div>
    </div>

    <div class="calendar-container">
        <FullCalendar :options="calendarOptions" />
    </div>
</template>

<style>
.calendar-legend {
    display: flex;
    justify-content: flex-end;
    gap: 20px;
    margin-bottom: 16px;
    flex-wrap: wrap;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #344966;
}

.legend-color {
    width: 13px;
    height: 13px;
    border-radius: 4px;
}

.legend-color.pending {
    background-color: #B392AC;
}

.legend-color.finished {
    background-color: #735D78;
}
  .calendar-container .task-pending {
      background-color: #B392AC !important;
      border-color: #B392AC !important;
      color: white !important;
  }

  .calendar-container .task-finished {
      background-color: #735D78 !important;
      border-color: #735D78 !important;
      color: white !important;
  }
</style>
