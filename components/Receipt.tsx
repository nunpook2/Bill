
import React from 'react';
import { BillMode } from '../types';

interface ReceiptProps {
  mode: BillMode;
  number: number;
}

const Receipt: React.FC<ReceiptProps> = ({ mode, number }) => {
  const isDineIn = mode === BillMode.DINE_IN;
  const timestamp = new Date().toLocaleString('th-TH', { 
    hour: '2-digit', 
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Sharp lines for writing orders without numbers
  const WritingLines = ({ count }: { count: number }) => (
    <div className="flex-grow py-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-b-[0.5mm] border-slate-300 w-full h-10 flex items-end">
          <span className="text-[16px] font-bold text-slate-200 ml-1 leading-none">
            ........................................................................................
          </span>
        </div>
      ))}
    </div>
  );

  // Dine-In Receipt: High Contrast White & Orange
  if (isDineIn) {
    return (
      <div className="bg-white text-black p-8 w-full h-full flex flex-col relative border-[1mm] border-slate-800 overflow-hidden" style={{ textRendering: 'optimizeLegibility' }}>
        {/* Decorative strip (Not black) */}
        <div className="absolute top-0 left-0 w-3 h-full bg-orange-400"></div>
        
        <div className="flex justify-between items-start mb-6 pl-4">
          <div>
            <h1 className="text-4xl font-extrabold text-orange-600 tracking-tight leading-none">ผัดไทยโบราณหญิงเรือง</h1>
            <div className="mt-4">
              <span className="text-[14px] font-extrabold border-2 border-orange-600 text-orange-600 px-3 py-1 rounded uppercase tracking-tighter">
                ทานที่ร้าน
              </span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <p className="text-[16px] font-black text-slate-700 uppercase leading-none mb-1">เลขโต๊ะ / TABLE</p>
            <span className="text-[100px] font-black mono text-orange-600 leading-none tracking-tighter">{number}</span>
          </div>
        </div>

        {/* Item List Area - Clean without numbers */}
        <div className="pl-4 flex-grow flex flex-col mt-2">
          <WritingLines count={6} />
        </div>

        {/* Footer with Manual Entry for Total */}
        <div className="mt-6 pt-5 pl-4 border-t-[1.5mm] border-slate-800 flex justify-between items-end">
          <p className="text-[13px] text-slate-500 font-mono font-bold italic">
            {timestamp}
          </p>
          <div className="flex items-center gap-5">
            <span className="text-3xl font-black text-slate-800">ราคารวมทั้งสิ้น</span>
            <div className="w-48 border-b-[1.5mm] border-double border-slate-800 h-12 flex items-end justify-end px-3">
               <span className="text-2xl font-black text-slate-800">บาท</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Takeaway Style: Split Copy (Customer & Shop)
  return (
    <div className="bg-white text-black w-full h-full flex flex-col border-[1mm] border-slate-800 overflow-hidden" style={{ textRendering: 'optimizeLegibility' }}>
      {/* Top Half: Customer Copy */}
      <div className="p-6 border-b-[1.2mm] border-dashed border-slate-400 bg-orange-50 flex justify-between items-center relative">
        <div className="z-10">
          <h2 className="text-2xl font-black text-orange-700 leading-none">ผัดไทยโบราณหญิงเรือง</h2>
          <p className="text-[14px] font-black text-orange-600 uppercase tracking-widest mt-2 border border-orange-600 px-2 py-0.5 rounded-md inline-block">
            ส่วนของลูกค้า (สั่งกลับบ้าน)
          </p>
        </div>
        <div className="bg-white border-[1.5mm] border-orange-600 px-10 py-5 rounded-[1.5rem] text-center shadow-md z-10 scale-110">
          <p className="text-[14px] font-black text-orange-600 uppercase mb-1 leading-none">เลขคิว</p>
          <span className="text-7xl font-black mono text-slate-800 leading-none tracking-tighter">{number}</span>
        </div>
      </div>

      {/* Bottom Half: Shop Copy */}
      <div className="p-8 flex-grow flex flex-col relative bg-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[15px] font-black border-2 border-slate-800 text-slate-800 px-3 py-1.5 rounded uppercase tracking-tighter">
                ส่วนของร้านค้า
              </span>
              <span className="text-[18px] font-black text-slate-800 tracking-widest">
                / คิวที่ {number}
              </span>
            </div>
          </div>
          <span className="text-6xl font-black mono text-slate-800 leading-none">{number}</span>
        </div>

        {/* Item List Area - Clean without numbers */}
        <div className="flex-grow mt-2">
          <WritingLines count={4} />
        </div>

        {/* Totals Section */}
        <div className="mt-auto pt-6 border-t-[1.2mm] border-slate-800 flex justify-between items-end">
          <span className="text-[12px] text-slate-400 font-mono font-bold">{timestamp}</span>
          <div className="flex items-center gap-5">
            <span className="text-2xl font-black text-slate-800">ราคารวม</span>
            <div className="w-40 border-b-[1.2mm] border-slate-800 h-11 flex items-end justify-end px-3">
              <span className="text-xl font-black text-slate-800">บาท</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
