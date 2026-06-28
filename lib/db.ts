import { MongoClient, Db } from 'mongodb';
import { InvestmentVerdict } from './types';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'investment_agent';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let useMemoryFallback = false;

// Global in-memory cache in case MongoDB is not running
const globalMemoryCache = global as typeof globalThis & {
  verdictsMemoryCache?: InvestmentVerdict[];
};

if (!globalMemoryCache.verdictsMemoryCache) {
  globalMemoryCache.verdictsMemoryCache = [];
}

export async function connectToDatabase() {
  if (useMemoryFallback) {
    return { client: null, db: null, fallback: true };
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb, fallback: false };
  }

  try {
    // Set a short timeout (2 seconds) so we don't hang if Mongo isn't running
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });

    await client.connect();
    const db = client.db(DB_NAME);

    // Create indexes for fast lookup and integrity
    try {
      await db.collection('verdicts').createIndex({ company: 1 }, { unique: true });
      await db.collection('verdicts').createIndex({ confidenceScore: -1 });
    } catch (idxError: any) {
      console.warn('Index creation skipped or already exists:', idxError.message);
    }

    cachedClient = client;
    cachedDb = db;
    console.log('Successfully connected to MongoDB.');
    return { client, db, fallback: false };
  } catch (error: any) {
    console.warn('MongoDB connection failed. Falling back to in-memory cache. Error:', error.message);
    useMemoryFallback = true;
    return { client: null, db: null, fallback: true };
  }
}

export async function getCachedVerdict(companyName: string): Promise<InvestmentVerdict | null> {
  const cleanName = companyName.trim().toLowerCase();

  const { db, fallback } = await connectToDatabase();
  if (fallback || !db) {
    const found = globalMemoryCache.verdictsMemoryCache?.find(
      v => v.company.trim().toLowerCase() === cleanName
    );
    return found || null;
  }

  try {
    const record = await db.collection('verdicts').findOne({
      company: { $regex: new RegExp(`^${companyName.trim()}$`, 'i') }
    });
    return record ? (record as unknown as InvestmentVerdict) : null;
  } catch (error) {
    console.error('Failed to read from MongoDB:', error);
    // Fallback to memory if DB read crashes midway
    const found = globalMemoryCache.verdictsMemoryCache?.find(
      v => v.company.trim().toLowerCase() === cleanName
    );
    return found || null;
  }
}

export async function saveVerdictToCache(verdict: InvestmentVerdict): Promise<void> {
  const cleanName = verdict.company.trim().toLowerCase();

  // Always sync to memory cache first as a hot backup
  const filtered = globalMemoryCache.verdictsMemoryCache?.filter(
    v => v.company.trim().toLowerCase() !== cleanName
  ) || [];
  globalMemoryCache.verdictsMemoryCache = [...filtered, verdict];

  const { db, fallback } = await connectToDatabase();
  if (fallback || !db) {
    return;
  }

  try {
    // Strip MongoDB _id to avoid modification collision on updates
    const { _id, ...updatePayload } = verdict as any;
    await db.collection('verdicts').updateOne(
      { company: verdict.company },
      { $set: updatePayload },
      { upsert: true }
    );
  } catch (error) {
    console.error('Failed to write to MongoDB:', error);
  }
}

export async function getTopVerdicts(limit = 10): Promise<InvestmentVerdict[]> {
  const { db, fallback } = await connectToDatabase();
  if (fallback || !db) {
    // Return memory cache sorted by confidenceScore descending
    return [...(globalMemoryCache.verdictsMemoryCache || [])]
      .sort((a, b) => b.confidenceScore - a.confidenceScore)
      .slice(0, limit);
  }

  try {
    const records = await db
      .collection('verdicts')
      .find({})
      .sort({ confidenceScore: -1 })
      .limit(limit)
      .toArray();
    return records as unknown as InvestmentVerdict[];
  } catch (error) {
    console.error('Failed to retrieve top verdicts from MongoDB:', error);
    // Fallback to memory
    return [...(globalMemoryCache.verdictsMemoryCache || [])]
      .sort((a, b) => b.confidenceScore - a.confidenceScore)
      .slice(0, limit);
  }
}
