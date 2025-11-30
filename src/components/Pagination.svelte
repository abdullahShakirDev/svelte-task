<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';

	export let currentPage: number;
	export let totalPages: number;

	function handlePageChange(newPage: number) {
		const url = new URL(page.url);

		url.searchParams.set('page', String(newPage));

		goto(url.toString(), { noScroll: true });
	}
</script>

{#if totalPages > 1}
	<div class="flex items-center justify-center gap-4 p-4">
		<button
			on:click={() => handlePageChange(currentPage - 1)}
			disabled={currentPage === 1}
			class="flex items-center justify-center rounded-md p-2 transition-colors
			       hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
			aria-label="Previous page"
		>
			<ChevronLeft class="h-4 w-4" />
		</button>

		<span class="text-sm font-medium">
			Page {currentPage} of {totalPages}
		</span>

		<button
			on:click={() => handlePageChange(currentPage + 1)}
			disabled={currentPage === totalPages}
			class="flex items-center justify-center rounded-md p-2 transition-colors
			       hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
			aria-label="Next page"
		>
			<ChevronRight class="h-4 w-4" />
		</button>
	</div>
{/if}
