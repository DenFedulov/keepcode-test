<script setup>
import { onMounted, ref } from "vue";
import globals from "@/globals.js";
import { useTaskStore } from "@/store/TaskStore";

const TaskStore = useTaskStore();

const totalCount = ref(-1);

async function fetchTotal() {
    // получение общего количества заданий для составления пагинации с помощью Fetch API
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos?_limit=0`);
    return response.headers.get('x-total-count');
}

const lastId = localStorage.getItem('lastId');
if (lastId) {
    TaskStore.lastId = lastId;
}

const loaded = ref(false);

onMounted(() => {
    fetchTotal().then((total) => {
        totalCount.value = total;
        if (!lastId) {
            TaskStore.lastId = total;
            localStorage.setItem('lastId', total);
        }
    }).finally(() => {
        loaded.value = true;
    });
});

</script>

<template>
    <h1 v-if="!loaded">
        Загрузка пагинации...
    </h1>
    <nav v-else-if="totalCount != -1" aria-label="Page navigation">
        <ul class="pagination">
            <li :class="TaskStore.page === pageNum ? 'selected-page' : ''" class="page-btn"
                v-for="pageNum in Math.ceil(totalCount / globals.TASKS_PER_PAGE)" @click="TaskStore.page = pageNum">
                <a>{{ pageNum }}</a>
            </li>
        </ul>
    </nav>
    <h1 v-else>
        Ошибка при загрузке пагинации
    </h1>
    
</template>

<style scoped>
.pagination {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.page-btn {
    display: flex;
    place-content: center;

    width: 1rem;
    height: 1rem;
    padding: 0.5rem;

    border: 1px solid black;
    border-radius: 6px;
}

.selected-page {
    background-color: gray;
}
</style>
