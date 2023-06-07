import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import _ from "lodash";
import { Car } from "../models/Car";
import { VictoryPie } from "victory-native";


interface Props {
  dataSet: Car[]
}

interface CarsByBrand {
  brand: string,
  amount: number,
}

const ComponentPieBrands = (props: Props) => {
  const [carsByBrands, setCarsByBrands] = useState([] as CarsByBrand[]);
  const [isLoading, setLoading] = useState(false);

  useEffect( () => {
    setLoading(true);
    setCarsByBrands([]);
    const cars: CarsByBrand[] = [];
    const groupedByBrand = _.groupBy(props.dataSet, 'brand')
    const restBrands: CarsByBrand = {
      brand: 'the rest',
      amount: 0
    }
    _.keys(groupedByBrand).forEach((brand) => {  // forEach > map cause we dont create new array (return)
      if (groupedByBrand[brand].length < 30) {  // dummy filter
        restBrands.amount += groupedByBrand[brand].length;
      } else {
        const amountByBrand: CarsByBrand = {
          brand: brand,
          amount: groupedByBrand[brand].length
        }
        cars.push(amountByBrand);
      }
    })
    cars.push(restBrands);
    setCarsByBrands(cars);
    setLoading(false);
    },[]
  );

  return (
    <View>
      {!isLoading ?
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <VictoryPie
            data={carsByBrands}
            x="brand"
            y="amount"
            labels={({ datum }) => `${datum.brand}: ${datum.amount}`}
            colorScale="qualitative"
            padding={120}
          />
        </View>
        :
        <View>
          <Text>Loading</Text>
        </View>
      }
    </View>
  )
}

export default ComponentPieBrands;
