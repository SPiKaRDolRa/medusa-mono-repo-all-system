import {
    CalculateShippingOptionPriceDTO,
    CalculatedShippingOptionPrice,
    Logger
} from "@medusajs/framework/types";

export type InjectedDependencies = {
    logger: Logger;
};

export type Options = {
    orsApiKey?: string; // Reserved if you later host your own ORSM
};

export interface CartContext {
    id: string
    items: CartItem[]
    shipping_address: Address
    from_location: FromLocation
}

export interface CartItem {
    id: string
    title: string
    subtitle: string
    thumbnail: string
    quantity: number
    variant_id: string
    product_id: string
    product_title: string
    product_description: string
    variant_sku: string
    variant_title: string
    requires_shipping: boolean
    is_discountable: boolean
    is_tax_inclusive: boolean
    is_custom_price: boolean
    unit_price: number
    cart_id: string
    created_at: string
    updated_at: string
    variant?: any // สามารถขยายเพิ่มได้ทีหลัง
    product?: any // สามารถขยายเพิ่มได้ทีหลัง
}


export interface Address {
    id: string
    customer_id: string | null
    company: string
    first_name: string
    last_name: string
    address_1: string
    address_2: string
    city: string
    country_code: string
    province: string
    postal_code: string
    phone: string
    metadata: Record<string, any> | null
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface FromLocation {
    id: string
    name: string
    address: Address
}
