import OpenAI from 'openai';
import { Schema } from '@effect/schema';
import { ChatCompletionContentPart } from 'openai/resources';

import { LaptopDetails, LaptopSpecs } from '../models';
import { Array, Effect } from 'effect';

const ChatCompletionResponse = Schema.Struct({
  choices: Schema.Array(
    Schema.Struct({
      message: Schema.Struct({
        content: Schema.NullOr(Schema.String),
      }),
    })
  ),
});
const ResponseData = Schema.Struct({
  data: Schema.Array(Schema.Unknown),
});

// const encodeLaptopDetails = Schema.encodeUnknown(LaptopDetails);
// const decodeLaptopDetailsArray = Schema.decodeUnknownPromise(
//   Schema.Array(LaptopDetails)
// );
const decodeResponseData = Schema.decodeUnknownPromise(ResponseData);
const decodeChatCompletionResponse = Schema.decodeUnknownPromise(
  ChatCompletionResponse
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function processData(data: string[]) {
  if (data.length === 0) return 'No data';
  const formatted: ChatCompletionContentPart[] = data.map((text) => ({
    text,
    type: 'text',
  }));
  const promptText: ChatCompletionContentPart = {
    type: 'text',
    text: `Format the data into JSON following this schema: data: [{ model: string, condition: string, price: number, specs: {cpu: string, ram: string, storage: string, display: string, graphicsCard: string, inclusions: string, os: string, batteryLife: string, ports: string}}]. Don't add formatting/spacing/newlines for logs. Just return the stringified JSON data like this data: [{model:"Dell Precision 5560",condition:"Slightly Used",price:3e4,specs:{cpu:"i5 1155G7 model...",ram:"16GB DDR4 3200MHz",storage:"512GB NVMe SSD",display:'15.6" FHD+ (1920 x 1200) 60Hz',graphicsCard:"Intel Iris Xe Graphics",inclusions:"Charger, Laptop Bag",os:"Windows 11 Pro",batteryLife:"Up to 5 hours",ports:"2x USB-C, 2x USB-A, HDMI, SD Card Reader"}}];`,
  };
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'user',
        content: [promptText, ...formatted],
      },
    ],
  });
  const { choices } = await decodeChatCompletionResponse(response);
  console.log('choices[0].message.content: ', choices[0].message.content);
  const raw = JSON.parse(choices[0].message.content);
  console.log({ raw });
  const parsedResponse = await decodeResponseData(raw);
  console.log({ parsedResponse });
  // const parsed = await decodeLaptopDetailsArray(parsedResponse.data);
  // console.log({ parsed });
  const parsed = parsedResponse.data as LaptopDetails[];
  console.log({ parsed });
  return parsed;
  // const encoded = await Promise.all(
  //   Array.map(parsedResponse.data, async (laptop) =>
  //     Effect.runSync(
  //       encodeLaptopDetails(
  //         new LaptopDetails({
  //           ...laptop,
  //           specs: new LaptopSpecs(laptop.specs),
  //         })
  //       )
  //     )
  //   )
  // );
  // return encoded;
}
