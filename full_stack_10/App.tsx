import React, { useState } from "react";
import { Button, Image, Text, View } from "react-native";
import { VictoryBrushLine, VictoryChart, VictoryLegend, VictoryLine } from "victory-native";
import _ from "lodash";
import { readRemoteFile } from "react-native-csv";
import RNFS from "react-native-fs";
import { Car } from "./src/models/Car";
import ComponentPieBrands from "./src/components/ComponentPieBrands";
import ComponentPriceRange from "./src/components/ComponentPriceRange";
import ComponentMileage from "./src/components/ComponentMileage";
import { ActivityIndicator } from 'react-native';



const App = () => {

  const [dataSet, setDataSet] = useState([] as Car[]);
  const [showGraph, setShowGraph] = useState('' as string);
  const [isLoading, setLoading] = useState(false as boolean);


  const readCsvFile = async () => {
    setLoading(true);
    try {
      const csvData: any[] = await new Promise((resolve, reject) => {
        readRemoteFile('http://share.yellowrobot.xyz/quick/2020-4-22-C9EF4A79-EA4E-488D-9277-0B7B52B6C74E.csv', {
          download: true,
          complete: (results) => resolve(results.data),
          error: (error) => reject(error)
        });
      });

      let cars: Car[] = [];

      for (let i = 1; i < csvData.length - 1; i++) {
        const carEach = {
          id: parseInt(csvData[i][0]),
          price: parseInt(csvData[i][1]),
          brand: csvData[i][2],
          model: csvData[i][3],
          year: parseInt(csvData[i][4]),
          titleStatus: csvData[i][5],
          mileage: parseFloat(csvData[i][6]),
          color: csvData[i][7],
          vin: csvData[i][8],
          lot: parseInt(csvData[i][9]),
          state: csvData[i][10],
          country: csvData[i][11],
          condition: csvData[i][12]
        } as Car;

        cars.push(carEach);
      }
      setDataSet(cars);
      console.log('Data fetching completed successfully.');
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  const sortByBrands = async () => {
    await readCsvFile();
    setShowGraph('amountByBrands');
  }

  const sortByPrice = async () => {
    await setShowGraph('another');
    setShowGraph('amountByPrice');
  }

  const sortByMileage = async () => {
    await readCsvFile();
    setShowGraph('amountByMileage');
  }

  return (
    <View>
      <View>
        <Button
          title={'Brand Pie Diagram'}
          onPress={ () => {
            sortByBrands();
          }}
        />
        <Button
          title={'Price Range Bar Diagram'}
          onPress={ () => {
            sortByPrice();
          }}
        />
        <Button
          title={'Mileage Range Bar Diagram'}
          onPress={ () => {
            sortByMileage();
          }}
        />
      </View>
      {isLoading
        ?
        <View style={{marginTop: 150}}>
          <ActivityIndicator size={'large'} color={'blue'}/>
        </View>
        :
        <View>
          {showGraph === 'amountByBrands' && <ComponentPieBrands dataSet={dataSet}/>}
          {showGraph === 'amountByPrice' && <ComponentPriceRange dataSet={dataSet}/>}
          {showGraph === 'amountByMileage' && <ComponentMileage dataSet={dataSet}/>}
        </View>
      }
    </View>
  )
}

export default App;
