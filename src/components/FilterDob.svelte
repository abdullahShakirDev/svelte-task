<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { NativeSelect, NativeSelectOption } from '$lib/components/ui/native-select';

	let dob = $derived(page.url.searchParams.get('dob') || '');

	function handleChange(e: Event) {
		const newValue = (e.target as HTMLSelectElement).value;

		const params = new URLSearchParams(page.url.searchParams);

		if (newValue) {
			params.set('dob', newValue);
		} else {
			params.delete('dob');
		}

		goto(`?${params.toString()}`, {
			keepFocus: true,
			noScroll: true
		});
	}
</script>

<div>
	<NativeSelect value={dob} onchange={handleChange}>
		<NativeSelectOption value="" disabled>Select Date</NativeSelectOption>
		<NativeSelectOption value="all">All</NativeSelectOption>
		<NativeSelectOption value="1970-1980">1970 - 1980</NativeSelectOption>
		<NativeSelectOption value="1980-1990">1980 - 1990</NativeSelectOption>
		<NativeSelectOption value="1990-2000">1990 - 2000</NativeSelectOption>
		<NativeSelectOption value="2000+">2000+</NativeSelectOption>
	</NativeSelect>
</div>
