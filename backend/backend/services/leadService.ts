export default {
    //Description: Create new project for user.
    //Params:
    //Param 1: projectName: Project name.
    //Param 2: projectId: Project Id present in req.params.
    //Param 3: userId: User Id.
    //Returns: promise
    create: async function(data: $TSFixMe) {
        let lead = new LeadsModel();

        lead.type = data.type;

        lead.name = data.name;

        lead.email = data.email;

        lead.phone = data.phone;

        lead.website = data.website;

        lead.companySize = data.companySize;

        lead.country = data.country;

        lead.message = data.message;

        lead.whitepaperName = data.whitepaperName;

        lead.source = data.source;

        lead.templateName = 'Request Demo';
        if (data.whitepaperName) {
            lead.templateName = 'Whitepaper Request';
        }

        lead = await lead.save();
        try {
            MailService.sendLeadEmailToOneUptimeTeam(lead);
            if (data.type) {
                if (data.type === 'demo') {
                    MailService.sendRequestDemoEmail(data.email);
                }

                if (data.type === 'whitepaper') {
                    MailService.sendWhitepaperEmail(
                        data.email,
                        data.whitepaperName
                    ); //whitepaper name should be stored in moreInfo.
                }
            }
        } catch (error) {
            ErrorService.log('leadService.create', error);
        }
        AirtableService.logLeads({
            name: data.name,
            email: data.email,
            phone: data.phone,
            country: data.country,
            message: data.message,
            website: data.website,
            source: data.source,
            volume: data.companySize,
            type: data.type,
        });
        return lead;
    },

    hardDeleteBy: async function(query: $TSFixMe) {
        await LeadsModel.deleteMany(query);
        return 'Lead(s) Removed Successfully!';
    },
};

import LeadsModel from '../models/lead';
import MailService from './mailService';
import ErrorService from 'common-server/utils/error';
import AirtableService from './airtableService';