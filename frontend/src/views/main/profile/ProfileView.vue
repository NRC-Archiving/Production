<template>
    <div class="main-container">
        <router-view />
    </div>
</template>
<script>
import { mapActions } from 'pinia';
import { usePageStore } from '@/store';
export default {
    methods: {
        ...mapActions(usePageStore, ['setPageTitle'])
    }
}
</script>
<stype lang="scss" scoped>
.main-container {
    padding: 2rem;
}
</stype>
