import React, { useState } from 'react';
import DashboardLayout from '../../../Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function CompaniesIndex({ companies, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/production/companies', { search }, { preserveState: true });
    };

    return (
        <DashboardLayout>
            <Head title="Production Companies" />

            <div className="space-y-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-black text-white">Production <span className="text-blue-500">Companies</span></h1>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all">
                        <span className="material-symbols-outlined">domain_add</span> Add New
                    </button>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 material-symbols-outlined">search</span>
                    <input 
                        type="text" 
                        placeholder="Search company..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#181818] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                </form>

                {/* Table */}
                <div className="bg-[#181818] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-xs uppercase font-bold text-gray-200">
                            <tr>
                                <th className="px-6 py-4 w-24">ID</th>
                                <th className="px-6 py-4">Company Name</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {companies.data.map((company) => (
                                <tr key={company.network_id || company.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-gray-500">#{company.network_id || company.id}</td>
                                    <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-gray-500">
                                            <span className="material-symbols-outlined text-lg">domain</span>
                                        </div>
                                        {company.network_name || company.name}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-400 hover:text-blue-300 font-bold text-xs uppercase tracking-wide">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* Pagination */}
                    <div className="p-4 border-t border-white/5 flex justify-end gap-2">
                        {companies.links.map((link, i) => (
                            link.url ? (
                                <Link key={i} href={link.url} className={`px-3 py-1 rounded text-xs font-bold ${link.active ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : <span key={i} className="px-3 py-1 text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: link.label }}></span>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}