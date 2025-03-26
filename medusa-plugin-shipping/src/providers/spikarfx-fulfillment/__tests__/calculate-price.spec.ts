// import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
// import { model } from "@medusajs/utils"
// import SpikarfxFulfillmentService from "../service"
// import {
//     CalculateShippingOptionPriceDTO,
// } from "@medusajs/framework/types";

// const DummyModel = model.define("dummy_model", {
//     id: model.id().primaryKey(),
// })

// moduleIntegrationTestRunner<SpikarfxFulfillmentService>({
//     moduleName: 'spikarfx-fulfillment',
//     moduleModels: [DummyModel],
//     resolve: "./src/modules/spikarfx-fulfillment",
//     testSuite: ({ service }) => {
//         describe("💰 calculatePrice() standalone test", () => {
//             it("should return dynamic price correctly", async () => {
//                 const context: CalculateShippingOptionPriceDTO["context"] = {
//                     items: [
//                         {
//                             variant: { weight: 1000 }, // 1kg
//                             quantity: 2,
//                         },
//                     ],
//                     shipping_address: {
//                         metadata: {
//                             lat: 13.7563, // Bangkok
//                             lng: 100.5018,
//                         },
//                     },
//                 }

//                 const result = await service.calculatePrice({}, {}, context)

//                 console.log("💥 Result from calculatePrice():", result)

//                 expect(result).toHaveProperty("calculated_amount")
//                 expect(typeof result.calculated_amount).toBe("number")
//                 expect(result.calculated_amount).toBeGreaterThan(0)
//             })
//         })
//     },
// })
