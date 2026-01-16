
import React, { useState, useEffect, useCallback } from 'react';
import { ChefHat, ShoppingBag, Utensils, Printer, RotateCcw, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BillMode } from './types';
import { logBill, db, getRecentBills, initAnalytics } from './firebase';
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import Receipt from './components/Receipt';

const App: React.FC = () => {
  const [mode, setMode] = useState<BillMode>(BillMode.DINE_IN);
  const [selectedTable, setSelectedTable] = useState<number>(1);
  const [queueNumber, setQueueNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [recentBills, setRecentBills] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      const bills = await getRecentBills(8);
      setRecentBills(bills);
    } catch (e) {
      console.error("Error fetching history:", e);
    }
  }, []);

  useEffect(() => {
    initAnalytics();
    const initQueue = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "bills"), orderBy("timestamp", "desc"), limit(20));
        const querySnapshot = await getDocs(q);
        const now = new Date();
        const lastToday = querySnapshot.docs.find(d => {
          const data = d.data();
          if (!data.timestamp) return false;
          const ts = data.timestamp.toDate();
          return ts.getDate() === now.getDate() && 
                 ts.getMonth() === now.getMonth() &&
                 data.type === BillMode.TAKEAWAY;
        });

        if (lastToday) {
          const num = lastToday.data().number;
          setQueueNumber(num >= 100 ? 1 : num + 1);
        } else {
          setQueueNumber(1);
        }
      } catch (e) {
        setQueueNumber(1);
      } finally {
        setIsLoading(false);
        fetchHistory();
      }
    };
    initQueue();
  }, [fetchHistory]);

  const handlePrint = useCallback(async () => {
    const num = mode === BillMode.DINE_IN ? selectedTable : queueNumber;
    setIsLoading(true);
    try {
      await logBill(mode, num);
      window.print();
      setSuccessMessage(`บันทึก${mode === BillMode.DINE_IN ? 'โต๊ะ' : 'คิว'} ${num} สำเร็จ`);
      setTimeout(() => setSuccessMessage(null), 3000);

      if (mode === BillMode.TAKEAWAY) {
        setQueueNumber(prev => (prev >= 100 ? 1 : prev + 1));
      }
      fetchHistory();
    } catch (err) {
      console.error("Logging failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [mode, selectedTable, queueNumber, fetchHistory]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 no-print">
      
      {/* Toast Notification */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-[100] bg-white border border-slate-200 text-slate-800 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-8 duration-300">
          <CheckCircle2 size={20} className="text-emerald-500" />
          <span className="font-bold">{successMessage}</span>
        </div>
      )}

      {/* Control Sidebar - Clean White/Grey theme (No Black) */}
      <div className="w-full md:w-[380px] bg-white border-r border-slate-200 p-8 flex flex-col shadow-sm">
        <div className="mb-10 flex items-center gap-3">
          <div className="bg-orange-50 p-2.5 rounded-xl text-orange-600">
            <ChefHat size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 leading-none">ระบบบิลอาหาร</h1>
            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">แผงควบคุมหลัก</p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mb-8">
          <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">เลือกประเภทบริการ</label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setMode(BillMode.DINE_IN)}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${
                mode === BillMode.DINE_IN ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Utensils size={16} /> ทานที่ร้าน
            </button>
            <button
              onClick={() => setMode(BillMode.TAKEAWAY)}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${
                mode === BillMode.TAKEAWAY ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <ShoppingBag size={16} /> สั่งกลับบ้าน
            </button>
          </div>
        </div>

        {/* Settings Area */}
        <div className="flex-grow">
          {mode === BillMode.DINE_IN ? (
            <div className="animate-in fade-in duration-300">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-4 block">ระบุเลขโต๊ะ (1-10)</label>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setSelectedTable(i + 1)}
                    className={`aspect-square flex items-center justify-center text-lg font-bold rounded-xl border-2 transition-all ${
                      selectedTable === i + 1
                        ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-sm'
                        : 'border-slate-100 bg-slate-50 text-slate-300 hover:border-slate-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest block">ลำดับคิวปัจจุบัน</label>
                <button 
                  onClick={() => setQueueNumber(1)}
                  className="text-[11px] text-slate-300 hover:text-red-500 font-bold uppercase flex items-center gap-1 transition-colors"
                >
                  <RotateCcw size={10} /> เริ่มใหม่ (1)
                </button>
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-8 text-center">
                <span className="text-6xl font-black text-orange-600 mono tracking-tighter">{queueNumber}</span>
                <p className="text-[11px] text-orange-400 mt-2 font-bold uppercase tracking-widest">ระบบรันคิวอัตโนมัติ</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-4">
          <button
            onClick={handlePrint}
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <><Printer size={20} /> พิมพ์บิลอาหาร (6 บิลต่อหน้า)</>
            )}
          </button>

          {/* History */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Clock size={14} /> รายการล่าสุด
            </h3>
            <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar">
              {recentBills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-3 bg-white rounded-lg text-xs border border-slate-100 shadow-sm">
                  <span className="font-bold text-slate-700">
                    {bill.type === BillMode.DINE_IN ? 'โต๊ะ' : 'คิว'} {bill.number}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {bill.timestamp?.toDate().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-12 flex flex-col items-center justify-center overflow-auto bg-slate-100/50">
        <div className="mb-6 flex items-center gap-3 text-slate-400 text-[12px] font-bold uppercase tracking-widest">
          <AlertCircle size={14} /> ตัวอย่างการจัดวางบนกระดาษ A4
        </div>
        <div className="bg-white shadow-2xl p-4 w-full max-w-4xl aspect-[297/210] grid grid-cols-3 grid-rows-2 gap-2 origin-top scale-75 lg:scale-90 transition-transform duration-500">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-slate-100 overflow-hidden bg-white shadow-sm">
              <div className="scale-[0.45] origin-top-left w-[222%] h-[222%]">
                <Receipt 
                  mode={mode} 
                  number={mode === BillMode.DINE_IN ? selectedTable : queueNumber} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hidden Print Area */}
      <div className="hidden print-only">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bill-page">
            <Receipt 
              mode={mode} 
              number={mode === BillMode.DINE_IN ? selectedTable : queueNumber} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
