<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { MoveDown, MoveUp, MoveVertical } from '@lucide/svelte';

	let { sort } = $props();

	let searchParams = $derived(page.url.searchParams);
	let sortParam = $derived(searchParams.get('sort') || '');
	let sortParts = $derived(sortParam ? sortParam.split(',') : []);

	let activeSort = $derived(sortParts.find((s) => s.startsWith(sort)));
	let direction = $derived(activeSort?.split('-')[1]);

	function handleChange() {
		const params = new URLSearchParams(searchParams);

		let nextSortString: string | null = null;

		if (!direction) nextSortString = `${sort}-asc`;
		else if (direction === 'asc') nextSortString = `${sort}-desc`;
		else if (direction === 'desc') nextSortString = null;

		const others = sortParts.filter((s) => !s.startsWith(sort));

		const finalSortList = nextSortString ? [...others, nextSortString] : others;
		const finalSort = finalSortList.join(',');

		if (finalSort) params.set('sort', finalSort);
		else params.delete('sort');

		goto(`?${params.toString()}`, {
			noScroll: true,
			keepFocus: true
		});
	}
</script>

<Button variant="ghost" size="icon" class="h-8 w-8 cursor-pointer" onclick={handleChange}>
	{#if direction === 'asc'}
		<MoveUp class="h-4 w-4" />
	{:else if direction === 'desc'}
		<MoveDown class="h-4 w-4" />
	{:else}
		<MoveVertical class="h-4 w-4" />
	{/if}
</Button>
