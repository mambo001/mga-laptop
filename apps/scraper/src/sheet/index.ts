import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { LaptopSpecs } from '../models';

export async function getSheetRows() {
  const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
  ];
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: SCOPES,
  });
  const doc = new GoogleSpreadsheet(
    process.env.GOOGLE_SPREADSHEET_ID,
    serviceAccountAuth
  );
  const SHEET_NAME = 'Laptops';

  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByTitle[SHEET_NAME];
  const rows = await sheet.getRows();

  return { rows };
}

type LaptopRow = {
  id: string;
  date: string;
  model: string;
  condition: string;
  price: number;
  specs: string;
};

export async function saveRows(laptopRows: LaptopRow[]) {
  const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
  ];
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: SCOPES,
  });
  const doc = new GoogleSpreadsheet(
    process.env.GOOGLE_SPREADSHEET_ID,
    serviceAccountAuth
  );
  const SHEET_NAME = 'Laptops';

  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByTitle[SHEET_NAME];
  const rows = await sheet.addRows(laptopRows);

  return { rows };
}
