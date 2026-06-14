<script lang="ts">
	import { SuiteFavicons } from '@ramo-libre/ui-themes';
	import { db } from '$lib';
	import { themes } from '@ramo-libre/ui-themes';
	import Auth from './_components/Auth.svelte';

	const popularCommunities = [
		{
			id: 'utfsm',
			name: 'Universidad Técnica Federico Santa María',
			acronym: 'UTFSM',
			presetsCount: 142,
			exportsCount: 1240
		},
		{
			id: 'pucv',
			name: 'Pontificia Universidad Católica de Valparaíso',
			acronym: 'PUCV',
			presetsCount: 89,
			exportsCount: 512
		},
		{
			id: 'uchile',
			name: 'Universidad de Chile',
			acronym: 'UCHILE',
			presetsCount: 210,
			exportsCount: 2389
		},
		{
			id: 'puc',
			name: 'Pontificia Universidad Católica',
			acronym: 'PUC',
			presetsCount: 175,
			exportsCount: 1845
		},
		{
			id: 'usach',
			name: 'Universidad de Santiago de Chile',
			acronym: 'USACH',
			presetsCount: 95,
			exportsCount: 412
		},
		{
			id: 'udec',
			name: 'Universidad de Concepción',
			acronym: 'UDEC',
			presetsCount: 112,
			exportsCount: 890
		}
	];

	let searchQuery = $state('');

	let filteredCommunities = $derived(
		searchQuery === ''
			? popularCommunities
			: popularCommunities.filter(
					(c) =>
						c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
						c.acronym.toLowerCase().includes(searchQuery.toLowerCase())
				)
	);
</script>

<main class="w-full min-h-dvh p-6 text-content flex flex-col gap-6 select-none">
	<section
		class="w-full rounded-xl border border-content/10 bg-base-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
	>
		<div class="flex items-center gap-4">
			<img src={SuiteFavicons.hub} alt="RamoLibre Hub" class="w-10 h-10 object-contain" />

			<div>
				<div class="flex items-center gap-2 mb-1">
					<h1 class="text-2xl font-bold tracking-tight">
						RamoLibre <span class="text-primary-100">Hub</span>
					</h1>
				</div>
				<p class="text-sm text-content/60">
					Encuentra tu comunidad, añade tus ramos y ahórrate la configuración manual del semestre.
				</p>
			</div>
		</div>

		<div class="relative w-full md:w-96">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Busca tu comunidad (ej: UTFSM)..."
				class="w-full px-4 py-2.5 text-sm rounded-lg border border-content/10 bg-base-300/60 focus:outline-none focus:border-primary transition-all placeholder:text-content/30"
			/>
		</div>
	</section>

	<div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
		<div class="flex flex-col gap-4 md:gap-5">
			<Auth />
			<div class="rounded-xl border border-content/10 bg-base-100 p-4 flex flex-col gap-3">
				<p class="text-xs font-bold font-mono uppercase tracking-wide text-content/40">
					Apariencia
				</p>
				<div class="grid grid-cols-2 gap-2">
					{#each themes as opt (opt.id)}
						<button
							onclick={() => (db.preferences.theme = opt.id)}
							class="hover:bg-base-300/60 flex cursor-pointer items-center gap-2 rounded-lg border border-content/5 bg-base-300/30 p-2.5 text-left transition-all duration-150
                                {db.preferences.theme === opt.id
								? 'border-primary-100 bg-primary-100/5 font-bold shadow-xs'
								: 'opacity-70 hover:opacity-100'}"
						>
							<span
								class="{db.preferences.theme === opt.id
									? 'text-primary-100'
									: 'text-content/40'} flex shrink-0"
							>
								<opt.icon size={14} />
							</span>
							<span class="truncate text-xs tracking-tight">{opt.label}</span>
						</button>
					{/each}
				</div>
			</div>
		</div>

		<section class="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
			{#each filteredCommunities as repo}
				<a
					href="/rm/{repo.id}"
					class="rounded-xl border border-content/10 bg-base-100 p-5 hover:border-primary-100/40 hover:bg-base-300 transition-all duration-150 flex flex-col justify-between group h-40 cursor-pointer"
				>
					<div>
						<div class="flex items-center justify-between gap-2 mb-3">
							<span
								class="text-[10px] font-mono text-content/40 bg-base-300 px-2 py-0.5 rounded border border-content/5 group-hover:bg-base-100 transition-colors"
							>
								rm/{repo.id}
							</span>
							<span
								class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
							></span>
						</div>

						<h3
							class="font-bold text-xl group-hover:text-primary-100 transition-colors line-clamp-1 tracking-tight"
						>
							{repo.acronym}
						</h3>
						<p class="text-xs text-content/50 line-clamp-1 mt-1">
							{repo.name}
						</p>
					</div>

					<div
						class="flex items-center justify-between border-t border-content/5 pt-3 text-xs font-mono text-content/40"
					>
						<div>
							Presets: <span
								class="text-content font-bold group-hover:text-content transition-colors"
								>{repo.presetsCount}</span
							>
						</div>
						<div>
							Exportaciones: <span class="text-primary-100 font-bold">{repo.exportsCount}</span>
						</div>
					</div>
				</a>
			{:else}
				<div
					class="col-span-full rounded-xl border border-dashed border-content/10 bg-base-100 p-12 text-center text-sm text-content/40"
				>
					No se encontraron comunidades que coincidan con tu búsqueda.
				</div>
			{/each}
		</section>
	</div>
</main>
