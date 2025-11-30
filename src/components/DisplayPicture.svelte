<script lang="ts">
	import { Dialog, DialogContent } from '$lib/components/ui/dialog';

	let { url } = $props<{ url: string }>();

	let open = $state(false);

	function handleOpenChange(value: boolean) {
		open = value;
	}
</script>

<div class="relative h-14 w-14 cursor-pointer overflow-hidden rounded border">
	<button onclick={() => (open = true)}>
		<img src={url} alt="Profile Preview" class="rounded object-cover" />
	</button>
</div>

<Dialog {open} onOpenChange={handleOpenChange}>
	<DialogContent
		class="flex h-[500px] w-[500px] flex-col items-center justify-center bg-gray-100 p-0"
	>
		<img src={url} alt="Profile Preview" class="h-full w-full rounded-full object-cover" />
	</DialogContent>
</Dialog>
