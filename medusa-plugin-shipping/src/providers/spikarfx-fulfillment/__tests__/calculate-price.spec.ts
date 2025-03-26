import SpikarfxFulfillmentService from "../service"
import { CartContext } from "../types"
import OpenRouteServiceClient from "../services/open-route-service-client"
import { calculateShippingCost } from "../utils"

// ✅ Mock ORS client class
jest.mock("../services/open-route-service-client")

const MockedORS = OpenRouteServiceClient as jest.MockedClass<typeof OpenRouteServiceClient>

describe("💰 calculatePrice()", () => {
    let service: SpikarfxFulfillmentService

    beforeEach(() => {
        const mockLogger = {
            info: jest.fn(),
            error: jest.fn(),
        }

        const options = {
            orsApiKey: "fake-api-key"
        }

        // ✅ สร้าง service พร้อม mock client
        service = new SpikarfxFulfillmentService({ logger: mockLogger } as any, options)

        // ✅ mock geocode ให้คืนค่าพิกัดตามเมือง
        MockedORS.prototype.geocode.mockImplementation(async (addr: string) => {
            if (addr.includes("เชียงใหม่")) {
                return { lat: 18.7883, lng: 98.9853 }
            } else {
                return { lat: 13.7367, lng: 100.5231 } // กทม
            }
        })

        // ✅ mock ระยะทาง: 10 กม.
        MockedORS.prototype.getDistanceInKm.mockResolvedValue(10)
    })

    it("ควรคำนวณราคาค่าส่งได้ถูกต้อง", async () => {
        const context: CartContext = {
            id: "cart_test_01",
            items: [
                {
                    id: "item_01",
                    title: "L",
                    subtitle: "เสื้อยืด",
                    thumbnail: "",
                    quantity: 2,
                    variant_id: "var_01",
                    product_id: "prod_01",
                    product_title: "T-shirt",
                    product_description: "เสื้อผ้าใส่สบาย",
                    variant_sku: "SKU01",
                    variant_title: "L",
                    requires_shipping: true,
                    is_discountable: true,
                    is_tax_inclusive: false,
                    is_custom_price: false,
                    unit_price: 1500,
                    cart_id: "cart_test_01",
                    created_at: "",
                    updated_at: "",
                    variant: {
                        weight: 1000, // 1kg
                    },
                    product: {},
                },
            ],
            shipping_address: {
                id: "addr_01",
                customer_id: null,
                company: "",
                first_name: "John",
                last_name: "Doe",
                address_1: "126/10",
                address_2: "",
                city: "เมืองเชียงใหม่",
                province: "เชียงใหม่",
                postal_code: "50100",
                country_code: "th",
                phone: "1234567890",
                metadata: null,
                created_at: "",
                updated_at: "",
                deleted_at: null,
            },
            from_location: {
                id: "loc_01",
                name: "Bangkok Warehouse",
                address: {
                    id: "addr_warehouse",
                    customer_id: null,
                    company: "",
                    first_name: "",
                    last_name: "",
                    address_1: "123 ถนนพระราม 1",
                    address_2: "",
                    city: "กรุงเทพ",
                    province: "กรุงเทพ",
                    postal_code: "10330",
                    country_code: "th",
                    phone: "0123456789",
                    metadata: null,
                    created_at: "",
                    updated_at: "",
                    deleted_at: null,
                },
            },
        }

        const result = await service.calculatePrice({}, {}, context)

        // 🧮 น้ำหนักรวม = 2kg, ระยะทาง = 10 กม.
        const expected = calculateShippingCost(10, 2)

        expect(result).toHaveProperty("calculated_amount", expected)
        expect(result).toHaveProperty("is_calculated_price_tax_inclusive", true)
    })
})
