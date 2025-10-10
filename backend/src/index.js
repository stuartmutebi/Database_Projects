import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from './generated/prisma/index.js';

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
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const created = await prisma.users.create({ data: req.body });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create user' });
  }
});

// (moved 404 handler to the bottom of the file, after all routes)

app.put('/api/users/:id', async (req, res) => {
  try {
    const updated = await prisma.users.update({ where: { user_id: Number(req.params.id) }, data: req.body });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await prisma.users.delete({ where: { user_id: Number(req.params.id) } });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete user' });
  }
});

// Assets CRUD
app.get('/api/assets', async (_req, res) => {
  try {
    const items = await prisma.assets.findMany();
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
    const created = await prisma.assets.create({ data });
    res.status(201).json(created);
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
    const updated = await prisma.assets.update({ where: { asset_id: Number(req.params.id) }, data });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update asset', detail: String(e.message || e) });
  }
});

app.delete('/api/assets/:id', async (req, res) => {
  try {
    await prisma.assets.delete({ where: { asset_id: Number(req.params.id) } });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete asset' });
  }
});

// Categories CRUD
app.get('/api/categories', async (_req, res) => {
  try {
    const rows = await prisma.categories.findMany({
      include: { _count: { select: { assets: true } } },
    });
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});
app.post('/api/categories', async (req, res) => {
  try {
    const created = await prisma.categories.create({ data: req.body });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create category' });
  }
});
app.put('/api/categories/:id', async (req, res) => {
  try {
    const updated = await prisma.categories.update({ where: { category_id: Number(req.params.id) }, data: req.body });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update category' });
  }
});
app.delete('/api/categories/:id', async (req, res) => {
  try {
    await prisma.categories.delete({ where: { category_id: Number(req.params.id) } });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete category' });
  }
});

// Suppliers CRUD
app.get('/api/suppliers', async (_req, res) => {
  try {
    const rows = await prisma.suppliers.findMany();
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});
app.post('/api/suppliers', async (req, res) => {
  try {
    const created = await prisma.suppliers.create({ data: req.body });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create supplier' });
  }
});
app.put('/api/suppliers/:id', async (req, res) => {
  try {
    const updated = await prisma.suppliers.update({ where: { supplier_id: Number(req.params.id) }, data: req.body });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update supplier' });
  }
});
app.delete('/api/suppliers/:id', async (req, res) => {
  try {
    await prisma.suppliers.delete({ where: { supplier_id: Number(req.params.id) } });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete supplier' });
  }
});

// Maintenance Staff CRUD
app.get('/api/maintenance-staff', async (_req, res) => {
  try {
    const rows = await prisma.maintenance_staff.findMany();
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch maintenance staff' });
  }
});
app.post('/api/maintenance-staff', async (req, res) => {
  try {
    const created = await prisma.maintenance_staff.create({ data: req.body });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create maintenance staff' });
  }
});
app.put('/api/maintenance-staff/:id', async (req, res) => {
  try {
    const updated = await prisma.maintenance_staff.update({ where: { m_staff_id: Number(req.params.id) }, data: req.body });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update maintenance staff' });
  }
});
app.delete('/api/maintenance-staff/:id', async (req, res) => {
  try {
    await prisma.maintenance_staff.delete({ where: { m_staff_id: Number(req.params.id) } });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete maintenance staff' });
  }
});

// Locations CRUD
app.get('/api/locations', async (_req, res) => {
  try {
    const rows = await prisma.locations.findMany();
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});
app.post('/api/locations', async (req, res) => {
  try {
    const created = await prisma.locations.create({ data: req.body });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create location' });
  }
});
app.put('/api/locations/:id', async (req, res) => {
  try {
    const updated = await prisma.locations.update({ where: { location_id: Number(req.params.id) }, data: req.body });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update location' });
  }
});
app.delete('/api/locations/:id', async (req, res) => {
  try {
    await prisma.locations.delete({ where: { location_id: Number(req.params.id) } });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete location' });
  }
});

// Buyers CRUD
app.get('/api/buyers', async (_req, res) => {
  try {
    const rows = await prisma.buyers.findMany();
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch buyers' });
  }
});
app.post('/api/buyers', async (req, res) => {
  try {
    const created = await prisma.buyers.create({ data: req.body });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create buyer' });
  }
});
app.put('/api/buyers/:id', async (req, res) => {
  try {
    const updated = await prisma.buyers.update({ where: { buyer_id: Number(req.params.id) }, data: req.body });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update buyer' });
  }
});
app.delete('/api/buyers/:id', async (req, res) => {
  try {
    await prisma.buyers.delete({ where: { buyer_id: Number(req.params.id) } });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete buyer' });
  }
});

// Assignments CRUD
app.get('/api/assignments', async (_req, res) => {
  try {
    const rows = await prisma.assignments.findMany();
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});
app.post('/api/assignments', async (req, res) => {
  try {
    const created = await prisma.assignments.create({ data: req.body });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create assignment' });
  }
});
app.put('/api/assignments/:id', async (req, res) => {
  try {
    const updated = await prisma.assignments.update({ where: { assignment_id: Number(req.params.id) }, data: req.body });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update assignment' });
  }
});
app.delete('/api/assignments/:id', async (req, res) => {
  try {
    await prisma.assignments.delete({ where: { assignment_id: Number(req.params.id) } });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete assignment' });
  }
});

// Maintenance CRUD
app.get('/api/maintenance', async (_req, res) => {
  try {
    const rows = await prisma.maintenance.findMany();
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch maintenance' });
  }
});
app.post('/api/maintenance', async (req, res) => {
  try {
    const created = await prisma.maintenance.create({ data: req.body });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create maintenance' });
  }
});
app.put('/api/maintenance/:id', async (req, res) => {
  try {
    const updated = await prisma.maintenance.update({ where: { maintenance_id: Number(req.params.id) }, data: req.body });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update maintenance' });
  }
});
app.delete('/api/maintenance/:id', async (req, res) => {
  try {
    await prisma.maintenance.delete({ where: { maintenance_id: Number(req.params.id) } });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete maintenance' });
  }
});

// Disposals CRUD
app.get('/api/disposals', async (_req, res) => {
  try {
    const rows = await prisma.disposals.findMany();
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch disposals' });
  }
});
app.post('/api/disposals', async (req, res) => {
  try {
    const created = await prisma.disposals.create({ data: req.body });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create disposal' });
  }
});
app.put('/api/disposals/:id', async (req, res) => {
  try {
    const updated = await prisma.disposals.update({ where: { disposal_id: Number(req.params.id) }, data: req.body });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update disposal' });
  }
});
app.delete('/api/disposals/:id', async (req, res) => {
  try {
    await prisma.disposals.delete({ where: { disposal_id: Number(req.params.id) } });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete disposal' });
  }
});

// Asset valuation CRUD
app.get('/api/valuations', async (_req, res) => {
  try {
    const rows = await prisma.asset_valuation.findMany();
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch valuations' });
  }
});
app.post('/api/valuations', async (req, res) => {
  try {
    const created = await prisma.asset_valuation.create({ data: req.body });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create valuation' });
  }
});
app.put('/api/valuations/:id', async (req, res) => {
  try {
    const updated = await prisma.asset_valuation.update({ where: { valuation_id: Number(req.params.id) }, data: req.body });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update valuation' });
  }
});
app.delete('/api/valuations/:id', async (req, res) => {
  try {
    await prisma.asset_valuation.delete({ where: { valuation_id: Number(req.params.id) } });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete valuation' });
  }
});

// Fallback 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
