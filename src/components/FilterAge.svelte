<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { NativeSelect, NativeSelectOption } from '$lib/components/ui/native-select';

	let age = $derived(page.url.searchParams.get('age') || '');

	function handleChange(e: Event) {
		const newValue = (e.target as HTMLSelectElement).value;

		const params = new URLSearchParams(page.url.searchParams);

		if (newValue) {
			params.set('age', newValue);
		} else {
			params.delete('age');
		}

		goto(`?${params.toString()}`, {
			keepFocus: true,
			noScroll: true
		});
	}
</script>

<div>
	<NativeSelect value={age} onchange={handleChange}>
		<NativeSelectOption value="" disabled>Select Age</NativeSelectOption>
		<NativeSelectOption value="all">All</NativeSelectOption>
		<NativeSelectOption value="18-30">18 - 30</NativeSelectOption>
		<NativeSelectOption value="28-40">28 - 40</NativeSelectOption>
		<NativeSelectOption value="40+">40+</NativeSelectOption>
	</NativeSelect>
</div>
