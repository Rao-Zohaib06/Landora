import mongoose from 'mongoose';
import User from '../models/User.model.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const fixAgentApprovals = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all agents with status 'active' but approvedByAdmin is false or undefined
    const agentsToFix = await User.find({
      role: 'agent',
      status: 'active',
      $or: [
        { approvedByAdmin: false },
        { approvedByAdmin: { $exists: false } },
        { approvedByAdmin: null }
      ]
    });

    console.log(`\n📊 Found ${agentsToFix.length} agent(s) with active status but not marked as approved`);

    if (agentsToFix.length === 0) {
      console.log('✅ All active agents are already properly approved!');
      process.exit(0);
    }

    // Update each agent
    let updated = 0;
    for (const agent of agentsToFix) {
      console.log(`\n🔧 Fixing agent: ${agent.name} (${agent.email})`);
      console.log(`   Current status: ${agent.status}`);
      console.log(`   Current approvedByAdmin: ${agent.approvedByAdmin}`);
      
      agent.approvedByAdmin = true;
      agent.approvedAt = agent.approvedAt || new Date();
      
      await agent.save();
      updated++;
      
      console.log(`   ✅ Updated! Now approvedByAdmin: ${agent.approvedByAdmin}`);
    }

    console.log(`\n✅ Successfully updated ${updated} agent(s)!`);
    console.log('\n📋 Summary:');
    console.log(`   - Total agents checked: ${agentsToFix.length}`);
    console.log(`   - Successfully updated: ${updated}`);
    console.log(`   - All active agents can now access their dashboard`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    process.exit(0);
  }
};

// Run the script
fixAgentApprovals();
