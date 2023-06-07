import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import _ from "lodash";
import { Car } from "../models/Car";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryHistogram, VictoryPie } from "victory-native";
import { CarsByPriceRange } from "../models/CarsByPriceRange";


interface Props {
  dataSet: Car[]
}


const ComponentPriceRange = (props: Props) => {
  const [carsByPriceRange, setCarsByPriceRange] = useState([] as CarsByPriceRange[])
  const [isLoading, setLoading] = useState(false);

  useEffect( () => {
    setLoading(true);
    const data = props.dataSet;
    const priceGroups: CarsByPriceRange[] = [];
    const minPrice = Math.min(...data.map((car) => car.price));
    const maxPrice = Math.max(...data.map((car) => car.price));
    const priceStep = maxPrice / 10;
    for (let i = 0; i < 10; i++) {
      const priceGroup: CarsByPriceRange = {
        lowerRange: priceStep * i,
        upperRange: priceStep * (i + 1),
        amount: 0,
      }
      priceGroups.push(priceGroup);
    }
    for (let i = 0; i < data.length; i++) {
      const car = data[i];
      for (let j = 0; j < priceGroups.length; j++) {
        const priceGroup = priceGroups[j];
        if (car.price >= priceGroup.lowerRange && car.price <= priceGroup.upperRange) {
          priceGroup.amount++;
          break; // I used forEach but for loop allows break so its better in this case
        }
      }
    }
    setCarsByPriceRange(priceGroups);
    setLoading(false);
    },[]
  );
  const tickValues = carsByPriceRange.map((group) => group.upperRange);

  return (
    <View>
      {!isLoading ?
        <View>
          <VictoryChart>
            <VictoryBar
              data={carsByPriceRange}
              x="upperRange"
              y="amount"
              labels={({ datum }) => `${datum.amount}`}
            />
            <VictoryAxis
              tickValues={tickValues}
              style={{ tickLabels: {angle :60}}}
            />
          </VictoryChart>
        </View>
        :
        <View>
          <Text>Loading</Text>
        </View>
      }
    </View>
  )
}

export default ComponentPriceRange;
