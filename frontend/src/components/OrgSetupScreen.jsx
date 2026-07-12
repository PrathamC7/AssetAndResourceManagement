import React from 'react';

export function OrgSetupScreen({ onNavigate, user, onAction }) {
  return (
    <>
      <div className="flex-1 overflow-y-auto p-margin-desktop custom-scrollbar"><div className="flex-1 overflow-y-auto p-margin-desktop custom-scrollbar">
{/* Page Header Area */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-lg">
<div>
<h2 className="font-headline-xl text-headline-xl mb-1">Organization Setup</h2>
<p className="text-on-surface-variant font-body-md text-body-md">Configure your enterprise structure, hierarchies, and team memberships.</p>
</div>
<button className="flex items-center gap-2 bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-button shadow-lg hover:shadow-xl transition-all active:scale-95" onClick={() => { if(typeof onAction === "function") onAction("openDrawer"); }}>
<span className="material-symbols-outlined">add</span>
<span>Add Department</span>
</button>
</div>
{/* Tabbed Interface */}
<div className="bg-surface-container-lowest rounded-[18px] shadow-sm mb-lg">
<div className="flex border-b border-outline-variant/20 px-6">
<button className="px-6 py-4 font-label-md text-label-md text-primary border-b-2 border-primary">Departments</button>
<button className="px-6 py-4 font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors">Categories</button>
<button className="px-6 py-4 font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors">Employees</button>
</div>
{/* Modern Data Table */}
<div className="overflow-x-auto">
<table className="w-full border-collapse text-left">
<thead className="sticky top-0 bg-surface-container-lowest z-10">
<tr>
<th className="px-8 py-5 font-label-md text-label-md text-on-surface-variant border-b border-outline-variant/20">Name</th>
<th className="px-8 py-5 font-label-md text-label-md text-on-surface-variant border-b border-outline-variant/20">Head / Manager</th>
<th className="px-8 py-5 font-label-md text-label-md text-on-surface-variant border-b border-outline-variant/20">Members</th>
<th className="px-8 py-5 font-label-md text-label-md text-on-surface-variant border-b border-outline-variant/20">Status</th>
<th className="px-8 py-5 font-label-md text-label-md text-on-surface-variant border-b border-outline-variant/20 text-right">Actions</th>
</tr>
</thead>
<tbody className="font-body-md text-body-md">
{/* Row 1 */}
<tr className="group hover:bg-surface-container-low/50 transition-colors">
<td className="px-8 py-6 border-b border-outline-variant/10">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
<span className="material-symbols-outlined">terminal</span>
</div>
<span className="font-semibold">Engineering</span>
</div>
</td>
<td className="px-8 py-6 border-b border-outline-variant/10">
<div className="flex items-center gap-2">
<div className="w-7 h-7 rounded-full bg-slate-200">
<img className="w-full h-full object-cover rounded-full" data-alt="Close-up portrait of a woman with glasses, smiling professionally, in a high-tech modern office space. The image follows a corporate SaaS aesthetic with bright, airy lighting and subtle depth of field." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx-H1iMw5RcdhVXZA8srVAU0nV_T8Yokw-mzm-zo0ACRnlQa4cK_MqhiK_JksH1yDQNuEQzkarcJV4O67CBtmyfBX4B0Ug29_bof_smQhgCCfz_VSzLM4_02pEQE52uDsgPZwdP3CJui4U8VesXEWe4E9rwfp_gUC0ymefn-W2TjG3ndAibv_4W6xEbKXuGkNnwSz9RS4GoufNs7w-NS121sYc87XawQNv-wTBxcurWTCUhupvM_DPJA"/>
</div>
<span>Sarah Jenkins</span>
</div>
</td>
<td className="px-8 py-6 border-b border-outline-variant/10">
<div className="flex -space-x-2">
<div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-slate-100 overflow-hidden"><img className="object-cover" data-alt="Portrait of a young software engineer in a modern collaborative workspace." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmcbVyZpccP_MAlVXd-_x0Mz2xo4mAjzpaRAU_rU7Ux8aYvk_LssxU3jJCK8YPGsmCPhqAFZRq5RNoYAzJ1y7v0LTzRWEj4reyL_jbWKfLOqOctc17x0RSxd3JMru0c6nd_--EoVpCA5tSB4QzaYlSuDMthRud3PXK3ovuDL0nGHZsw_Vkd-PP4pdnLc3gil2LXDThA9QXgbcFHaZyWmqRbRFY7ysAyHfYSX59wEBmwpTSGDQ2V1YY_A"/></div>
<div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-slate-100 overflow-hidden"><img className="object-cover" data-alt="Portrait of a senior developer in a sleek modern office." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZf6JE5TLi2ofpgDxV1LeDhx9gtcG_FjwXvJmgmoiwi5Q0D3VdCoYIb-aQ6C39a3mGBDFcrMRsRbvPFRfXZOPLIBpXXRUlM-V1HQGucJ7FOoaIcE5e9o7OzgkJi2DVPCnvFWjeOtv0JqtgtySVy7OAJfA0g9DUHIcgW0b5cW48VO_BB_4RowliuRbjh9epqZqIPYb2aqX2FWUjfRZQpLWVnn50GyrE6vD-rGDj_CuSeqc1KaMG841S2A"/></div>
<div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-slate-100 overflow-hidden"><img className="object-cover" data-alt="Portrait of a QA engineer smiling in a professional tech environment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRo9TOapL24mWaLU8-hdjP3jrS2jKMy9iB7rDI-CS7hEETza9WayvPQdQxxXmQ8-R6MON0JOIXj4BcFCOIevmqh-0YKkeNaR3F5x5A5cbC3986quawU1PKzs2cuW9oOdYcTy2CcPgL0Mruz3zDG4ARbUQGvry4Fhg3_jdzCniKXAAwbGPrS2K6kFIX6Ntnjr_ndWJg7yFKakDTvRBjmBYEIQeX4Nvjo_-_0jLjs4dttmi5yDV16Usv5g"/></div>
<div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-surface-container-high flex items-center justify-center text-[10px] font-bold">+14</div>
</div>
</td>
<td className="px-8 py-6 border-b border-outline-variant/10">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-success/10 text-success uppercase">Active</span>
</td>
<td className="px-8 py-6 border-b border-outline-variant/10 text-right">
<button className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
{/* Row 2 */}
<tr className="group hover:bg-surface-container-low/50 transition-colors">
<td className="px-8 py-6 border-b border-outline-variant/10">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
<span className="material-symbols-outlined">payments</span>
</div>
<span className="font-semibold">Finance &amp; Operations</span>
</div>
</td>
<td className="px-8 py-6 border-b border-outline-variant/10">
<div className="flex items-center gap-2">
<div className="w-7 h-7 rounded-full bg-slate-200">
<img className="w-full h-full object-cover rounded-full" data-alt="A portrait of a male finance director wearing a tailored suit in a bright, modern glass-walled office. The style is professional and crisp, with a neutral color palette." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ7oULdd0IAKK46UyWYYe914qjTNtmVtwpko7VItamN9iXUmpSiFfHPpH2WgEWciRr0Bn62t9umHEMN4oBEiwwb3hzPlIecG0xsMQzqOKn4B-BzprRBURp6hMtzIBDPqU-VoEbaybzh3M5hETVj-vbZLNXKM8XoQiQ7Ui-vPjTc4nzodLUT0BMOrHQc7CJ1_sMbasgnni7AclzLHUilKgqz48HqF_VsLrYSW96k1W19CzuwVh8f-RWNQ"/>
</div>
<span>Mark Henderson</span>
</div>
</td>
<td className="px-8 py-6 border-b border-outline-variant/10">
<div className="flex -space-x-2">
<div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-slate-100 overflow-hidden"><img className="object-cover" data-alt="A business analyst in a contemporary office setting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpJdK_LK4JtIghbylGrdyr_sfjgvokgZuFqZroRO7ChhySBS7VS9ycULt0ta96BUYwPyEnS77L_YCbHU4o3e_6QYXNC4bdmFVFz5HWbNcbQM8zhC_9Fm8nchgJ_nuAbght5EhQSiMRIg47mvhkYbrZSoWXiWrPj_rw-xnbLDKH5J8ifcqAcCl_CZKVvUNyKy55i3TERRifBuQoB3N4pX5KA39028uNPzkkNNaG4J6NpTAebWo7YrFohg"/></div>
<div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-slate-100 overflow-hidden"><img className="object-cover" data-alt="An accountant working in a professional corporate environment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA08M6a8eSqtPHvkjMlzHB1UtGDskWUXk15WtwQ_2SY6YLKdZthPlgV9Xzo52fKBVMSjAm5fw7ziCbn5s-XBoxxNqzLOW-pH7tjS2s-weNn4m3K-riedx8xYGRslZoki7zaRkVM7MWSux-KnTNIgoiCKpga16IpLz79VhDkKct4cHCwS6ugt9vZb4RE-getMLFcdqTlo8ha-7AGYyioafy0K7Bq0HGI1x3ik_HTrpNM_g7Nwja4tGLDcQ"/></div>
<div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-surface-container-high flex items-center justify-center text-[10px] font-bold">+8</div>
</div>
</td>
<td className="px-8 py-6 border-b border-outline-variant/10">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-success/10 text-success uppercase">Active</span>
</td>
<td className="px-8 py-6 border-b border-outline-variant/10 text-right">
<button className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
{/* Row 3 */}
<tr className="group hover:bg-surface-container-low/50 transition-colors">
<td className="px-8 py-6 border-b border-outline-variant/10">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
<span className="material-symbols-outlined">palette</span>
</div>
<span className="font-semibold">Brand Design</span>
</div>
</td>
<td className="px-8 py-6 border-b border-outline-variant/10">
<div className="flex items-center gap-2">
<div className="w-7 h-7 rounded-full bg-slate-200">
<img className="w-full h-full object-cover rounded-full" data-alt="A portrait of a creative director in a stylish, minimalist studio environment with colorful art on the walls. High-end lighting, professional aesthetic, vibrant but controlled color palette." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhtxKTjM6TDAwXZO0gjb1-gR8MzvgzUo6qGi-fb6iEwJqaXiYrpaqQQLMwNUqnSI1VV8me5R5U1ROcDqCq8pu2UvzyV2evb0CYF2mZU4UKT6PzoTAGBeFJLzp_ua8tdnIw4gl_8Diu-6dlqDLvwd9o8TJZuBdVLBXRmgugwzi5vpQmLj7sU4mbET_vhom-8qCgVkoarA6o7PQnMe3ljjSlRpsSrwwEOHDnh9If5gbr36Dr4nnINXjKUw"/>
</div>
<span>Elena Rodriguez</span>
</div>
</td>
<td className="px-8 py-6 border-b border-outline-variant/10">
<div className="flex -space-x-2">
<div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-slate-100 overflow-hidden"><img className="object-cover" data-alt="A graphic designer working in a bright creative studio." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvqKbhfaRc8s6se9ynEVD-pYVwzH5AgR07EDA49s7MQGtCTsvyWzxTxvBoijdke7TgOzFVgyniIXYM34A8YRGt-aXx8suiDMkPwjtDXMgMjg-rfirwn3FRoQp8UEuQwUwhI8K_uvdBhrYG68MWVcV6hiBLESIM_6dYysNMPNEUfi51shHRozYD_Eff7-hU6ukj9pqvHRQBB2HPrXBf6f0jvvP4iMdpNSAA4zgEPXHSi1rcbLkrr69bgA"/></div>
<div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-surface-container-high flex items-center justify-center text-[10px] font-bold">+5</div>
</div>
</td>
<td className="px-8 py-6 border-b border-outline-variant/10">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-outline-variant text-on-surface-variant uppercase">Inactive</span>
</td>
<td className="px-8 py-6 border-b border-outline-variant/10 text-right">
<button className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
{/* Row 4 */}
<tr className="group hover:bg-surface-container-low/50 transition-colors">
<td className="px-8 py-6 border-b border-outline-variant/10">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
<span className="material-symbols-outlined">group</span>
</div>
<span className="font-semibold">Human Resources</span>
</div>
</td>
<td className="px-8 py-6 border-b border-outline-variant/10">
<div className="flex items-center gap-2">
<div className="w-7 h-7 rounded-full bg-slate-200">
<img className="w-full h-full object-cover rounded-full" data-alt="A professional headshot of an HR manager with a warm, welcoming smile in a light-filled modern atrium. Clean lighting, premium corporate style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr00KZpf3w2VQ_KmNKcWYn7y4y2c3YvAub0s7QmvRs36yw-DSvR_Fy7y6Tc8Xmk_CMjnreTLlSgb-nDkLmWudr89tO2edEPcu-QCJoqa6VR8SsNQ1WEnBGh6s-HXckISl8Qhz3Z-mrG803-8qA8mUHyTdA3eeFjrYfDdL_QU1i9fCRATPGrFT25J0zNhVxnQKmkth0yDGWxQMarv1uUUOQQB-MCQqqkVSoRaTnGNuLzkgLC15tXrvRzg"/>
</div>
<span>Jameson Wu</span>
</div>
</td>
<td className="px-8 py-6 border-b border-outline-variant/10">
<div className="flex -space-x-2">
<div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-slate-100 overflow-hidden"><img className="object-cover" data-alt="A recruiter in a sleek office environment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA36AgyuSFyzTz88QMzJdF3tUnERj9gJRT0KnrMCjrvakXOJxX5mhuGTMu9oYiVPAa-0rHWufjUy7zFkqReDlp6a9GgnC47a-8GLETpo379gjaQjimXp8wblIt5JdQRBS68IFwAnEVIQzJ_MvpACZUT-CY29TJK5JAolQlSFVuItksEg200pTeDOUuyfQ3JFNjwYPiqIQWB1z3HEll8z9y2R2tfFqkyaIabZfUAHQIKjOwthzj2s_m7EA"/></div>
<div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-slate-100 overflow-hidden"><img className="object-cover" data-alt="A talent acquisition specialist in a modern corporate lobby." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkwrY7oc67k5wcir-J4h_sIw9ujJnl0KP1mffWG2K-4_txWcc30PJj4B4GK5FetwBum75xQo6Gaa2fuVoqAveuvE_4Rg1-vYcHLHxWKaB-Sm-VT5HtwyaDplgkx5PbzhNGnLwdzsUmiCdxotbJu27U36gq88jhOXIguTT35WqbKK8mVt7q5cJA5nX6AcuZKy057mccYjCnLwerSU7CsK0Yep5mrzb16dBnQf_YUU2Ew1PClYSWTc70kg"/></div>
<div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-surface-container-high flex items-center justify-center text-[10px] font-bold">+12</div>
</div>
</td>
<td className="px-8 py-6 border-b border-outline-variant/10">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-success/10 text-success uppercase">Active</span>
</td>
<td className="px-8 py-6 border-b border-outline-variant/10 text-right">
<button className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
{/* Pagination / Footer */}
<div className="flex items-center justify-between px-8 py-5 border-t border-outline-variant/20">
<span className="font-label-md text-label-md text-on-surface-variant">Showing 4 of 12 Departments</span>
<div className="flex gap-2">
<button className="p-2 border border-outline-variant/30 rounded-lg hover:bg-surface-container-low transition-colors disabled:opacity-50" disabled="">
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button className="p-2 border border-outline-variant/30 rounded-lg hover:bg-surface-container-low transition-colors">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</div>
{/* Dashboard Stats Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
<div className="bg-surface-container-lowest p-6 rounded-[18px] shadow-sm border border-transparent hover:border-primary/20 transition-all">
<p className="font-label-md text-label-md text-on-surface-variant mb-2">Total Employees</p>
<div className="flex items-center justify-between">
<h3 className="font-headline-md text-headline-md font-bold">1,284</h3>
<span className="text-success font-bold text-xs">+4.2%</span>
</div>
<div className="w-full bg-surface-container-high h-1.5 rounded-full mt-4">
<div className="bg-primary h-full rounded-full w-[70%]"></div>
</div>
</div>
<div className="bg-surface-container-lowest p-6 rounded-[18px] shadow-sm border border-transparent hover:border-primary/20 transition-all">
<p className="font-label-md text-label-md text-on-surface-variant mb-2">Active Categories</p>
<div className="flex items-center justify-between">
<h3 className="font-headline-md text-headline-md font-bold">42</h3>
<span className="text-on-surface-variant font-bold text-xs">No change</span>
</div>
<div className="w-full bg-surface-container-high h-1.5 rounded-full mt-4">
<div className="bg-stripe-purple h-full rounded-full w-[40%]"></div>
</div>
</div>
<div className="bg-surface-container-lowest p-6 rounded-[18px] shadow-sm border border-transparent hover:border-primary/20 transition-all">
<p className="font-label-md text-label-md text-on-surface-variant mb-2">Setup Completion</p>
<div className="flex items-center justify-between">
<h3 className="font-headline-md text-headline-md font-bold">92%</h3>
<span className="text-success font-bold text-xs">Healthy</span>
</div>
<div className="w-full bg-surface-container-high h-1.5 rounded-full mt-4">
<div className="bg-success h-full rounded-full w-[92%]"></div>
</div>
</div>
</div>
</div><button className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-40" onClick={() => { if(typeof onAction === "function") onAction("openDrawer"); }}>
<span className="material-symbols-outlined">add</span>
</button></div>
    </>
  );
}
