export interface IBloodPressureMeasurement {
  systolic: number;
  diastolic: number;
}

export interface IMeasurement {
  id: number;
  patientId: string;
  type: string;
  value?: number;
  values?: IBloodPressureMeasurement;
  date: string;
  read?: boolean;
}
