<script lang="ts">
	import { db } from '$lib';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		db.preferences.applyTheme();
	});
</script>

<main class="h-screen w-full overflow-y-auto">
	{@render children()}
</main>
