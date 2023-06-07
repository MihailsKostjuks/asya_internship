
import React, { useEffect, useState } from "react";
import {
	Button, PermissionsAndroid,
	TextInput,
	View,
} from "react-native";
import axios, { all } from "axios";
import ComponentPicker from "./src/components/ComponentPicker";
import { PickerItemData } from "./src/models/PickerItemData";
import { CarData } from "./src/models/CarData";
import { RequestCar } from "../session_11_backend/src/models/db/RequestCar"
import RNFetchBlob from "rn-fetch-blob";
import { Buffer } from "buffer";


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
	const [pdfData, setPdfData] = useState('');

	const [carData, setCarData] = useState({
		brand: '',
		year: '',
		price: '',
		description: ''
	} as CarData);

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

	useEffect(() => {
		const allowPermission = async () => {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
					title: 'Storage Permission',
					message: 'App needs access to your storage to save files.',
					buttonNeutral: 'Ask Me Later',
					buttonNegative: 'Cancel',
					buttonPositive: 'OK',
				}
			);
			console.log(granted);  // LOG: never_ask_again
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				console.log('allowed');
			}
		};
		allowPermission();
	}, []);

	const onSubmit = async () => {
		if (!carData.year || !carData.price || !carData.brand) {
			console.warn('please enter all the required fields');
		} else {
			try {
				const request: RequestCar = {
					...carData,
					date: new Date()
				}
				const request_json = JSON.stringify(request);
				// const formData = new FormData();
				// formData.append("request_json", JSON.stringify(request));

				console.log(request_json);

				let response = await axios.post(
					'http://10.0.2.2:8000/cars/submit',
					request_json,
					{
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				console.log(response);
			} catch (e) {
				console.error(e);
			}
		}
	};

	const onGenerate = async () => {
		try {
			let response = await axios.get(
				'http://10.0.2.2:8000/cars/exportpdf',
			)
			console.log(response);
		} catch (e) {
			console.error(e);
		}
	}

	const onExportPDF = async () => {
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
			console.log(granted);  // LOG: never_ask_again
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				let response = await axios.get(
					'http://10.0.2.2:8000/cars/exportpdf', {
						responseType: 'arraybuffer',
					},
				)
				const base64String = Buffer.from(response.data, 'binary').toString('base64');
				setPdfData(base64String);
				const byteArray = Buffer.from(base64String, 'base64');
				const filePath = `${RNFetchBlob.fs.dirs.DocumentDir}/carHistory1.pdf`;
				console.log(filePath);
				await RNFetchBlob.fs.writeFile(filePath, byteArray.toString(), 'base64');
				await RNFetchBlob.android.actionViewIntent(filePath, 'application/pdf');
				console.log('success'); // not reachable
			}
			else {
				console.log('no permission');  // this log
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
				<Button title="Generate PDF" onPress={onGenerate} />
				<Button title="Export PDF" onPress={onExportPDF} />
			</View>
		</View>
	);
};

export default App;

