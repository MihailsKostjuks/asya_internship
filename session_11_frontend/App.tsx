
import React, { useEffect, useState } from "react";
import {
	Button, PermissionsAndroid,
	TextInput,
	View,
} from "react-native";
import axios, { all } from "axios";
import 'react-native-get-random-values';
import ComponentPicker from "./src/components/ComponentPicker";
import { PickerItemData } from "./src/models/PickerItemData";
import { CarData } from "./src/models/CarData";
import { RequestCar } from "../session_11_backend/src/models/db/RequestCar"
import { RequestExportPDF } from "../session_11_backend/src/models/messages/RequestExportPDF"
import { ResponseExportPDF } from "../session_11_backend/src/models/messages/ResponseExportPDF"
import RNFetchBlob from "rn-fetch-blob";
import { v4 as uuidv4 } from 'uuid';
import { Buffer } from "buffer";
import { RequestPermissionWrite } from "./src/models/RequestPermissionWrite";

const DOMAIN: string = 'http://10.0.2.2:8000';
const carBrands: PickerItemData[] = [
	{
		label: 'Audi',
		value: 'audi'
	},
	{
		label: 'BMW',
		value: 'bmw'
	},
	{
		label: 'Nissan',
		value: 'nissan'
	},
	{
		label: 'Toyota',
		value: 'toyota'
	},
]

const carYears: PickerItemData[] = [
	{
		label: '2020',
		value: '2020'
	},
	{
		label: '2021',
		value: '2021'
	},
	{
		label: '2022',
		value: '2022'
	},
	{
		label: '2023',
		value: '2023'
	},
]


const App = () => {
	const [carData, setCarData] = useState({
		brand: '',
		year: '',
		price: '',
		description: ''
	} as CarData);

	const [sessionToken, setSessionToken] = useState('');

	useEffect(() => {
		const authorization  = () => {
			try {
				setSessionToken(uuidv4());
			} catch (e) {
				console.error(e);
			}
		};
		authorization();
	}, []);

	const onPriceChange = (price) => {
		setCarData({
			...carData,
			price: price
		});
	};

	const onDescriptionChange = (description) => {
		setCarData({
			...carData,
			description: description
		});
	};

	const onUpdateBrand = (brand) => {
		setCarData({
			...carData,
			brand: brand
		});
	}

	const onUpdateYear = (year) => {
		setCarData({
			...carData,
			year: year
		});
	}

	const requestPermission = async () : Promise<RequestPermissionWrite> => {
		const response: RequestPermissionWrite = {
			is_permitted: false
		}
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
					title: 'Storage Permission',
					message: 'App needs access to your storage to save files.',
					buttonNeutral: 'Ask Me Later',
					buttonNegative: 'Cancel',
					buttonPositive: 'OK',
				}
			);
			console.log(granted); // never_ask_again (already set?)
			console.log(PermissionsAndroid.RESULTS.GRANTED);  // granted (probably because I set it manually in Manifest)?
			response.is_permitted = granted === PermissionsAndroid.RESULTS.GRANTED;

		} catch (e) {
			console.error(e);
		}
		return response;  // return true/false
	}

	const onSubmit = async () => {
		if (!carData.year || !carData.price || !carData.brand) {
			console.warn('please enter all the required fields');
		} else {
			try {
				const request: RequestCar = {
					...carData,
					date: new Date(),
					session_token: sessionToken
				}
				const request_json = JSON.stringify(request);

				let response = await axios.post(
					DOMAIN + '/cars/submit',
					request_json,
					{
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
			} catch (e) {
				console.error(e);
			}
		}
	};

	const onExportPDF = async () => {
		try {
			const response: RequestPermissionWrite = await requestPermission();
			console.log(response);
			// if (response.is_permitted) {
			if (true) {
				let request: RequestExportPDF = {
					session_token: sessionToken,
				};
				let request_json = JSON.stringify(request);
				let response = await axios.post(
					DOMAIN + '/cars/exportpdf',
					request_json,{
						headers: {
							'Content-Type': 'application/json',
						},
						// responseType: "json" also not helping
					},
				)
				let data: ResponseExportPDF = response.data;
				console.log(response)
				console.log(data)  // data is sent in  backend but not retrieved in frontend, why?
				console.log(data.is_success);
				// LOG  {"config": {"adapter": ["xhr", "http"], "data": "{\"session_token\":\"7bb44eee-fb4b-4947-a4b8-691cb1cb69f7\"}", "env": {"Blob": [Function Blob], "FormData": [Function FormData]}, "headers": [Object], "maxBodyLength": -1, "maxContentLength": -1, "method": "post", "timeout": 0, "transformRequest": [[Function transformRequest]], "transformResponse": [[Function transformResponse]], "transitional": {"clarifyTimeoutError": false, "forcedJSONParsing": true, "silentJSONParsing": true}, "url": "http://10.0.2.2:8000/cars/exportpdf", "validateStatus": [Function validateStatus], "xsrfCookieName": "XSRF-TOKEN", "xsrfHeaderName": "X-XSRF-TOKEN"}, "data": "", "headers": {"connection": "keep-alive", "date": "Wed, 14 Jun 2023 11:09:27 GMT", "keep-alive": "timeout=5", "x-powered-by": "Express"}, "request": {"DONE": 4, "HEADERS_RECEIVED": 2, "LOADING": 3, "OPENED": 1, "UNSENT": 0, "_aborted": false, "_cachedResponse": undefined, "_hasError": false, "_headers": {"accept": "application/json, text/plain, */*", "content-type": "application/json"}, "_incrementalEvents": false, "_lowerCaseResponseHeaders": {"connection": "keep-alive", "date": "Wed, 14 Jun 2023 11:09:27 GMT", "keep-alive": "timeout=5", "x-powered-by": "Express"}, "_method": "POST", "_perfKey": "network_XMLHttpRequest_http://10.0.2.2:8000/cars/exportpdf", "_performanceLogger": {"_closed": false, "_extras": [Object], "_pointExtras": [Object], "_points": [Object], "_timespans": [Object]}, "_requestId": null, "_response": "", "_responseType": "", "_sent": true, "_subscriptions": [], "_timedOut": false, "_trackingName": "unknown", "_url": "http://10.0.2.2:8000/cars/exportpdf", "readyState": 4, "responseHeaders": {"Connection": "keep-alive", "Date": "Wed, 14 Jun 2023 11:09:27 GMT", "Keep-Alive": "timeout=5", "X-Powered-By": "Express"}, "responseURL": "http://10.0.2.2:8000/cars/exportpdf", "status": 204, "timeout": 0, "upload": {}, "withCredentials": true}, "status": 204, "statusText": undefined}
				// LOG
				// LOG  undefined
				if (response.data) {
					const base64String = Buffer.from(response.base64String, 'binary').toString('base64');
					const byteArray = Buffer.from(base64String, 'base64');
					const filePath = `${RNFetchBlob.fs.dirs.DocumentDir}/carHistory1.pdf`;
					await RNFetchBlob.fs.writeFile(filePath, byteArray.toString(), 'base64');
					await RNFetchBlob.android.actionViewIntent(filePath, 'application/pdf');
					console.log()
				} else {
					console.log('request failed')
				}
			}
			else {
				console.log('Permission denied');
			}
		} catch (e) {
			console.error(e);
		}
	}

	return (
		<View style={{ flex: 1 , justifyContent:'space-between'}}>
			<View>
				<TextInput
					placeholder={'Enter the price'}
					style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
					onChangeText={(price) => onPriceChange(price)}
					value={carData.price}
				/>
				<TextInput
					placeholder={'Enter the description (optional)'}
					style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
					onChangeText={(description) => onDescriptionChange(description)}
					value={carData.description}
				/>
				<View style={{flexDirection: 'row'}}>
					<ComponentPicker data={carBrands} label={'Select brand'} onChoose={onUpdateBrand}/>
					<ComponentPicker data={carYears} label={'Select year'} onChoose={onUpdateYear}/>
				</View>
			</View>
			<View>
				<Button title="Submit" onPress={onSubmit} />
				<Button title="Export PDF" onPress={onExportPDF} />
			</View>
		</View>
	);
};

export default App;

