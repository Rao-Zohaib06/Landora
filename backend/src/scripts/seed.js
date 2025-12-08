import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import User from '../models/User.model.js';
import Project from '../models/Project.model.js';
import Plot from '../models/Plot.model.js';
import CommissionRule from '../models/CommissionRule.model.js';
import Partner from '../models/Partner.model.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting seed process...');

    // Clear existing data (optional - comment out in production)
    // await User.deleteMany({});
    // await Project.deleteMany({});
    // await Plot.deleteMany({});
    // await CommissionRule.deleteMany({});
    // await Partner.deleteMany({});

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.findOneAndUpdate(
      { email: 'admin@landora.com' },
      {
        name: 'Admin User',
        email: 'admin@landora.com',
        phone: '+92 300 0000001',
        passwordHash: adminPassword,
        role: 'admin',
        status: 'active',
        profile: {
          cnic: '12345-1234567-1',
          address: 'Lahore, Pakistan',
          city: 'Lahore',
        },
      },
      { upsert: true, new: true }
    );
    console.log('✅ Admin user created:', admin.email);

    // Create Agent User
    const agentPassword = await bcrypt.hash('agent123', 10);
    const agent = await User.findOneAndUpdate(
      { email: 'agent@landora.com' },
      {
        name: 'Agent User',
        email: 'agent@landora.com',
        phone: '+92 300 0000002',
        passwordHash: agentPassword,
        role: 'agent',
        status: 'active',
        agentProfile: {
          licenseNumber: 'AG-001',
          agency: 'Landora Realty',
          experience: 5,
          specialization: ['Residential', 'Commercial'],
          commissionRate: 2.5,
        },
        profile: {
          cnic: '12345-1234567-2',
          address: 'Islamabad, Pakistan',
          city: 'Islamabad',
        },
      },
      { upsert: true, new: true }
    );
    console.log('✅ Agent user created:', agent.email);

    // Create Sample Project
    const project = await Project.findOneAndUpdate(
      { code: 'EE-PH2' },
      {
        name: 'Emerald Enclave Phase 2',
        code: 'EE-PH2',
        location: {
          city: 'Lahore',
          area: 'DHA Phase 5',
          address: 'Main Boulevard, DHA Phase 5, Lahore',
        },
        totalAreaMarla: 500,
        status: 'ongoing',
        details: {
          description: 'Premium residential project with modern amenities',
          features: ['Gated Community', '24/7 Security', 'Parks', 'Mosque'],
          amenities: ['Swimming Pool', 'Gym', 'Community Center'],
          developer: 'Landora Developers',
          approvalStatus: 'approved',
          approvalNumber: 'LDA-2024-001',
        },
        blocks: [
          { name: 'Block A', totalPlots: 100, availablePlots: 85 },
          { name: 'Block B', totalPlots: 100, availablePlots: 90 },
        ],
        pricing: {
          minPrice: 5000000,
          maxPrice: 50000000,
          pricePerMarla: 500000,
        },
        createdBy: admin._id,
      },
      { upsert: true, new: true }
    );
    console.log('✅ Project created:', project.name);

    // Create Sample Plots
    const plots = [];
    for (let i = 1; i <= 10; i++) {
      const plot = await Plot.findOneAndUpdate(
        { projectId: project._id, plotNo: `PL-${i.toString().padStart(3, '0')}` },
        {
          projectId: project._id,
          plotNo: `PL-${i.toString().padStart(3, '0')}`,
          sizeMarla: i % 2 === 0 ? 10 : 5,
          block: i <= 5 ? 'Block A' : 'Block B',
          phase: 'Phase 2',
          status: i <= 3 ? 'sold' : 'available',
          price: (i % 2 === 0 ? 10 : 5) * 500000,
          features: {
            corner: i % 3 === 0,
            parkFacing: i % 4 === 0,
            mainRoad: i % 5 === 0,
          },
        },
        { upsert: true, new: true }
      );
      plots.push(plot);
    }
    console.log(`✅ Created ${plots.length} plots`);

    // Create Commission Rules
    const commissionRules = [
      {
        projectId: project._id,
        plotSizeRange: { min: 0, max: 5 },
        type: 'percent',
        value: 2,
        active: true,
        priority: 1,
        description: '2% commission for plots up to 5 Marla',
      },
      {
        projectId: project._id,
        plotSizeRange: { min: 5, max: 10 },
        type: 'percent',
        value: 2.5,
        active: true,
        priority: 1,
        description: '2.5% commission for plots 5-10 Marla',
      },
      {
        projectId: project._id,
        plotSizeRange: { min: 10, max: Infinity },
        type: 'percent',
        value: 3,
        active: true,
        priority: 1,
        description: '3% commission for plots above 10 Marla',
      },
    ];

    for (const rule of commissionRules) {
      await CommissionRule.findOneAndUpdate(
        {
          projectId: rule.projectId,
          'plotSizeRange.min': rule.plotSizeRange.min,
          'plotSizeRange.max': rule.plotSizeRange.max,
        },
        { ...rule, createdBy: admin._id },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Created ${commissionRules.length} commission rules`);

    // Create Sample Partners
    const partners = [
      {
        name: 'Ahmed Khan',
        email: 'ahmed@partner.com',
        phone: '+92 300 0000101',
        sharePercent: 25,
        investmentAmount: 50000000,
        capitalInjected: 50000000,
        status: 'active',
      },
      {
        name: 'Sara Sheikh',
        email: 'sara@partner.com',
        phone: '+92 300 0000102',
        sharePercent: 15,
        investmentAmount: 30000000,
        capitalInjected: 30000000,
        status: 'active',
      },
    ];

    for (const partnerData of partners) {
      await Partner.findOneAndUpdate(
        { email: partnerData.email },
        partnerData,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Created ${partners.length} partners`);

    console.log('🎉 Seed process completed successfully!');
    console.log('\n📝 Default Login Credentials:');
    console.log('Admin: admin@landora.com / admin123');
    console.log('Agent: agent@landora.com / agent123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed process failed:', error);
    process.exit(1);
  }
};

seedData();

