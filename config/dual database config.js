const { PrismaClient } = require('@prisma/client');

// Create two Prisma clients for both databases
const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.LOCAL_DB_URL || "mysql://root:password123@localhost:3307/assets_app_db"
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
    console.log(`Dual creating in ${model}:`, data);
    
    const [localResult, virtualResult] = await Promise.all([
      localPrisma[model].create({ data }),
      virtualPrisma[model].create({ data })
    ]);
    
    console.log('Dual create successful');
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
    const [localResult, virtualResult] = await Promise.all([
      localPrisma[model].update({ where, data }),
      virtualPrisma[model].update({ where, data })
    ]);
    
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
    const [localResult, virtualResult] = await Promise.all([
      localPrisma[model].delete({ where }),
      virtualPrisma[model].delete({ where })
    ]);
    
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

module.exports = {
  localPrisma,
  virtualPrisma,
  dualCreate,
  dualUpdate,
  dualDelete
};