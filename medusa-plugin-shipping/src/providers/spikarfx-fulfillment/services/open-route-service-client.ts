import axios from "axios"

export type Coordinates = {
    lat: number
    lng: number
}

export default class OpenRouteServiceClient {
    protected apiKey: string

    constructor(apiKey: string) {
        this.apiKey = apiKey
    }

    // 🧭 ฟังก์ชันหลัก: คำนวณราคาขนส่ง
    async calculateShippingCostFromCustomerLocation(
        warehouse: Coordinates,
        context: Record<string, any>,
        data: Record<string, any>,
        calculateShippingCost: (distance: number, weight: number) => number
    ): Promise<{
        distance_km: number
        weight_kg: number
        shipping_cost: number
    }> {
        // ✅ Step 1: หาพิกัดลูกค้า
        const customerCoords = await this.getCustomerCoordinates(context, data)

        // ✅ Step 2: หาน้ำหนักจาก items
        const items = context.items || []
        const weight = this.calculateTotalWeight(items)

        // ✅ Step 3: คำนวณระยะทาง
        const distance = await this.getDistanceInKm(warehouse, customerCoords)

        // ✅ Step 4: คิดราคา
        const shipping_cost = calculateShippingCost(distance, weight)

        return {
            distance_km: distance,
            weight_kg: weight,
            shipping_cost,
        }
    }

    // ✅ ฝั่ง client ส่ง lat/lng มา? ใช้เลย
    async getCustomerCoordinates(
        context: Record<string, any>,
        data: Record<string, any>
    ): Promise<Coordinates> {
        if (data?.lat && data?.lng) {
            return {
                lat: parseFloat(data.lat),
                lng: parseFloat(data.lng),
            }
        }

        const addr = context?.shipping_address
        const addressStr = [addr?.address_1, addr?.city, addr?.postal_code, addr?.country_code]
            .filter(Boolean)
            .join(", ")

        if (!addressStr) throw new Error("❌ No address provided for geocoding")

        return await this.geocode(addressStr)
    }

    // 🌍 ใช้ geocode หา lat/lng จาก string
    async geocode(address: string): Promise<Coordinates> {

        const res = await axios.get('https://api.openrouteservice.org/geocode/search', {
            params: {
                api_key: this.apiKey,
                text: address,
                size: 1
            }
        })

        console.log('res', res.data)
        const coords = res.data.features?.[0]?.geometry?.coordinates
        if (!coords) throw new Error("❌ Geocoding failed: No coordinates returned")

        return {
            lng: coords[0],
            lat: coords[1],
        }
    }

    // 🚗 ยิง directions API เพื่อคำนวณระยะทาง
    async getDistanceInKm(from: Coordinates, to: Coordinates): Promise<number> {
        const res = await axios.post(
            "https://api.openrouteservice.org/v2/directions/driving-car",
            {
                coordinates: [
                    [from.lng, from.lat],
                    [to.lng, to.lat],
                ],
            },
            {
                headers: {
                    Authorization: this.apiKey,
                    "Content-Type": "application/json",
                },
            }
        )

        const meters = res.data?.routes?.[0]?.summary?.distance
        if (!meters) throw new Error("❌ No route found")

        return meters / 1000
    }

    // ⚖️ คำนวณน้ำหนักรวม
    private calculateTotalWeight(items: any[]): number {
        return items.reduce((total, item) => {
            const weight = item.variant?.weight || 0 // gram
            const qty = item.quantity || 1
            return total + (weight * qty) / 1000 // convert to kg
        }, 0)
    }
}
