<script setup>
import { onMounted, ref, watch } from "vue";
import globals from "@/globals.js";
import Pagination from "./components/Pagination.vue";
import { useTaskStore } from "@/store/TaskStore";
import TaskList from "./components/TaskList.vue";

const TaskStore = useTaskStore();

async function fetchTasks(page) {
  // получение заданий с удаленного сервера с помощью Fetch API
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos?_start=${(page - 1)
    * globals.TASKS_PER_PAGE}&_limit=${globals.TASKS_PER_PAGE}`);
  let data = await response.json();
  localStorage.setItem(`tasks:${page}`, JSON.stringify(data));
  // асинхронные функции возвращают Promise
  return data;
}

async function getTasks(page) {
  const storageTasks = localStorage.getItem(`tasks:${page}`);
  if (storageTasks) {
    try {
      return JSON.parse(storageTasks);
    } catch (error) {
      localStorage.removeItem(`tasks:${page}`); // чтобы не застревало с невалидными данными
      console.error(error);
    }
  }
  return await fetchTasks(page);
}

const loaded = ref(false);

onMounted(() => {
  loaded.value = false;
  getTasks(TaskStore.page).then((data) => {
    TaskStore.tasks = data;
  }).finally(() => {
    loaded.value = true;
  });
});

watch(() => TaskStore.page, (newPage) => {
  loaded.value = false;
  getTasks(newPage).then((data) => {
    TaskStore.tasks = data;
  }).finally(() => {
    loaded.value = true;
  });
});

// Реагирование на мутацию данных для сохранения в localStorage
watch(() => TaskStore.tasks, (newTasks) => {
  localStorage.setItem(`tasks:${TaskStore.page}`, JSON.stringify(newTasks));
}, { deep: true });

watch(() => TaskStore.lastId, (newLastId) => {
  localStorage.setItem("lastId", newLastId);
}, { deep: true });

</script>

<template>
  <main>
    <Pagination></Pagination>

    <!-- Функционал добавления задания -->
    <button @click="TaskStore.addTask()" style="margin-top: 1rem;">Добавить задачу</button>
    <section class="tasks">
      <div class="task-list-wraper" aria-label="Uncompleted tasks">
        <h1>Невыполненные задачи:</h1>
        <TaskList :tasks="TaskStore.uncompletedTasks" :loaded="loaded"></TaskList>
      </div>
      <div class="task-list-wraper" aria-label="Completed tasks">
        <h1>Выполненные задачи:</h1>
        <TaskList :tasks="TaskStore.completedTasks" :loaded="loaded"></TaskList>
      </div>
    </section>

  </main>
</template>

<style scoped>
/* общие стили */
.tasks {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.task-list-wraper {
  margin-top: 1rem;
  padding: 0.25rem;
  border: 1px solid black;
  border-radius: 5px;
}

/* стили мобильной версии */
.tasks {
  column-gap: 0.25rem;
}

/* полноразмерные стили */
@media (min-width: 48rem) {
  main {
    margin-left: 6rem;
    margin-right: 6rem;
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .tasks {
    column-gap: 2rem;
  }
}
</style>
