// ============================================================
//  ScholarSafe — app/page.jsx
//  Single-file landing page: Header · Hero · ListingCard ·
//  SafetyBadge · WaitlistSection
//
//  Stack : Next.js 14 (App Router) · Tailwind CSS · Supabase
//  Run   : paste scholarsafe-schema.sql into Supabase SQL editor
//  Env   : NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
// ============================================================
"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  GraduationCap, Shield, MapPin, Users, Star, ArrowRight,
  Search, BedDouble, Bath, Heart, ChevronDown, Menu, X,
  Sparkles, TrendingUp, Home, Moon, Sun,
  Mail, CheckCircle2, Loader2, AlertCircle, Bell,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// 1. SUPABASE CLIENT
//    Add to .env.local:
//      NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
//      NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
// ─────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL     ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
);

// ─────────────────────────────────────────────────────────────
// 2. DESIGN TOKENS  (single source of truth for colours)
// ─────────────────────────────────────────────────────────────
const T = {
  navy:        "#1a2b5e",
  navyLight:   "#2d4a8a",
  gold:        "#c9a227",
  cream:       "#f8f5f0",
  white:       "#ffffff",
  slate:       "#8492a6",
  slateLight:  "#eef1f8",
  safe:        "#22c55e",  safeLight:  "#dcfce7", safeRing:  "#86efac",
  warn:        "#f59e0b",  warnLight:  "#fef3c7", warnRing:  "#fcd34d",
  danger:      "#ef4444",  dangerLight:"#fee2e2", dangerRing:"#fca5a5",
};

// ─────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────
function safetyMeta(score) {
  if (score >= 80) return { color: T.safe,   bg: T.safeLight,   ring: T.safeRing,   label: "Safe"     };
  if (score >= 60) return { color: T.warn,   bg: T.warnLight,   ring: T.warnRing,   label: "Moderate" };
  return               { color: T.danger, bg: T.dangerLight, ring: T.dangerRing, label: "Caution"  };
}

const isEduEmail = (v) => /^[^\s@]+@[^\s@]+\.edu$/i.test(v.trim());
const normalise  = (v) => v.trim().toLowerCase();

// Shared hover button helper (inline style swap)
const hoverNav  = (e) => { e.currentTarget.style.color = T.navy;  e.currentTarget.style.background = T.slateLight; };
const unhoverNav= (e) => { e.currentTarget.style.color = T.slate; e.currentTarget.style.background = "transparent"; };
const hoverBtn  = (e) => e.currentTarget.style.background = T.gold;
const unhoverBtn= (e) => e.currentTarget.style.background = T.navy;

// ─────────────────────────────────────────────────────────────
// 4. SAFETY BADGE  ── green ≥ 80 / yellow 60–79 / red < 60
// ─────────────────────────────────────────────────────────────
function SafetyBadge({ score, size = "sm" }) {
  const m  = safetyMeta(score);
  const lg = size === "lg";
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: lg ? 10 : 6,
      background: m.bg, border: `1.5px solid ${m.ring}`, borderRadius: 999,
      padding: lg ? "8px 16px" : "5px 11px",
    }}>
      <Shield
        size={lg ? 18 : 14}
        style={{ color: m.color, flexShrink: 0 }}
        fill={m.color} fillOpacity={0.18}
      />
      <span style={{ fontSize: lg ? 15 : 12, fontWeight: 700, color: m.color }}>
        {score}/100 · {m.label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. LISTING CARD
// ─────────────────────────────────────────────────────────────
function ListingCard({ listing, featured = false }) {
  const [saved,    setSaved]    = useState(false);
  const [hovered,  setHovered]  = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: T.white, borderRadius: 20, overflow: "hidden", width: "100%", maxWidth: 360,
        border: featured ? `2px solid ${T.gold}` : `1.5px solid rgba(26,43,94,.07)`,
        boxShadow: hovered
          ? "0 24px 60px rgba(26,43,94,.16), 0 4px 16px rgba(26,43,94,.08)"
          : "0 4px 24px rgba(26,43,94,.08), 0 1px 4px rgba(26,43,94,.04)",
        transform:  hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all .25s cubic-bezier(.34,1.56,.64,1)",
        position: "relative",
      }}
    >
      {/* Featured pill */}
      {featured && (
        <div style={{
          position:"absolute", top:14, left:14, zIndex:10,
          background:T.gold, color:T.white, padding:"4px 12px",
          borderRadius:999, fontSize:11, fontWeight:700,
          letterSpacing:".06em", textTransform:"uppercase",
          display:"flex", alignItems:"center", gap:4,
        }}>
          <Sparkles size={11} /> Featured
        </div>
      )}

      {/* Save / heart */}
      <button
        onClick={() => setSaved(s => !s)}
        style={{
          position:"absolute", top:14, right:14, zIndex:10,
          background: saved ? T.navy : "rgba(255,255,255,.9)",
          border:"none", borderRadius:"50%", width:34, height:34,
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", backdropFilter:"blur(8px)", transition:"all .2s",
        }}
      >
        <Heart size={15} fill={saved ? T.white : "none"} color={saved ? T.white : T.navy} />
      </button>

      {/* Image band */}
      <div style={{
        height:175, position:"relative", overflow:"hidden",
        background:`linear-gradient(135deg,${T.navyLight} 0%,${T.navy} 100%)`,
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        {/* Minimal building SVG */}
        <svg width="200" height="130" viewBox="0 0 200 140" fill="none" style={{opacity:.22}}>
          <rect x="40" y="50" width="60" height="90" rx="4" fill="white"/>
          <rect x="110" y="30" width="50" height="110" rx="4" fill="white"/>
          <rect x="20" y="70" width="30" height="70" rx="4" fill="white"/>
          {[[55,65],[75,65],[55,90],[75,90]].map(([x,y]) =>
            <rect key={`${x}${y}`} x={x} y={y} width="12" height="14" rx="2" fill={T.navy}/>
          )}
          {[[120,50],[138,50],[120,75],[138,75]].map(([x,y]) =>
            <rect key={`${x}${y}`} x={x} y={y} width="12" height="14" rx="2" fill={T.navy}/>
          )}
        </svg>

        {/* Safety badge overlay */}
        <div style={{position:"absolute", bottom:12, left:12}}>
          <SafetyBadge score={listing.safetyScore} />
        </div>

        {/* Day / night chips */}
        <div style={{position:"absolute", bottom:12, right:12, display:"flex", gap:5}}>
          {listing.safetyDay && (
            <div style={{background:"rgba(255,255,255,.15)", backdropFilter:"blur(8px)", borderRadius:999, padding:"3px 8px", display:"flex", alignItems:"center", gap:4, fontSize:10, color:"white", fontWeight:600}}>
              <Sun size={9} /> {listing.safetyDay}
            </div>
          )}
          {listing.safetyNight && (
            <div style={{background:"rgba(255,255,255,.15)", backdropFilter:"blur(8px)", borderRadius:999, padding:"3px 8px", display:"flex", alignItems:"center", gap:4, fontSize:10, color:"white", fontWeight:600}}>
              <Moon size={9} /> {listing.safetyNight}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{padding:"18px 18px 0"}}>
        <h3 style={{fontSize:16, fontWeight:700, color:T.navy, margin:0, lineHeight:1.3}}>
          {listing.title}
        </h3>
        <div style={{display:"flex", alignItems:"center", gap:4, marginTop:5, marginBottom:12, color:T.slate, fontSize:13}}>
          <MapPin size={12}/> {listing.address}
        </div>

        {/* Stats row */}
        <div style={{display:"flex", gap:14, paddingBottom:12, borderBottom:`1px solid ${T.slateLight}`, marginBottom:12}}>
          {[
            { icon:<BedDouble size={13} color={T.navyLight}/>, val:listing.bedrooms,  lbl:"bed"   },
            { icon:<Bath      size={13} color={T.navyLight}/>, val:listing.bathrooms, lbl:"bath"  },
            { icon:<Users     size={13} color={T.navyLight}/>, val:listing.spots,     lbl:"spots" },
          ].map(({icon,val,lbl}) => (
            <div key={lbl} style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:T.slate}}>
              {icon} <span><strong style={{color:T.navy}}>{val}</strong> {lbl}</span>
            </div>
          ))}
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:4,fontSize:12,color:T.slate}}>
            <Home size={12} color={T.slate}/> {listing.distanceMi} mi
          </div>
        </div>

        {/* Review snippet */}
        {listing.reviewSnippet && (
          <div style={{background:T.slateLight, borderRadius:9, padding:"9px 12px", marginBottom:12}}>
            <div style={{display:"flex", gap:3, marginBottom:4}}>
              {[...Array(5)].map((_,i) => (
                <Star key={i} size={11} fill={i < listing.rating ? T.gold : "none"} color={i < listing.rating ? T.gold : T.slate}/>
              ))}
            </div>
            <p style={{fontSize:12, color:T.slate, margin:0, fontStyle:"italic", lineHeight:1.5}}>
              "{listing.reviewSnippet}"
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{padding:"0 18px 18px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <div>
          <span style={{fontFamily:"'Playfair Display',serif", fontSize:21, fontWeight:900, color:T.navy}}>
            ${listing.pricePerPerson.toLocaleString()}
          </span>
          <span style={{fontSize:12, color:T.slate}}>/person/mo</span>
          {listing.utilitiesIncluded && (
            <div style={{fontSize:11, color:T.safe, fontWeight:600, marginTop:2}}>✓ Utilities included</div>
          )}
        </div>
        <button
          style={{background:T.navy, color:T.white, border:"none", borderRadius:9, padding:"9px 16px", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5, transition:"background .15s"}}
          onMouseEnter={hoverBtn} onMouseLeave={unhoverBtn}
        >
          View <ArrowRight size={13}/>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. HEADER
// ─────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Find Housing", href: "#listings"  },
  { label: "Roommates",    href: "#roommates" },
  { label: "Safety Map",   href: "#safety"    },
  { label: "Reviews",      href: "#reviews"   },
  { label: "For Landlords",href: "#landlords" },
];

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header style={{
      position:"sticky", top:0, zIndex:100,
      background:"rgba(255,255,255,.97)", backdropFilter:"blur(16px)",
      borderBottom:"1px solid rgba(26,43,94,.08)",
    }}>
      <div style={{maxWidth:1200, margin:"0 auto", padding:"0 32px", display:"flex", alignItems:"center", height:68}}>

        {/* Logo */}
        <a href="/" style={{textDecoration:"none", display:"flex", alignItems:"center", gap:10, marginRight:44, flexShrink:0}}>
          <div style={{width:36, height:36, borderRadius:10, background:T.navy, display:"flex", alignItems:"center", justifyContent:"center"}}>
            <GraduationCap size={20} color={T.gold}/>
          </div>
          <span style={{fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:900, color:T.navy}}>
            Scholar<span style={{color:T.gold}}>Safe</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav style={{display:"flex", gap:2, flex:1}}>
          {NAV_LINKS.map(({label,href}) => (
            <a key={label} href={href}
              style={{fontSize:14, fontWeight:500, color:T.slate, textDecoration:"none", padding:"6px 13px", borderRadius:8, transition:"all .15s", whiteSpace:"nowrap"}}
              onMouseEnter={hoverNav} onMouseLeave={unhoverNav}>
              {label}
            </a>
          ))}
        </nav>

        {/* CTA group */}
        <div style={{display:"flex", alignItems:"center", gap:8, marginLeft:16}}>
          <a href="/login" style={{fontSize:14, fontWeight:600, color:T.navy, textDecoration:"none", padding:"8px 14px"}}>
            Log in
          </a>
          <a href="/signup"
            style={{background:T.navy, color:T.white, textDecoration:"none", padding:"9px 20px", borderRadius:10, fontSize:14, fontWeight:700, display:"flex", alignItems:"center", gap:6, transition:"background .15s"}}
            onMouseEnter={hoverBtn} onMouseLeave={unhoverBtn}>
            Sign up free <ArrowRight size={14}/>
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          style={{display:"none", background:"none", border:"none", cursor:"pointer", padding:6, marginLeft:12}}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} color={T.navy}/> : <Menu size={22} color={T.navy}/>}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <nav style={{background:T.white, borderTop:`1px solid rgba(26,43,94,.06)`, padding:"12px 24px 20px", display:"flex", flexDirection:"column", gap:4}}>
          {NAV_LINKS.map(({label,href}) => (
            <a key={label} href={href}
              style={{fontSize:15, fontWeight:500, color:T.navy, textDecoration:"none", padding:"10px 4px", borderBottom:`1px solid ${T.slateLight}`}}>
              {label}
            </a>
          ))}
          <a href="/signup"
            style={{marginTop:12, background:T.navy, color:T.white, textDecoration:"none", padding:"12px 20px", borderRadius:10, fontSize:15, fontWeight:700, textAlign:"center"}}>
            Sign up free
          </a>
        </nav>
      )}
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// 7. HERO
// ─────────────────────────────────────────────────────────────
const DEMO_LISTINGS = [
  {
    id:1, title:"Modern 3BR near Campus", address:"0.4 mi · Oak District",
    safetyScore:91, safetyDay:"97", safetyNight:"84",
    bedrooms:3, bathrooms:2, spots:2, distanceMi:"0.4",
    pricePerPerson:725, utilitiesIncluded:true, rating:5,
    reviewSnippet:"Super quiet at night, landlord replies same-day. Best decision I made.",
  },
  {
    id:2, title:"Cozy Studio · Scholar Row", address:"0.2 mi · Scholar Row",
    safetyScore:74, safetyDay:"88", safetyNight:"61",
    bedrooms:1, bathrooms:1, spots:1, distanceMi:"0.2",
    pricePerPerson:980, utilitiesIncluded:false, rating:4,
    reviewSnippet:"Great location, a bit noisy on weekends but overall solid.",
  },
  {
    id:3, title:"4BR House · West End", address:"1.1 mi · West End",
    safetyScore:48, safetyDay:"71", safetyNight:"29",
    bedrooms:4, bathrooms:2, spots:3, distanceMi:"1.1",
    pricePerPerson:540, utilitiesIncluded:false, rating:3,
    reviewSnippet:"Cheap for a reason. Wouldn't walk home alone after dark.",
  },
];

function StatPill({ icon, value, label }) {
  return (
    <div style={{display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.75)", border:`1px solid rgba(26,43,94,.08)`, borderRadius:999, padding:"7px 15px", backdropFilter:"blur(8px)"}}>
      <span style={{fontSize:15}}>{icon}</span>
      <div>
        <div style={{fontSize:14, fontWeight:800, color:T.navy, lineHeight:1.1}}>{value}</div>
        <div style={{fontSize:11, color:T.slate, lineHeight:1.1}}>{label}</div>
      </div>
    </div>
  );
}

function Hero() {
  const [query,      setQuery]      = useState("");
  const [campus,     setCampus]     = useState("");
  const [activeCard, setActiveCard] = useState(0);

  return (
    <section style={{
      background:`radial-gradient(ellipse at 70% 50%,rgba(201,162,39,.08) 0%,transparent 60%),
                 radial-gradient(ellipse at 20% 80%,rgba(26,43,94,.05) 0%,transparent 50%),${T.cream}`,
      minHeight:"calc(100vh - 68px)",
      display:"flex", alignItems:"center", overflow:"hidden",
    }}>
      <div style={{maxWidth:1200, margin:"0 auto", padding:"80px 32px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center", width:"100%"}}>

        {/* ── Left column ── */}
        <div>
          {/* Eyebrow badge */}
          <div style={{display:"inline-flex", alignItems:"center", gap:8, background:T.slateLight, border:`1px solid rgba(26,43,94,.1)`, borderRadius:999, padding:"5px 15px", marginBottom:26}}>
            <TrendingUp size={13} color={T.gold}/>
            <span style={{fontSize:12, fontWeight:700, color:T.navy, letterSpacing:".05em", textTransform:"uppercase"}}>
              By Students, For Students
            </span>
          </div>

          {/* Headline */}
          <h1 style={{fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.4rem,4vw,3.6rem)", fontWeight:900, color:T.navy, lineHeight:1.06, marginBottom:18}}>
            Find your{" "}
            <span style={{color:T.gold, position:"relative", display:"inline-block"}}>
              safe
              <svg viewBox="0 0 120 8" style={{position:"absolute", bottom:-6, left:0, width:"100%", height:8, overflow:"visible"}}>
                <path d="M2 6 Q30 1 60 5 Q90 9 118 3" stroke={T.gold} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".55"/>
              </svg>
            </span>{" "}place.<br/>
            Find your <span style={{color:T.navyLight}}>people.</span>
          </h1>

          {/* Subheading */}
          <p style={{fontSize:16, lineHeight:1.75, color:T.slate, maxWidth:450, marginBottom:32}}>
            The only student housing platform with verified listings, real student reviews,
            neighbourhood safety scores, and compatible roommate matching — all in one place.
          </p>

          {/* Search bar */}
          <div style={{display:"flex", alignItems:"center", background:T.white, border:`1.5px solid rgba(26,43,94,.08)`, borderRadius:13, padding:"5px 5px 5px 16px", boxShadow:"0 6px 32px rgba(26,43,94,.1)", gap:8, marginBottom:28, maxWidth:500}}>
            <Search size={16} color={T.slate} style={{flexShrink:0}}/>
            <input
              type="text" placeholder="Search by university or neighborhood…"
              value={query} onChange={e => setQuery(e.target.value)}
              style={{border:"none", outline:"none", fontSize:14, color:T.navy, background:"transparent", flex:1}}
            />
            <div style={{width:1, height:22, background:"rgba(26,43,94,.1)", flexShrink:0}}/>
            <div style={{display:"flex", alignItems:"center", gap:6, padding:"0 8px", flexShrink:0}}>
              <MapPin size={14} color={T.slate}/>
              <input
                type="text" placeholder="Campus"
                value={campus} onChange={e => setCampus(e.target.value)}
                style={{border:"none", outline:"none", fontSize:14, color:T.navy, background:"transparent", width:80}}
              />
              <ChevronDown size={13} color={T.slate}/>
            </div>
            <button
              style={{background:T.navy, color:T.white, border:"none", borderRadius:9, padding:"11px 18px", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6, flexShrink:0, transition:"background .15s"}}
              onMouseEnter={hoverBtn} onMouseLeave={unhoverBtn}>
              Search <ArrowRight size={13}/>
            </button>
          </div>

          {/* Stat pills */}
          <div style={{display:"flex", gap:9, flexWrap:"wrap"}}>
            <StatPill icon="🎓" value="100%"   label="Verified .edu"/>
            <StatPill icon="🏠" value="5,000+" label="Listings"/>
            <StatPill icon="🛡️" value="Safety-First" label="Always"/>
          </div>
        </div>

        {/* ── Right column — interactive card switcher ── */}
        <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:14}}>

          {/* Tab row */}
          <div style={{display:"flex", gap:5, background:T.white, borderRadius:11, padding:4, boxShadow:"0 2px 12px rgba(26,43,94,.08)", border:`1px solid rgba(26,43,94,.06)`}}>
            {DEMO_LISTINGS.map((l,i) => {
              const m = safetyMeta(l.safetyScore);
              return (
                <button key={l.id} onClick={() => setActiveCard(i)}
                  style={{background:activeCard===i ? T.navy : "transparent", color:activeCard===i ? T.white : T.slate, border:"none", borderRadius:7, padding:"7px 14px", fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6, transition:"all .2s"}}>
                  <span style={{width:7, height:7, borderRadius:"50%", background:m.color, flexShrink:0}}/>
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* The active listing card */}
          <ListingCard
            key={activeCard}
            listing={DEMO_LISTINGS[activeCard]}
            featured={activeCard === 0}
          />

          {/* Roommate match strip */}
          <div style={{background:T.white, border:`1.5px solid ${T.slateLight}`, borderRadius:12, padding:"11px 16px", display:"flex", alignItems:"center", gap:12, width:"100%", maxWidth:360, boxShadow:"0 3px 14px rgba(26,43,94,.06)"}}>
            <div style={{width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg,${T.navy},${T.navyLight})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
              <Users size={15} color={T.gold}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13, fontWeight:700, color:T.navy}}>Roommate Match Available</div>
              <div style={{fontSize:12, color:T.slate}}>Alex B. · Business Major · 92% compatible</div>
            </div>
            <div style={{background:T.slateLight, borderRadius:999, padding:"3px 11px", fontSize:12, fontWeight:800, color:T.navyLight}}>92%</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// 8. WAITLIST SECTION
// ─────────────────────────────────────────────────────────────
function PerkPill({ icon: Icon, label }) {
  return (
    <span style={{display:"inline-flex", alignItems:"center", gap:6, background:T.slateLight, border:`1px solid rgba(26,43,94,.08)`, borderRadius:999, padding:"4px 12px", fontSize:11, fontWeight:600, color:T.slate}}>
      <Icon size={11} style={{color:T.gold}}/> {label}
    </span>
  );
}

function WaitlistSuccess({ email }) {
  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:18, textAlign:"center", animation:"fadeScaleIn .45s cubic-bezier(.34,1.56,.64,1) both"}}>
      {/* Animated check ring */}
      <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>
        <span style={{position:"absolute", width:88, height:88, borderRadius:"50%", background:"#dcfce7", animation:"pingOnce .7s .3s ease-out both"}}/>
        <div style={{position:"relative", zIndex:1, width:72, height:72, borderRadius:"50%", background:"#f0fdf4", border:"3px solid #bbf7d0", display:"flex", alignItems:"center", justifyContent:"center"}}>
          <CheckCircle2 size={38} color="#22c55e" strokeWidth={1.8}/>
        </div>
      </div>

      <div>
        <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, color:T.navy, marginBottom:8}}>
          You're on the list!
        </h3>
        <p style={{fontSize:13, color:T.slate, lineHeight:1.65, margin:0}}>
          Check your inbox at <strong style={{color:T.navy}}>{email}</strong>.<br/>
          We'll reach out when ScholarSafe launches near your campus.
        </p>
      </div>

      {/* Email confirmed row */}
      <div style={{display:"flex", alignItems:"center", gap:12, background:"#f8fafc", border:`1px solid rgba(26,43,94,.07)`, borderRadius:12, padding:"12px 16px", width:"100%"}}>
        <div style={{width:32, height:32, borderRadius:"50%", background:T.slateLight, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
          <Mail size={14} color={T.navy}/>
        </div>
        <div style={{textAlign:"left", flex:1}}>
          <p style={{fontSize:12, fontWeight:700, color:T.navy, margin:0}}>Confirmation sent</p>
          <p style={{fontSize:11, color:T.slate, margin:0}}>Check spam if you don't see it</p>
        </div>
        <CheckCircle2 size={15} color="#22c55e"/>
      </div>

      <p style={{fontSize:11, color:T.slate}}>
        Know a classmate who needs safer housing?{" "}
        <button style={{background:"none", border:"none", cursor:"pointer", fontWeight:700, color:T.gold, textDecoration:"underline", fontSize:11}}>
          Share ScholarSafe →
        </button>
      </p>
    </div>
  );
}

function WaitlistSection() {
  const [email,       setEmail]       = useState("");
  const [touched,     setTouched]     = useState(false);
  const [status,      setStatus]      = useState("idle"); // idle | loading | success | error
  const [serverError, setServerError] = useState("");

  const showVal = touched && email.length > 0;
  const isEdu   = isEduEmail(email);
  const valMsg  = !email            ? ""
    : !email.includes("@")          ? "Please include an @ symbol."
    : !isEdu                        ? "Only .edu email addresses are accepted."
    : "";

  const inputBg = showVal && valMsg ? "rgba(254,226,226,.45)"
    : showVal && isEdu              ? "rgba(240,253,244,.4)"
    : T.cream;
  const inputBorder = showVal && valMsg ? "#fca5a5"
    : showVal && isEdu              ? "#86efac"
    : "rgba(26,43,94,.15)";
  const inputShadow = showVal && valMsg ? "0 0 0 3px rgba(252,165,165,.2)"
    : showVal && isEdu              ? "0 0 0 3px rgba(134,239,172,.2)"
    : "none";

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setTouched(true);
    if (!isEdu) return;

    setStatus("loading");
    setServerError("");

    try {
      const { error } = await supabase
        .from("waitlist")
        .insert([{ email: normalise(email) }]);

      if (error) {
        setServerError(
          error.code === "23505"
            ? "This email is already on the waitlist — you're all set! 🎉"
            : "Something went wrong on our end. Please try again."
        );
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setServerError("Network error — check your connection and try again.");
      setStatus("error");
    }
  };

  return (
    <section id="waitlist" style={{
      position:"relative", overflow:"hidden", padding:"100px 32px",
      background:"linear-gradient(to bottom,#f5f7fc,#fff)",
    }}>
      {/* Decorative blobs */}
      <div aria-hidden style={{pointerEvents:"none", position:"absolute", inset:0}}>
        <div style={{position:"absolute", top:-100, right:-100, width:480, height:480, borderRadius:"50%", background:"radial-gradient(circle,rgba(201,162,39,.08) 0%,transparent 70%)"}}/>
        <div style={{position:"absolute", bottom:-80, left:-80, width:380, height:380, borderRadius:"50%", background:"radial-gradient(circle,rgba(26,43,94,.05) 0%,transparent 70%)"}}/>
      </div>

      {/* Card */}
      <div style={{position:"relative", zIndex:1, maxWidth:500, margin:"0 auto"}}>
        <div style={{background:"rgba(255,255,255,.92)", borderRadius:28, border:`1px solid rgba(26,43,94,.07)`, padding:"44px 48px", backdropFilter:"blur(12px)", boxShadow:"0 8px 60px rgba(26,43,94,.10),0 2px 12px rgba(26,43,94,.06)"}}>

          {/* Logo icon */}
          <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:14, marginBottom:28}}>
            <div style={{width:52, height:52, borderRadius:14, background:T.navy, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(26,43,94,.25)"}}>
              <GraduationCap size={26} color={T.gold}/>
            </div>
            {/* Perk pills */}
            <div style={{display:"flex", flexWrap:"wrap", gap:7, justifyContent:"center"}}>
              <PerkPill icon={Bell}     label="Priority access"/>
              <PerkPill icon={Shield}   label="Safety-first listings"/>
              <PerkPill icon={Users}    label="Roommate matching"/>
              <PerkPill icon={Sparkles} label="Free premium for founders"/>
            </div>
          </div>

          {/* Heading */}
          <div style={{textAlign:"center", marginBottom:28}}>
            <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:900, color:T.navy, lineHeight:1.2, marginBottom:10}}>
              Be the first to know when we launch at your campus.
            </h2>
            <p style={{fontSize:14, color:T.slate, lineHeight:1.65, margin:0}}>
              ScholarSafe is coming soon. Drop your .edu email and we'll notify you the moment we go live near you.
            </p>
          </div>

          {/* ── Form or success ── */}
          {status === "success" ? (
            <WaitlistSuccess email={normalise(email)}/>
          ) : (
            <div style={{display:"flex", flexDirection:"column", gap:0}}>

              {/* Label */}
              <label htmlFor="wl-email" style={{fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:T.slate, marginBottom:6, display:"block"}}>
                School Email
              </label>

              {/* Input row */}
              <div style={{display:"flex", alignItems:"center", gap:10, border:`1.5px solid ${inputBorder}`, borderRadius:12, padding:"0 14px", background:inputBg, boxShadow:inputShadow, transition:"all .2s", marginBottom:6}}>
                <Mail size={15} color={showVal && valMsg ? T.danger : showVal && isEdu ? T.safe : T.slate} style={{flexShrink:0}}/>
                <input
                  id="wl-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@university.edu"
                  value={email}
                  disabled={status === "loading"}
                  onChange={e => { setEmail(e.target.value); if (serverError) setServerError(""); if (status==="error") setStatus("idle"); }}
                  onBlur={() => setTouched(true)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit(e)}
                  style={{border:"none", outline:"none", fontSize:14, color:T.navy, background:"transparent", flex:1, padding:"13px 0", fontFamily:"inherit"}}
                  aria-invalid={showVal && !!valMsg}
                  aria-describedby="wl-msg"
                />
                {showVal && (
                  isEdu
                    ? <CheckCircle2 size={15} color={T.safe} style={{flexShrink:0}}/>
                    : <AlertCircle  size={15} color={T.danger} style={{flexShrink:0}}/>
                )}
              </div>

              {/* Inline validation message */}
              <div id="wl-msg" aria-live="polite" style={{minHeight:18, marginBottom:10, paddingLeft:2}}>
                {showVal && valMsg && (
                  <span style={{display:"flex", alignItems:"center", gap:4, fontSize:11, fontWeight:600, color:T.danger}}>
                    <AlertCircle size={11}/> {valMsg}
                  </span>
                )}
                {showVal && isEdu && (
                  <span style={{display:"flex", alignItems:"center", gap:4, fontSize:11, fontWeight:600, color:T.safe}}>
                    <CheckCircle2 size={11}/> Looks good!
                  </span>
                )}
              </div>

              {/* Server error */}
              {serverError && (
                <div style={{display:"flex", alignItems:"flex-start", gap:8, background:"#fff5f5", border:"1px solid #fca5a5", borderRadius:9, padding:"10px 14px", fontSize:12, color:T.danger, marginBottom:10}}>
                  <AlertCircle size={13} style={{marginTop:1, flexShrink:0}}/> {serverError}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={status === "loading"}
                style={{
                  width:"100%", background:T.navy, color:T.white,
                  border:"none", borderRadius:12, padding:"14px", fontSize:14, fontWeight:700,
                  cursor: status==="loading" ? "not-allowed" : "pointer",
                  opacity: status==="loading" ? .8 : 1,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  transition:"all .2s", position:"relative", overflow:"hidden",
                }}
                onMouseEnter={e => { if (status!=="loading") hoverBtn(e); }}
                onMouseLeave={e => { if (status!=="loading") unhoverBtn(e); }}
              >
                {status === "loading" ? (
                  <><Loader2 size={15} style={{animation:"spin 1s linear infinite"}}/> Joining…</>
                ) : (
                  <>Join the Waitlist <ArrowRight size={14}/></>
                )}
              </button>

              {/* Trust note */}
              <p style={{display:"flex", alignItems:"center", justifyContent:"center", gap:5, marginTop:10, fontSize:11, color:T.slate, textAlign:"center"}}>
                <Shield size={11} color="rgba(132,146,166,.5)"/>
                No spam, ever. Only .edu emails accepted. Unsubscribe any time.
              </p>
            </div>
          )}

          {/* Social proof */}
          <div style={{borderTop:`1px solid rgba(26,43,94,.07)`, marginTop:28, paddingTop:20, textAlign:"center"}}>
            <p style={{fontSize:12, color:T.slate, marginBottom:10}}>
              Joining <strong style={{color:T.navy}}>2,400+ students</strong> already on the waitlist
            </p>
            <div style={{display:"flex", alignItems:"center", justifyContent:"center", gap:8}}>
              <div style={{display:"flex"}}>
                {[T.navy, T.navyLight, T.gold, "#3aaa6b", T.slate].map((c,i) => (
                  <div key={i} style={{width:26, height:26, borderRadius:"50%", border:"2px solid white", background:`linear-gradient(135deg,${c}cc,${c})`, display:"flex", alignItems:"center", justifyContent:"center", marginLeft:i===0?0:-7}}>
                    <span style={{fontSize:8, fontWeight:700, color:"white"}}>{"MJADK"[i]}</span>
                  </div>
                ))}
              </div>
              <span style={{fontSize:11, color:T.slate}}>+ many more waiting</span>
            </div>
          </div>
        </div>

        <p style={{marginTop:16, textAlign:"center", fontSize:11, color:T.slate}}>
          Launching first at{" "}
          <strong style={{color:"#555"}}>SCU · SJSU · Stanford · UC Berkeley</strong>
          {" "}and expanding fast.
        </p>
      </div>

      <style>{`
        @keyframes fadeScaleIn {
          from { opacity:0; transform:scale(.92) translateY(12px); }
          to   { opacity:1; transform:scale(1)   translateY(0); }
        }
        @keyframes pingOnce {
          0%  { transform:scale(.8);  opacity:.8; }
          80% { transform:scale(1.5); opacity:0;  }
          100%{ transform:scale(1.5); opacity:0;  }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// 9. FOOTER
// ─────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{background:"#0f1a3c", padding:"36px 40px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16}}>
      <div>
        <div style={{fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:900, color:T.white}}>
          Scholar<span style={{color:T.gold}}>Safe</span>
        </div>
        <div style={{fontSize:12, color:"rgba(255,255,255,.4)", marginTop:3}}>Safe Places. Bright Futures.</div>
      </div>
      <div style={{fontSize:12, color:"rgba(255,255,255,.4)"}}>
        Built by Zainah Fatimah · Farhiya Mohamed · Danna Kholaif
      </div>
      <div style={{fontSize:12, color:"rgba(255,255,255,.4)"}}>
        © {new Date().getFullYear()} ScholarSafe. All rights reserved.
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// 10. PAGE  (default export — drop into app/page.jsx)
// ─────────────────────────────────────────────────────────────
export default function ScholarSafePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: ${T.cream}; color: ${T.navy}; }
        @media (max-width: 768px) {
          /* Stack hero columns on mobile */
          section > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <Header />
      <Hero />
      <WaitlistSection />
      <Footer />
    </>
  );
}
