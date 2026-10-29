import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import {uploadDirectory,safePdfName} from '../../../infrastructure/config/uploads';
import { GetInvoices } from '../../../application/useCase/GetInvoices';
import { ExtractPdfData } from '../../../application/useCase/ExtractPdfData';
import { VariablesOfInterest } from '../../../application/useCase/VariablesOfInterest';


const getInvoices = new GetInvoices();
const pdfLibParser = new ExtractPdfData();
const variablesOfInterest = new VariablesOfInterest();

export class InvoiceController {
    async uploadInvoice(req: Request, res: Response): Promise<void> {
        try {
            const filePath = req.file?.path;
            const fileName = req.file?.filename;

            if (!filePath || !fileName) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            await pdfLibParser.execute(filePath, fileName);

            res.status(200).json({ message: 'Invoice uploaded and processed successfully' });
        } catch (error) {
            console.error('Error processing invoice:', error);
            res.status(500).json({ message: 'Error processing invoice' });
        }
    }
    async getAllInvoices(_: Request, res: Response): Promise<void> {
        try {
            const invoices = await getInvoices.findAll();

            const bigIntReplacer = (_key: any, value: any) =>
                typeof value === 'bigint' ? value.toString() : value;

            res.status(200).json(JSON.parse(JSON.stringify(invoices, bigIntReplacer)));
        } catch (error) {
            console.error('Error fetching invoices:', error);
            res.status(500).json({ message: 'Error fetching invoices' });
        }
    }

    viewPdf(req: Request, res: Response): void {
        const filename = req.params.filename;
        if(!safePdfName(filename)){res.status(400).json({message:'Invalid filename'});return;}
        const filepath = path.join(uploadDirectory, filename);

        if (fs.existsSync(filepath)) {
            res.setHeader('Content-Type', 'application/pdf');
            res.sendFile(filepath);
        } else {
            res.status(404).json({ message: 'File not found' });
        }
    }

    async getVariablesOfInterest(req: Request, res: Response): Promise<void> {
        const data = await getInvoices.findAll();

        const bigIntReplacer = (_key: any, value: any) =>
            typeof value === 'bigint' ? value.toString() : value;

        const invoices = JSON.parse(JSON.stringify(data, bigIntReplacer))

        const response = await variablesOfInterest.execute(invoices);

        res.status(200).json(response);
    }


    async getAllNumberClient(_: Request, res: Response): Promise<void> {
        try {

            const invoices = await getInvoices.findAllNumberClient();

            res.status(200).json(invoices);

        } catch (error) {
            res.status(500).json({ message: 'Could not retrieve client numbers' });
        }
    }
}
