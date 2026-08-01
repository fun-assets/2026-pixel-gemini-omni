import { ReadyOnly } from '@/settings/type-unity';
import { IType, TUploadRespond } from './type';

// mongodb collection schema setting.
export const SETTING = {
  mongodb: [
    {
      collection: 'user',
      schema: {
        userName: { type: IType.String, required: true },
        email: { type: IType.String, required: true },
        type: { type: IType.String, required: true },
        timestamp: { type: IType.Date, default: 'Date.now()' },
      },
    },
    {
      collection: 'tracking',
      schema: {
        pageName: { type: IType.String, required: true },
        type: { type: IType.String, required: true },
        count: { type: IType.Object, required: false },
        timestamp: { type: IType.Date, default: 'Date.now()' },
      },
    },
  ],
};

// set type for mongodb
export type TType =
  | {
      userName: string;
      email: string;
      type: string;
      timestamp: string;
    }
  | {
      pageName: string;
      type: string;
      count: object;
      timestamp: string;
    };

// type for api respond
export type IRespond = ReadyOnly<{
  res: boolean;
  msg: string;
  collection: string;
  data: TType[];
}>;

export type TUploadResult = ReadyOnly<{
  res: boolean;
  msg: string;
  collection: string;
  data: TUploadRespond[];
}>;
