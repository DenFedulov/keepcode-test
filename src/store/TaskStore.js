import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useTaskStore = defineStore('tasks', () => {
    const page = ref(1);
    const lastId = ref(0);
    const tasks = ref([]);
    const completedTasks = computed(() => {
        return tasks.value.filter((task) => task.completed);
    });
    const uncompletedTasks = computed(() => {
        return tasks.value.filter((task) => !task.completed);
    });

    function addTask() {
        lastId.value++;
        tasks.value.push({userId: 1, id: lastId.value, title: "new task", completed: false});
    }

    function deleteTask(taskId) {
        tasks.value = tasks.value.filter((task) => task.id !== taskId);
    }

    return {
        page,
        tasks,
        lastId,
        addTask,
        deleteTask,
        completedTasks,
        uncompletedTasks
    }
});