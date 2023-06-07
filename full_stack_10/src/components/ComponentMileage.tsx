import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import _ from "lodash";
import { Car } from "../models/Car";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryHistogram, VictoryPie } from "victory-native";
import { CarsByPriceRange } from "../models/CarsByPriceRange";
import { CarsByMileage } from "../models/CarsByMileage";


interface Props {
  dataSet: Car[]
}


const ComponentMileage = (props: Props) => {
  const [carsByMileage, setCarsByMileage] = useState([] as CarsByMileage[])
  const [isLoading, setLoading] = useState(false);

  useEffect( () => {
      setLoading(true);
      const data = props.dataSet;
      const mileageGroups: CarsByMileage[] = [];
      const minMileage = Math.min(...data.map((car) => car.mileage));
      const maxMileage = Math.max(...data.map((car) => car.mileage));
      const mileageStep = maxMileage / 10;
      for (let i = 0; i < 10; i++) {
        const mileageGroup: CarsByMileage = {
          lowerRange: mileageStep * i,
          upperRange: mileageStep * (i + 1),
          amount: 0,
        }
        mileageGroups.push(mileageGroup);
      }
      for (let i = 0; i < data.length; i++) {
        const car = data[i];
        for (let j = 0; j < mileageGroups.length; j++) {
          const mileageGroup = mileageGroups[j];
          if (car.mileage >= mileageGroup.lowerRange && car.mileage <= mileageGroup.upperRange) {
            mileageGroup.amount++;
            break; // I used forEach but for loop allows break so its better in this case
          }
        }
      }
    setCarsByMileage(mileageGroups);
      setLoading(false);
    },[]
  );
  const tickValues: number[] = carsByMileage.map((group) => group.upperRange);

  return (
    <View>
      {!isLoading ?
        <View>
          <VictoryChart>
            <VictoryBar
              data={carsByMileage}
              x="upperRange"
              y="amount"
              labels={({ datum }) => `${datum.amount}`}
            />
            <VictoryAxis
              tickValues={tickValues}
              tickFormat={(tick) => `${(tick / 1000).toFixed(0)}k`}
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

export default ComponentMileage;
