import { PrismaClient } from '../src/generated/prisma/index.js';

// Create two Prisma clients for both databases
const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "mysql://root:0778576369Ms%2F@localhost:3307/assets_app_db"
    }
  }
});

const virtualPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.VIRTUAL_DB_URL || "mysql://asset_user:asset_pass@localhost:3308/asset_mgr_team"
    }
  }
});

// Dual write functions
async function dualCreate(model, data) {
  try {
    const isPrimary = process.env.PRIMARY_LAPTOP === 'true';
    let localResult = null, virtualResult = null;
    if (isPrimary) {
      // Try both databases, but succeed if at least one works
      const results = await Promise.allSettled([
        localPrisma[model].create({ data }),
        virtualPrisma[model].create({ data })
      ]);
      localResult = results[0].status === 'fulfilled' ? results[0].value : null;
      virtualResult = results[1].status === 'fulfilled' ? results[1].value : null;
      
      if (results[0].status === 'rejected') {
        console.warn('Local database create failed:', results[0].reason.message);
      }
      if (results[1].status === 'rejected') {
        console.warn('Virtual database create failed:', results[1].reason.message);
      }
      
      // Fail only if both databases failed
      if (!localResult && !virtualResult) {
        throw new Error('Both databases failed to create record');
      }
    } else {
      virtualResult = await virtualPrisma[model].create({ data });
    }
    return {
      success: true,
      local: localResult,
      virtual: virtualResult
    };
  } catch (error) {
    console.error('Dual create error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function dualUpdate(model, where, data) {
  try {
    const isPrimary = process.env.PRIMARY_LAPTOP === 'true';
    let localResult = null, virtualResult = null;
    if (isPrimary) {
      // Try both databases, but succeed if at least one works
      const results = await Promise.allSettled([
        localPrisma[model].update({ where, data }),
        virtualPrisma[model].update({ where, data })
      ]);
      localResult = results[0].status === 'fulfilled' ? results[0].value : null;
      virtualResult = results[1].status === 'fulfilled' ? results[1].value : null;
      
      if (results[0].status === 'rejected') {
        console.warn('Local database update failed:', results[0].reason.message);
      }
      if (results[1].status === 'rejected') {
        console.warn('Virtual database update failed:', results[1].reason.message);
      }
      
      // Fail only if both databases failed
      if (!localResult && !virtualResult) {
        throw new Error('Both databases failed to update record');
      }
    } else {
      virtualResult = await virtualPrisma[model].update({ where, data });
    }
    return {
      success: true,
      local: localResult,
      virtual: virtualResult
    };
  } catch (error) {
    console.error('Dual update error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function dualDelete(model, where) {
  try {
    const isPrimary = process.env.PRIMARY_LAPTOP === 'true';
    let localResult = null, virtualResult = null;
    if (isPrimary) {
      // Try both databases, but succeed if at least one works
      const results = await Promise.allSettled([
        localPrisma[model].delete({ where }),
        virtualPrisma[model].delete({ where })
      ]);
      localResult = results[0].status === 'fulfilled' ? results[0].value : null;
      virtualResult = results[1].status === 'fulfilled' ? results[1].value : null;
      
      if (results[0].status === 'rejected') {
        console.warn('Local database delete failed:', results[0].reason.message);
      }
      if (results[1].status === 'rejected') {
        console.warn('Virtual database delete failed:', results[1].reason.message);
      }
      
      // Fail only if both databases failed
      if (!localResult && !virtualResult) {
        throw new Error('Both databases failed to delete record');
      }
    } else {
      virtualResult = await virtualPrisma[model].delete({ where });
    }
    return {
      success: true,
      local: localResult,
      virtual: virtualResult
    };
  } catch (error) {
    console.error('Dual delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Sync all models from virtual to local
async function syncVirtualToLocal() {
  const isPrimary = process.env.PRIMARY_LAPTOP === 'true';
  if (!isPrimary) {
    console.log('Sync skipped: Not primary laptop');
    return;
  }
  
  console.log('🔄 Starting sync from virtual to local database...');
  
  // List all models to sync
  const models = [
    'users', 'assets', 'categories', 'suppliers', 'maintenance_staff', 'locations',
    'buyers', 'assignments', 'maintenance', 'disposals', 'asset_valuation'
  ];
  
  let syncedCount = 0;
  let errorCount = 0;
  
  for (const model of models) {
    try {
      const virtualRows = await virtualPrisma[model].findMany();
      
      for (const row of virtualRows) {
        // Upsert into local
        const idField = Object.keys(row).find(k => k.endsWith('_id'));
        if (!idField) continue;
        
        try {
          await localPrisma[model].upsert({
            where: { [idField]: row[idField] },
            update: row,
            create: row
          });
          syncedCount++;
        } catch (upsertErr) {
          console.error(`Failed to upsert ${model} with ${idField}=${row[idField]}:`, upsertErr.message);
          errorCount++;
        }
      }
      console.log(`✅ Synced ${virtualRows.length} ${model} records`);
    } catch (err) {
      console.error(`❌ Sync error for ${model}:`, err.message);
      errorCount++;
    }
  }
  
  console.log(`🎉 Sync complete: ${syncedCount} records synced, ${errorCount} errors`);
}

// Simple cache for merged data (5 second TTL)
const dataCache = new Map();
const CACHE_TTL = 5000; // 5 seconds

// Helper function to merge data from both databases (prefer most recent)
async function getMergedData(model, options = {}) {
  const isPrimary = process.env.PRIMARY_LAPTOP === 'true';
  
  if (!isPrimary) {
    // Non-primary laptops only read from virtual database
    return await virtualPrisma[model].findMany(options);
  }
  
  // Check cache first (only for simple queries without filters)
  const cacheKey = `${model}_${JSON.stringify(options)}`;
  const cached = dataCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  // Primary laptop: merge from both databases
  const [localData, virtualData] = await Promise.all([
    localPrisma[model].findMany(options),
    virtualPrisma[model].findMany(options)
  ]);
  
  // Merge by ID field, prefer virtual data (most recent from team)
  const idField = model === 'users' ? 'user_id' :
                  model === 'assets' ? 'asset_id' :
                  model === 'categories' ? 'category_id' :
                  model === 'suppliers' ? 'supplier_id' :
                  model === 'maintenance_staff' ? 'staff_id' :
                  model === 'locations' ? 'location_id' :
                  model === 'buyers' ? 'buyer_id' :
                  model === 'assignments' ? 'assignment_id' :
                  model === 'maintenance' ? 'maintenance_id' :
                  model === 'disposals' ? 'disposal_id' :
                  model === 'asset_valuation' ? 'valuation_id' : null;
  
  if (!idField) return virtualData;
  
  const dataMap = new Map();
  
  // Add local data first
  for (const item of localData) {
    dataMap.set(item[idField], item);
  }
  
  // Override with virtual data (team changes take precedence)
  for (const item of virtualData) {
    dataMap.set(item[idField], item);
  }
  
  const result = Array.from(dataMap.values());
  
  // Cache the result
  dataCache.set(cacheKey, {
    data: result,
    timestamp: Date.now()
  });
  
  return result;
}

export {
  localPrisma,
  virtualPrisma,
  dualCreate,
  dualUpdate,
  dualDelete,
  syncVirtualToLocal,
  getMergedData
};
