import { Body, Post, Route } from "tsoa";
import { ResponseSendCarsForm } from "../models/messages/ResponseSendCarsForm";
import * as fs from 'fs';
import {RequestCar} from "../models/db/RequestCar";
import PDFDocument from 'pdfkit';
import {RequestExportPDF} from "../models/messages/RequestExportPDF";
import {ResponseExportPDF} from "../models/messages/ResponseExportPDF";

@Route("cars")
export class ControllerCars {
    @Post("submit")
    public async Upload(
        @Body() request: RequestCar,
    ): Promise<void> {
        try {
            console.log(request);
            const filePath = './public/carsHistory/' + request.session_token + '.ldjson';  // ? many jsons in one json-file
            fs.appendFileSync(filePath, JSON.stringify(request) + '\n', 'utf8');
            console.log('Data has been appended to the file successfully.');
        } catch (e) {
            console.error(e);
        }
    }

    @Post("exportpdf")
    public async ExportPDF(
        @Body() request: RequestExportPDF
    ): Promise<ResponseExportPDF> {
        let response: ResponseExportPDF = {
            base64String: '',
            is_success: false
        }
        try {
            const ldjsonFilePath = './public/carsHistory/' + request.session_token + '.ldjson';
            const pdfFilePath = './public/pdfs/' + request.session_token + '.pdf';
            const ldjsonData = fs.readFileSync(ldjsonFilePath, 'utf8');

            const lines = ldjsonData.split('\n');
            const pdfDoc = new PDFDocument();
            let writeStream = fs.createWriteStream(pdfFilePath);
            pdfDoc.pipe(writeStream);

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

            writeStream.on('finish', () => {
                const fileData = fs.readFileSync(pdfFilePath);
                const base64String = Buffer.from(fileData).toString('base64');
                response = {
                    base64String: base64String,
                    is_success: true
                }
                console.log(response);
                // return JSON.stringify(response);
                return response;
            })
        } catch (e) {
            console.error(e);
            return response;
        }
    }
}

