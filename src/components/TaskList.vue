<script setup>
import Task from "@/components/Task.vue";
import { useTaskStore } from "@/store/TaskStore";

const TaskStore = useTaskStore();

const { tasks, loaded } = defineProps({
  tasks: Array,
  loaded: Boolean
});

</script>

<template>
  <h1 v-if="!loaded">
    Загрузка задач...
  </h1>
  <ol v-else-if="tasks.length > 0" class="task-list">
    <!-- Прием ивентов об изменениях для мутации данных -->
    <Task v-for="task in tasks" :key="task.id" :task="task" @update:title="task.title = $event"
      @update:completed="task.completed = $event" @update:delete="TaskStore.deleteTask(task.id)">
    </Task>
  </ol>
  <h1 v-else>
    Задачи отсутствуют
  </h1>
</template>

<style scoped>
.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
