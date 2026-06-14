<script lang="ts">
	import { page } from '$app/state';
	import { SuiteFavicons } from '@ramo-libre/ui-themes';
	import {
		ArrowLeft,
		Layers,
		FileCode,
		Clock,
		GraduationCap,
		Atom,
		Edit3,
		Calendar,
		Star,
		Gauge,
		RotateCcw,
		Plus,
		Trash2,
		Save
	} from '@lucide/svelte';
	import Icon from '@iconify/svelte';

	import katex from 'katex';
	import 'katex/dist/katex.min.css';
	import { parseScript, toLatex, statementDisplayName } from '@ramo-libre/dsl-parser';
	import type { AssignmentStatement, ConstraintStatement } from '@ramo-libre/dsl-parser';
	import Auth from '../../../_components/Auth.svelte';

	const communityId = page.params.community?.toUpperCase();
	const branchCode = page.params.branch?.toUpperCase();

	const originalBranchDetail = {
		code: branchCode || 'INF-221',
		name: 'Estructuras de Datos y Algoritmos',
		teacher: 'Carlos Castro',
		period: '2026-1',
		department: 'Departamento de Informática',
		description:
			'Estudio de estructuras de datos abstractas, algoritmos de ordenación, búsqueda y análisis de complejidad computacional bajo restricciones de memoria.',
		hasNonLinearMath: true,
		dslFormula: 'C1 * 0.30 + C2 * 0.30 + C3 * 0.30 + (T1+T2+T3)/3 * 0.10',
		dslScriptRaw: 'C1 * 0.30 + C2 * 0.30 + C3 * 0.30 + prom(T1, T2, T3) * 0.10\nNF >= 55\nC1 >= 50',
		meta: { difficulty: 'Alta', rating: 4.8, votes: 42 },
		evaluations: [
			{ name: 'Certamen 1', weight: 30, type: 'Certamen' },
			{ name: 'Certamen 2', weight: 30, type: 'Certamen' },
			{ name: 'Certamen 3', weight: 30, type: 'Certamen' },
			{ name: 'Tareas Prácticas', weight: 10, type: 'Tarea' }
		],
		schedule: [
			{ day: 'Lunes', time: '08:15 - 09:25', room: 'C-201' },
			{ day: 'Miércoles', time: '09:40 - 10:50', room: 'Lab-Inf' }
		],
		dates: [
			{ event: 'Certamen 1', date: 'Abril 15', priority: 'Alta', room: 'C-201' },
			{ event: 'Entrega 1', date: 'Mayo 04', priority: 'Media', room: 'Aula Virtual' },
			{ event: 'Certamen 2', date: 'Mayo 27', priority: 'Alta', room: 'B-212' },
			{ event: 'Certamen 3', date: 'Julio 01', priority: 'Baja', room: '' }
		]
	};

	let branchDetail = $state(JSON.parse(JSON.stringify(originalBranchDetail)));

	let exportSchedule = $state(true);
	let exportGrades = $state(true);
	let exportFormula = $state(true);
	let exportCalendar = $state(true);

	let activeTab = $state<'horarios' | 'calendario' | 'notas' | 'avanzado'>('horarios');
	let isEditing = $state(false);

	let scriptInput = $state(branchDetail.dslScriptRaw);

	let statements = $derived(parseScript(branchDetail.dslScriptRaw));
	let renderableStatements = $derived(
		statements.filter(
			(s): s is AssignmentStatement | ConstraintStatement =>
				s.type === 'assignment' || s.type === 'constraint'
		)
	);

	function renderStatementToLatex(stmt: any): string {
		try {
			return katex.renderToString(toLatex(stmt), { displayMode: false, throwOnError: true });
		} catch {
			return `<span class="text-error font-mono text-xs">Error de sintaxis DSL</span>`;
		}
	}

	function handleToggleEdit() {
		isEditing = !isEditing;
		if (!isEditing) {
			branchDetail = JSON.parse(JSON.stringify(originalBranchDetail));
			scriptInput = branchDetail.dslScriptRaw;
		}
	}

	function handleApplyScript() {
		branchDetail.dslScriptRaw = scriptInput;
	}

	function addScheduleRow() {
		branchDetail.schedule.push({ day: 'Lunes', time: '11:40 - 12:50', room: 'Sala' });
	}
	function removeScheduleRow(index: number) {
		branchDetail.schedule.splice(index, 1);
	}

	function addDateRow() {
		branchDetail.dates.push({ event: 'Nuevo Hito', date: 'S/F', priority: 'Media', room: '' });
	}

	function addEvaluationRow() {
		branchDetail.evaluations.push({ name: 'Nueva Evaluación', weight: 10, type: 'Otro' });
	}
	function removeEvaluationRow(index: number) {
		branchDetail.evaluations.splice(index, 1);
	}

	function handleWebExport() {
		console.log('Exportando...');
	}
	function handleLabExport() {
		console.log('Abriendo sandbox Lab...');
	}
	function handleCalendarExport() {
		console.log('Sincronizando GCalendar...');
	}
</script>

<main
	class="w-full h-auto lg:h-dvh p-4 md:p-6 text-content flex flex-col gap-6 select-none lg:overflow-hidden bg-base-200/30"
>
	<section
		class="w-full rounded-xl border border-content/10 bg-base-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0"
	>
		<div class="flex items-center gap-3 min-w-0">
			<a
				href="/rm/{communityId?.toLowerCase()}"
				class="p-2 rounded-lg bg-base-300/60 hover:bg-base-300 text-content/60 hover:text-content transition-colors text-xs font-mono border border-content/5 shrink-0"
			>
				<ArrowLeft />
			</a>
			<div class="h-4 w-[1px] bg-content/10 hidden sm:block"></div>

			<div class="flex flex-col min-w-0">
				<div class="flex items-center gap-2 flex-wrap">
					<span class="text-[10px] font-mono text-content/40 uppercase tracking-wider"
						>rm / {communityId?.toLowerCase()}</span
					>
					<span
						class="text-[9px] font-mono bg-base-300 text-content/50 px-1.5 py-0.5 rounded border border-content/5"
						>{branchDetail.period}</span
					>
					{#if branchDetail.hasNonLinearMath}
						<span
							class="text-[9px] font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20"
							>No-Lineal</span
						>
					{/if}
				</div>
				<h1 class="text-base font-bold tracking-tight text-content truncate mt-0.5">
					<span class="font-mono text-primary-100 font-semibold">{branchDetail.code}</span> — {branchDetail.name}
				</h1>
			</div>
		</div>

		<div
			class="flex items-center gap-3 text-xs font-mono shrink-0 border-t sm:border-t-0 border-content/5 pt-3 sm:pt-0 justify-between sm:justify-end"
		>
			<div class="flex flex-col sm:items-end">
				<span class="text-[10px] text-content/40 uppercase">Estatus Preset</span>
				<span class="text-emerald-500 font-bold flex items-center gap-1 mt-0.5">
					<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Verificado
				</span>
			</div>
		</div>
	</section>

	<div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start flex-1 min-h-0 lg:overflow-hidden">
		<div class="flex flex-col gap-4 md:gap-5 shrink-0">
			<Auth />

			<aside class="rounded-xl border border-content/10 bg-base-100 p-5 flex flex-col gap-5">
				<div>
					<h2 class="text-lg font-bold tracking-tight text-content flex items-center gap-2">
						<Layers class="w-4 h-4 text-primary-100" /> Exportar
					</h2>
					<p class="text-[11px] text-content/50 mt-1 leading-relaxed">
						Selecciona qué datos deseas exportar.
					</p>
				</div>

				<div class="flex flex-col gap-2 bg-base-300/30 p-3 rounded-lg border border-content/5">
					<label class="flex items-center justify-between text-xs cursor-pointer group">
						<div class="flex flex-col">
							<span class="font-bold text-content/80 group-hover:text-content transition-colors"
								>Horarios</span
							>
							<span class="text-[10px] text-content/40 font-mono flex items-center gap-1 mt-0.5">
								<Clock class="w-3 h-3" />
								{branchDetail.schedule.length} bloques listos
							</span>
						</div>
						<input
							type="checkbox"
							bind:checked={exportSchedule}
							class="accent-primary-100 rounded w-4 h-4 cursor-pointer"
						/>
					</label>

					<div class="h-[1px] bg-content/5 my-1"></div>

					<label class="flex items-center justify-between text-xs cursor-pointer group">
						<div class="flex flex-col">
							<span class="font-bold text-content/80 group-hover:text-content transition-colors"
								>Calendario de Hitos</span
							>
							<span class="text-[10px] text-content/40 font-mono flex items-center gap-1 mt-0.5">
								<Calendar class="w-3 h-3" />
								{branchDetail.dates.length} fechas críticas
							</span>
						</div>
						<input
							type="checkbox"
							bind:checked={exportCalendar}
							class="accent-primary-100 rounded w-4 h-4 cursor-pointer"
						/>
					</label>

					<div class="h-[1px] bg-content/5 my-1"></div>

					<label class="flex items-center justify-between text-xs cursor-pointer group">
						<div class="flex flex-col">
							<span class="font-bold text-content/80 group-hover:text-content transition-colors"
								>Estructura de Notas Simplificada</span
							>
							<span class="text-[10px] text-content/40 font-mono flex items-center gap-1 mt-0.5">
								<GraduationCap class="w-3 h-3" />
								{branchDetail.evaluations.length} ponderaciones
							</span>
						</div>
						<input
							type="checkbox"
							bind:checked={exportGrades}
							class="accent-primary-100 rounded w-4 h-4 cursor-pointer"
						/>
					</label>

					{#if branchDetail.hasNonLinearMath}
						<div class="h-[1px] bg-content/5 my-1"></div>
						<label class="flex items-center justify-between text-xs cursor-pointer group">
							<div class="flex flex-col">
								<span class="font-bold text-content/80 group-hover:text-content transition-colors"
									>Estructura de Notas Avanzada</span
								>
								<span class="text-[10px] text-content/40 font-mono flex items-center gap-1 mt-0.5">
									<FileCode class="w-3 h-3" /> Ecuaciones DSL
								</span>
							</div>
							<input
								type="checkbox"
								bind:checked={exportFormula}
								class="accent-primary-100 rounded w-4 h-4 cursor-pointer"
							/>
						</label>
					{/if}
				</div>

				<div class="flex flex-col gap-2 border-t border-content/5 pt-4">
					<button
						onclick={handleWebExport}
						disabled={!exportSchedule && !exportGrades && !exportCalendar}
						class="w-full cursor-pointer px-4 py-2.5 text-xs font-bold rounded-lg bg-primary-100 text-base-100 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2.5 shadow-sm"
					>
						<img src={SuiteFavicons.web} alt="Web" class="w-4 h-4 object-contain" />
						Agregar a RamoLibre
					</button>

					{#if branchDetail.hasNonLinearMath}
						<button
							onclick={handleLabExport}
							disabled={!exportFormula}
							class="w-full cursor-pointer px-4 py-2.5 text-xs font-bold rounded-lg bg-base-300 hover:bg-base-300/80 text-content disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2.5"
						>
							<img src={SuiteFavicons.lab} alt="Lab" class="w-4 h-4 object-contain" />
							Probar en Lab
						</button>
					{/if}

					<button
						onclick={handleCalendarExport}
						disabled={!exportSchedule && !exportCalendar}
						class="w-full cursor-pointer bg-base-200 px-4 py-2 text-xs font-medium rounded-lg text-content hover:text-content hover:bg-base-300 font-mono transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed mt-1"
					>
						<Icon icon="logos:google-calendar" class="w-3.5 h-3.5" />
						Google Calendar
					</button>
				</div>
			</aside>

			<div class="rounded-xl border border-content/10 bg-base-100 p-4 flex flex-col gap-3">
				<div class="flex items-center gap-2">
					<Edit3 class="w-3.5 h-3.5 text-content/40" />
					<h4 class="text-xs font-bold font-mono uppercase tracking-wide text-content/40">
						Modificación Local
					</h4>
				</div>
				<p class="text-[11px] text-content/50 leading-normal">
					{isEditing
						? 'Estás editando el preset. Puedes agregar, quitar u mutar filas e inputs.'
						: 'Ajusta los parámetros directamente en local antes de exportarlo.'}
				</p>
				<button
					onclick={handleToggleEdit}
					class="w-full cursor-pointer mt-1 px-3 py-2 text-xs font-semibold rounded-lg border transition-all text-center flex items-center justify-center gap-2
                    {isEditing
						? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20'
						: 'bg-base-300/60 text-content border-content/5 hover:bg-base-300'}"
				>
					{#if isEditing}
						<RotateCcw class="w-3.5 h-3.5" /> Restaurar valores
					{:else}
						Activar edición
					{/if}
				</button>
			</div>
		</div>

		<div class="lg:col-span-3 lg:h-full flex flex-col gap-5 lg:overflow-hidden">
			<div class="rounded-xl border border-content/10 bg-base-100 p-6 flex flex-col gap-4 shrink-0">
				<div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 w-full">
					<div>
						<h3 class="text-xl font-bold tracking-tight">{branchDetail.name}</h3>
						<p class="text-sm text-content/60 mt-1">
							Profesor titular: <span class="text-content font-medium">{branchDetail.teacher}</span>
							• {branchDetail.department}
						</p>
					</div>

					<div
						class="flex flex-wrap items-center gap-2 text-xs font-mono shrink-0 self-start sm:self-auto"
					>
						<div
							class="flex items-center gap-1.5 bg-amber-500/5 text-amber-500 border border-amber-500/10 px-2 py-1 rounded"
						>
							<Star class="w-3.5 h-3.5 fill-amber-500/10" />
							<span class="text-content font-bold">{branchDetail.meta.rating}</span>
						</div>
						<div
							class="flex items-center gap-1.5 bg-red-500/5 text-red-400 border border-red-500/10 px-2 py-1 rounded"
						>
							<Gauge class="w-3.5 h-3.5" />
							<span class="font-bold">{branchDetail.meta.difficulty}</span>
						</div>
					</div>
				</div>
				<p
					class="text-xs text-content/50 leading-relaxed max-w-3xl border-t border-content/5 pt-3.5"
				>
					{branchDetail.description}
				</p>
			</div>

			<div
				class="bg-base-100 border border-content/10 flex gap-0.5 rounded-lg p-1 text-xs font-medium shrink-0 overflow-x-auto max-w-full scrollbar-none"
			>
				<button
					onclick={() => (activeTab = 'horarios')}
					class="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 transition-all {activeTab ===
					'horarios'
						? 'bg-base-300 text-content font-semibold'
						: 'text-content/50 hover:text-content'}"
				>
					<Clock size={13} /> Horarios
				</button>
				<button
					onclick={() => (activeTab = 'calendario')}
					class="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 transition-all {activeTab ===
					'calendario'
						? 'bg-base-300 text-content font-semibold'
						: 'text-content/50 hover:text-content'}"
				>
					<Calendar size={13} /> Calendario
				</button>
				<button
					onclick={() => (activeTab = 'notas')}
					class="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 transition-all {activeTab ===
					'notas'
						? 'bg-base-300 text-content font-semibold'
						: 'text-content/50 hover:text-content'}"
				>
					<GraduationCap size={13} /> Notas
				</button>
				{#if branchDetail.hasNonLinearMath}
					<button
						onclick={() => (activeTab = 'avanzado')}
						class="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 transition-all {activeTab ===
						'avanzado'
							? 'bg-base-300 text-content font-semibold'
							: 'text-content/50 hover:text-content'}"
					>
						<Atom size={13} /> Notas Avanzado
					</button>
				{/if}
			</div>

			<div class="h-auto lg:flex-1 lg:min-h-0 lg:overflow-y-auto pr-1 pb-4 scrollbar-thin">
				{#if activeTab === 'horarios'}
					<div
						class="rounded-xl border border-content/10 bg-base-100 p-5 flex flex-col gap-4 opacity={exportSchedule
							? '1'
							: '40'} transition-opacity"
					>
						<div class="flex items-center justify-between">
							<h4
								class="text-xs font-bold font-mono uppercase tracking-wider text-content/40 flex items-center gap-1.5"
							>
								<Clock class="w-3.5 h-3.5" /> Horarios de Clase
							</h4>
							{#if isEditing}
								<button
									onclick={addScheduleRow}
									class="flex items-center gap-1 text-[11px] font-mono bg-primary-100/10 border border-primary-100/20 text-primary-100 px-2 py-1 rounded hover:bg-primary-100 hover:text-base-100 transition-all cursor-pointer"
								>
									<Plus size={12} /> Añadir Bloque
								</button>
							{/if}
						</div>

						<div class="flex flex-col gap-2">
							{#each branchDetail.schedule as sch, i}
								<div
									class="flex items-center justify-between p-3 rounded-lg bg-base-300/40 border border-content/5 text-xs font-mono gap-3"
								>
									<div class="flex items-center gap-2 flex-1 min-w-0">
										{#if isEditing}
											<select
												bind:value={sch.day}
												class="bg-base-100 border border-content/10 rounded px-1.5 py-1 text-content font-bold focus:outline-none focus:border-primary-100 text-xs"
											>
												<option>Lunes</option><option>Martes</option><option>Miércoles</option
												><option>Jueves</option><option>Viernes</option>
											</select>
											<input
												type="text"
												bind:value={sch.time}
												class="bg-base-100 border border-content/10 rounded px-2 py-1 text-content flex-1 font-sans focus:outline-none focus:border-primary-100 text-xs"
											/>
										{:else}
											<span class="font-bold text-primary-100">{sch.day}</span>
											<span class="text-content/30">|</span>
											<span class="text-content/80 font-sans">{sch.time}</span>
										{/if}
									</div>

									<div class="flex items-center gap-2">
										{#if isEditing}
											<input
												type="text"
												bind:value={sch.room}
												class="bg-base-100 border border-content/10 rounded px-2 py-1 text-content font-bold w-20 text-center focus:outline-none focus:border-primary-100 text-xs"
											/>
											<button
												onclick={() => removeScheduleRow(i)}
												class="p-1.5 text-content/40 hover:text-error hover:bg-error/10 rounded border border-transparent hover:border-error/20 transition-colors cursor-pointer"
											>
												<Trash2 size={13} />
											</button>
										{:else}
											<span
												class="px-2 py-0.5 rounded bg-base-300 border border-content/10 font-bold text-content/60"
												>{sch.room}</span
											>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{:else}
					{#if activeTab === 'calendario'}
						<div
							class="rounded-xl border border-content/10 bg-base-100 p-5 flex flex-col gap-4 opacity={exportCalendar
								? '1'
								: '40'} transition-opacity"
						>
							<div class="flex items-center justify-between">
								<h4
									class="text-xs font-bold font-mono uppercase tracking-wider text-content/40 flex items-center gap-1.5"
								>
									<Calendar class="w-3.5 h-3.5" /> Hitos Académicos
								</h4>
								{#if isEditing}
									<button
										onclick={addDateRow}
										class="flex items-center gap-1 text-[11px] font-mono bg-primary-100/10 border border-primary-100/20 text-primary-100 px-2 py-1 rounded hover:bg-primary-100 hover:text-base-100 transition-all cursor-pointer"
									>
										<Plus size={12} /> Añadir Hito
									</button>
								{/if}
							</div>

							<div class="flex flex-col gap-2">
								{#each branchDetail.dates as item, i}
									<div
										class="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-base-300/40 border border-content/5 text-xs gap-3"
									>
										<div class="flex-1 min-w-0 flex flex-col gap-1">
											{#if isEditing}
												<input
													type="text"
													bind:value={item.event}
													class="bg-base-100 border border-content/10 rounded px-2 py-1 text-content font-bold focus:outline-none focus:border-primary-100 text-xs w-full"
													placeholder="Nombre del hito..."
												/>
												<div class="flex items-center gap-2 mt-1">
													<select
														bind:value={item.priority}
														class="bg-base-100 border border-content/10 rounded px-1.5 py-0.5 text-content font-mono focus:outline-none focus:border-primary-100 text-[10px]"
													>
														<option value="Alta">Alta</option>
														<option value="Media">Media</option>
														<option value="Baja">Baja</option>
													</select>
													<input
														type="text"
														bind:value={item.room}
														class="bg-base-100 border border-content/10 rounded px-2 py-0.5 text-content/60 font-sans focus:outline-none focus:border-primary-100 text-[11px] flex-1"
														placeholder="Lugar/Sala (Opcional)..."
													/>
												</div>
											{:else}
												<div class="flex items-center gap-2 flex-wrap">
													<span class="font-bold text-content/80 leading-snug">{item.event}</span>
													<span
														class="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border
                                                        {item.priority === 'Alta'
															? 'bg-red-500/10 text-red-400 border-red-500/20'
															: ''}
                                                        {item.priority === 'Media'
															? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
															: ''}
                                                        {item.priority === 'Baja' || !item.priority
															? 'bg-content/5 text-content/40 border-content/10'
															: ''}"
													>
														{item.priority || 'Media'}
													</span>
												</div>
												{#if item.room && item.room.trim() !== ''}
													<span class="text-[10px] text-content/40 font-mono tracking-tight">
														Lugar: <span class="text-content/60 font-sans">{item.room}</span>
													</span>
												{/if}
											{/if}
										</div>

										<div
											class="flex items-center justify-between sm:justify-end gap-2 shrink-0 border-t sm:border-t-0 border-content/5 pt-2 sm:pt-0"
										>
											{#if isEditing}
												<input
													type="text"
													bind:value={item.date}
													class="bg-base-100 border border-content/10 rounded px-2 py-1 text-primary-100 font-mono font-semibold text-center focus:outline-none focus:border-primary-100 text-xs w-28"
													placeholder="Ej: Abril 15"
												/>
												<button
													onclick={() => branchDetail.dates.splice(i, 1)}
													class="p-1.5 text-content/40 hover:text-error hover:bg-error/10 rounded border border-transparent hover:border-error/20 transition-colors cursor-pointer"
												>
													<Trash2 size={13} />
												</button>
											{:else}
												<span
													class="font-mono font-semibold text-primary-100 bg-primary-100/5 px-2 py-1 rounded border border-primary-100/10 shrink-0"
												>
													{item.date}
												</span>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</div>
					{:else}
						{#if activeTab === 'notas'}
							<div
								class="rounded-xl border border-content/10 bg-base-100 p-5 flex flex-col gap-4 opacity={exportGrades
									? '1'
									: '40'} transition-opacity"
							>
								<div class="flex items-center justify-between">
									<h4
										class="text-xs font-bold font-mono uppercase tracking-wider text-content/40 flex items-center gap-1.5"
									>
										<GraduationCap class="w-3.5 h-3.5" /> Estructura de Evaluaciones (simplificada)
									</h4>
									{#if isEditing}
										<button
											onclick={addEvaluationRow}
											class="flex items-center gap-1 text-[11px] font-mono bg-primary-100/10 border border-primary-100/20 text-primary-100 px-2 py-1 rounded hover:bg-primary-100 hover:text-base-100 transition-all cursor-pointer"
										>
											<Plus size={12} /> Añadir Ítem
										</button>
									{/if}
								</div>

								<div class="grid grid-cols-1 gap-2">
									{#each branchDetail.evaluations as ev, i}
										<div
											class="flex justify-between items-center px-3 py-2 rounded-lg bg-base-300/40 border border-content/5 text-xs gap-3"
										>
											{#if isEditing}
												<input
													type="text"
													bind:value={ev.name}
													class="bg-base-100 border border-content/10 rounded px-2 py-1 text-content font-medium flex-1 focus:outline-none focus:border-primary-100 text-xs"
												/>
												<div class="flex items-center gap-2 shrink-0">
													<div class="relative flex items-center">
														<input
															type="number"
															bind:value={ev.weight}
															class="bg-base-100 border border-content/10 rounded no-spinner pl-2 pr-5 py-1 text-primary-100 font-mono font-bold text-right focus:outline-none focus:border-primary-100 text-xs w-16"
														/>
														<span
															class="absolute right-2 text-primary-100 font-mono font-bold text-[11px] pointer-events-none"
															>%</span
														>
													</div>
													<button
														onclick={() => removeEvaluationRow(i)}
														class="p-1.5 text-content/40 hover:text-error hover:bg-error/10 rounded border border-transparent hover:border-error/20 transition-colors cursor-pointer"
													>
														<Trash2 size={13} />
													</button>
												</div>
											{:else}
												<span class="font-medium text-content/80">{ev.name}</span>
												<span class="font-mono font-bold text-primary-100">{ev.weight}%</span>
											{/if}
										</div>
									{/each}
								</div>
							</div>
						{:else}
							{#if activeTab === 'avanzado' && branchDetail.hasNonLinearMath}
								<div
									class="rounded-xl border border-content/10 bg-base-100 p-5 flex flex-col gap-4"
								>
									<h4
										class="text-xs font-bold font-mono uppercase tracking-wider text-content/40 flex items-center gap-1.5"
									>
										<Atom class="w-3.5 h-3.5" /> Restricciones avanzadas
									</h4>

									<div class="flex flex-col gap-2.5">
										{#each renderableStatements as stmt}
											{@const isAssignment = stmt.type === 'assignment'}
											{@const displayName = statementDisplayName(stmt)}

											<div
												class="flex flex-col rounded-lg border border-content/5 bg-base-300/30 p-3 font-mono text-xs"
											>
												<div
													class="text-content pointer-events-none flex min-h-10 items-center justify-center py-1 text-base select-none"
												>
													{@html renderStatementToLatex(stmt)}
												</div>

												<div
													class="mt-2 border-t border-content/5 pt-2 flex items-center justify-between text-[10px] text-content/40"
												>
													<span class="truncate font-medium text-content/60">{displayName}</span>
													<span
														class="rounded px-1.5 py-0.5 text-[8px] font-bold tracking-wider uppercase {isAssignment
															? 'bg-primary-100/10 text-primary-100'
															: 'bg-base-400/50 text-content/50'}"
													>
														{isAssignment ? 'cómputo' : 'restricción'}
													</span>
												</div>
											</div>
										{/each}
									</div>

									{#if exportFormula}
										<div class="border-t border-content/5 pt-4">
											<div class="flex items-center justify-between mb-2">
												<span
													class="text-[10px] font-mono uppercase tracking-wider text-content/40 flex items-center gap-1"
												>
													<FileCode class="w-3 h-3" />
													{isEditing
														? 'Editor de Reglas del Hub (Compilador)'
														: 'DSL Script Original'}
												</span>
												{#if isEditing}
													<button
														onclick={handleApplyScript}
														class="flex items-center gap-1 text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded hover:bg-emerald-500 hover:text-base-100 transition-all cursor-pointer"
													>
														<Save size={11} /> Compilar reglas
													</button>
												{/if}
											</div>

											{#if isEditing}
												<textarea
													bind:value={scriptInput}
													spellcheck="false"
													class="w-full h-32 p-3 rounded-lg bg-base-300/60 font-mono text-[11px] text-content focus:outline-none focus:border-primary-100 border border-content/10 resize-none scrollbar-thin leading-relaxed"
													placeholder="// Escribe tus reglas aquí..."
												></textarea>
											{:else}
												<pre
													class="p-2.5 rounded bg-base-300 font-mono text-[10px] text-content/60 border border-content/5 overflow-x-auto whitespace-pre-wrap select-text">{branchDetail.dslScriptRaw}</pre>
											{/if}
										</div>
									{/if}
								</div>
							{/if}
						{/if}
					{/if}
				{/if}
			</div>
		</div>
	</div>
</main>
