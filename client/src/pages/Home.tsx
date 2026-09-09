import { ChangeEvent, useMemo, useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  AudioWaveform,
  Bold,
  Check,
  ChevronDown,
  CircleHelp,
  CloudUpload,
  Download,
  Eye,
  FileVideo,
  Film,
  Italic,
  Languages,
  Layers3,
  LayoutTemplate,
  Loader2,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  Move,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Scissors,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Subtitles,
  Type,
  UploadCloud,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import { captionsToSrt } from "@shared/captions";

type Caption = {
  id: number;
  start: string;
  end: string;
  text: string;
};

type Template = {
  name: string;
  category: string;
  className: string;
  preview: string;
};

const starterCaptions: Caption[] = [
  { id: 1, start: "00:00.00", end: "00:02.18", text: "Aaj ka idea simple hai." },
  { id: 2, start: "00:02.18", end: "00:04.76", text: "Make your videos impossible to scroll past." },
  { id: 3, start: "00:04.76", end: "00:07.40", text: "Bas ek strong hook se start karo." },
  { id: 4, start: "00:07.40", end: "00:10.12", text: "And let the story do the rest." },
  { id: 5, start: "00:10.12", end: "00:13.40", text: "Caption Studio makes it effortless." },
];

const templates: Template[] = [
  { name: "Creator", category: "Minimal", className: "template-creator", preview: "Clean & bold" },
  { name: "Pop words", category: "Emphasis", className: "template-pop", preview: "Word by word" },
  { name: "Kinetic", category: "Motion", className: "template-kinetic", preview: "Fast energy" },
  { name: "Editorial", category: "Premium", className: "template-editorial", preview: "Quiet luxury" },
  { name: "Neon punch", category: "Social", className: "template-neon", preview: "High contrast" },
  { name: "Soft serif", category: "Story", className: "template-serif", preview: "Warm & human" },
];

const languages = ["Auto detect", "Hinglish", "English (US)", "Hindi", "German", "Spanish", "French"];

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remaining = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remaining}`;
}

function CaptionRow({ caption, active, onSelect }: { caption: Caption; active: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={`group grid w-full grid-cols-[78px_78px_1fr_34px] items-center gap-3 border-b border-white/[0.06] px-4 py-3 text-left transition ${active ? "bg-[#5b5ce2]/[0.13]" : "hover:bg-white/[0.03]"}`}
    >
      <span className="font-mono text-[11px] text-white/40">{caption.start}</span>
      <span className="font-mono text-[11px] text-white/30">{caption.end}</span>
      <span className={`truncate text-[13px] ${active ? "font-medium text-white" : "text-white/70"}`}>{caption.text}</span>
      <MoreHorizontal size={15} className="text-white/20 transition group-hover:text-white/50" />
    </button>
  );
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Caption editor");
  const [activeTemplate, setActiveTemplate] = useState("Creator");
  const [activeCaption, setActiveCaption] = useState(2);
  const [captions, setCaptions] = useState(starterCaptions);
  const [language, setLanguage] = useState("Hinglish");
  const [videoName, setVideoName] = useState("reel-idea-01.mp4");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState(13.4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState("AI draft ready to style");
  const [activeInspector, setActiveInspector] = useState("Style");
  const [fontSize, setFontSize] = useState(30);
  const [outline, setOutline] = useState(true);
  const [highlight, setHighlight] = useState(false);
  const [align, setAlign] = useState("center");
  const fileInput = useRef<HTMLInputElement>(null);

  const currentCaption = captions.find((caption) => caption.id === activeCaption) ?? captions[1];
  const timePercent = useMemo(() => Math.min(100, Math.max(0, (activeCaption - 1) * 17 + 20)), [activeCaption]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast("AI draft ready to style"), 2800);
  };

  const handleFile = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setVideoName(file.name);
    flash("Video loaded locally — ready for captions");
  };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => handleFile(event.target.files?.[0]);

  const generateCaptions = () => {
    setIsGenerating(true);
    flash("Whisper is preparing your caption draft…");
    window.setTimeout(() => {
      setCaptions([
        { id: 1, start: "00:00.00", end: "00:02.18", text: language === "German" ? "Die Idee ist ganz einfach." : "Aaj ka idea simple hai." },
        { id: 2, start: "00:02.18", end: "00:04.76", text: language === "Hindi" ? "अपने वीडियो को यादगार बनाइए।" : "Make your videos impossible to scroll past." },
        { id: 3, start: "00:04.76", end: "00:07.40", text: language === "English (US)" ? "Start with one strong hook." : "Bas ek strong hook se start karo." },
        { id: 4, start: "00:07.40", end: "00:10.12", text: "And let the story do the rest." },
        { id: 5, start: "00:10.12", end: "00:13.40", text: "Caption Studio makes it effortless." },
      ]);
      setIsGenerating(false);
      flash("Caption draft generated — 5 lines synced");
    }, 900);
  };

  const updateCaption = (text: string) => {
    setCaptions((items) => items.map((item) => (item.id === activeCaption ? { ...item, text } : item)));
  };

  const downloadSrt = () => {
    setIsExporting(true);
    const body = captionsToSrt(captions);
    const blob = new Blob([body], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${videoName.replace(/\.[^/.]+$/, "")}-captions.srt`;
    link.click();
    URL.revokeObjectURL(url);
    window.setTimeout(() => setIsExporting(false), 550);
    flash(".SRT captions exported");
  };

  return (
    <div className="min-h-screen bg-[#0c0d12] text-white selection:bg-[#6c6df5]/40">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[232px] shrink-0 flex-col border-r border-white/[0.07] bg-[#101117] px-4 py-5 lg:flex">
          <div className="flex items-center gap-2 px-2">
            <div className="grid h-7 w-7 place-items-center rounded-[9px] bg-[#6c6df5] shadow-[0_0_22px_rgba(108,109,245,.36)]"><Sparkles size={14} fill="white" /></div>
            <span className="text-[14px] font-semibold tracking-[-0.02em]">caption<span className="text-[#8788ff]">.</span>studio</span>
          </div>
          <button onClick={() => fileInput.current?.click()} className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-[#6465ed] px-3 py-2.5 text-[12px] font-semibold shadow-[0_8px_28px_rgba(100,101,237,.22)] transition hover:bg-[#7778fa] active:scale-[.98]"><Plus size={15} /> New project</button>
          <input ref={fileInput} type="file" accept="video/*,audio/*" className="hidden" onChange={handleUpload} />

          <div className="mt-8 space-y-1">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[.18em] text-white/25">Workspace</p>
            {[{ label: "Caption editor", icon: Subtitles }, { label: "Projects", icon: Film }, { label: "Templates", icon: LayoutTemplate }].map(({ label, icon: Icon }) => (
              <button key={label} onClick={() => setActiveNav(label)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[12px] transition ${activeNav === label ? "bg-white/[0.08] text-white" : "text-white/45 hover:bg-white/[0.04] hover:text-white/80"}`}><Icon size={15} />{label}{label === "Templates" && <span className="ml-auto rounded-full bg-[#6c6df5]/20 px-1.5 py-0.5 text-[9px] text-[#a1a2ff]">24</span>}</button>
            ))}
          </div>

          <div className="mt-8 space-y-1">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[.18em] text-white/25">Tools</p>
            {[{ label: "Brand kit", icon: Layers3 }, { label: "Preferences", icon: Settings2 }].map(({ label, icon: Icon }) => (
              <button key={label} onClick={() => flash(`${label} opens in the next workspace`)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[12px] text-white/45 transition hover:bg-white/[0.04] hover:text-white/80"><Icon size={15} />{label}</button>
            ))}
          </div>

          <div className="mt-auto rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5">
            <div className="flex items-start justify-between"><div><p className="text-[11px] font-medium text-white/80">Free workspace</p><p className="mt-1 text-[10px] text-white/35">24 minutes left this month</p></div><Zap size={14} className="text-[#f5c56e]" /></div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.08]"><div className="h-full w-[38%] rounded-full bg-[#f5c56e]" /></div>
            <button onClick={() => flash("Your free plan is active")} className="mt-3 text-[10px] font-medium text-[#a7a8ff] hover:text-white">View usage</button>
          </div>
          <div className="mt-4 flex items-center justify-between px-2 text-[10px] text-white/25"><span className="flex items-center gap-1.5"><CircleHelp size={13} /> Help center</span><span className="flex items-center gap-1.5"><LockKeyhole size={11} /> Private</span></div>
        </aside>

        <main className="min-w-0 flex-1 bg-[radial-gradient(circle_at_50%_-10%,rgba(108,109,245,.09),transparent_35%)]">
          <header className="flex h-[68px] items-center justify-between border-b border-white/[0.07] px-5 sm:px-8">
            <div className="flex min-w-0 items-center gap-3"><button className="text-white/55 lg:hidden"><Menu size={20} /></button><div className="min-w-0"><div className="flex items-center gap-2 text-[13px] text-white/80"><span className="truncate">{videoName.replace(/\.[^/.]+$/, "")}</span><ChevronDown size={14} className="shrink-0 text-white/30" /></div><p className="mt-0.5 text-[10px] text-white/30">Last edited just now · local draft</p></div></div>
            <div className="flex items-center gap-2"><button onClick={() => flash("Preview is ready in your browser")} className="hidden items-center gap-2 rounded-lg border border-white/[0.09] px-3 py-2 text-[11px] font-medium text-white/60 transition hover:border-white/20 hover:text-white sm:flex"><Eye size={14} /> Preview</button><button onClick={downloadSrt} className="flex items-center gap-2 rounded-lg bg-[#6465ed] px-3.5 py-2 text-[11px] font-semibold shadow-[0_7px_25px_rgba(100,101,237,.18)] transition hover:bg-[#7778fa] active:scale-[.98]"><Download size={14} /> {isExporting ? "Exporting" : "Export SRT"}</button></div>
          </header>

          <div className="px-4 py-5 sm:px-8 sm:py-7">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><div className="flex items-center gap-2"><span className="rounded-full border border-[#7b7cff]/25 bg-[#6869ed]/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-[.16em] text-[#a4a5ff]">Caption editor</span><span className="flex items-center gap-1 text-[10px] text-emerald-300/70"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Saved locally</span></div><h1 className="mt-3 text-[25px] font-semibold tracking-[-.045em] text-white sm:text-[30px]">Make every word land.</h1><p className="mt-1 text-[12px] text-white/40">Turn raw speech into captions with rhythm, clarity, and a little more personality.</p></div><button onClick={generateCaptions} disabled={isGenerating} className="flex items-center gap-2 rounded-lg border border-[#6d6ef4]/35 bg-[#6d6ef4]/10 px-3.5 py-2.5 text-[11px] font-semibold text-[#b2b3ff] transition hover:bg-[#6d6ef4]/20 disabled:cursor-wait disabled:opacity-70">{isGenerating ? <Loader2 size={14} className="animate-spin" /> : <WandSparkles size={14} />}{isGenerating ? "Generating draft" : "Generate captions"}</button></div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">
              <section className="min-w-0 space-y-4">
                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#12141c] shadow-[0_18px_55px_rgba(0,0,0,.2)]">
                  <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3"><div className="flex items-center gap-2 text-[11px] text-white/55"><AudioWaveform size={14} className="text-[#8889fb]" /><span>9:16 vertical preview</span><span className="text-white/20">·</span><span>{formatDuration(videoDuration)}</span></div><div className="flex items-center gap-1.5 text-[10px] text-white/30"><span className="h-1.5 w-1.5 rounded-full bg-[#6c6df5]" /> {language}</div></div>
                  <div className="relative mx-auto aspect-[9/11] max-h-[465px] w-full max-w-[380px] overflow-hidden bg-[#1a1b24]">
                    {videoUrl ? <video src={videoUrl} className="absolute inset-0 h-full w-full object-cover opacity-65" onLoadedMetadata={(event) => setVideoDuration(event.currentTarget.duration || 13.4)} /> : <><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_20%,rgba(246,184,92,.28),transparent_33%),linear-gradient(154deg,#29354d_0%,#151721_43%,#21131c_100%)]" /><div className="absolute -right-12 top-8 h-48 w-48 rounded-full bg-[#ef8f7a]/20 blur-3xl" /><div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[#7378e8]/20 blur-3xl" /><div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0e1017]/80 to-transparent" /><div className="absolute left-7 top-8 rotate-[-8deg] rounded-full border border-white/20 bg-black/10 px-3 py-1 text-[10px] uppercase tracking-[.18em] text-white/60 backdrop-blur">create / repeat</div><div className="absolute bottom-[30%] left-[15%] h-28 w-28 rounded-[35%] bg-[#dc977a]/35 blur-[1px]" /></>}
                    <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center"><button onClick={() => setIsPlaying((value) => !value)} className="grid h-12 w-12 place-items-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md transition hover:scale-105">{isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-0.5" />}</button></div>
                    <div className={`absolute inset-x-5 bottom-10 text-${align}`}><span className={`caption-preview ${activeTemplate === "Pop words" ? "text-[#f6c967]" : "text-white"} ${activeTemplate === "Neon punch" ? "text-[#d1ff46]" : ""}`} style={{ fontSize: `${fontSize}px`, textAlign: align as "left" | "center" | "right", textShadow: outline ? "0 3px 0 rgba(0,0,0,.85), 0 0 14px rgba(0,0,0,.4)" : "none", fontFamily: activeTemplate === "Soft serif" ? "Georgia, serif" : "inherit" }}>{highlight ? <mark className="rounded bg-[#f2bd54] px-1.5 text-[#161616]">{currentCaption.text}</mark> : currentCaption.text}</span></div>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/20 px-2 py-1 text-[9px] text-white/45 backdrop-blur">{activeCaption} / {captions.length}</div>
                  </div>
                  <div className="border-t border-white/[0.06] bg-[#101117] px-4 py-3"><div className="relative h-1.5 rounded-full bg-white/[0.08]"><div className="absolute left-0 top-0 h-full rounded-full bg-[#7778fa]" style={{ width: `${timePercent}%` }} /><div className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-[#c1c2ff] bg-[#6c6df5] shadow-[0_0_12px_rgba(108,109,245,.8)]" style={{ left: `calc(${timePercent}% - 6px)` }} /></div><div className="mt-2 flex items-center justify-between text-[10px] font-mono text-white/30"><span>00:0{Math.min(activeCaption - 1, 9)}.42</span><span>{formatDuration(videoDuration)}</span></div></div>
                </div>

                <div onClick={() => fileInput.current?.click()} className="group flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-white/[0.14] bg-white/[0.02] px-4 py-3 transition hover:border-[#7778fa]/60 hover:bg-[#7778fa]/[0.04]"><div className="flex items-center gap-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-[#7778fa]/10 text-[#a2a3ff]"><CloudUpload size={16} /></div><div><p className="text-[11px] font-medium text-white/75">Drop another video here</p><p className="mt-0.5 text-[10px] text-white/30">MP4, MOV, WebM · up to 500 MB in browser preview</p></div></div><span className="hidden items-center gap-1.5 text-[10px] font-medium text-[#9b9cff] group-hover:flex"><UploadCloud size={13} /> Browse files</span></div>

                <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#12141a]"><div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3"><div className="flex items-center gap-2"><Subtitles size={14} className="text-[#8b8cff]" /><span className="text-[12px] font-semibold text-white/80">Caption timeline</span><span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[9px] text-white/35">{captions.length} lines</span></div><div className="flex items-center gap-1"><button onClick={generateCaptions} className="rounded-md p-1.5 text-white/35 transition hover:bg-white/[0.06] hover:text-white"><RefreshCw size={13} /></button><button onClick={() => flash("Split tool is ready for the next caption beat")} className="rounded-md p-1.5 text-white/35 transition hover:bg-white/[0.06] hover:text-white"><Scissors size={13} /></button><button onClick={() => flash("Timeline settings saved")} className="rounded-md p-1.5 text-white/35 transition hover:bg-white/[0.06] hover:text-white"><MoreHorizontal size={14} /></button></div></div><div className="grid grid-cols-[78px_78px_1fr_34px] gap-3 border-b border-white/[0.06] px-4 py-2 text-[9px] font-semibold uppercase tracking-[.14em] text-white/25"><span>Start</span><span>End</span><span>Caption copy</span><span /></div>{captions.map((caption) => <CaptionRow key={caption.id} caption={caption} active={activeCaption === caption.id} onSelect={() => setActiveCaption(caption.id)} />)}<div className="flex items-center justify-between bg-white/[0.015] px-4 py-2.5"><button onClick={() => setCaptions((items) => [...items, { id: items.length + 1, start: "00:13.40", end: "00:15.20", text: "Type your next beat…" }])} className="flex items-center gap-1.5 text-[10px] font-medium text-[#9b9cff] hover:text-white"><Plus size={13} /> Add caption</button><span className="flex items-center gap-1.5 text-[10px] text-white/25"><LockKeyhole size={11} /> Autosaved locally</span></div></div>
              </section>

              <aside className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#12141a] xl:sticky xl:top-5 xl:self-start">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3"><div className="flex items-center gap-2"><SlidersHorizontal size={14} className="text-[#9697ff]" /><span className="text-[12px] font-semibold text-white/80">Inspector</span></div><button onClick={() => flash("Inspector reset to defaults")} className="text-white/30 transition hover:text-white"><RefreshCw size={13} /></button></div>
                <div className="grid grid-cols-3 border-b border-white/[0.06] px-2 pt-2">{["Style", "Position", "Motion"].map((tab) => <button key={tab} onClick={() => setActiveInspector(tab)} className={`border-b-2 px-2 py-2.5 text-[10px] font-medium transition ${activeInspector === tab ? "border-[#7f80ff] text-white" : "border-transparent text-white/35 hover:text-white/70"}`}>{tab}</button>)}</div>
                <div className="space-y-5 p-4">
                  {activeInspector === "Style" && <>
                    <div><div className="mb-2.5 flex items-center justify-between"><label className="flex items-center gap-2 text-[11px] font-medium text-white/65"><LayoutTemplate size={13} /> Template</label><span className="text-[10px] text-[#9b9cff]">{activeTemplate}</span></div><div className="grid grid-cols-3 gap-2">{templates.map((template) => <button key={template.name} onClick={() => { setActiveTemplate(template.name); flash(`${template.name} template applied`); }} className={`group rounded-lg border p-1.5 text-left transition ${activeTemplate === template.name ? "border-[#797aff] bg-[#7778fa]/10" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"}`}><div className={`template-tile ${template.className}`}><span>{template.name === "Pop words" ? "make it POP" : template.name === "Kinetic" ? "MOVE\nWITH IT" : template.name === "Editorial" ? "the story" : "your words"}</span></div><p className="mt-1.5 truncate text-[9px] text-white/50">{template.name}</p></button>)}</div></div>
                    <div><label className="mb-2 flex items-center gap-2 text-[11px] font-medium text-white/65"><Languages size={13} /> Language</label><div className="relative"><select value={language} onChange={(event) => setLanguage(event.target.value)} className="w-full appearance-none rounded-lg border border-white/[0.1] bg-white/[0.035] px-3 py-2.5 text-[11px] text-white/75 outline-none transition focus:border-[#7778fa]"><option className="bg-[#1b1c25]" value="Auto detect">Auto detect</option>{languages.filter((item) => item !== "Auto detect").map((item) => <option className="bg-[#1b1c25]" key={item} value={item}>{item}</option>)}</select><ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/35" /></div><p className="mt-1.5 text-[9px] leading-relaxed text-white/25">Hinglish keeps English words natural while preserving Hindi rhythm.</p></div>
                    <div><div className="mb-2 flex items-center justify-between"><label className="flex items-center gap-2 text-[11px] font-medium text-white/65"><Type size={13} /> Text size</label><span className="font-mono text-[10px] text-white/35">{fontSize}px</span></div><input type="range" min="18" max="52" value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} className="w-full accent-[#797aff]" /></div>
                    <div><label className="mb-2 flex items-center gap-2 text-[11px] font-medium text-white/65"><AlignCenter size={13} /> Alignment</label><div className="flex rounded-lg border border-white/[0.08] bg-white/[0.025] p-1">{[{ key: "left", icon: AlignLeft }, { key: "center", icon: AlignCenter }, { key: "right", icon: AlignRight }].map(({ key, icon: Icon }) => <button key={key} onClick={() => setAlign(key)} className={`flex flex-1 justify-center rounded-md py-1.5 transition ${align === key ? "bg-white/[0.1] text-white" : "text-white/30 hover:text-white/70"}`}><Icon size={14} /></button>)}</div></div>
                    <div className="space-y-2.5"><Toggle label="Outline" active={outline} onClick={() => setOutline((value) => !value)} /><Toggle label="Highlight active word" active={highlight} onClick={() => setHighlight((value) => !value)} /></div>
                  </>}
                  {activeInspector === "Position" && <InspectorEmpty icon={<Move size={16} />} title="Place your captions" copy="Use the canvas preview to choose a safe area for every platform." options={["Bottom safe zone", "Center focus", "Top headline"]} onClick={() => flash("Position preset applied")} />}
                  {activeInspector === "Motion" && <InspectorEmpty icon={<WandSparkles size={16} />} title="Add a little rhythm" copy="Animate each line without losing readability." options={["Pop in", "Word reveal", "Smooth fade"]} onClick={() => flash("Motion preset applied")} />}
                </div>
                <div className="border-t border-white/[0.06] bg-white/[0.015] p-4"><button onClick={generateCaptions} disabled={isGenerating} className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/[0.08] py-2.5 text-[11px] font-semibold text-white/80 transition hover:bg-white/[0.13] disabled:opacity-60"><Sparkles size={13} className="text-[#a7a8ff]" /> {isGenerating ? "Drafting…" : "Regenerate with AI"}</button><p className="mt-2 flex items-center justify-center gap-1 text-center text-[9px] text-white/25"><Zap size={10} className="text-[#f5c56e]" /> Uses local preview mode until a Whisper key is connected.</p></div>
              </aside>
            </div>

            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[#7778fa]/15 bg-[#7778fa]/[0.05] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#7778fa]/15 text-[#a7a8ff]"><WandSparkles size={14} /></div><div><p className="text-[11px] font-semibold text-white/75">{toast}</p><p className="mt-0.5 text-[10px] text-white/35">Your video stays in this browser until you connect a hosted transcription provider.</p></div></div><button onClick={() => flash("Whisper integration checklist copied")} className="flex shrink-0 items-center gap-1.5 text-[10px] font-medium text-[#a7a8ff] hover:text-white"><FileVideo size={13} /> Integration checklist</button></div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button onClick={onClick} className="flex w-full items-center justify-between text-[11px] text-white/55"><span>{label}</span><span className={`relative h-4 w-7 rounded-full transition ${active ? "bg-[#7778fa]" : "bg-white/[0.13]"}`}><span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition ${active ? "left-3.5" : "left-0.5"}`} /></span></button>;
}

function InspectorEmpty({ icon, title, copy, options, onClick }: { icon: React.ReactNode; title: string; copy: string; options: string[]; onClick: () => void }) {
  return <div className="space-y-4"><div className="rounded-xl border border-dashed border-white/[0.1] bg-white/[0.02] p-4"><div className="mb-3 grid h-8 w-8 place-items-center rounded-lg bg-[#7778fa]/10 text-[#a3a4ff]">{icon}</div><p className="text-[12px] font-medium text-white/75">{title}</p><p className="mt-1 text-[10px] leading-relaxed text-white/35">{copy}</p></div><div className="space-y-2">{options.map((option) => <button key={option} onClick={onClick} className="flex w-full items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-2.5 text-left text-[11px] text-white/55 transition hover:border-[#7778fa]/40 hover:text-white"><span>{option}</span><Check size={13} className="text-white/20" /></button>)}</div></div>;
}
