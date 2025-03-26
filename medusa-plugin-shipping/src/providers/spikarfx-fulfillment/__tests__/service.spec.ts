// import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
// import { model } from "@medusajs/utils"
// import SpikarfxFulfillmentService from "../service"

// const DummyModel = model.define("dummy_model", {
//     id: model.id().primaryKey(),
// })

// moduleIntegrationTestRunner<SpikarfxFulfillmentService>({
//     moduleName: 'spikarfx-fulfillment',
//     moduleModels: [DummyModel],
//     resolve: "./src/modules/spikarfx-fulfillment", // path ไปยัง index.ts
//     testSuite: ({ service }) => {
//         console.log('this container service', service)

//         describe("SpikarfxFulfillmentService", () => {
//             it("returns fulfillment options", async () => {
//                 const result = await service.getFulfillmentOptions()

//                 console.log('Fulfillment Options has:', result)

//                 expect(result).toEqual([
//                     {
//                         id: "custom-option",
//                         name: "Custom Delivery",
//                         data: {},
//                     },
//                 ])
//             })

//             it("calculates shipping cost", async () => {
//                 const mockItems = [
//                     { variant: { weight: 1000 }, quantity: 2 } // 2kg
//                 ]

//                 const mockOrder = {
//                     shipping_address: {
//                         metadata: { lat: 13.7563, lng: 100.5018 }
//                     }
//                 }

//                 const result = await service.createFulfillment({}, mockItems, mockOrder as any, {})

//                 expect(result.data).toHaveProperty("distance_km")
//                 expect(result.data).toHaveProperty("weight_kg")
//                 expect(result.data).toHaveProperty("shipping_cost")
//                 expect(result.data.weight_kg).toBe(2)
//                 expect(result.data.shipping_cost).toBeGreaterThan(0)
//             })
//         })
//     },
// })
