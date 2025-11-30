<script lang="ts">
	import { page } from '$app/state';
	import Table from '$lib/components/ui/table/table.svelte';
	import { Search } from '@lucide/svelte';
	import AddUserForm from './AddUserForm.svelte';
	import TableBodyUi from './TableBodyUi.svelte';
	import TableHeaderUi from './TableHeaderUi.svelte';
	import { Input } from '$lib/components/ui/input';
	import Pagination from './Pagination.svelte';
	import { goto } from '$app/navigation';
	import FilterDob from './FilterDob.svelte';
	import FilterAge from './FilterAge.svelte';

	let users = $derived(page.data.users);
	let searchQuery = $state('');
	let currentPage = $derived(page.data.currentPage);
	let totalPages = $derived(page.data.totalPages);

	function handleSearch() {
		const url = new URL(page.url);
		url.searchParams.set('search', searchQuery);
		if (!searchQuery) {
			url.searchParams.delete('search');
		}
		goto(url.toString(), { noScroll: true, keepFocus: true });
	}
</script>

<div class="w-full space-y-6 overflow-x-auto rounded-2xl border bg-card p-6 shadow-lg">
	<div></div>
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div class="relative flex w-full items-center sm:w-72">
			<span class="absolute top-1.5 left-1.5 h-4 w-4 text-muted-foreground">
				<Search />
			</span>
			<Input
				bind:value={searchQuery}
				oninput={handleSearch}
				type="text"
				placeholder="Search by name, age, or date..."
				class="pl-8"
			/>
		</div>
		<FilterAge />
		<FilterDob />
		<AddUserForm />
	</div>

	<Table>
		<TableHeaderUi />
		<TableBodyUi {users} />
	</Table>
</div>
<Pagination {currentPage} {totalPages} />
