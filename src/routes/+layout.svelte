<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<main class="mx-auto mt-10 max-w-6xl">
	{@render children()}
</main>
