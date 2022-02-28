const expect = require('chai').expect;
import chai from 'chai';
import chaihttp from 'chai-http';
chai.use(chaihttp);
require('dotenv').config();
const requests: $TSFixMe = [];
let app, request: $TSFixMe, sandbox: $TSFixMe;

describe('API limit rate', function() {
    this.timeout(10000);

    before(function(done: $TSFixMe) {
        import sinon from 'sinon';
        sandbox = sinon.createSandbox();
        sandbox
            .stub(process.env, 'RATE_LIMITTER_TIME_PERIOD_IN_MS')
            .value('5000');
        sandbox.stub(process.env, 'RATE_LIMITTER_REQUEST_LIMIT').value('3');
        sandbox.stub(process.env, 'RATE_LIMITTER_ENABLED').value('true');
        require('../server').close();
        delete require.cache[require.resolve('../server')];
        app = require('../server');

        request = chai.request.agent(app);
        done();
    });

    it('should get too many requests response after 3 requests', async function() {
        for (let i = 1; i <= 3; i++) {
            requests.push(request.get('/'));
        }
        await Promise.all(requests);
        const response = await request.get('/');
        expect(response.status).to.be.equal(429);
    });

    after(function(done: $TSFixMe) {
        sandbox.restore();
        done();
    });
});