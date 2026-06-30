const mongoose = require('mongoose');
const { logInfo, logError } = require('../utils/logger');
const { processSingleSale } = require('../controllers/saleController');
const Sale = require('../models/Sale');

/**
 * Processes offline bulk sync payload from POS PWA
 * @param {Array} bills Array of sale objects stored offline
 * @param {ObjectId} shopId The active shop ID
 * @param {ObjectId} userId The cashier who pushed the sync
 */
const processOfflineSync = async (bills, shopId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    logInfo(`Starting offline sync for shop ${shopId} with ${bills.length} bills.`);
    let successCount = 0;
    
    for (const bill of bills) {
      // 2. Check if invoiceNumber already exists to prevent duplicate syncs
      const exists = await Sale.findOne({ invoiceNumber: bill.invoiceNumber, shopId }).session(session);
      if (exists) {
        logInfo(`Skipping duplicate bill ${bill.invoiceNumber}`);
        continue; // Skip, it was already synced
      }

      bill.isOfflineSynced = true;
      
      // Process sale (Stock decrease, Profit calc, Customer due)
      await processSingleSale(bill, shopId, userId, session);
      successCount++;
    }
    
    await session.commitTransaction();
    session.endSession();
    return { success: true, message: `Successfully synced ${successCount} out of ${bills.length} bills.` };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logError('Offline Sync Failed', error);
    throw error;
  }
};

module.exports = {
  processOfflineSync
};
