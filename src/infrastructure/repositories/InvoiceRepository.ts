import prisma from '../database';
import { IInvoice } from '../../@types';

export interface Invoice {
    numberClient: number | bigint;
    name: string;
    address: string;
    additionalAddress?: string;
    referenceMonth: string;
    electricalEnergyQuantity: number;
    electricalEnergyValue: number;
    energySCEEEWithoutICMSQuantity: number;
    energySCEEEWithoutICMSValue: number;
    compensatedEnergyGDQuantity: number;
    compensatedEnergyGDValue: number;
    contribMunicipalPublicLightValue: number;
    urlAccount: string;
}




export class PrismaInvoiceRepository {
    async save(invoice: Invoice): Promise<void> {
        try {
            await prisma.client.upsert({
                where: { numberClient: Number(invoice.numberClient) },
                update: {},
                create: {
                    numberClient: Number(invoice.numberClient),
                    name: invoice.name,
                    address: invoice.address,
                    additionalAddress: invoice.additionalAddress,
                },
            });

            await prisma.accountData.create({
                data: {
                    numberClient: Number(invoice.numberClient),
                    referenceMonth: invoice.referenceMonth.toString(),
                    electricalEnergyQuantity: invoice.electricalEnergyQuantity,
                    electricalEnergyValue: invoice.electricalEnergyValue,
                    energySCEEEWithoutICMSQuantity:
                        invoice.energySCEEEWithoutICMSQuantity,
                    energySCEEEWithoutICMSValue: invoice.energySCEEEWithoutICMSValue,
                    compensatedEnergyGDQuantity: invoice.compensatedEnergyGDQuantity,
                    compensatedEnergyGDValue: invoice.compensatedEnergyGDValue,
                    contribMunicipalPublicLightValue:
                        invoice.contribMunicipalPublicLightValue,
                    urlAccount: invoice.urlAccount,
                },
            });


        } catch (error) {
            console.error('Error saving invoice data:', error);
            throw error;
        }
    }

    async findAllInvoices(): Promise<IInvoice[]> {
        try {
            const data = await prisma.accountData.findMany({
                distinct: ['numberClient', 'referenceMonth'],
                include: {
                    client: true,
                },
            });

            return data;
        } catch (error) {
            console.error('Error in findAllInvoices:', error);
            throw error;
        }
    }

    async findAllNClient(): Promise<{ numberClient: bigint }[]> {
        try {
            const data = await prisma.accountData.findMany({
                select: {
                    numberClient: true,
                },
                distinct: ['numberClient'],
            });

            return data;
        } catch (error) {
            console.error('Error in findAllNClient:', error);
            throw error;
        }
    }

}
