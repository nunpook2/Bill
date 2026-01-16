
import React from 'react';
import { BillMode } from '../types';

interface ReceiptProps {
  mode: BillMode;
  number: number;
}

const Receipt: React.FC<ReceiptProps> = ({ mode, number }) => {
  const isDineIn = mode === BillMode.DINE_IN;

  // เส้นบรรทัดว่างสำหรับเขียนรายการอาหาร (ไม่มีตัวเลขและจุดไข่ปลา)
  const WritingLines = ({ count }: { count: number }) => (
    <div className="flex-grow py-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-b-[0.5mm] border-slate-200 w-full h-10">
          {/* พื้นที่ว่างสำหรับเขียน */}
        </div>
      ))}
    </div>
  );

  // บิลทานที่ร้าน
  if (isDineIn) {
    return (
      <div className="bg-white text-black p-8 w-full h-full flex flex-col relative border-[1mm] border-slate-800 overflow-hidden" style={{ textRendering: 'optimizeLegibility' }}>
        {/* แถบสีตกแต่งด้านข้าง */}
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

        {/* ส่วนเขียนรายการ - เป็นเส้นบรรทัดว่าง */}
        <div className="pl-4 flex-grow flex flex-col mt-2">
          <WritingLines count={6} />
        </div>

        {/* ส่วนท้ายสำหรับเขียนราคารวม - ปรับให้กว้างขึ้นและไม่มีวันที่ */}
        <div className="mt-6 pt-5 pl-4 border-t-[1.5mm] border-slate-800 flex items-end">
          <div className="flex items-center w-full justify-between">
            <span className="text-3xl font-black text-slate-800 whitespace-nowrap">ราคารวมทั้งสิ้น</span>
            <div className="flex-grow mx-6 border-b-[1.5mm] border-double border-slate-800 h-14"></div>
            <span className="text-3xl font-black text-slate-800 whitespace-nowrap">บาท</span>
          </div>
        </div>
      </div>
    );
  }

  // บิลสั่งกลับบ้าน
  return (
    <div className="bg-white text-black w-full h-full flex flex-col border-[1mm] border-slate-800 overflow-hidden" style={{ textRendering: 'optimizeLegibility' }}>
      {/* ส่วนบน: ส่วนของลูกค้า */}
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

      {/* ส่วนล่าง: ส่วนของร้านค้า */}
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

        {/* ส่วนเขียนรายการ - เป็นเส้นบรรทัดว่าง */}
        <div className="flex-grow mt-2">
          <WritingLines count={4} />
        </div>

        {/* ส่วนราคารวมท้ายบิล - ปรับให้กว้างขึ้นและไม่มีวันที่ */}
        <div className="mt-auto pt-6 border-t-[1.2mm] border-slate-800 flex items-end">
          <div className="flex items-center w-full justify-between">
            <span className="text-2xl font-black text-slate-800 whitespace-nowrap">ราคารวม</span>
            <div className="flex-grow mx-4 border-b-[1.2mm] border-slate-800 h-12"></div>
            <span className="text-2xl font-black text-slate-800 whitespace-nowrap">บาท</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
