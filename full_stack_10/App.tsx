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
        const CSV_URL: string = 'http://share.yellowrobot.xyz/quick/2020-4-22-C9EF4A79-EA4E-488D-9277-0B7B52B6C74E.csv';
        readRemoteFile(CSV_URL, {
          download: true,
          complete: (results) => resolve(results.data),
          error: (error) => reject(error)
        });
      });

      let cars: Car[] = [];

      for (let i = 1; i < csvData.length - 1; i++) {
        const rowEach = csvData[i];
        const carEach = {
          id: parseInt(rowEach[0]),
          price: parseInt(rowEach[1]),
          brand: rowEach[2],
          model: rowEach[3],
          year: parseInt(rowEach[4]),
          titleStatus: rowEach[5],
          mileage: parseFloat(rowEach[6]),
          color: rowEach[7],
          vin: rowEach[8],
          lot: parseInt(rowEach[9]),
          state: rowEach[10],
          country: rowEach[11],
          condition: rowEach[12]
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
    if (!dataSet.length) {
      await readCsvFile();
    }
    setShowGraph('amountByBrands');
  }

  const sortByPrice = async () => {
    if (!dataSet.length) {
      await readCsvFile();
    }
    setShowGraph('amountByPrice');
  }

  const sortByMileage = async () => {
    if (!dataSet.length) {
      await readCsvFile();
    }
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
