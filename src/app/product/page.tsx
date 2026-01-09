'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '../../types/product';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const API_URL = 'http://localhost:3000/products';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching:', error);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm('คุณต้องการลบสินค้านี้ใช่หรือไม่?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      } else {
        alert('ลบไม่สำเร็จ');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาด');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>รายการสินค้า</h1>
      <Link href="/product/create">
        <button style={{ marginBottom: '10px', padding: '10px 20px' }}>
          + เพิ่มสินค้าใหม่
        </button>
      </Link>
      <hr />
      <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>ชื่อสินค้า</th>
            <th>ราคา</th>
            <th>รายละเอียด</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.description}</td>
              <td>
                <Link href={`/product/${p.id}`}>แก้ไข</Link>
                {' | '}
                <button onClick={() => handleDelete(p.id)}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}