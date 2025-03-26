import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils";
import {
    CreateFulfillmentResult,
    FulfillmentOption,
} from "@medusajs/types";
import {
    CalculateShippingOptionPriceDTO,
    CalculatedShippingOptionPrice,
    Logger
} from "@medusajs/framework/types";
import { calculateShippingCost } from "./utils";
import OpenRouteServiceClient from "./services/open-route-service-client";
import { CartContext, InjectedDependencies, Options } from "./types";



class SpikarfxFulfillmentService extends AbstractFulfillmentProviderService {
    static identifier = "spikarfx-fulfillment";

    protected logger_: Logger;
    protected options_: Options;
    protected orsClient_: OpenRouteServiceClient

    // Optional: if you want to integrate external API later
    protected client: any;

    constructor({ logger }: InjectedDependencies, options: Options) {
        super()
        this.logger_ = logger
        this.options_ = options
        this.orsClient_ = new OpenRouteServiceClient(options.orsApiKey!)
    }

    /**
     * Return fulfillment methods supported by this provider.
     */
    async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
        return [
            {
                id: "dynamic-distance-shipping",
                name: "Dynamic Distance Delivery",
                data: {}, // Optional metadata
            },
        ];
    }

    /**
     * Validate any custom data used in fulfillment creation (currently unused)
     */
    async validateFulfillmentData(
        optionData: any,
        data: any,
        context: any
    ): Promise<Record<string, unknown>> {
        // You can add validation logic here later
        return data;
    }

    /**
   * Required by Medusa to validate if this provider supports shipping option
   */
    async canCalculate(
        data: any,
    ): Promise<boolean> {
        return true
    }

    /**
   * Dynamic calculate price
   */
    async calculatePrice(
        optionData: CalculateShippingOptionPriceDTO["optionData"],
        data: CalculateShippingOptionPriceDTO["data"],
        context: CalculateShippingOptionPriceDTO["context"] | CartContext
    ): Promise<CalculatedShippingOptionPrice> {
        this.logger_.info("📦 test data3" + context)
        console.log('📦 test data log3', context)

        const shippingAddress = context.shipping_address as any
        const items = context.items as any[]

        function formatAddress(address: Record<string, any>): string {
            return [
                // address.address_1,
                address.city,
                // address.postal_code,
                // address.country_code,
            ]
                .join(", ")
        }

        const addressStr = formatAddress(shippingAddress)
        console.log("📦 Full address to geocode:" + addressStr)

        const customerCoords = await this.orsClient_.geocode(addressStr)

        const warehouseAddress = context.from_location?.address?.city as string
        const warehouseCoords = await this.orsClient_.geocode(warehouseAddress)

        const distanceKm = await this.orsClient_.getDistanceInKm(warehouseCoords, customerCoords)
        const totalWeightKg = this.calculateTotalWeight(items)
        const cost = calculateShippingCost(distanceKm, totalWeightKg)

        return {
            calculated_amount: cost,
            is_calculated_price_tax_inclusive: true,
        }
    }

    /**
     * Main logic to calculate distance, weight, and shipping cost
     */
    async createFulfillment(
        data: any,
        items: any,
        order: any,
        fulfillment: any
    ): Promise<CreateFulfillmentResult> {
        const externalData = await this.client.create(
            fulfillment,
            items
        )

        return {
            data: {
                ...(fulfillment.data as object || {}),
                ...externalData
            },
            labels: []
        };
    }

    /**
     * Optional cancel logic (stub)
     */
    async cancelFulfillment(fulfillmentData: Record<string, unknown>) {
        return {
            status: "cancelled",
        };
    }

    /**
     * Calculate total weight (in kg) from line items
     */
    private calculateTotalWeight(items: any[]): number {
        return items.reduce((total, item) => {
            const weightGram = item.variant?.weight || 0;
            const quantity = item.quantity || 1;
            return total + (weightGram * quantity) / 1000; // g → kg
        }, 0);
    }
}

export default SpikarfxFulfillmentService;
