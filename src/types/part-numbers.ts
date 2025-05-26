export interface RunRateByHC {
  hc: number;
  rate: number;
}

export interface PartNumber {
  code: string;
  runRatesT1: RunRateByHC[];  // Array de run rates por HC para T1
  runRateT2: number;
  runRateT3: number;
  laborStd: number;
  totalHC: number;  // HC default/actual
}

// Función helper para crear runRatesT1 basado en la imagen
const createRunRatesT1 = (rates: number[]): RunRateByHC[] => {
  return rates.map((rate, index) => ({
    hc: index + 6,
    rate
  }));
};

export const PART_NUMBERS: PartNumber[] = [
  { 
    code: "13379",
    runRatesT1: createRunRatesT1([56, 65, 75, 84, 93, 103, 112, 121, 131, 140, 149, 159, 168]),
    runRateT2: 56,
    runRateT3: 56,
    laborStd: 0.660,
    totalHC: 6
  },
  { 
    code: "18611",
    runRatesT1: createRunRatesT1([45, 52, 60, 67, 74, 82, 89, 97, 104, 112, 119, 127, 134]),
    runRateT2: 45,
    runRateT3: 45,
    laborStd: 0.750,
    totalHC: 6
  },
  {
    code: "23581",
    runRatesT1: createRunRatesT1([35, 41, 47, 53, 58, 64, 70, 76, 82, 88, 93, 99, 105]),
    runRateT2: 35,
    runRateT3: 35,
    laborStd: 0.636,
    totalHC: 6
  },
  {
    code: "94886",
    runRatesT1: createRunRatesT1([35, 41, 47, 53, 58, 64, 70, 76, 82, 88, 93, 99, 105]),
    runRateT2: 35,
    runRateT3: 35,
    laborStd: 0.636,
    totalHC: 6
  },
  {
    code: "30588",
    runRatesT1: createRunRatesT1([34, 40, 46, 52, 57, 63, 69, 74, 80, 86, 92, 97, 103]),
    runRateT2: 34,
    runRateT3: 34,
    laborStd: 0.670,
    totalHC: 6
  },
  {
    code: "30589",
    runRatesT1: createRunRatesT1([34, 40, 46, 52, 57, 63, 69, 74, 80, 86, 92, 97, 103]),
    runRateT2: 34,
    runRateT3: 34,
    laborStd: 0.670,
    totalHC: 6
  },
  {
    code: "25050",
    runRatesT1: createRunRatesT1([51, 59, 68, 76, 84, 93, 101, 110, 118, 127, 135, 144, 152]),
    runRateT2: 51,
    runRateT3: 51,
    laborStd: 0.590,
    totalHC: 6
  },
  {
    code: "25048",
    runRatesT1: createRunRatesT1([42, 49, 56, 64, 71, 78, 85, 92, 99, 106, 113, 120, 127]),
    runRateT2: 42,
    runRateT3: 42,
    laborStd: 0.590,
    totalHC: 6
  },
  {
    code: "24984",
    runRatesT1: createRunRatesT1([53, 62, 71, 80, 89, 98, 107, 116, 124, 133, 142, 151, 160]),
    runRateT2: 53,
    runRateT3: 53,
    laborStd: 0.486,
    totalHC: 6
  },
  {
    code: "29375",
    runRatesT1: createRunRatesT1([53, 62, 71, 80, 89, 98, 107, 116, 124, 133, 142, 151, 160]),
    runRateT2: 53,
    runRateT3: 53,
    laborStd: 0.550,
    totalHC: 6
  },
  {
    code: "28365",
    runRatesT1: createRunRatesT1([38, 44, 50, 56, 63, 69, 75, 81, 88, 94, 100, 106, 113]),
    runRateT2: 38,
    runRateT3: 38,
    laborStd: 0.612,
    totalHC: 6
  },
  {
    code: "39388",
    runRatesT1: createRunRatesT1([33, 39, 44, 50, 55, 61, 66, 72, 77, 83, 88, 94, 99]),
    runRateT2: 33,
    runRateT3: 33,
    laborStd: 1.430,
    totalHC: 6
  },
  {
    code: "66000",
    runRatesT1: createRunRatesT1([33, 39, 44, 50, 56, 61, 67, 72, 78, 83, 89, 94, 100]),
    runRateT2: 33,
    runRateT3: 33,
    laborStd: 0.327,
    totalHC: 6
  },
  {
    code: "88000",
    runRatesT1: createRunRatesT1([22, 25, 29, 33, 36, 40, 43, 47, 51, 54, 58, 61, 65]),
    runRateT2: 22,
    runRateT3: 22,
    laborStd: 0.700,
    totalHC: 6
  }
];