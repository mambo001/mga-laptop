import { Schema } from '@effect/schema';

// export class LaptopSpecs extends Schema.Class<LaptopSpecs>('LaptopSpecs')({
//   cpu: Schema.String,
//   ram: Schema.String,
//   storage: Schema.String,
//   display: Schema.String,
//   graphicsCard: Schema.String,
//   inclusions: Schema.String,
//   os: Schema.String,
//   batteryLife: Schema.String,
//   ports: Schema.String,
// }) {}

// export class LaptopDetails extends Schema.Class<LaptopDetails>('LaptopDetails')(
//   {
//     model: Schema.String,
//     condition: Schema.String,
//     price: Schema.Number,
//     specs: LaptopSpecs,
//   }
// ) {}

export interface LaptopSpecs {
  cpu: string | null;
  ram: string | null;
  storage: string | null;
  display: string | null;
  graphicsCard: string | null;
  inclusions: string | null;
  os: string | null;
  batteryLife: string | null;
  ports: string | null;
}

export interface LaptopDetails {
  model: string;
  condition: string;
  price: number;
  specs: LaptopSpecs | null;
}
