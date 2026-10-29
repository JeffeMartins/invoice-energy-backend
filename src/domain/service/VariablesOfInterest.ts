import { IInvoice } from "../../@types";

interface IVariables {
    numberClient: string | number | bigint;
    totalValueWithoutGD: number;
    electricalEnergyConsumption: number;
    compensatedEnergy: number;
    economyDG: number;
    referenceMonth: string;
}

export class VariablesOfInterestService {
    constructor(private invoices: IInvoice[]) {}

    async variablesOfInterestFactory(): Promise<IVariables[]> {
        return this.invoices.map((invoice: IInvoice) => {
            const {
                electricalEnergyValue,
                energySCEEEWithoutICMSValue,
                electricalEnergyQuantity,
                energySCEEEWithoutICMSQuantity,
                contribMunicipalPublicLightValue,
                compensatedEnergyGDQuantity,
                compensatedEnergyGDValue,
                numberClient,
                referenceMonth
            } = invoice;

            const totalValueWithoutGD = this.roundToTwoDecimals(
                this.calculateTotalValueWithoutGD(
                    electricalEnergyValue,
                    energySCEEEWithoutICMSValue,
                    contribMunicipalPublicLightValue
                )
            );

            const electricalEnergyConsumption = this.roundToTwoDecimals(
                this.calculateElectricalEnergyConsumption(
                    electricalEnergyQuantity,
                    energySCEEEWithoutICMSQuantity
                )
            );

            return {
                numberClient,
                referenceMonth,
                electricalEnergyConsumption,
                compensatedEnergy: this.roundToTwoDecimals(compensatedEnergyGDQuantity),
                totalValueWithoutGD,
                economyDG: this.roundToTwoDecimals(compensatedEnergyGDValue)
            };
        });
    }

    private calculateTotalValueWithoutGD(
        electricalEnergyValue: number,
        energySCEEEWithoutICMSValue: number,
        contribMunicipalPublicLightValue: number
    ): number {
        return electricalEnergyValue + energySCEEEWithoutICMSValue + contribMunicipalPublicLightValue;
    }

    private calculateElectricalEnergyConsumption(
        electricalEnergyValue: number,
        energySCEEEWithoutICMSValue: number
    ): number {
        return electricalEnergyValue + energySCEEEWithoutICMSValue;
    }

    private roundToTwoDecimals(value: number): number {
        return parseFloat(value.toFixed(2));
    }
}
