import { Body, Controller, Post, Get, Route, FormField, Query, UploadedFile } from "tsoa";
import { ResponseSendAttachment } from "../models/messages/ResponseSendAttachment";
import { RequestSendAttachment } from "../models/messages/RequestSendAttachment";
import * as fs from 'fs';

@Route("attachments")
export class ControllerAttachments {
	@Post("upload")
	public async Upload(
		@FormField() request_json: string,
		@UploadedFile() attachment_file,
	): Promise<ResponseSendAttachment> {
		console.log('gone')
		let request = JSON.parse(request_json) as RequestSendAttachment;

		console.log(request);
		console.log(attachment_file);

		let is_success = false;
		const file_name_on_server = `./public/attachments/${attachment_file.originalname}`;
		if (!fs.existsSync(file_name_on_server)) {
			fs.writeFileSync(file_name_on_server, attachment_file.buffer);
			is_success = true
		}

		let response = {
			is_success: is_success,
		} as ResponseSendAttachment;
		return response;
	}
}

