import React from 'react';

export function LoginScreen({ onNavigate, user, onAction }) {
  return (
    <>
      <div className="flex-1 overflow-y-auto p-margin-desktop custom-scrollbar"><div className="w-full max-w-[480px] space-y-md animate-float">
{/* Welcome Text */}
<div className="text-center space-y-xs">
<h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Welcome back to AssetFlow</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Sign in to manage your organization's assets</p>
</div>
{/* Auth Card */}
<div className="glass-card p-lg rounded-[24px] shadow-[0_32px_64px_-12px_rgba(15,23,42,0.12)] border border-white/50">
<form className="space-y-md" id="loginForm" onSubmit={(e) => { e.preventDefault(); if(typeof onAction === "function") onAction("submit", e); }}>
{/* Email Input */}
<div className="space-y-xs">
<label className="font-label-md text-label-md text-on-surface-variant block ml-1" htmlFor="email">Email Address</label>
<div className="relative group halo-focus rounded-xl transition-all">
<div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
<span className="material-symbols-outlined text-outline" data-icon="mail">mail</span>
</div>
<input className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-10 pr-md font-body-md text-body-md placeholder:text-outline-variant transition-colors hover:bg-surface-container" id="email" name="email" placeholder="name@company.com" required={true} type="email"/>
</div>
</div>
{/* Password Input */}
<div className="space-y-xs">
<div className="flex justify-between items-center px-1">
<label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">Password</label>
<a className="font-label-md text-label-md text-primary hover:underline" href="#">Forgot password?</a>
</div>
<div className="relative group halo-focus rounded-xl transition-all">
<div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
<span className="material-symbols-outlined text-outline" data-icon="lock">lock</span>
</div>
<input className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-10 pr-12 font-body-md text-body-md placeholder:text-outline-variant transition-colors hover:bg-surface-container" id="password" name="password" placeholder="••••••••" required={true} type="password"/>
<button className="absolute inset-y-0 right-0 pr-sm flex items-center text-outline hover:text-on-surface transition-colors" onClick={() => { if(typeof onAction === "function") onAction("togglePassword"); }} type="button">
<span className="material-symbols-outlined" data-icon="visibility" id="passwordIcon">visibility</span>
</button>
</div>
</div>
{/* Submit Button */}
<div className="pt-sm space-y-sm">
<button className="w-full bg-primary-container text-on-primary-container font-button text-button py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2" type="submit">
                                Sign In
                                <span className="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
</button>
<button className="w-full bg-transparent text-on-surface-variant font-button text-button py-3.5 rounded-xl hover:bg-surface-container-high transition-colors" type="button">
                                Create Account
                            </button>
</div>
</form>
</div>
{/* Trust Badges / Social Proof (Subtle) */}
<div className="flex items-center justify-center gap-md opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
<span className="text-label-md font-label-md uppercase tracking-widest text-outline">Trusted by Enterprise Leaders</span>
</div>
</div></div>
    </>
  );
}
