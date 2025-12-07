import React from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function Talents({ talents }) {
    return (
        <DashboardLayout>
            <Head title="Talent Analytics" />
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-white">Talent <span className="text-pink-500">Analytics</span></h1>
                    <p className="text-gray-400">Identify the most bankable professionals in the industry.</p>
                </div>

                <div className="bg-[#181818] rounded-2xl border border-white/5 shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Top 50 Bankable Professionals</h3>
                        <button className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-bold transition-all">Export CSV</button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-white/5 text-xs uppercase font-bold text-gray-200">
                                <tr>
                                    <th className="px-6 py-4">Rank</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Profession</th>
                                    <th className="px-6 py-4 text-right">Total Votes</th>
                                    <th className="px-6 py-4 text-right">Avg Rating</th>
                                    <th className="px-6 py-4 text-center">Impact Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {talents.data.map((person, index) => (
                                    <tr key={index} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-gray-500">#{index + 1 + (talents.current_page - 1) * talents.per_page}</td>
                                        <td className="px-6 py-4 font-bold text-white group-hover:text-pink-400 transition-colors">{person.primaryName}</td>
                                        <td className="px-6 py-4 text-xs uppercase tracking-wide">{person.primaryProfession}</td>
                                        <td className="px-6 py-4 text-right font-mono text-cyan-400">{(person.TotalNumVotes / 1000).toFixed(1)}k</td>
                                        <td className="px-6 py-4 text-right font-mono text-yellow-500">{parseFloat(person.AverageRating).toFixed(1)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-xs font-bold">
                                                High
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="p-4 border-t border-white/5 flex justify-center gap-2">
                        {talents.links.map((link, i) => (
                            link.url ? (
                                <Link 
                                    key={i} 
                                    href={link.url}
                                    className={`px-3 py-1 rounded text-xs font-bold ${link.active ? 'bg-pink-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span key={i} className="px-3 py-1 text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: link.label }}></span>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}