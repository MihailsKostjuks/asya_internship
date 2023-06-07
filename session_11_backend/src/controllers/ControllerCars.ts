import { Body, Controller, Post, Get, Route, FormField, Query, UploadedFile } from "tsoa";
import { ResponseSendAttachment } from "../models/messages/ResponseSendAttachment";
import { RequestSendAttachment } from "../models/messages/RequestSendAttachment";
import * as fs from 'fs';
import {RequestCar} from "../models/db/RequestCar";
import PDFDocument from 'pdfkit';

@Route("cars")
export class ControllerCars {
    @Post("submit")
    public async Upload(
        @Body() request,
    ): Promise<void> {
        try {
            const request_json = JSON.stringify(request);
            const filePath = './public/carsHistory/carHistory1.ldjson';  // ? many jsons in one json-file
            fs.appendFileSync(filePath, request_json + '\n', 'utf8');
            console.log('Data has been appended to the file successfully.');
        } catch (e) {
            console.error(e);
        }
    }

    @Get("generatepdf")
    public async GeneratePDF(): Promise<void> {
        try {
            const ldjsonFilePath = './public/carsHistory/carHistory1.ldjson';
            const pdfFilePath = './public/pdfs/carHistory1.pdf';
            const ldjsonData = fs.readFileSync(ldjsonFilePath, 'utf8');

            const lines = ldjsonData.split('\n');

            const pdfDoc = new PDFDocument();
            pdfDoc.pipe(fs.createWriteStream(pdfFilePath));

            for (let line of lines) {
                if (line.trim() === '') {
                    continue;
                }
                const jsonObject: RequestCar = JSON.parse(line);

                pdfDoc.text(`Name: ${jsonObject.brand}`);
                pdfDoc.text(`Year: ${jsonObject.year}`);
                pdfDoc.text(`Price: ${jsonObject.price}`);
                pdfDoc.text(`Description: ${jsonObject.description}`);
                pdfDoc.text(`Created: ${jsonObject.date}`);
                pdfDoc.moveDown();
            }

            pdfDoc.end();
            console.log('PDF created successfully.');

        } catch (e) {
            console.error(e);
        }
    }

    @Get("exportpdf")
    public async ExportPDF(): Promise<string> {
        try {
            const pdfFilePath = './public/pdfs/carHistory1.pdf';
            const fileData = fs.readFileSync(pdfFilePath);
            const base64String = Buffer.from(fileData).toString('base64');
            // console.log(base64String);
            return base64String;
        } catch (e) {
            console.error(e);
        }
    }
}

