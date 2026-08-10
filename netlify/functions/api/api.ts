import { GoogleGenAI } from '@google/genai';
import bodyParser from 'body-parser';
import cloudinary from 'cloudinary';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Router } from 'express';
import fs from 'fs/promises';
import Atobtoa from 'lesca-atobtoa';
import BunnyCDN from 'lesca-node-bunnycdn';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'path';
import serverless from 'serverless-http';
import sharp from 'sharp';
import { SETTING, TType } from '../../../setting';
import { CloudinaryUploadedResult, TUploadRespond } from '../../../setting/type';
import { REST_PATH } from '../../../src/settings/config';
import { UserType } from '../../../src/settings/type';
import { limit, messages } from '../config';
import connect from './connect';
import deleteOne from './delete';
import insert, { insertMany } from './insert';
import select from './select';
import update from './update';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const app = express();

app.use(bodyParser.json({ limit }));
app.use(bodyParser.urlencoded({ extended: true, limit }));
app.use(express.json({ limit }));

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const bunnyCdnConfig = {
  password: process.env.BUNNY_PASSWORD || 'unset',
  storageZone: process.env.BUNNY_STORAGE_ZONE || 'demo',
  folderName: process.env.BUNNY_FOLDER_NAME || '',
  region: process.env.BUNNY_REGION || 'SG',
};

const storageType: 'cloudinary' | 'bunnycdn' =
  process.env.CLOUD_STORAGE_TYPE === 'cloudinary' ? 'cloudinary' : 'bunnycdn';

app.use(cors({ origin: '*' }));
app.use(express.json());

const router = Router();

const extractImageFromDataUrl = (dataUrl: string) => {
  const matched = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matched) {
    return null;
  }

  return {
    mimeType: matched[1],
    imageBytes: matched[2],
  };
};

const getExtensionByMimeType = (mimeType: string) => {
  const mapping: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/bmp': 'bmp',
    'image/svg+xml': 'svg',
  };

  return mapping[mimeType.toLowerCase()] || 'png';
};

const formatDateFolder = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatTimestamp = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  const ms = String(date.getMilliseconds()).padStart(3, '0');
  return `${y}${m}${d}${hh}${mm}${ss}${ms}`;
};

const createSortableRandomFileName = (extension: string) => {
  const now = new Date();
  const timestamp = formatTimestamp(now);
  const random = Math.random().toString(36).slice(2, 10);
  return {
    fileName: `${timestamp}-${random}.${extension}`,
    dateFolder: formatDateFolder(now),
  };
};

const toPublicPath = (filePath: string) => {
  const publicRoot = path.resolve(process.cwd(), 'public');
  if (filePath.includes(publicRoot)) {
    return `${path.relative(publicRoot, filePath).split(path.sep).join('/')}`;
  }

  return path.relative(process.cwd(), filePath).split(path.sep).join('/');
};

function normalizeModelName(model: string): string {
  return model.replace(/^publishers\/google\/models\//, '');
}

async function getAccessibleVeoModels(ai: GoogleGenAI): Promise<string[]> {
  const models = [];
  try {
    const pager = await ai.models.list();
    for await (const m of pager) {
      const raw = m.name || m.displayName || '';
      if (!/veo/i.test(raw)) continue;
      models.push(normalizeModelName(raw));
    }
  } catch {
    // 查詢失敗時保留靜態 fallback，避免中斷主流程。
  }
  return [...new Set(models)];
}

function isModelNotFoundError(err: any): boolean {
  return err?.status === 404 || /NOT_FOUND|model.*not found/i.test(String(err?.message || ''));
}

router.post(`/${REST_PATH.login}`, async (req, res) => {
  const { body } = req;
  const connection = await connect();
  if (!connection.res) {
    res.status(200).json({ res: false, msg: messages.connectError });
  } else {
    if (body.email === process.env.ADMIN_EMAIL) {
      const type = UserType.Admin;
      const name = body.name || 'super user';
      const timestamp = new Date().toISOString();
      const data = { type, name, timestamp, email: body.email };
      const token = Atobtoa.toBase64(data);
      res.status(200).json({ res: true, token, type });
    } else {
      const respond = await select({ collection: SETTING.mongodb[0].collection });
      const data = respond.data as Extract<TType, { email: string }>[];
      const matched = data.filter((item) => item.email === body.email);
      if (matched.length === 0) res.status(200).json({ res: false, type: UserType.Guest });
      else {
        const type = matched[0].type as UserType;
        const name = body.name || '';
        const timestamp = body.updated_at || new Date().toISOString();
        const email = matched[0].email;
        const data = { type, name, email, timestamp };
        const token = Atobtoa.toBase64(data);
        res.status(200).json({ res: true, token, type });
      }
    }
  }
});

router.get(`/${REST_PATH.connect}`, async (_, res) => {
  const respond = await connect();
  res.status(200).json(respond);
});

router.post(`/${REST_PATH.select}`, async (req, res) => {
  const connection = await connect();
  if (!connection.res) {
    res.status(200).json({ res: false, msg: messages.connectError });
  } else {
    const respond = await select(req.body);
    res.status(200).json(respond);
  }
});

router.post(`/${REST_PATH.insert}`, async (req, res) => {
  const connection = await connect();
  if (!connection.res) {
    res.status(200).json({ res: false, msg: messages.connectError });
  } else {
    const respond = await insert(req.body);
    res.status(200).json(respond);
  }
});

router.post(`/${REST_PATH.insertMany}`, async (req, res) => {
  const connection = await connect();
  if (!connection.res) {
    res.status(200).json({ res: false, msg: messages.connectError });
  } else {
    const respond = await insertMany(req.body);
    res.status(200).json(respond);
  }
});

router.post(`/${REST_PATH.delete}`, async (req, res) => {
  const connection = await connect();
  if (!connection.res) {
    res.status(200).json({ res: false, msg: messages.connectError });
  } else {
    const respond = await deleteOne(req.body);
    res.status(200).json(respond);
  }
});

router.post(`/${REST_PATH.update}`, async (req, res) => {
  const connection = await connect();
  if (!connection.res) {
    res.status(200).json({ res: false, msg: messages.connectError });
  } else {
    const respond = await update(req.body);
    res.status(200).json(respond);
  }
});

router.post(`/${REST_PATH.upload}`, async (req, res) => {
  try {
    const base64Image = req.body.image;
    if (!base64Image) {
      res.status(200).json({ res: false, msg: 'No image provided' });
      return;
    }

    const sharpConfig: { format?: 'jpeg' | 'png' | 'webp'; quality?: number } = {
      format: 'webp',
      quality: 80,
    };

    const buffer = await sharp(Buffer.from(base64Image.split(',')[1], 'base64'))
      .toFormat(sharpConfig.format || 'webp', { quality: sharpConfig.quality || 80 })
      .toBuffer();

    if (storageType === 'cloudinary') {
      const folder = `${process.env.CLOUDINARY_BASE_FOLDER}${req.body.folder ? `/${req.body.folder}` : ''}`;
      const base64String = `data:image/webp;base64,${buffer.toString('base64')}`;
      cloudinary.v2.uploader.upload(base64String, { folder }, (error, result) => {
        if (error) res.status(200).json({ res: false, msg: error });
        else res.status(200).json({ res: true, msg: messages.updateSuccess, data: result });
      });
    } else {
      const folder = req.body.folder || '';
      const result = await BunnyCDN.upload({
        buffer,
        folder,
        ...bunnyCdnConfig,
      });

      const public_id = result.url?.split('/').pop() || '';
      const data: CloudinaryUploadedResult = {
        public_id,
        version: 0,
        signature: '',
        width: 0,
        height: 0,
        format: public_id.split('.').pop() || 'webp',
        resource_type: 'image',
        created_at: '',
        tags: [],
        pages: 0,
        bytes: 0,
        type: 'image',
        etag: '',
        placeholder: false,
        url: result.url || '',
        secure_url: result.url || '',
        access_control: [],
        original_filename: public_id,
        moderation: [],
        access_mode: '',
        context: {},
        metadata: {},
        colors: [],
      };
      res.status(200).json({ res: true, msg: messages.uploadSuccess, data });
    }
  } catch (error) {
    res.status(200).json({ res: false, msg: messages.uploadError, error });
  }
});

router.post(`/${REST_PATH.search}`, async (req, res) => {
  try {
    if (storageType === 'cloudinary') {
      cloudinary.v2.search
        .expression(
          `folder=${process.env.CLOUDINARY_BASE_FOLDER}${req.body.folder ? `/${req.body.folder}` : ''}`,
        )
        .execute()
        .then((result) => {
          res.status(200).json({ res: true, msg: messages.searchSuccess, data: result.resources });
        })
        .catch(() => {
          res.status(200).json({ res: false, msg: messages.searchError });
        });
    } else {
      const currentFolder = req.body.folder === '*' ? '' : req.body.folder;
      const result = await BunnyCDN.list({
        folder: currentFolder,
        configOverrides: bunnyCdnConfig,
      });
      const files = result.files
        ?.map((item) => {
          const resources: TUploadRespond = {
            access_control: null,
            access_mode: '',
            aspect_ratio: 0,
            asset_id: '',
            backup_bytes: 0,
            bytes: item.Length,
            created_at: item.DateCreated,
            created_by: { access_key: item.Guid },
            etag: item.Checksum,
            filename: item.ObjectName,
            folder: item.Path.replace(/\//g, ''),
            format: item.ContentType.split('/')[1] || '',
            height: 0,
            pixels: 0,
            public_id: item.ObjectName,
            resource_type: item.IsDirectory ? 'folder' : 'file',
            secure_url: item.Url,
            status: 'available',
            type: item.IsDirectory ? 'folder' : 'file',
            uploaded_at: item.DateCreated,
            uploaded_by: { access_key: '' },
            url: item.Url,
            version: 0,
            width: 0,
          };
          return resources;
        })
        .sort((a) => {
          return a.resource_type === 'folder' ? -1 : 1;
        });
      res.status(200).json({ res: true, msg: messages.searchSuccess, data: files });
    }
  } catch (error) {
    res.status(200).json({ res: false, msg: messages.searchError, error });
  }
});

router.post(`/${REST_PATH.remove}`, async (req, res) => {
  try {
    if (storageType === 'cloudinary') {
      cloudinary.v2.uploader.destroy(req.body.public_id, (error: any, result: any) => {
        if (error) res.status(200).json({ res: false, msg: messages.removeError });
        else res.status(200).json({ res: true, msg: messages.removeSuccess, data: result });
      });
    } else {
      const result = await BunnyCDN.deleteFile({
        ...bunnyCdnConfig,
        href: req.body.public_id,
      });
      if (result) res.status(200).json({ res: true, msg: messages.removeSuccess, data: result });
      else res.status(200).json({ res: false, msg: messages.removeError });
    }
  } catch (error) {
    res.status(200).json({ res: false, msg: messages.uploadError, error });
  }
});

router.post(`/${REST_PATH.removeMany}`, async (req, res) => {
  try {
    if (storageType === 'cloudinary') {
      cloudinary.v2.api.delete_resources(req.body.public_ids, (error, result) => {
        if (error) res.status(200).json({ res: false, msg: messages.removeError });
        else res.status(200).json({ res: true, msg: messages.removeSuccess, data: result });
      });
    } else {
      const results = await Promise.all(
        req.body.public_ids.map(async (public_id: string) => {
          return await BunnyCDN.deleteFile({
            ...bunnyCdnConfig,
            href: public_id,
          });
        }),
      );
      res.status(200).json({ res: true, msg: messages.removeSuccess, data: results });
    }
  } catch (error) {
    res.status(200).json({ res: false, msg: messages.uploadError, error });
  }
});

router.post(`/${REST_PATH.generateVideo}`, async (req, res) => {
  const PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
  const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
  // veo-3.0-fast-generate-001（較便宜）/ veo-3.0-generate-001（品質較高、較貴）
  const MODEL = process.env.VEO_MODEL || 'veo-3.1-fast-generate-001';
  const API_VERSION = process.env.VERTEX_API_VERSION; // 例：v1beta1

  if (!PROJECT || PROJECT === 'your-gcp-project-id') {
    console.error('請先在 .env 填入 GOOGLE_CLOUD_PROJECT（你的 GCP 專案 ID）');
    process.exit(1);
  }

  const { image, prompt } = req.body as { image?: string; prompt?: string };

  if (!image || !prompt) {
    res.status(200).json({ res: false, msg: 'image and prompt are required' });
    return;
  }

  let mimeType = 'image/png';
  let imageBytes = image;
  const parsedImage = extractImageFromDataUrl(image);
  if (parsedImage) {
    mimeType = parsedImage.mimeType;
    imageBytes = parsedImage.imageBytes;
  }
  imageBytes = imageBytes.replace(/\s+/g, '');

  const ai = new GoogleGenAI({
    vertexai: true,
    project: PROJECT,
    location: LOCATION,
    ...(API_VERSION ? { httpOptions: { apiVersion: API_VERSION } } : {}),
  });

  const requestedModel = normalizeModelName(MODEL);
  const staticFallbackModels = [
    'veo-3.1-fast-generate-001',
    'veo-3.1-generate-001',
    'veo-3.0-fast-generate-001',
    'veo-3.0-generate-001',
    'veo-2.0-generate-001',
  ];
  const accessibleVeoModels = await getAccessibleVeoModels(ai);
  const candidateModels = [
    ...new Set([requestedModel, ...staticFallbackModels, ...accessibleVeoModels]),
  ];

  // 1) 送出請求，拿到一個 long-running operation
  let operation;

  for (const candidate of candidateModels) {
    const isVeo3 = candidate.startsWith('veo-3');
    try {
      console.log(`\n嘗試模型：${candidate}`);
      operation = await ai.models.generateVideos({
        model: candidate,
        source: {
          prompt,
          image: { imageBytes, mimeType },
        },
        config: {
          numberOfVideos: 1,
          aspectRatio: '9:16',
          durationSeconds: 8, // Veo 3 單支最長 8 秒
          // 輸入圖含真人時需要，否則可能被安全政策擋下
          personGeneration: 'allow_adult',
          // Veo 3 才支援音訊（8-bit 配樂 / 音效由 prompt 描述生成）
          ...(isVeo3 ? { generateAudio: true } : {}),
          // 若你的專案要求輸出到 Cloud Storage，取消下一行註解並填 bucket：
          // outputGcsUri: 'gs://your-bucket/veo-output/',
        },
      });
      break;
    } catch (err) {
      if (isModelNotFoundError(err)) {
        res.status(200).json({
          res: false,
          msg: `模型 ${candidate} 不存在或無法存取，請確認專案是否有權限使用。`,
        });
        return;
      }
      throw err;
    }
  }

  if (!operation) {
    res.status(200).json({ res: false, msg: '找不到可用的 Veo 模型' });
    return;
  }

  let waited = 0;
  while (!operation.done) {
    await new Promise((r) => setTimeout(r, 10000));
    waited += 10;
    console.log(`  …仍在生成中（已等待 ${waited}s）`);
    operation = await ai.operations.getVideosOperation({ operation });
  }

  console.log(operation);

  console.log('影片生成完成，開始處理結果…');

  if (operation.error) {
    res.status(200).json({
      res: false,
      msg: '影片生成失敗',
      error: operation.error,
      data: { operationName: operation.name },
    });
    return;
  }

  const videos = operation.response?.generatedVideos ?? [];
  if (videos.length === 0) {
    res.status(200).json({
      res: false,
      msg: '生成完成但沒有回傳影片（可能被安全策略過濾）',
      data: {
        operationName: operation.name,
        raiMediaFilteredCount: operation.response?.raiMediaFilteredCount ?? 0,
        raiMediaFilteredReasons: operation.response?.raiMediaFilteredReasons ?? [],
      },
    });
    return;
  }

  mkdirSync('output', { recursive: true });

  for (const [i, v] of videos.entries()) {
    const bytes = v.video?.videoBytes;
    const uri = v.video?.uri;
    if (bytes) {
      const baseLocalPath = process.env.SAVE_VIDEO_BASE_PATH
        ? path.resolve(process.env.SAVE_VIDEO_BASE_PATH)
        : path.resolve(process.cwd(), 'public', 'video');

      const { fileName: finalFileName, dateFolder } = createSortableRandomFileName('mp4');
      const outputDir = path.join(baseLocalPath, dateFolder);
      await fs.mkdir(outputDir, { recursive: true });
      const filePath = path.join(outputDir, finalFileName);
      writeFileSync(filePath, Buffer.from(bytes, 'base64'));

      const localPath = toPublicPath(filePath);
      const relativePath = path.relative(process.cwd(), filePath);

      res.status(200).json({
        res: true,
        msg: '影片生成成功',
        data: {
          operationName: operation.name,
          baseLocalPath,
          subfolder: dateFolder,
          fileName: finalFileName,
          filePath,
          localPath,
          relativePath,
        },
      });
      return;
    } else if (uri) {
      res.status(200).json({
        res: true,
        msg: '影片生成成功（Cloud Storage）',
        data: {
          index: i,
          operationName: operation.name,
          uri,
        },
      });
      return;
    } else {
      continue;
    }
  }

  res.status(200).json({
    res: false,
    msg: '影片生成完成，但沒有可儲存的 videoBytes 或 uri',
    data: { operationName: operation.name },
  });
});

const uploadVideoToBunnyCDN = async (videoLocalPath: string) => {
  const videoBuffer = await fs.readFile(videoLocalPath);
  const fileName = path.basename(videoLocalPath);
  const storageZone = bunnyCdnConfig.storageZone;
  const accessKey = bunnyCdnConfig.password;
  const regionHost = bunnyCdnConfig.region
    ? `${bunnyCdnConfig.region}.storage.bunnycdn.com`
    : 'storage.bunnycdn.com';
  const folder = bunnyCdnConfig.folderName.replace(/^\/+|\/+$/g, '');
  const objectPath = [folder, fileName]
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  const uploadUrl = `https://${regionHost}/${storageZone}/${objectPath}`;
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      AccessKey: accessKey,
      'Content-Type': 'video/mp4',
      'Content-Length': videoBuffer.length.toString(),
    },
    body: videoBuffer,
  });

  if (response.status !== 201) {
    const errorText = await response.text();
    throw new Error(`BunnyCDN upload failed: ${response.status} ${errorText}`);
  }

  const url = `https://${storageZone}.b-cdn.net/${objectPath}`;
  return {
    url,
    public_id: fileName,
    localPath: videoLocalPath,
  };
};

router.post(`/${REST_PATH.uploadLocalVideo}`, async (req, res) => {
  try {
    const { relativePath } = req.body as { relativePath?: string };
    if (!relativePath) {
      res.status(200).json({ res: false, msg: 'relativePath is required' });
      return;
    }

    const absoluteVideoPath = path.resolve(relativePath);
    const uploadResult = await uploadVideoToBunnyCDN(absoluteVideoPath);

    res.status(200).json({
      res: true,
      msg: '影片上傳成功',
      data: uploadResult,
    });
  } catch (error) {
    res.status(200).json({ res: false, msg: '影片上傳失敗', error });
  }
});

router.post(`/${REST_PATH.getVideoOperation}`, async (req, res) => {
  const PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
  const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
  const API_VERSION = process.env.VERTEX_API_VERSION;

  if (!PROJECT || PROJECT === 'your-gcp-project-id') {
    res.status(200).json({ res: false, msg: 'GOOGLE_CLOUD_PROJECT is required' });
    return;
  }

  const { operationName } = req.body as { operationName?: string };
  if (!operationName) {
    res.status(200).json({ res: false, msg: 'operationName is required' });
    return;
  }

  try {
    const ai = new GoogleGenAI({
      vertexai: true,
      project: PROJECT,
      location: LOCATION,
      ...(API_VERSION ? { httpOptions: { apiVersion: API_VERSION } } : {}),
    });

    const operation = await ai.operations.getVideosOperation({
      operation: { name: operationName } as any,
    });

    if (!operation.done) {
      res.status(200).json({
        res: true,
        msg: '影片仍在生成中',
        data: { operationName, done: false },
      });
      return;
    }

    if (operation.error) {
      res.status(200).json({
        res: false,
        msg: '影片生成失敗',
        error: operation.error,
        data: { operationName, done: true },
      });
      return;
    }

    const videos = operation.response?.generatedVideos ?? [];
    if (videos.length === 0) {
      res.status(200).json({
        res: false,
        msg: '生成完成但沒有回傳影片（可能被安全策略過濾）',
        data: {
          operationName,
          done: true,
          raiMediaFilteredCount: operation.response?.raiMediaFilteredCount ?? 0,
          raiMediaFilteredReasons: operation.response?.raiMediaFilteredReasons ?? [],
        },
      });
      return;
    }

    for (const [i, v] of videos.entries()) {
      const bytes = v.video?.videoBytes;
      const uri = v.video?.uri;

      if (bytes) {
        const baseLocalPath = process.env.SAVE_VIDEO_BASE_PATH
          ? path.resolve(process.env.SAVE_VIDEO_BASE_PATH)
          : path.resolve(process.cwd(), 'public', 'saved-video');
        const { fileName: finalFileName, dateFolder } = createSortableRandomFileName('mp4');
        const outputDir = path.join(baseLocalPath, dateFolder);
        await fs.mkdir(outputDir, { recursive: true });
        const filePath = path.join(outputDir, finalFileName);

        writeFileSync(filePath, Buffer.from(bytes, 'base64'));
        res.status(200).json({
          res: true,
          msg: '影片生成成功',
          data: {
            index: i,
            operationName,
            done: true,
            baseLocalPath,
            subfolder: dateFolder,
            fileName: finalFileName,
            filePath,
            bytes: Buffer.byteLength(bytes, 'base64'),
          },
        });
        return;
      }

      if (uri) {
        res.status(200).json({
          res: true,
          msg: '影片生成成功（Cloud Storage）',
          data: {
            index: i,
            operationName,
            done: true,
            uri,
          },
        });
        return;
      }
    }

    res.status(200).json({
      res: false,
      msg: '影片生成完成，但沒有可儲存的 videoBytes 或 uri',
      data: { operationName, done: true },
    });
  } catch (error) {
    res.status(200).json({
      res: false,
      msg: '查詢影片任務失敗',
      error,
      data: { operationName },
    });
  }
});

router.post(`/${REST_PATH.saveImage}`, async (req, res) => {
  try {
    const { image } = req.body as { image?: string };

    if (!image) {
      res.status(200).json({ res: false, msg: 'image is required' });
      return;
    }

    let mimeType = 'image/png';
    let imageBytes = image;

    const parsed = extractImageFromDataUrl(image);
    if (parsed) {
      mimeType = parsed.mimeType;
      imageBytes = parsed.imageBytes;
    }

    const extension = getExtensionByMimeType(mimeType);
    const { fileName: finalFileName, dateFolder } = createSortableRandomFileName(extension);

    const baseLocalPath = process.env.SAVE_IMAGE_BASE_PATH
      ? path.resolve(process.env.SAVE_IMAGE_BASE_PATH)
      : path.resolve(process.cwd(), 'saved-images');

    const outputDir = path.join(baseLocalPath, dateFolder);
    await fs.mkdir(outputDir, { recursive: true });

    const filePath = path.join(outputDir, finalFileName);
    const buffer = Buffer.from(imageBytes, 'base64');
    await fs.writeFile(filePath, buffer);

    res.status(200).json({
      res: true,
      msg: 'Save image successful',
      data: {
        baseLocalPath,
        subfolder: dateFolder,
        fileName: finalFileName,
        filePath,
        mimeType,
        bytes: buffer.byteLength,
      },
    });
  } catch (error) {
    res.status(200).json({ res: false, msg: 'Save image failed', error });
  }
});

router.post(`/${REST_PATH.tracking}`, async (req, res) => {
  const connection = await connect();
  if (!connection.res) {
    res.status(200).json({ res: false, msg: messages.connectError });
  } else {
    const { collection, data } = req.body as {
      collection: string;
      data: Omit<Extract<TType, { pageName: string }>, 'timestamp' | 'count'>;
    };

    if (!collection || !data) {
      res.status(200).json({ res: false, msg: 'Collection and data are required' });
      return;
    }

    const dateNow = new Date();
    const dateKey = dateNow.toISOString().slice(0, 10);

    type MatchedType = Extract<TType, { pageName: string }> & {
      _id: any;
      count: Record<string, number>;
    };

    const dataFromDb = await select({ collection });
    const existingData = dataFromDb.data as Extract<TType, { pageName: string }>[];
    const matched = existingData.find(
      (item) => item.pageName === data.pageName && item.type === data.type,
    ) as MatchedType | undefined;

    if (!matched) {
      const newData = {
        ...data,
        timestamp: dateNow.toISOString(),
        count: { [dateKey]: 1 },
      };
      const response = await insert({ collection, data: newData });
      res.status(200).json({ ...response, msg: newData.pageName });
    } else {
      const normalizedCount = Object.entries(
        (matched.count || {}) as Record<string, number>,
      ).reduce(
        (acc, [key, value]) => {
          const normalizedKey = key.includes('T') ? key.slice(0, 10) : key;
          const normalizedValue = Number(value) || 0;
          acc[normalizedKey] = (acc[normalizedKey] || 0) + normalizedValue;
          return acc;
        },
        {} as Record<string, number>,
      );

      const updatedCount = {
        ...normalizedCount,
        [dateKey]: (normalizedCount[dateKey] || 0) + 1,
      };
      const response = await update({
        collection,
        data: { _id: matched._id, data: { count: updatedCount } },
      });
      res.status(200).json({ ...response, msg: matched.pageName });
    }
  }
});

app.use('/api/', router);

export const handler = serverless(app);
