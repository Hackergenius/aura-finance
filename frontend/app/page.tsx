"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Upload, Scan, CheckCircle, AlertTriangle, FileText, TrendingUp, 
  Package, Box, Activity, Landmark, Loader2, Cpu, ShieldCheck, 
  Zap, Plane, QrCode, History, Wallet, ShoppingBag, ArrowRight, 
  Briefcase, BarChart3, Globe, Copy, Lock, Mail, ChevronRight 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import axios from 'axios';

// --- CONFIGURATION CRITIQUE ---
// URL Render identifiée : https://aura-backend-9gcm.onrender.com
// La valeur par défaut DOIT être l'URL Render.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aura-backend-9gcm.onrender.com"; 
const USER_ID = "user_demo_franck_abe";

// --- MODE PRO : ZÉRO DONNÉES PAR DÉFAUT ---
const INITIAL_CHART_DATA = [
  { name: 'Week 1', amount: 0 },
  { name: 'Week 2', amount: 0 },
  { name: 'Week 3', amount: 0 },
  { name: 'Week 4', amount: 0 },
];

const AI_LOGS = [
  "INITIALIZING UHG-NEURAL CORE v2.5...",
  "CONNECTING TO RENDER API...", 
  "EXTRACTING TEXT DATA (OCR)...",
  "DETECTING CURRENCY: AED (United Arab Emirates)...",
  "CHECKING UAE CORPORATE TAX LAW (2025)...",
  "CALCULATING VAT DEDUCTIBILITY (5%)...",
  "VERIFYING INVENTORY SKU MATCHING...",
  "OPTIMIZING TAX SHIELD STRATEGY...",
  "FINALIZING FINANCIAL ENTRY...",
  "DONE."
];

// Portefeuille touristique vide par défaut
// Correction TypeScript pour le type explicite
interface RefundEntry {
    id: number;
    merchant: string;
    date: string;
    amount: number;
    refund: number;
    status: string;
}
const MOCK_TOURIST_HISTORY: RefundEntry[] = []; 

// Retrait des données Partenaire Virtuzone (Mode Pro)
const PARTNER_DATA = {
    partner_name: "AURA PARTNER NETWORK",
    tier: "DEMO ACCOUNT",
    total_clients: 0,
    commission_rate: "0%",
    pending_commission: 0.00,
    graph_data: [
        { name: 'J', sales: 0 }, { name: 'J', sales: 0 },
        { name: 'A', sales: 0 }, { name: 'S', sales: 0 },
        { name: 'O', sales: 0 }, { name: 'N', sales: 0 },
    ],
    recent: [
        { client: "Awaiting First Signup", plan: "---", comm: "0", status: "PENDING" },
    ]
};

// --- VARIANTS POUR ANIMATION STAGGER (Inchangés) ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 50 }
  }
};

// --- COMPOSANT PRINCIPAL (LOGIN + APP) ---
export default function AuraApp() {
    const [hasAccess, setHasAccess] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [isLoadingLogin, setIsLoadingLogin] = useState(false);
 
    // ... (handleLogin reste inchangé)
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (!userEmail) return;
     
      setIsLoadingLogin(true);
     
      setTimeout(() => {
          setIsLoadingLogin(false);
          setHasAccess(true);
      }, 1500);
    };
 
    // 1. ECRAN DE CONNEXION (SI PAS ACCES)
    if (!hasAccess) {
        return (
          <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 overflow-hidden relative font-sans selection:bg-emerald-500 selection:text-black">
             
              {/* Fond Animé */}
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-slate-900 via-black to-black z-0"></div>
              <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
 
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden"
              >
                  {/* Ligne laser haut */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-emerald-500 to-blue-500"></div>
                 
                  <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-black border border-emerald-500/50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                          <span className="text-4xl font-bold text-emerald-500">A</span>
                      </div>
                      <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">AURA <span className="text-emerald-500 font-mono text-lg">CORE</span></h1>
                      <p className="text-slate-400 text-sm">Dubai's First AI-CFO.</p>
                  </div>
 
                  <form onSubmit={handleLogin} className="space-y-5">
                      <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-2 ml-1 tracking-widest">Business Email Access</label>
                          <div className="relative group">
                              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                              <input
                                  type="email"
                                  required
                                  value={userEmail}
                                  onChange={(e) => setUserEmail(e.target.value)}
                                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-700"
                                  placeholder="ceo@company.ae"
                              />
                          </div>
                      </div>
                     
                      <button
                          type="submit"
                          disabled={isLoadingLogin}
                          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 group transform active:scale-[0.98]"
                      >
                          {isLoadingLogin ? (
                              <><Loader2 className="w-5 h-5 animate-spin"/> VERIFYING ACCESS...</>
                          ) : (
                              <><Lock className="w-4 h-4 group-hover:hidden"/><span className="group-hover:hidden">ENTER BETA PREVIEW</span> <span className="hidden group-hover:inline">UNLOCK DASHBOARD</span> <ChevronRight className="w-4 h-4 hidden group-hover:inline"/></>
                          )}
                      </button>
                  </form>
 
                  <div className="mt-8 text-center border-t border-white/5 pt-6">
                      <div className="flex items-center justify-center gap-2 text-[10px] text-slate-600 font-mono">
                          <ShieldCheck className="w-3 h-3 text-emerald-500"/>
                          <span>ENCRYPTED SESSION • UHG PROTOCOL v2.5</span>
                      </div>
                  </div>
              </motion.div>
          </div>
        );
    }
 
    // 2. SI CONNECTÉ -> AFFICHER LE DASHBOARD
    return <AuraDashboard />;
  }


// --- DASHBOARD ---
function AuraDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>(INITIAL_CHART_DATA);
  const [error, setError] = useState<string | null>(null);
 
  // 3. AFFINEMENT MOBILE : Utilisation d'un padding plus grand sur mobile
  const [activeTab, setActiveTab] = useState<'overview' | 'scan' | 'assets' | 'tourist' | 'partner'>('overview');
 
  const [aiLogIndex, setAiLogIndex] = useState(0);


  // Type pour l'historique des remboursements
  interface RefundEntry {
      id: number;
      merchant: string;
      date: string;
      amount: number;
      refund: number;
      status: string;
  }
  
  // Correction TypeScript: Utilise le type RefundEntry[]
  const [refundHistory, setRefundHistory] = useState<RefundEntry[]>(MOCK_TOURIST_HISTORY);


  // État pour le module Touriste
  const [taxFreeAmount, setTaxFreeAmount] = useState<string>("");
  const [taxFreeMerchant, setTaxFreeMerchant] = useState<string>("");
  const [taxFreeResult, setTaxFreeResult] = useState<any>(null);


  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => { 
    // On appelle l'API Render (qui peut être lente ou en veille)
    fetchInventory(); 
  }, []);


  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      setAiLogIndex(0);
      interval = setInterval(() => {
        setAiLogIndex((prev) => (prev < AI_LOGS.length - 1 ? prev + 1 : prev));
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isScanning]);


  const fetchInventory = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/aura/inventory/${USER_ID}`);
      setInventory(res.data);
    } catch (e) { 
      console.error("Erreur stock (API Render inaccessible ou en veille)", e); 
      // Si l'inventaire échoue, on affiche un message mais on continue
      setError("Erreur : Impossible de charger les données de stock depuis Render.");
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setScanResult(null);
      setError(null);
    }
  };


  // Logique mise à jour pour gérer l'API Render + Fallback Simulation
  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    const isApiConnected = API_URL !== "https://aura-backend-9gcm.onrender.com";
    let isSimulation = !isApiConnected;
    let finalResult: any = null;

    try {
      if (isApiConnected) {
        // Mode production : Appel réel
        const requestPromise = axios.post(`${API_URL}/api/aura/scan/${USER_ID}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        // Attente de 3.5s pour l'effet de scan/logs
        const [response] = await Promise.all([
          requestPromise,
          new Promise(resolve => setTimeout(resolve, 3500)) 
        ]);

        finalResult = response.data.data;
        if (!finalResult) throw new Error("API returned no data.");

      } else {
        // Forcer la simulation si l'URL est toujours la valeur par défaut
        throw new Error("URL API non configurée. Passage en mode simulation.");
      }

    } catch (err: any) {
      console.error("❌ Erreur Scan (Backend) :", err.message || err);
      // Si l'API réelle configurée échoue ou n'est pas configurée, on passe en simulation
      isSimulation = true;
      setError(`Erreur API : ${err.message || "Impossible de joindre Render."} Affichage de la simulation.`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Logique de simulation (exécutée si isSimulation est true)
    if (isSimulation) {
        finalResult = {
            merchant: "Dubai Tech Store (Sim)",
            total: 8925, 
            currency: "AED",
            tax_rule_applied: "Standard 5% VAT (Sim)",
            is_deductible: true,
            justification: "Achat de matériel informatique déductible pour l'entreprise (Simulé).",
            line_items: [
              {name: "MacBook Pro 16\"", quantity: 1, unit_price: 8000, sku: "MBP-16-A"},
              {name: "Office Software License", quantity: 1, unit_price: 500, sku: "SW-O365"}
            ]
        };
    }

    if (finalResult) {
        setScanResult(finalResult);
        fetchInventory();
        setChartData(prev => [...prev, { name: 'Now', amount: prev[prev.length - 1].amount - (finalResult.total || 0) }]);
    }
    
    setIsScanning(false);
    setActiveTab('scan');
  };

  // ... (handleTaxFreeCalc reste inchangé)
  const handleTaxFreeCalc = async () => {
      try {
          const amount = parseFloat(taxFreeAmount);
          if (isNaN(amount)) return;
         
          const merchantName = taxFreeMerchant || "Dubai Mall Retailer";

          const res = await axios.post(`${API_URL}/api/aura/tax-free`, {
              amount_total: amount,
              merchant_name: merchantName
          });
         
          const resultData = res.data;
          setTaxFreeResult(resultData);

          if (resultData.status === "ELIGIBLE") {
              const newEntry = {
                  id: Date.now(),
                  merchant: merchantName,
                  date: new Date().toISOString().split('T')[0],
                  amount: amount,
                  refund: resultData.estimated_refund,
                  status: "READY"
              } as RefundEntry;
              setRefundHistory(prev => [newEntry, ...prev]);
          }

      } catch(e) { console.error("Erreur calcul Tax Free:", e); }
  };

  const totalAssets = inventory.reduce((acc, item) => acc + (item.quantity_on_hand * item.unit_price), 0);
  const recoverableVAT = totalAssets * 0.05;
  const totalRefundValue = refundHistory.reduce((acc, item) => acc + item.refund, 0);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden">
     
      {/* HEADER - OPTIMISATION MOBILE : px-4 au lieu de px-6 sur mobile */}
      <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between"> 
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]">A</div>
            <span className="text-xl font-bold tracking-tight text-white hidden md:block">AURA <span className="text-emerald-500 font-mono text-xs">CORE</span></span>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
             {[
                 {id: 'overview', icon: <Activity className="w-3 h-3"/>},
                 {id: 'scan', icon: <Scan className="w-3 h-3"/>},
                 {id: 'assets', icon: <Box className="w-3 h-3"/>},
                 {id: 'tourist', icon: <Plane className="w-3 h-3"/>},
                 {id: 'partner', icon: <Briefcase className="w-3 h-3"/>}
             ].map((tab) => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`text-xs font-bold uppercase tracking-wider px-3 md:px-4 py-2 rounded-full transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-white bg-white/5'}`}
               >
                  {tab.icon} {tab.id}
               </button>
             ))}
          </div>
        </div>
      </nav>

      {/* CONTENU PRINCIPAL - Utilise px-4 sm:px-6 pour plus d'espace sur petit écran */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8"> 
       
        {/* VIEW: OVERVIEW (DASHBOARD) */}
        {activeTab === 'overview' && (
           <motion.div
             initial="hidden"
             animate="visible"
             variants={containerVariants}
             className="space-y-6"
           >
              {/* CORRECTION MOBILE : p-4 au lieu de p-6 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  <motion.div variants={itemVariants} className="bg-slate-900 border border-white/10 p-4 sm:p-6 rounded-2xl hover:border-emerald-500/30 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500/20 transition-all"><Activity className="w-6 h-6"/></div>
                          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Cash Flow</span>
                      </div>
                      {/* DONNÉES EN MODE PRO (ZEROS PAR DÉFAUT) */}
                      <h3 className="text-3xl font-bold text-white">0 <span className="text-sm text-slate-400 font-normal">AED</span></h3> 
                      <p className="text-slate-400 text-xs mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> 0% vs last month</p>
                  </motion.div>
                  <motion.div variants={itemVariants} className="bg-slate-900 border border-white/10 p-4 sm:p-6 rounded-2xl hover:border-emerald-500/30 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:bg-purple-500/20 transition-all"><Box className="w-6 h-6"/></div>
                          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Inventory Assets</span>
                      </div>
                      <h3 className="text-3xl font-bold text-white">{totalAssets.toLocaleString()} <span className="text-sm text-slate-400 font-normal">AED</span></h3>
                      <p className="text-slate-400 text-xs mt-2">{inventory.length} active SKUs</p>
                  </motion.div>
                  <motion.div variants={itemVariants} className="bg-slate-900 border border-white/10 p-4 sm:p-6 rounded-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
                      <div className="flex justify-between items-start mb-4">
                          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Landmark className="w-6 h-6"/></div>
                          <span className="text-xs text-emerald-500 uppercase font-bold tracking-wider">Recoverable VAT (5%)</span>
                      </div>
                      <h3 className="text-3xl font-bold text-white">+{recoverableVAT.toLocaleString()} <span className="text-sm text-slate-400 font-normal">AED</span></h3>
                      <p className="text-slate-400 text-xs mt-2">Ready to claim from FTA</p>
                  </motion.div>
              </div>
              <motion.div variants={itemVariants} className="bg-slate-900 border border-white/10 p-4 sm:p-6 rounded-2xl h-[350px] sm:h-[400px] relative"> 
                  <div className="absolute top-6 right-6 flex items-center gap-2">
                     <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                     <span className="text-xs text-emerald-500 font-mono">LIVE PREDICTION</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-6">Corporate Tax Threshold Tracker (375k AED)</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} />
                      <YAxis stroke="#64748b" tick={{fontSize: 12}} />
                      <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px'}} itemStyle={{color: '#fff'}} />
                      <Area type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                    </AreaChart>
                  </ResponsiveContainer>
              </motion.div>
           </motion.div>
        )}

        {/* VIEW: SCANNER - Logique de Scan (maintenant connecté ou en simulation forcée) */}
        {activeTab === 'scan' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-4 sm:gap-8 items-start"> 
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Cpu className="w-24 h-24 text-emerald-500"/></div>
                <div className="mb-4 flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <Scan className="w-4 h-4" /> AI Input Node
                </div>
               
                {/* DROPZONE MODIFIÉE POUR L'EFFET LASER */}
                <div
                onClick={() => !isScanning && fileInputRef.current?.click()}
                className={`relative overflow-hidden border-2 border-dashed transition-all rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer group z-10 ${
                    isScanning
                    ? 'border-emerald-500 bg-black'
                    : 'border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/5'
                }`}
                >
                {/* FAISCEAU LASER DE SCAN */}
                {isScanning && (
                    <motion.div
                    initial={{ top: "0%" }}
                    animate={{ top: "100%" }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute left-0 w-full h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] z-20"
                    />
                )}

                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" disabled={isScanning} />
               
                {isScanning ? (
                    <div className="w-full h-full p-4 flex flex-col items-start justify-center font-mono text-xs z-10 bg-black/80 backdrop-blur-sm">
                        {AI_LOGS.map((log, index) => (
                           <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{
                                opacity: index <= aiLogIndex ? (index === aiLogIndex ? 1 : 0.5) : 0,
                                x: index <= aiLogIndex ? 0 : -10
                              }}
                              className={`mb-1 flex items-center gap-2 ${index === aiLogIndex ? 'text-emerald-400 font-bold shadow-emerald-500/50 drop-shadow-md' : 'text-emerald-500/30'}`}
                           >
                              <span>{index === aiLogIndex ? '>' : '#'}</span> {log}
                           </motion.div>
                        ))}
                    </div>
                ) : file ? (
                    <div className="text-center p-4">
                    <FileText className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                    <p className="text-white font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-slate-500 mt-1">Ready for Analysis</p>
                    </div>
                ) : (
                    <div className="text-center">
                    <Upload className="w-10 h-10 text-slate-500 group-hover:text-emerald-400 mb-4 mx-auto transition-colors" />
                    <p className="text-slate-300 font-medium">Click to Upload Invoice</p>
                    <p className="text-xs text-slate-500 mt-2">Supports PDF, JPG, PNG</p>
                    </div>
                )}
                </div>

                <button
                onClick={handleScan}
                disabled={!file || isScanning}
                className={`w-full mt-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    !file || isScanning
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transform hover:scale-[1.02]'
                }`}
                >
                {isScanning ? <><Loader2 className="w-5 h-5 animate-spin" /> PROCESSING...</> : <><Zap className="w-5 h-5" /> ANALYZE WITH AURA</>}
                </button>
                {error && <div className="mt-4 p-3 bg-red-900/20 border border-red-500 text-red-400 text-sm rounded-lg">{error}</div>}
            </div>
           
            {/* RÉSULTAT DU SCAN */}
            <div className="relative min-h-[300px]">
                <AnimatePresence>
                {scanResult && !isScanning && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-emerald-500 to-blue-500" />
                    <div className="p-6 bg-white/5 border-b border-white/5">
                         <div className="flex justify-between items-center">
                             <div className="flex items-center gap-2 text-emerald-400">
                                 <ShieldCheck className="w-5 h-5"/>
                                 <span className="text-sm font-bold tracking-wider">COMPLIANCE VERIFIED</span>
                             </div>
                             <span className="text-xs text-slate-500 font-mono">{new Date().toLocaleDateString()}</span>
                         </div>
                    </div>
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div><h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Merchant</h3><p className="text-2xl font-bold text-white">{scanResult.merchant}</p></div>
                            <div className="text-right"><h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Total Amount</h3><p className="text-white font-mono text-3xl tracking-tight">{scanResult.total} <span className="text-lg text-emerald-500">{scanResult.currency}</span></p></div>
                        </div>
                        {scanResult.tax_rule_applied && (
                            <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-300 flex items-center gap-3">
                                <Landmark className="w-5 h-5 shrink-0"/>
                                <div><p className="uppercase font-bold text-blue-400 mb-1">UAE Tax Law Applied</p><span className="text-white">{scanResult.tax_rule_applied}</span></div>
                            </div>
                        )}
                        {scanResult.line_items && scanResult.line_items.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-xs text-emerald-400 uppercase mb-3 flex items-center gap-2 font-bold"><Package className="w-3 h-3"/> Inventory Update</h4>
                                <div className="bg-black/40 rounded-lg overflow-hidden border border-white/5">
                                    {scanResult.line_items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center text-sm p-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-slate-300">{item.name}</span></div>
                                            <span className="text-emerald-400 font-mono bg-emerald-500/10 px-2 py-1 rounded">x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className={`flex items-center gap-3 p-4 rounded-xl border ${scanResult.is_deductible ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                            {scanResult.is_deductible ? <CheckCircle className="w-6 h-6 text-emerald-400" /> : <AlertTriangle className="w-6 h-6 text-red-400" />}
                            <div><p className={`text-sm font-bold ${scanResult.is_deductible ? 'text-emerald-400' : 'text-red-400'}`}>{scanResult.is_deductible ? "CORPORATE TAX DEDUCTIBLE" : "NON-DEDUCTIBLE EXPENSE"}</p><p className="text-xs text-slate-400 mt-1">{scanResult.justification || "Analyzed based on FTA guidelines."}</p></div>
                        </div>
                    </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
            </motion.div>
        )}


        {/* VIEW: ASSETS */}
        {activeTab === 'assets' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 sm:p-8 shadow-2xl"> 
                    <div className="flex items-center justify-between mb-8">
                        <div><h2 className="text-2xl font-bold text-white flex items-center gap-2"><Box className="w-6 h-6 text-emerald-500" /> Real-Time Inventory</h2></div>
                        <div className="text-right"><p className="text-xs text-slate-500 uppercase">Valuation</p><p className="text-2xl font-mono text-emerald-400">{totalAssets.toLocaleString()} AED</p></div>
                    </div>
                    {inventory.length === 0 ? <p className="text-center text-slate-500 py-10">No assets in stock.</p> : (
                        <div className="overflow-x-auto"> 
                          <table className="w-full text-left border-collapse min-w-[500px]"> 
                              <thead><tr className="border-b border-white/10 text-xs text-slate-500 uppercase"><th className="pb-4 pl-4 text-emerald-500">SKU Ref</th><th className="pb-4">Product Name</th><th className="pb-4 text-right">Qty</th><th className="pb-4 text-right pr-4">Unit Value</th></tr></thead>
                              <tbody className="text-sm">{inventory.map((item, idx) => (
                                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors"><td className="py-4 pl-4 font-mono text-slate-400 text-xs">{item.sku}</td><td className="py-4 font-medium text-white">{item.product_name}</td><td className="py-4 text-right"><span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">{item.quantity_on_hand}</span></td><td className="py-4 text-right pr-4 font-mono text-emerald-400">{item.unit_price.toLocaleString()} AED</td></tr>
                              ))}</tbody>
                          </table>
                        </div>
                    )}
                </div>
            </motion.div>
        )}


        {/* VIEW: TOURIST (WALLET MODE) */}
        {activeTab === 'tourist' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-4 sm:gap-8 items-start"> 
               
                {/* COLONNE GAUCHE : GENERATEUR */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 sm:p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Plane className="w-32 h-32 text-blue-500"/></div>
                       
                        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><QrCode className="w-6 h-6 text-blue-400"/> New Purchase</h2>
                        <p className="text-slate-400 text-xs mb-8">Scan receipt to add to your Tax Free Wallet.</p>
                       
                        <div className="space-y-4 relative z-10">
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Merchant Name</label>
                                <div className="relative">
                                    <ShoppingBag className="absolute left-4 top-3.5 w-5 h-5 text-slate-500"/>
                                    <input
                                        type="text"
                                        value={taxFreeMerchant}
                                        onChange={(e) => setTaxFreeMerchant(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 outline-none text-sm"
                                        placeholder="e.g. Chanel, Dubai Mall"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Total Receipt (AED)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-slate-500">AED</span>
                                    <input
                                        type="number"
                                        value={taxFreeAmount}
                                        onChange={(e) => setTaxFreeAmount(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 outline-none font-mono text-lg"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleTaxFreeCalc}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Wallet className="w-4 h-4"/> ADD TO WALLET
                            </button>
                        </div>
                    </div>


                    {/* QR CODE ACTIF (DERNIER) */}
                    <AnimatePresence>
                    {taxFreeResult && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white text-black rounded-2xl p-6 shadow-2xl relative">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">Digital Refund Tag</h3>
                                    <p className="text-xs text-slate-500 mb-4">{new Date().toLocaleString()}</p>
                                </div>
                                <img src={taxFreeResult.qr_code_url} alt="Refund QR" className="w-16 h-16 mix-blend-multiply" />
                            </div>
                            <div className="flex justify-between items-end border-t border-slate-100 pt-4">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase">Refund Value</p>
                                    <p className="text-3xl font-bold text-blue-600">{taxFreeResult.estimated_refund} <span className="text-sm text-slate-400">AED</span></p>
                                </div>
                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> READY</span>
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>


                {/* COLONNE DROITE : HISTORIQUE PORTEFEUILLE */}
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 sm:p-8 shadow-2xl h-full flex flex-col">
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2"><History className="w-6 h-6 text-blue-400"/> Your Wallet</h2>
                        <div className="text-right">
                             <p className="text-xs text-slate-500 uppercase">Total Refundable</p>
                             <p className="text-2xl font-mono text-emerald-400">{totalRefundValue.toLocaleString()} AED</p>
                        </div>
                     </div>


                     <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {refundHistory.length === 0 ? (
                            <div className="text-center py-10 opacity-30">
                                <ShoppingBag className="w-12 h-12 mx-auto mb-3"/>
                                <p className="text-sm">No purchases yet. Start scanning receipts!</p>
                            </div>
                        ) : (
                            refundHistory.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white/5 border border-white/5 p-4 rounded-xl flex justify-between items-center hover:bg-white/10 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold group-hover:bg-blue-500 group-hover:text-white transition-all">
                                            {item.merchant.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{item.merchant}</p>
                                            <p className="text-xs text-slate-500">{item.date} • Spent: {item.amount} AED</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-emerald-400 font-bold">+{item.refund} AED</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{item.status}</p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                     </div>
                     
                     <div className="mt-6 pt-6 border-t border-white/10">
                        <button className="w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all">
                            CLAIM ALL REFUNDS <ArrowRight className="w-4 h-4"/>
                        </button>
                     </div>
                </div>

            </motion.div>
        )}


        {/* VIEW: PARTNER (B2B / VIRTUZONE) */}
        {activeTab === 'partner' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-linear-to-br from-slate-900 to-black border border-amber-500/20 rounded-2xl p-4 sm:p-8 shadow-2xl">
                    {/* Header Partenaire */}
                    <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/30">
                                <Briefcase className="w-8 h-8 text-amber-500"/>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{PARTNER_DATA.partner_name}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-amber-500 text-black text-[10px] font-bold rounded uppercase tracking-wider">{PARTNER_DATA.tier} PARTNER</span>
                                    <span className="text-slate-500 text-sm">ID: VZ-8829-DXB</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Pending Commission (USDT)</p>
                            <p className="text-4xl font-mono font-bold text-amber-500">${PARTNER_DATA.pending_commission.toLocaleString()}</p>
                            <button className="mt-2 text-xs text-amber-400 underline hover:text-white transition-colors">Withdraw to Binance</button>
                        </div>
                    </div>


                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <p className="text-slate-500 text-xs uppercase">Total Clients</p>
                            <p className="text-2xl font-bold text-white mt-1">{PARTNER_DATA.total_clients}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <p className="text-slate-500 text-xs uppercase">Commission Rate</p>
                            <p className="text-2xl font-bold text-white mt-1">{PARTNER_DATA.commission_rate}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 col-span-2">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-slate-500 text-xs uppercase">Referral Link</p>
                                <button className="text-emerald-500 hover:text-white transition-colors"><Copy className="w-4 h-4"/></button>
                            </div>
                            <code className="block bg-black/50 p-3 rounded-lg text-emerald-500 font-mono text-sm truncate">
                                https://aura.ae/ref/virtuzone-vip-promo
                            </code>
                        </div>
                    </div>


                    {/* Graph & List */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         {/* Graph */}
                         <div className="md:col-span-2 bg-white/5 rounded-xl p-6 border border-white/5">
                             <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-slate-400"/> Revenue Performance</h3>
                             <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={PARTNER_DATA.graph_data}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false}/>
                                        <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false}/>
                                        <Tooltip contentStyle={{backgroundColor: '#000', borderColor: '#333'}} cursor={{fill: 'rgba(255,255,255,0.05)'}}/>
                                        <Bar dataKey="sales" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={30}/>
                                    </BarChart>
                                </ResponsiveContainer>
                             </div>
                         </div>


                         {/* Recent Activity */}
                         <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                             <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-slate-400"/> Recent Signups</h3>
                             <div className="space-y-3">
                                 {PARTNER_DATA.recent.map((item, idx) => (
                                     <div key={idx} className="flex justify-between items-center text-sm pb-3 border-b border-white/5 last:border-0 last:pb-0">
                                         <div>
                                             <p className="text-white font-medium">{item.client}</p>
                                             <p className="text-slate-500 text-xs">{item.plan}</p>
                                         </div>
                                         <div className="text-right">
                                             <p className="text-amber-500 font-mono">{item.comm}</p>
                                             <p className="text-[10px] text-emerald-500">{item.status}</p>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                             <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all">VIEW ALL CLIENTS</button>
                         </div>
                    </div>
                </div>
            </motion.div>
        )}


      </div>
    </main>
  );
}
