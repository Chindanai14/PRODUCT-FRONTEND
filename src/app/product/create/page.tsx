'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateProduct() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  
  // 1. เพิ่ม State สำหรับเก็บข้อความ Error 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // เคลียร์ Error เก่าก่อน 

    try {
      const res = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          price: Number(price), // แปลงราคาเป็นตัวเลข [cite: 21]
          description 
        }),
      });

      if (res.ok) {
        router.push('/product'); // บันทึกสำเร็จ กลับไปหน้ารายการ [cite: 21]
      } else {
        // 2. ดึงรายละเอียดข้อผิดพลาดจาก Server (เช่น Validation Failed) 
        const errorData = await res.json();
        
        // NestJS มักส่ง Error มาเป็น Array หรือ String 
        if (Array.isArray(errorData.message)) {
          setErrorMessage(errorData.message.join(', ')); 
        } else {
          setErrorMessage(errorData.message || 'เกิดข้อผิดพลาดในการบันทึก'); 
        }
      }
    } catch (error) {
      setErrorMessage('ไม่สามารถเชื่อมต่อกับ Server ได้'); 
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>เพิ่มสินค้าใหม่</h1>

      {/* 3. แสดงข้อความ Error ถ้ามี  */}
      {errorMessage && (
        <div style={{ color: 'red', marginBottom: '10px', border: '1px solid red', padding: '10px' }}>
          <strong>เกิดข้อผิดพลาด:</strong> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <p>ชื่อ: <input type="text" value={name} onChange={e => setName(e.target.value)} required /></p>
        <p>ราคา: <input type="number" value={price} onChange={e => setPrice(e.target.value)} required /></p>
        <p>รายละเอียด: <textarea value={description} onChange={e => setDescription(e.target.value)} /></p>
        <button type="submit">บันทึก</button> {' '}
        <Link href="/product">ยกเลิก</Link>
      </form>
    </div>
  );
}