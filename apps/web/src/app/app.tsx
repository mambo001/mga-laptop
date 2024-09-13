import {
  Box,
  Card,
  Container,
  Grid,
  Grid2,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';

const API_URL =
  'https://script.google.com/macros/s/AKfycbzSIwBRmBV3o5OD9oa48flTaK83RIpLJfGOEZA2eYvqSQ9wZrFFU4voxCAU1jBWa6oC/exec';

type SheetLaptopRow = {
  id: string;
  date: string;
  model: string;
  condition: string;
  price: number;
  specs: string;
};

export interface LaptopRow {
  id: string;
  date: string;
  model: string;
  condition: string;
  price: number;
  specs: LaptopSpecs | null;
}

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

export default function App() {
  const [laptops, setLaptops] = useState<LaptopRow[] | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(({ data }: { data: SheetLaptopRow[] }) => {
        const laptops: LaptopRow[] = data.map((row) => ({
          ...row,
          specs: JSON.parse(row.specs),
        }));
        setLaptops(laptops);
      })
      .catch(console.error);
  }, []);

  return (
    <Container>
      <Stack
        justifyContent={'center'}
        padding={2}
        gap={4}
        flexWrap={'wrap'}
        flexDirection={'row'}
      >
        {laptops
          ? laptops.map((laptop) => (
              <LaptopDetailCardLayout
                key={laptop.id}
                model={<Typography variant={'h6'}>{laptop.model}</Typography>}
                price={
                  <LabeledItem
                    label={
                      <Typography variant={'body1'} color="gray">
                        Price:
                      </Typography>
                    }
                    value={
                      <Typography variant={'body1'}>{laptop.price}</Typography>
                    }
                  />
                }
                condition={
                  <LabeledItem
                    label={
                      <Typography variant={'body1'} color="gray">
                        Condition:
                      </Typography>
                    }
                    value={
                      <Typography variant={'body1'}>
                        {laptop.condition}
                      </Typography>
                    }
                  />
                }
                cpu={
                  laptop.specs &&
                  laptop.specs.cpu && (
                    <LabeledItem
                      label={
                        <Typography variant={'body1'} color="gray">
                          CPU:
                        </Typography>
                      }
                      value={
                        <Typography variant={'body1'}>
                          {laptop.specs.cpu}
                        </Typography>
                      }
                    />
                  )
                }
                ram={
                  laptop.specs &&
                  laptop.specs.ram && (
                    <LabeledItem
                      label={
                        <Typography variant={'body1'} color="gray">
                          RAM:
                        </Typography>
                      }
                      value={
                        <Typography variant={'body1'}>
                          {laptop.specs.ram}
                        </Typography>
                      }
                    />
                  )
                }
                storage={
                  laptop.specs &&
                  laptop.specs.storage && (
                    <LabeledItem
                      label={
                        <Typography variant={'body1'} color="gray">
                          Storage:
                        </Typography>
                      }
                      value={
                        <Typography variant={'body1'}>
                          {laptop.specs.storage}
                        </Typography>
                      }
                    />
                  )
                }
                batteryLife={
                  laptop.specs &&
                  laptop.specs.batteryLife && (
                    <LabeledItem
                      label={
                        <Typography variant={'body1'} color="gray">
                          Battery Life:
                        </Typography>
                      }
                      value={
                        <Typography variant={'body1'}>
                          {laptop.specs.batteryLife}
                        </Typography>
                      }
                    />
                  )
                }
              />
            ))
          : Array.from({ length: 10 }).map((_, index) => (
              <LaptopDetailCardSkeleton key={index} />
            ))}
      </Stack>
    </Container>
  );
}

export interface LaptopDetailCardLayoutProps {
  model: ReactNode;
  price: ReactNode;
  condition: ReactNode;
  cpu: ReactNode;
  ram: ReactNode;
  storage: ReactNode;
  batteryLife: ReactNode;
}

function LaptopDetailCardLayout(props: LaptopDetailCardLayoutProps) {
  return (
    <Card sx={{ minWidth: 380, maxWidth: 380 }}>
      <Stack padding={2} gap={1}>
        {props.model}
        <Stack justifyContent={'space-between'} flexDirection={'row'}>
          {props.price}
          {props.condition}
        </Stack>
        <Box>{props.cpu}</Box>
        <Box>{props.ram}</Box>
        <Box>{props.storage}</Box>
        <Box>{props.batteryLife}</Box>
      </Stack>
    </Card>
  );
}

function LaptopDetailCardSkeleton() {
  return (
    <LaptopDetailCardLayout
      model={<Skeleton variant={'text'} width={'100%'} sx={{ fontSize: 60 }} />}
      condition={
        <LabeledItem
          label={
            <Skeleton variant={'text'} sx={{ fontSize: 32 }} width={100} />
          }
          value={
            <Skeleton variant={'text'} sx={{ fontSize: 32 }} width={150} />
          }
        />
      }
      price={
        <LabeledItem
          label={
            <Skeleton variant={'text'} sx={{ fontSize: 32 }} width={100} />
          }
          value={
            <Skeleton variant={'text'} sx={{ fontSize: 32 }} width={150} />
          }
        />
      }
      cpu={
        <LabeledItem
          label={
            <Skeleton variant={'text'} sx={{ fontSize: 32 }} width={200} />
          }
          value={
            <Skeleton variant={'text'} sx={{ fontSize: 32 }} width={300} />
          }
        />
      }
      ram={
        <LabeledItem
          label={
            <Skeleton variant={'text'} sx={{ fontSize: 32 }} width={200} />
          }
          value={
            <Skeleton variant={'text'} sx={{ fontSize: 32 }} width={300} />
          }
        />
      }
      storage={
        <LabeledItem
          label={
            <Skeleton variant={'text'} sx={{ fontSize: 32 }} width={200} />
          }
          value={
            <Skeleton variant={'text'} sx={{ fontSize: 32 }} width={300} />
          }
        />
      }
      batteryLife={
        <LabeledItem
          label={
            <Skeleton variant={'text'} sx={{ fontSize: 32 }} width={200} />
          }
          value={
            <Skeleton variant={'text'} sx={{ fontSize: 32 }} width={300} />
          }
        />
      }
    />
  );
}

export interface LabeledItemProps {
  label: ReactNode;
  value: ReactNode;
}

function LabeledItem(props: LabeledItemProps) {
  return (
    <Stack gap={0.5}>
      {props.label}
      {props.value}
    </Stack>
  );
}
