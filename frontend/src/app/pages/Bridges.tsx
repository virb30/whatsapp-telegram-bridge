import { useEffect, useState } from 'react';
import { http } from '../http/httpClient';

export type BridgeItem = {
	id: string;
	whatsappGroupId: string;
	telegramGroupId: string;
};

export function BridgesPage() {
	const [items, setItems] = useState<BridgeItem[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [wa, setWa] = useState('');
	const [tg, setTg] = useState('');

	async function load() {
		setLoading(true);
		setError(null);
		try {
			const res = await http.get('/api/v1/bridges');
			setItems((res.data as { items: BridgeItem[] }).items);
		} catch (e: any) {
			setError(e?.response?.data?.message ?? 'Falha ao carregar pontes');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		void load();
	}, []);

	async function handleAdd(e: React.FormEvent) {
		e.preventDefault();
		if (!wa || !tg) return;
		setError(null);
		try {
			await http.post('/api/v1/bridges', {
				whatsappGroupId: wa,
				telegramGroupId: tg,
			});
			setWa('');
			setTg('');
			await load();
		} catch (e: any) {
			setError(e?.response?.data?.message ?? 'Falha ao criar ponte');
		}
	}

	async function handleDelete(id: string) {
		setError(null);
		try {
			await http.delete(`/api/v1/bridges/${id}`);
			setItems((prev) => prev.filter((i) => i.id !== id));
		} catch (e: any) {
			setError(e?.response?.data?.message ?? 'Falha ao remover ponte');
		}
	}

	return (
		<div className="p-6 max-w-3xl mx-auto space-y-6">
			<h1 className="text-2xl font-semibold">Gerenciar Pontes</h1>

			<form onSubmit={handleAdd} className="flex flex-col gap-3 md:flex-row md:items-end">
				<div className="flex-1 flex flex-col">
					<label htmlFor="wa" className="text-sm font-medium">Grupo WhatsApp</label>
					<input id="wa" value={wa} onChange={(e) => setWa(e.target.value)}
						className="border rounded px-3 py-2" placeholder="ex: wa-group-id" />
				</div>
				<div className="flex-1 flex flex-col">
					<label htmlFor="tg" className="text-sm font-medium">Grupo Telegram</label>
					<input id="tg" value={tg} onChange={(e) => setTg(e.target.value)}
						className="border rounded px-3 py-2" placeholder="ex: tg-group-id" />
				</div>
				<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
					Adicionar
				</button>
			</form>

			{error ? (
				<div role="alert" className="text-red-600">{error}</div>
			) : null}

			{loading ? (
				<div>Carregando...</div>
			) : (
				<ul className="divide-y border rounded">
					{items.map((b) => {
						const label = `${b.whatsappGroupId} → ${b.telegramGroupId}`;
						return (
							<li key={b.id} className="flex items-center justify-between px-4 py-3">
								<span>{label}</span>
								<button
									className="text-red-600 hover:underline"
									onClick={() => handleDelete(b.id)}
									aria-label={`Remover ${label}`}
								>
									Remover
								</button>
							</li>
						);
					})}
					{items.length === 0 ? (
						<li className="px-4 py-3 text-slate-500">Nenhuma ponte cadastrada</li>
					) : null}
				</ul>
			)}
		</div>
	);
}

export default BridgesPage;
