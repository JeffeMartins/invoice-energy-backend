import fs from 'node:fs/promises';
import {PDFParse} from 'pdf-parse';

export class Invoice {
  constructor(
    public numberClient: number,
    public referenceMonth: string,
    public electricalEnergyQuantity: number,
    public electricalEnergyValue: number,
    public energySCEEEWithoutICMSQuantity: number,
    public energySCEEEWithoutICMSValue: number,
    public compensatedEnergyGDQuantity: number,
    public compensatedEnergyGDValue: number,
    public contribMunicipalPublicLightValue: number,
    public urlAccount: string,
    public name: string,
    public address: string,
    public additionalAddress: string
  ) {}
}

export class PdfLibParser {
  async extractData(filePath: string, fileName: string): Promise<Invoice> {
    const dataBuffer = await fs.readFile(filePath);
    if(dataBuffer.subarray(0,5).toString() !== '%PDF-')throw new Error('Invalid PDF signature');
    const parser=new PDFParse({data:dataBuffer});
    let pdfText:string;
    try{pdfText=(await parser.getText()).text;}finally{await parser.destroy();}

    const numberClientMatch = pdfText.match(/NÃ‚Âº DO CLIENTE\s+NÃ‚Âº DA INSTALAÃƒâ€¡ÃƒÆ’O\s+(\d+)/);
    const numberClient = numberClientMatch ? parseInt(numberClientMatch[1]) : 0;

    const referenceMonthMatch = pdfText.match(/\b[A-Z]{3}\/\d{4}\b/);
    const referenceMonth = referenceMonthMatch ? referenceMonthMatch[0] : '';

    const electricalEnergyQuantityMatch = pdfText.match(/Energia ElÃƒÂ©tricakWh\s+(\d+)/);
    const electricalEnergyQuantity = electricalEnergyQuantityMatch ? parseInt(electricalEnergyQuantityMatch[1], 10) : 0;

    const electricalEnergyValueMatch = pdfText.match(/Energia ElÃƒÂ©tricakWh\s+\d+\s+[\d.,]+\s+([\d.,]+)/);
    const electricalEnergyValue = electricalEnergyValueMatch ? parseFloat(electricalEnergyValueMatch[1].replace(/\./g, '').replace(',', '.')) : 0;

    const compensatedEnergyGDQuantityMatch = pdfText.match(/Energia compensada GD IkWh\s+(\d+)/);
    const compensatedEnergyGDQuantity = compensatedEnergyGDQuantityMatch ? parseInt(compensatedEnergyGDQuantityMatch[1], 10) : 0;

    const compensatedEnergyGDValueMatch = pdfText.match(/Energia compensada GD IkWh\s+\d+\s+[\d.,]+\s+(-?[\d.,]+)/);
    const compensatedEnergyGDValue = compensatedEnergyGDValueMatch ? parseFloat(compensatedEnergyGDValueMatch[1].replace(/\./g, '').replace(',', '.')) : 0;

    const contribMunicipalPublicLightValueMatch = pdfText.match(/Contrib Ilum Publica Municipal\s+([\d.,]+)/);
    const contribMunicipalPublicLightValue = contribMunicipalPublicLightValueMatch ? parseFloat(contribMunicipalPublicLightValueMatch[1].replace(/\./g, '').replace(',', '.')) : 0;

    const energySCEEEWithoutICMSMatch = pdfText.match(/Energia SCEE s\/ ICMSkWh\s+(\d+)\s+[\d.,]+\s+([\d.,]+)/);
    const energySCEEEWithoutICMSQuantity = energySCEEEWithoutICMSMatch ? parseInt(energySCEEEWithoutICMSMatch[1]) : 0;
    const energySCEEEWithoutICMSValue = energySCEEEWithoutICMSMatch ? parseFloat(energySCEEEWithoutICMSMatch[2].replace(/\./g, '').replace(',', '.')) : 0;

    const addressMatch = pdfText.match(/(?:RUA|AVENIDA)\s+[A-Z\s\d,.]+/i);
    const address = addressMatch ? addressMatch[0].trim() : '';

    const additionalAddressMatch = pdfText.match(/(\d{5}-\d{3}\s+[A-Z\s,]+)/);
    const additionalAddress = additionalAddressMatch ? additionalAddressMatch[0].trim() : '';

    const nameMatch = pdfText.match(/([A-Z\s]+)\s+\d{8}/);
    const name = nameMatch ? nameMatch[1].trim() : '';

    const urlAccount = `${process.env.URL_BASE}/view-pdf/${fileName}`;

    return new Invoice(
      numberClient,
      referenceMonth,
      electricalEnergyQuantity,
      electricalEnergyValue,
      energySCEEEWithoutICMSQuantity,
      energySCEEEWithoutICMSValue,
      compensatedEnergyGDQuantity,
      compensatedEnergyGDValue,
      contribMunicipalPublicLightValue,
      urlAccount,
      name,
      address,
      additionalAddress
    );
  }
}
