const Business = require('../models/Business');
const { MESSAGES } = require('../constants');

class BusinessService {
    static async createBusiness(fein, name, userId) {
        const business = new Business({ fein, name, user: userId });
        await business.save();
        return business;
    }

    static async progressBusiness(id, industry, contact, result) {
        const business = await Business.findById(id);

        if (!business) {
            throw new Error(MESSAGES.BUSINESS_NOT_FOUND);
        }

        switch (business.status) {
            case 'New':
                return this.handleNewStage(business, industry);
            case 'Market Approved':
                return this.handleMarketApprovedStage(business, contact);
            case 'Sales Approved':
                return this.handleSalesApprovedStage(business, result);
            default:
                return { business, nextStep: null, message: MESSAGES.NO_FURTHER_STEPS };
        }
    }

    static async handleNewStage(business, industry) {
        if (!industry || !['restaurants', 'stores'].includes(industry)) {
            business.status = 'Market Declined';
            await business.save();
            return { business, nextStep: null, message: MESSAGES.BUSINESS_DECLINED };
        } else {
            business.industry = industry;
            business.status = 'Market Approved';
            await business.save();
            return { business, nextStep: MESSAGES.PROVIDE_CONTACT_INFO, requiredFields: ['contact.name', 'contact.phone'] };
        }
    }

    static async handleMarketApprovedStage(business, contact) {
        if (!contact || !contact.name || !contact.phone) {
            throw new Error(MESSAGES.VALID_CONTACT_REQUIRED);
        } else {
            business.contact = contact;
            business.status = 'Sales Approved';
            await business.save();
            return { business, nextStep: MESSAGES.DECIDE_WON_OR_LOST, requiredFields: ['result (Won or Lost)'] };
        }
    }

    static async handleSalesApprovedStage(business, result) {
        if (!result || !['Won', 'Lost'].includes(result)) {
            throw new Error(MESSAGES.RESULT_REQUIRED);
        }
        business.status = result;
        await business.save();
        return { business, nextStep: null, message: MESSAGES.BUSINESS_MARKED(result) };
    }
}

module.exports = BusinessService;
