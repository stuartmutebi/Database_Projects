import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from './generated/prisma/index.js';
import { dualCreate, dualUpdate, dualDelete, syncVirtualToLocal, getMergedData } from '../config/dual database config.js';

const app = express();
const PORT = process.env.PORT || 4000;
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Root route for convenience
app.get('/', (_req, res) => {
  res.send('API is running');
});

// Silence browser/.well-known probes to avoid noisy console errors
app.get('/.well-known/*', (_req, res) => {
  res.status(204).end();
});

// Example Users routes (adjust table/model name as needed after introspection)
app.get('/api/users', async (_req, res) => {
  try {
    const users = await getMergedData('users');
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const result = await dualCreate('users', req.body);
    if (result.success) {
      res.status(201).json(result.virtual || result.local);
    } else {
      res.status(400).json({ error: 'Failed to create user', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create user' });
  }
});

// (moved 404 handler to the bottom of the file, after all routes)

app.put('/api/users/:id', async (req, res) => {
  try {
    const result = await dualUpdate('users', { user_id: Number(req.params.id) }, req.body);
    if (result.success) {
      res.json(result.virtual || result.local);
    } else {
      res.status(400).json({ error: 'Failed to update user', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const result = await dualDelete('users', { user_id: Number(req.params.id) });
    if (result.success) {
      res.status(204).end();
    } else {
      res.status(400).json({ error: 'Failed to delete user', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete user' });
  }
});

// Assets CRUD
app.get('/api/assets', async (_req, res) => {
  try {
    const items = await getMergedData('assets');
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

app.post('/api/assets', async (req, res) => {
  try {
    const data = { ...req.body };
    // normalize empties to null
    for (const k of Object.keys(data)) {
      if (data[k] === '') data[k] = null;
    }
    if (!data.asset_name || String(data.asset_name).trim() === '') {
      return res.status(400).json({ error: 'asset_name is required' });
    }
    if (typeof data.purchase_cost !== 'undefined' && data.purchase_cost !== null) {
      data.purchase_cost = String(data.purchase_cost);
    }
    const result = await dualCreate('assets', data);
    if (result.success) {
      res.status(201).json(result.virtual || result.local);
    } else {
      res.status(400).json({ error: 'Failed to create asset', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create asset', detail: String(e.message || e) });
  }
});

app.put('/api/assets/:id', async (req, res) => {
  try {
    const data = { ...req.body };
    for (const k of Object.keys(data)) {
      if (data[k] === '') data[k] = null;
    }
    if (typeof data.purchase_cost !== 'undefined' && data.purchase_cost !== null) {
      data.purchase_cost = String(data.purchase_cost);
    }
    const result = await dualUpdate('assets', { asset_id: Number(req.params.id) }, data);
    if (result.success) {
      res.json(result.virtual || result.local);
    } else {
      res.status(400).json({ error: 'Failed to update asset', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update asset', detail: String(e.message || e) });
  }
});

app.delete('/api/assets/:id', async (req, res) => {
  try {
    const result = await dualDelete('assets', { asset_id: Number(req.params.id) });
    if (result.success) {
      res.status(204).end();
    } else {
      res.status(400).json({ error: 'Failed to delete asset', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete asset' });
  }
});

// Categories CRUD
app.get('/api/categories', async (_req, res) => {
  try {
    const rows = await getMergedData('categories', { include: { _count: { select: { assets: true } } } });
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});
app.post('/api/categories', async (req, res) => {
  try {
    // Only include valid fields for the database
    const { category_name, description, category_type } = req.body;
    const data = { 
      category_name, 
      description
    };
    // Only add category_type if the column exists (after migration)
    if (category_type) {
      data.category_type = category_type;
    }
    const result = await dualCreate('categories', data);
    if (result.success) {
      res.status(201).json(result.virtual || result.local);
    } else {
      console.error('Create category failed:', result.error);
      res.status(400).json({ error: 'Failed to create category', detail: result.error });
    }
  } catch (e) {
    console.error('Create category exception:', e);
    res.status(400).json({ error: 'Failed to create category', detail: e.message });
  }
});
app.put('/api/categories/:id', async (req, res) => {
  try {
    // Only include valid fields for the database
    const { category_name, description, category_type } = req.body;
    const data = { 
      category_name, 
      description
    };
    // Only add category_type if the column exists (after migration)
    if (category_type) {
      data.category_type = category_type;
    }
    const result = await dualUpdate('categories', { category_id: Number(req.params.id) }, data);
    if (result.success) {
      res.json(result.virtual || result.local);
    } else {
      console.error('Update category failed:', result.error);
      res.status(400).json({ error: 'Failed to update category', detail: result.error });
    }
  } catch (e) {
    console.error('Update category exception:', e);
    res.status(400).json({ error: 'Failed to update category', detail: e.message });
  }
});
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const result = await dualDelete('categories', { category_id: Number(req.params.id) });
    if (result.success) {
      res.status(204).end();
    } else {
      res.status(400).json({ error: 'Failed to delete category', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete category' });
  }
});

// Suppliers CRUD
app.get('/api/suppliers', async (_req, res) => {
  try {
    const rows = await getMergedData('suppliers');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});
app.post('/api/suppliers', async (req, res) => {
  try {
    const result = await dualCreate('suppliers', req.body);
    if (result.success) {
      res.status(201).json(result.virtual || result.local);
    } else {
      res.status(400).json({ error: 'Failed to create supplier', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create supplier' });
  }
});
app.put('/api/suppliers/:id', async (req, res) => {
  try {
    const result = await dualUpdate('suppliers', { supplier_id: Number(req.params.id) }, req.body);
    if (result.success) {
      res.json(result.virtual || result.local);
    } else {
      res.status(400).json({ error: 'Failed to update supplier', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update supplier' });
  }
});
app.delete('/api/suppliers/:id', async (req, res) => {
  try {
    const result = await dualDelete('suppliers', { supplier_id: Number(req.params.id) });
    if (result.success) {
      res.status(204).end();
    } else {
      res.status(400).json({ error: 'Failed to delete supplier', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete supplier' });
  }
});

// Maintenance Staff CRUD
app.get('/api/maintenance-staff', async (_req, res) => {
  try {
    const rows = await getMergedData('maintenance_staff');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch maintenance staff' });
  }
});
app.post('/api/maintenance-staff', async (req, res) => {
  try {
    const result = await dualCreate('maintenance_staff', req.body);
    if (result.success) {
      res.status(201).json(result.virtual || result.local);
    } else {
      res.status(400).json({ error: 'Failed to create maintenance staff', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create maintenance staff' });
  }
});
app.put('/api/maintenance-staff/:id', async (req, res) => {
  try {
    const result = await dualUpdate('maintenance_staff', { m_staff_id: Number(req.params.id) }, req.body);
    if (result.success) {
      res.json(result.virtual || result.local);
    } else {
      res.status(400).json({ error: 'Failed to update maintenance staff', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update maintenance staff' });
  }
});
app.delete('/api/maintenance-staff/:id', async (req, res) => {
  try {
    const result = await dualDelete('maintenance_staff', { m_staff_id: Number(req.params.id) });
    if (result.success) {
      res.status(204).end();
    } else {
      res.status(400).json({ error: 'Failed to delete maintenance staff', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete maintenance staff' });
  }
});

// Locations CRUD
app.get('/api/locations', async (_req, res) => {
  try {
    const rows = await getMergedData('locations');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});
app.post('/api/locations', async (req, res) => {
  try {
    const result = await dualCreate('locations', req.body);
    if (result.success) {
      res.status(201).json(result.virtual || result.local);
    } else {
      res.status(400).json({ error: 'Failed to create location', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create location' });
  }
});
app.put('/api/locations/:id', async (req, res) => {
  try {
    const result = await dualUpdate('locations', { location_id: Number(req.params.id) }, req.body);
    if (result.success) {
      res.json(result.virtual || result.local);
    } else {
      res.status(400).json({ error: 'Failed to update location', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update location' });
  }
});
app.delete('/api/locations/:id', async (req, res) => {
  try {
    const result = await dualDelete('locations', { location_id: Number(req.params.id) });
    if (result.success) {
      res.status(204).end();
    } else {
      res.status(400).json({ error: 'Failed to delete location', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete location' });
  }
});

// Buyers CRUD
app.get('/api/buyers', async (_req, res) => {
  try {
    const rows = await getMergedData('buyers');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch buyers' });
  }
});
app.post('/api/buyers', async (req, res) => {
  try {
    const result = await dualCreate('buyers', req.body);
    if (result.success) {
      res.status(201).json(result.virtual || result.local);
    } else {
      res.status(400).json({ error: 'Failed to create buyer', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create buyer' });
  }
});
app.put('/api/buyers/:id', async (req, res) => {
  try {
    const result = await dualUpdate('buyers', { buyer_id: Number(req.params.id) }, req.body);
    if (result.success) {
      res.json(result.virtual || result.local);
    } else {
      res.status(400).json({ error: 'Failed to update buyer', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update buyer' });
  }
});
app.delete('/api/buyers/:id', async (req, res) => {
  try {
    const result = await dualDelete('buyers', { buyer_id: Number(req.params.id) });
    if (result.success) {
      res.status(204).end();
    } else {
      res.status(400).json({ error: 'Failed to delete buyer', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete buyer' });
  }
});

// Assignments CRUD
app.get('/api/assignments', async (_req, res) => {
  try {
    const rows = await getMergedData('assignments');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});
app.post('/api/assignments', async (req, res) => {
  try {
    const result = await dualCreate('assignments', req.body);
    if (result.success) {
      res.status(201).json(result.virtual || result.local);
    } else {
      res.status(400).json({ error: 'Failed to create assignment', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create assignment' });
  }
});
app.put('/api/assignments/:id', async (req, res) => {
  try {
    const result = await dualUpdate('assignments', { assignment_id: Number(req.params.id) }, req.body);
    if (result.success) {
      res.json(result.virtual || result.local);
    } else {
      res.status(400).json({ error: 'Failed to update assignment', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update assignment' });
  }
});
app.delete('/api/assignments/:id', async (req, res) => {
  try {
    const result = await dualDelete('assignments', { assignment_id: Number(req.params.id) });
    if (result.success) {
      res.status(204).end();
    } else {
      res.status(400).json({ error: 'Failed to delete assignment', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete assignment' });
  }
});

// Maintenance CRUD
app.get('/api/maintenance', async (_req, res) => {
  try {
    const rows = await getMergedData('maintenance');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch maintenance' });
  }
});
app.post('/api/maintenance', async (req, res) => {
  try {
    const result = await dualCreate('maintenance', req.body);
    if (result.success) {
      res.status(201).json(result.virtual || result.local);
    } else {
      res.status(400).json({ error: 'Failed to create maintenance', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create maintenance' });
  }
});
app.put('/api/maintenance/:id', async (req, res) => {
  try {
    const result = await dualUpdate('maintenance', { maintenance_id: Number(req.params.id) }, req.body);
    if (result.success) {
      res.json(result.virtual || result.local);
    } else {
      res.status(400).json({ error: 'Failed to update maintenance', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update maintenance' });
  }
});
app.delete('/api/maintenance/:id', async (req, res) => {
  try {
    const result = await dualDelete('maintenance', { maintenance_id: Number(req.params.id) });
    if (result.success) {
      res.status(204).end();
    } else {
      res.status(400).json({ error: 'Failed to delete maintenance', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete maintenance' });
  }
});

// Disposals CRUD
app.get('/api/disposals', async (_req, res) => {
  try {
    const rows = await getMergedData('disposals');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch disposals' });
  }
});
app.post('/api/disposals', async (req, res) => {
  try {
    const result = await dualCreate('disposals', req.body);
    if (result.success) {
      res.status(201).json(result.virtual || result.local);
    } else {
      res.status(400).json({ error: 'Failed to create disposal', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create disposal' });
  }
});
app.put('/api/disposals/:id', async (req, res) => {
  try {
    const result = await dualUpdate('disposals', { disposal_id: Number(req.params.id) }, req.body);
    if (result.success) {
      res.json(result.virtual || result.local);
    } else {
      res.status(400).json({ error: 'Failed to update disposal', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update disposal' });
  }
});
app.delete('/api/disposals/:id', async (req, res) => {
  try {
    const result = await dualDelete('disposals', { disposal_id: Number(req.params.id) });
    if (result.success) {
      res.status(204).end();
    } else {
      res.status(400).json({ error: 'Failed to delete disposal', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete disposal' });
  }
});

// Asset valuation CRUD
app.get('/api/valuations', async (_req, res) => {
  try {
    const rows = await getMergedData('asset_valuation');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch valuations' });
  }
});
app.post('/api/valuations', async (req, res) => {
  try {
    const result = await dualCreate('asset_valuation', req.body);
    if (result.success) {
      res.status(201).json(result.virtual || result.local);
    } else {
      res.status(400).json({ error: 'Failed to create valuation', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create valuation' });
  }
});
app.put('/api/valuations/:id', async (req, res) => {
  try {
    const result = await dualUpdate('asset_valuation', { valuation_id: Number(req.params.id) }, req.body);
    if (result.success) {
      res.json(result.virtual || result.local);
    } else {
      res.status(400).json({ error: 'Failed to update valuation', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update valuation' });
  }
});
app.delete('/api/valuations/:id', async (req, res) => {
  try {
    const result = await dualDelete('asset_valuation', { valuation_id: Number(req.params.id) });
    if (result.success) {
      res.status(204).end();
    } else {
      res.status(400).json({ error: 'Failed to delete valuation', detail: result.error });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete valuation' });
  }
});

// Reports API - Real-time data analytics
app.get('/api/reports/dashboard', async (_req, res) => {
  try {
    const [assets, users, categories, suppliers, maintenance, disposals, assignments, valuations] = await Promise.all([
      getMergedData('assets'),
      getMergedData('users'),
      getMergedData('categories'),
      getMergedData('suppliers'),
      getMergedData('maintenance'),
      getMergedData('disposals'),
      getMergedData('assignments'),
      getMergedData('asset_valuation')
    ]);

    // Asset statistics by category
    const assetsByCategory = categories.map(cat => ({
      name: cat.category_name,
      count: assets.filter(a => a.category_id === cat.category_id).length,
      value: assets.filter(a => a.category_id === cat.category_id)
        .reduce((sum, a) => sum + (Number(a.purchase_price) || 0), 0)
    }));

    // Asset statistics by location
    const assetsByLocation = await getMergedData('locations').then(locations =>
      locations.map(loc => ({
        name: loc.location_name,
        count: assets.filter(a => a.location_id === loc.location_id).length
      }))
    );

    // Asset status distribution
    const assetsByStatus = [
      { status: 'Active', count: assets.filter(a => a.status === 'Active').length },
      { status: 'Inactive', count: assets.filter(a => a.status === 'Inactive').length },
      { status: 'Under Maintenance', count: assets.filter(a => a.status === 'Under Maintenance').length },
      { status: 'Disposed', count: assets.filter(a => a.status === 'Disposed').length }
    ];

    // Maintenance statistics
    const maintenanceStats = {
      total: maintenance.length,
      pending: maintenance.filter(m => m.status === 'Pending').length,
      inProgress: maintenance.filter(m => m.status === 'In Progress').length,
      completed: maintenance.filter(m => m.status === 'Completed').length,
      totalCost: maintenance.reduce((sum, m) => sum + (Number(m.cost) || 0), 0)
    };

    // Top suppliers by asset count
    const topSuppliers = suppliers.map(sup => ({
      name: sup.supplier_name,
      assetCount: assets.filter(a => a.supplier_id === sup.supplier_id).length,
      totalValue: assets.filter(a => a.supplier_id === sup.supplier_id)
        .reduce((sum, a) => sum + (Number(a.purchase_price) || 0), 0)
    })).sort((a, b) => b.assetCount - a.assetCount).slice(0, 10);

    // Asset value trends (by purchase year)
    const assetValueByYear = {};
    assets.forEach(asset => {
      if (asset.purchase_date) {
        const year = new Date(asset.purchase_date).getFullYear();
        if (!assetValueByYear[year]) {
          assetValueByYear[year] = { year, count: 0, value: 0 };
        }
        assetValueByYear[year].count++;
        assetValueByYear[year].value += Number(asset.purchase_price) || 0;
      }
    });
    const valueByYear = Object.values(assetValueByYear).sort((a, b) => a.year - b.year);

    // Disposal statistics
    const disposalStats = {
      total: disposals.length,
      totalValue: disposals.reduce((sum, d) => sum + (Number(d.disposal_value) || 0), 0),
      byMethod: disposals.reduce((acc, d) => {
        const method = d.disposal_method || 'Unknown';
        acc[method] = (acc[method] || 0) + 1;
        return acc;
      }, {})
    };

    // Assignment statistics
    const assignmentStats = {
      total: assignments.length,
      activeUsers: new Set(assignments.map(a => a.user_id)).size,
      assignedAssets: new Set(assignments.map(a => a.asset_id)).size
    };

    // Valuation statistics
    const valuationStats = {
      total: valuations.length,
      totalCurrentValue: valuations.reduce((sum, v) => sum + (Number(v.current_value) || 0), 0),
      averageDepreciation: valuations.length > 0 
        ? valuations.reduce((sum, v) => {
            const original = Number(v.original_value) || 0;
            const current = Number(v.current_value) || 0;
            return sum + (original > 0 ? ((original - current) / original) * 100 : 0);
          }, 0) / valuations.length
        : 0
    };

    res.json({
      summary: {
        totalAssets: assets.length,
        totalUsers: users.length,
        totalCategories: categories.length,
        totalSuppliers: suppliers.length,
        totalValue: assets.reduce((sum, a) => sum + (Number(a.purchase_price) || 0), 0)
      },
      assetsByCategory,
      assetsByLocation,
      assetsByStatus,
      maintenanceStats,
      topSuppliers,
      valueByYear,
      disposalStats,
      assignmentStats,
      valuationStats
    });
  } catch (e) {
    console.error('Reports error:', e);
    res.status(500).json({ error: 'Failed to generate reports' });
  }
});

// Fallback 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  
  // Automatically sync virtual to local on server start
  syncVirtualToLocal().then(() => {
    console.log('Initial sync from virtual to local complete.');
  }).catch(err => {
    console.error('Initial sync failed:', err);
  });
  
  // Set up periodic sync every 30 seconds (only for primary laptop)
  const SYNC_INTERVAL = 30000; // 30 seconds
  setInterval(() => {
    syncVirtualToLocal().catch(err => {
      console.error('Periodic sync failed:', err);
    });
  }, SYNC_INTERVAL);
  
  console.log(`🔄 Periodic sync enabled (every ${SYNC_INTERVAL / 1000} seconds)`);
});
