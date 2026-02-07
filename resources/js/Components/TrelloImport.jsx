import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function TrelloImport({ trelloIntegration = null, projects = [] }) {
    const [selectedBoard, setSelectedBoard] = useState('');
    const [selectedList, setSelectedList] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [boards, setBoards] = useState([]);
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [importLabels, setImportLabels] = useState(true);
    const [importDueDate, setImportDueDate] = useState(true);
    const [error, setError] = useState('');

    // Fetch boards when integration is connected
    useEffect(() => {
        if (trelloIntegration?.isConnected && !boards.length) {
            fetchBoards();
        }
    }, [trelloIntegration?.isConnected]);

    // Fetch lists when board is selected
    useEffect(() => {
        if (selectedBoard) {
            fetchLists();
        }
    }, [selectedBoard]);

    const fetchBoards = async () => {
        try {
            setLoading(true);
            const response = await fetch(route('trello.boards'));
            const data = await response.json();
            if (response.ok) {
                setBoards(data);
            } else {
                setError(data.error || 'Failed to fetch boards');
            }
        } catch (e) {
            setError('Error fetching boards: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchLists = async () => {
        try {
            setLoading(true);
            const response = await fetch(route('trello.lists') + '?board_id=' + selectedBoard);
            const data = await response.json();
            if (response.ok) {
                setLists(data.filter(list => !list.closed));
                setSelectedList('');
            } else {
                setError(data.error || 'Failed to fetch lists');
            }
        } catch (e) {
            setError('Error fetching lists: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (e) => {
        e.preventDefault();
        setError('');

        if (!selectedBoard || !selectedList || !selectedProject) {
            setError('Παρακαλώ επιλέξτε board, list και project');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(route('trello.import'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({
                    board_id: selectedBoard,
                    list_id: selectedList,
                    project_id: parseInt(selectedProject),
                    import_labels: importLabels,
                    import_due_date: importDueDate,
                }),
            });

            if (response.ok) {
                window.location.href = route('settings.index');
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to import cards');
            }
        } catch (e) {
            setError('Error importing: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = () => {
        if (confirm('Είστε σίγουροι ότι θέλετε να αποσυνδέσετε το Trello;')) {
            router.post(route('trello.disconnect'));
        }
    };

    if (!trelloIntegration?.isConnected) {
        return (
            <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Trello Integration</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Συνδέστε το Trello για να εισάγετε κάρτες ως tasks
                        </p>
                    </div>
                    <a
                        href={route('trello.authorize')}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        Connect Trello
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Trello Integration
                    </h3>
                    <p className="mt-1 text-sm text-green-600">
                        ✓ Συνδεδεμένος ως {trelloIntegration.trello_username}
                    </p>
                </div>
                <button
                    onClick={handleDisconnect}
                    className="rounded-md bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
                >
                    Disconnect
                </button>
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-4 border border-red-200">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            <form onSubmit={handleImport} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Board *
                    </label>
                    <select
                        value={selectedBoard}
                        onChange={(e) => setSelectedBoard(e.target.value)}
                        className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        disabled={loading}
                    >
                        <option value="">Select a board...</option>
                        {boards.map((board) => (
                            <option key={board.id} value={board.id}>
                                {board.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedBoard && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            List *
                        </label>
                        <select
                            value={selectedList}
                            onChange={(e) => setSelectedList(e.target.value)}
                            className="w-full rounded-md border-slate-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
                            disabled={loading || !lists.length}
                        >
                            <option value="">Select a list...</option>
                            {lists.map((list) => (
                                <option key={list.id} value={list.id}>
                                    {list.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project *
                    </label>
                    <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        className="w-full rounded-md border-slate-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
                    >
                        <option value="">Select a project...</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                                {project.name} · {project.client.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-3 pt-2">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={importLabels}
                            onChange={(e) => setImportLabels(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-slate-900"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                            Import Trello labels as tags
                        </span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={importDueDate}
                            onChange={(e) => setImportDueDate(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-slate-900"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                            Import due dates
                        </span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading || !selectedBoard || !selectedList || !selectedProject}
                    className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                >
                    {loading ? 'Importing...' : 'Import Cards'}
                </button>
            </form>

            {trelloIntegration.last_synced_at && (
                <div className="mt-4 text-xs text-gray-500">
                    Last synced: {new Date(trelloIntegration.last_synced_at).toLocaleString()}
                </div>
            )}
        </div>
    );
}
