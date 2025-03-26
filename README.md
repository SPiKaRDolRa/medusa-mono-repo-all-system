# 📦 Medusa Plugin - SpikarFX Fulfillment (Dynamic Distance Shipping)

> Plugin สำหรับ Medusa.js v2.6.1+ ที่รองรับการคำนวณค่าขนส่งแบบ Dynamic ตามระยะทาง + น้ำหนัก
> เหมาะสำหรับระบบขนส่งภายในประเทศหรือใช้ OpenRouteService API

---

## ✨ คุณสมบัติ

- ✅ สร้าง Fulfillment Provider แบบ custom (`spikarfx-fulfillment`)
- ✅ คำนวณราคาขนส่งแบบไดนามิก: ระยะทาง (km) + น้ำหนักสินค้า (kg)
- ✅ ยิง API ภายนอกผ่าน ORS (OpenRouteService)
- ✅ มี route API: `/shipping/distance` สำหรับใช้ดึงค่าขนส่ง
- ✅ พร้อม Unit Test

---

## การตั้งค่า env
```sh
ORS_API_KEY=your_openrouteservice_api_key
```

---

## ⚙️ การทำงานของ Fulfillment Provider
🔁 ขั้นตอน
Frontend เลือก shipping method: "dynamic-distance-shipping"

ส่ง lat และ lng ไปใน data ของ shipping method

Backend (plugin) ใช้ข้อมูล:

หากมี lat/lng → ใช้เลย

ถ้าไม่มี → geocode ที่อยู่ลูกค้า + โกดัง

คำนวณระยะทาง (km) ด้วย ORS

คิดน้ำหนักรวมจาก variant.weight

ใช้สูตรคำนวณ:
```
- 0–2 kg → base 50 + 10 บาท/กม.
- มากกว่า 2 kg → base 55 + 15 บาท/กม.
```

---

## 📁 โครงสร้างโปรเจกต์
```bash
medusa-plugin-shipping/
├── src/
│   └── providers/
│       └── spikarfx-fulfillment/
│           │├── __tests__/calculate-price.spec.ts
│           │└── __tests__/service.spec.ts
│           ├── services/open-route-service-client.ts
│           ├── utils/index.ts      # Shipping cost calculator
│           ├── types/index.ts      # Custom CartContext
│           ├── service.ts          # Fulfillment Logic
│           └── index.ts            # export plugin
```
---

## 🧪 Unit Test
ทดสอบฟังก์ชัน calculatePrice() และ calculateShippingCost(...)
test file:
```
src/providers/spikarfx-fulfillment/__tests__/calculate-price.spec.ts
src/providers/spikarfx-fulfillment/__tests__/service.spec.ts
```

---

Powered by. SPiKaR (Lab)