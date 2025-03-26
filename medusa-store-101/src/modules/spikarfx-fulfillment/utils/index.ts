export function calculateShippingCost(distanceKm: number, weightKg: number): number {
    let basePrice: number;
    let pricePerKm: number;

    if (weightKg <= 2) {
        basePrice = 50;
        pricePerKm = 10;
    } else {
        basePrice = 55;
        pricePerKm = 15;
    }

    return basePrice + pricePerKm * distanceKm;
}
