<script lang="ts">
	import { Dialog, DialogContent } from '$lib/components/ui/dialog';

	let { url } = $props<{ url: string }>();

	let open = $state(false);

	function handleOpenChange(value: boolean) {
		open = value;
	}
</script>

<button
	onclick={() => (open = true)}
	aria-label="Open video preview"
	class="h-14 w-14 cursor-pointer overflow-hidden rounded border"
>
	<video src={url} class="h-full w-full object-cover" muted playsinline preload="metadata">
		<track kind="captions" />
	</video>
</button>

<Dialog {open} onOpenChange={handleOpenChange}>
	<DialogContent
		class="flex h-[500px] w-[450px] flex-col items-center justify-center bg-gray-100 p-0 [&>button[data-dialog-close]]:hidden"
	>
		<video
			src={url}
			class="min-h-[70vh] w-full rounded object-fill object-center"
			controls
			autoplay
			playsinline
		>
			<track kind="captions" />
		</video>
	</DialogContent>
</Dialog>
