export function calculateShippingCost(distanceKm: number, weightKg: number): number {
    const basePrice = weightKg <= 2 ? 50 : 55
    const perKm = weightKg <= 2 ? 10 : 15
    return basePrice + (distanceKm * perKm)
}
