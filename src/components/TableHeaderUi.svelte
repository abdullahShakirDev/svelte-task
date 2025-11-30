<script>
	import { TableHead, TableHeader, TableRow } from '$lib/components/ui/table/index';
	import Sort from './Sort.svelte';
</script>

<TableHeader>
	<TableRow class="bg-muted/40 text-lg font-semibold">
		<TableHead class="w-[15%] px-6 py-4 text-center">
			<span>Name</span>
			<Sort sort="name" />
		</TableHead>
		<TableHead class="w-[10%] px-6 py-4 text-center">
			<span>Age</span>
			<Sort sort="age" />
		</TableHead>

		<TableHead class="w-[15%] px-6 py-4 text-center">Picture</TableHead>
		<TableHead class="w-[20%] px-6 py-4 text-center">
			<span>Date of Birth</span>
			<Sort sort="dob" />
		</TableHead>
		<TableHead class="w-[20%] px-6 py-4 text-center">Bio Video</TableHead>
		<TableHead class="w-[20%] px-6 py-4 text-center">Actions</TableHead>
	</TableRow>
</TableHeader>
