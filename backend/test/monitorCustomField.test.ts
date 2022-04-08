process.env['PORT'] = 3020;

process.env['IS_SAAS_SERVICE'] = true;
import chai from 'chai';
const expect = chai.expect;
import userData from './data/user';
import app from '../server';
import chaihttp from 'chai-http';
chai.use(chaihttp);

const request = chai.request.agent(app);
import GlobalConfig from './utils/globalConfig';

import { createUser } from './utils/userSignUp';
import VerificationTokenModel from '../backend/models/verificationToken';
import AirtableService from '../backend/services/airtableService';
import UserService from '../backend/services/userService';
import ProjectService from '../backend/services/projectService';
import ComponentService from '../backend/services/componentService';
import MonitorCustomFieldService from '../backend/services/monitorCustomField';

describe('Monitor Custom Field API', function () {
    const timeout = 30000;
    let projectId: string,
        userId,
        token,
        authorization: $TSFixMe,
        monitorCustomFieldId: $TSFixMe;

    const monitorFieldText = {
            fieldName: 'textField',
            fieldType: 'text',
        },
        monitorFieldNumber = {
            fieldName: 'numField',
            fieldType: 'number',
        };

    this.timeout(timeout);

    before(function (done: $TSFixMe) {
        GlobalConfig.initTestConfig().then(function () {
            createUser(
                request,
                userData.user,
                function (err: $TSFixMe, res: $TSFixMe) {
                    const project = res.body.project;
                    projectId = project._id;
                    userId = res.body.id;

                    VerificationTokenModel.findOne(
                        { userId },
                        function (err: $TSFixMe, verificationToken: $TSFixMe) {
                            request
                                .get(
                                    `/user/confirmation/${verificationToken.token}`
                                )
                                .redirects(0)
                                .end(function () {
                                    request
                                        .post('/user/login')
                                        .send({
                                            email: userData.user.email,
                                            password: userData.user.password,
                                        })
                                        .end(function (
                                            err: $TSFixMe,
                                            res: $TSFixMe
                                        ) {
                                            token =
                                                res.body.tokens.jwtAccessToken;
                                            authorization = `Basic ${token}`;
                                            done();
                                        });
                                });
                        }
                    );
                }
            );
        });
    });

    after(async function () {
        await GlobalConfig.removeTestConfig();
        await ProjectService.hardDeleteBy({ _id: projectId });
        await UserService.hardDeleteBy({
            email: userData.user.email.toLowerCase(),
        });
        await ComponentService.hardDeleteBy({ projectId });
        await MonitorCustomFieldService.hardDeleteBy({ projectId });
        await AirtableService.deleteAll({ tableName: 'User' });
    });

    it('should not create a monitor custom field when field name is missing or not specified', function (done: $TSFixMe) {
        request
            .post(`/monitorCustomField/${projectId}`)
            .send({ fieldType: 'text' })
            .set('Authorization', authorization)
            .end(function (err: $TSFixMe, res: $TSFixMe) {
                expect(res).to.have.status(400);
                expect(res.body.message).to.be.equal('Field name is required');
                done();
            });
    });

    it('should not create a monitor custom field when field type is missing or not specified', function (done: $TSFixMe) {
        request
            .post(`/monitorCustomField/${projectId}`)
            .send({ fieldName: 'missingType' })
            .set('Authorization', authorization)
            .end(function (err: $TSFixMe, res: $TSFixMe) {
                expect(res).to.have.status(400);
                expect(res.body.message).to.be.equal('Field type is required');
                done();
            });
    });

    it('should setup custom fields for all monitors in a project (text)', function (done: $TSFixMe) {
        request
            .post(`/monitorCustomField/${projectId}`)
            .send(monitorFieldText)
            .set('Authorization', authorization)
            .end(function (err: $TSFixMe, res: $TSFixMe) {
                monitorCustomFieldId = res.body._id;
                expect(res).to.have.status(200);
                expect(res.body.fieldName).to.be.equal(
                    monitorFieldText.fieldName
                );
                done();
            });
    });

    it('should not create monitor custom field with an existing name in a project', function (done: $TSFixMe) {
        request
            .post(`/monitorCustomField/${projectId}`)
            .send(monitorFieldText)
            .set('Authorization', authorization)
            .end(function (err: $TSFixMe, res: $TSFixMe) {
                expect(res).to.have.status(400);
                expect(res.body.message).to.be.equal(
                    'Custom field with this name already exist'
                );
                done();
            });
    });

    it('should update a particular monitor custom field in a project', function (done: $TSFixMe) {
        monitorFieldText.fieldName = 'newName';

        request
            .put(`/monitorCustomField/${projectId}/${monitorCustomFieldId}`)
            .send(monitorFieldText)
            .set('Authorization', authorization)
            .end(function (err: $TSFixMe, res: $TSFixMe) {
                expect(res).to.have.status(200);
                expect(res.body.fieldName).to.be.equal(
                    monitorFieldText.fieldName
                );
                expect(String(res.body._id)).to.be.equal(
                    String(monitorCustomFieldId)
                );
                done();
            });
    });

    it('should list all the monitor custom fields in a project', function (done: $TSFixMe) {
        // add one more monitor custom field
        request
            .post(`/monitorCustomField/${projectId}`)
            .send(monitorFieldNumber)
            .set('Authorization', authorization)
            .end(function () {
                request
                    .get(`/monitorCustomField/${projectId}?skip=0&limit=10`)
                    .set('Authorization', authorization)
                    .end(function (err: $TSFixMe, res: $TSFixMe) {
                        expect(res).to.have.status(200);
                        expect(res.body.count).to.be.equal(2);
                        expect(res.body.data).to.be.an('array');
                        done();
                    });
            });
    });

    it('should delete a particular monitor custom field in a project', function (done: $TSFixMe) {
        request
            .delete(`/monitorCustomField/${projectId}/${monitorCustomFieldId}`)
            .set('Authorization', authorization)
            .end(function (err: $TSFixMe, res: $TSFixMe) {
                expect(res).to.have.status(200);
                expect(String(res.body._id)).to.be.equal(
                    String(monitorCustomFieldId)
                );
                done();
            });
    });
});