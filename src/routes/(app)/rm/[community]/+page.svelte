<script lang="ts">
	import { page } from '$app/state';
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';
	import Auth from '../../_components/Auth.svelte';
	const universityId = page.params.community?.toUpperCase();

	const currentUniversity = {
		acronym: universityId,
		fullName:
			universityId === 'UTFSM'
				? 'Universidad Técnica Federico Santa María'
				: 'Universidad de Destino',
		careers: ['Plan Común', 'Ing. Civil Informática', 'Ing. Civil Eléctrica', 'Ing. Civil Mecánica']
	};

	const branchPresets = [
		{
			code: 'INF-221',
			name: 'Estructuras de Datos y Algoritmos',
			teacher: 'Carlos Castro',
			period: '2026-1',
			hasNonLinearMath: true,
			createdBy: 'mad mti',
			exportsCount: 234,
			stats: { evaluations: 4, schedules: 2 },
			evaluations: [
				{ name: 'Certamen 1', weight: 30 },
				{ name: 'Certamen 2', weight: 30 },
				{ name: 'Certamen 3', weight: 30 },
				{ name: 'Tareas', weight: 10 }
			]
		},
		{
			code: 'MAT-024',
			name: 'Cálculo IV',
			teacher: 'Ariel Edwards',
			period: '2026-1',
			hasNonLinearMath: false,
			createdBy: 'alex_dev',
			exportsCount: 89,
			stats: { evaluations: 3, schedules: 3 },
			evaluations: [
				{ name: 'Certamen 1', weight: 33 },
				{ name: 'Certamen 2', weight: 33 },
				{ name: 'Certamen 3', weight: 34 }
			]
		},
		{
			code: 'INF-253',
			name: 'Sistemas Operativos',
			teacher: 'Aníbal Coronado',
			period: '2025-2',
			hasNonLinearMath: true,
			createdBy: 'fvck mti',
			exportsCount: 142,
			stats: { evaluations: 4, schedules: 2 },
			evaluations: [
				{ name: 'Certamen 1', weight: 25 },
				{ name: 'Certamen 2', weight: 25 },
				{ name: 'Controles', weight: 20 },
				{ name: 'Laboratorios', weight: 30 }
			]
		}
	];

	let selectedCareer = $state('Todos');
</script>

<main class="w-full min-h-dvh p-6 text-content flex flex-col gap-6 select-none bg-base-200/30">
	<section
		class="w-full rounded-xl border border-content/10 bg-base-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
	>
		<div class="flex items-center gap-3 min-w-0">
			<a
				href="/"
				class="p-2 rounded-lg bg-base-300/60 hover:bg-base-300 text-content/60 hover:text-content transition-colors text-xs font-mono border border-content/5 shrink-0"
			>
				<ArrowLeft />
			</a>
			<div class="h-4 w-[1px] bg-content/10 hidden sm:block"></div>

			<div class="flex flex-col min-w-0">
				<div class="flex items-center gap-2 flex-wrap">
					<span class="text-[10px] font-mono text-content/40 uppercase tracking-wider"
						>Comunidad</span
					>
				</div>
				<h1 class="text-base font-bold tracking-tight text-content truncate mt-0.5">
					<span class="font-mono text-primary-100 font-semibold"
						>rm/{universityId?.toLowerCase()}</span
					>
					<span class="text-content/40 font-normal mx-1 hidden md:inline">•</span>
					<span class="text-xs md:text-sm font-normal text-content/60 hidden md:inline"
						>{currentUniversity.fullName}</span
					>
				</h1>
			</div>
		</div>

		<div
			class="flex items-center gap-6 text-xs font-mono shrink-0 border-t sm:border-t-0 border-content/5 pt-3 sm:pt-0 justify-between sm:justify-end"
		>
			<div class="flex flex-col sm:items-end">
				<span class="text-[10px] text-content/40 uppercase">Presets</span>
				<span class="text-content font-bold mt-0.5">{branchPresets.length}</span>
			</div>
			<div class="h-6 w-[1px] bg-content/10 hidden sm:block"></div>
			<div class="flex flex-col sm:items-end">
				<span class="text-[10px] text-content/40 uppercase">Sincronización</span>
				<span class="font-bold flex items-center gap-1 mt-0.5"> Hace 2 dias </span>
			</div>
		</div>
	</section>

	<div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
		<div class="flex flex-col gap-4 md:gap-5 shrink-0">
			<Auth />

			<aside class="rounded-xl border border-content/10 bg-base-100 p-5 flex flex-col gap-5">
				<div>
					<h2 class="text-lg font-bold tracking-tight text-primary-100 mb-0.5">
						{currentUniversity.acronym}
					</h2>
					<p class="text-[11px] text-content/50 leading-relaxed">{currentUniversity.fullName}</p>
				</div>

				<div class="border-t border-content/5 pt-4 flex flex-col gap-2">
					<span class="text-xs font-bold font-mono uppercase tracking-wider text-content/40"
						>Carreras / Departamentos</span
					>
					<div class="flex flex-col gap-1 mt-1">
						<button
							class="w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors {selectedCareer ===
							'Todos'
								? 'bg-primary-100/10 text-primary-100 border border-primary-100/20 font-semibold'
								: 'hover:bg-base-300/60 text-content/70'}"
							onclick={() => (selectedCareer = 'Todos')}
						>
							Todos los presets
						</button>
						{#each currentUniversity.careers as career}
							<button
								class="w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors {selectedCareer ===
								career
									? 'bg-primary-100/10 text-primary-100 border border-primary-100/20 font-semibold'
									: 'hover:bg-base-300/60 text-content/70'}"
								onclick={() => (selectedCareer = career)}
							>
								{career}
							</button>
						{/each}
					</div>
				</div>
			</aside>
		</div>

		<section class="lg:col-span-3 flex flex-col gap-3">
			{#each branchPresets as branch}
				<a
					href="/rm/{universityId?.toLowerCase()}/{branch.code.toLowerCase()}"
					class="group rounded-xl border border-content/10 bg-base-100 p-4 flex flex-col lg:grid lg:grid-cols-12 gap-4 items-start lg:items-center hover:border-primary-100/40 hover:bg-base-300 transition-all duration-150 cursor-pointer w-full"
				>
					<div class="flex items-center gap-4 min-w-0 w-full lg:col-span-7">
						<span
							class="text-xs font-mono font-bold text-primary-100 bg-primary-100/10 px-2 py-1 rounded border border-primary-100/20 shrink-0"
						>
							{branch.code}
						</span>

						<div class="flex flex-col min-w-0">
							<h3
								class="text-base font-bold tracking-tight text-content group-hover:text-primary-100 transition-colors line-clamp-1 leading-snug"
							>
								{branch.name}
							</h3>
							<div class="flex items-center gap-2 mt-0.5 text-[11px] text-content/40 font-mono">
								<span class="truncate"
									>Profe: <span class="text-content/60 font-sans">{branch.teacher}</span></span
								>
								<span class="shrink-0">•</span>
								<span class="shrink-0"
									>Periodo: <span class="text-content/60 font-sans">{branch.period}</span></span
								>
							</div>
						</div>
					</div>

					<div
						class="w-full lg:w-auto flex items-center lg:justify-start gap-2 text-xs font-mono lg:col-span-3 border-t lg:border-t-0 border-content/5 pt-3 lg:pt-0"
					>
						<div
							class="px-2.5 py-1 rounded bg-base-300/60 border border-content/5 flex items-center gap-1.5 min-w-[72px] justify-center"
						>
							<span class="text-[10px] text-content/40 uppercase tracking-tight">Notas</span>
							<span class="text-content font-bold">{branch.stats.evaluations}</span>
						</div>
						<div
							class="px-2.5 py-1 rounded bg-base-300/60 border border-content/5 flex items-center gap-1.5 min-w-[85px] justify-center"
						>
							<span class="text-[10px] text-content/40 uppercase tracking-tight">Horarios</span>
							<span class="text-content font-bold">{branch.stats.schedules}</span>
						</div>
						<div
							class="px-2.5 py-1 rounded bg-base-300/60 border border-content/5 flex items-center gap-1.5 min-w-[72px] justify-center"
						>
							<span class="text-[10px] text-content/40 uppercase tracking-tight">Usos</span>
							<span class="text-primary-100 font-bold">{branch.exportsCount}</span>
						</div>
					</div>

					<div
						class="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-4 text-[11px] font-mono lg:col-span-2 lg:justify-self-end"
					>
						<div class="flex items-center gap-1 text-content/40 min-w-[85px] lg:justify-end">
							<span>Por:</span>
							<span class="text-content/70 font-sans font-medium max-w-[65px] truncate"
								>{branch.createdBy}</span
							>
						</div>

						<div class="flex items-center gap-3 shrink-0">
							{#if branch.hasNonLinearMath}
								<span
									class="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-medium text-[10px]"
								>
									No-Lineal
								</span>
							{:else}
								<span class="text-content/30 italic text-[10px]">Ec. Lineal</span>
							{/if}

							<span
								class="text-content/30 group-hover:text-primary-100 group-hover:translate-x-0.5 transition-all hidden lg:block text-xs"
							>
								<ArrowRight />
							</span>
						</div>
					</div>
				</a>
			{/each}
		</section>
	</div>
</main>
