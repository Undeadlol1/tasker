import 'babel-polyfill'
import slugify from 'slug'
import request from 'supertest'
import server from 'server/server'
import chai, { assert, expect } from 'chai'
import users from 'server/data/fixtures/users'
import { Goals, User } from 'server/data/models'
import { loginUser } from 'server/test/middlewares/authApi.test'
chai.should();
chai.use(require('chai-properties'))

const   agent = request.agent(server),
        username = users[0].username,
        password = users[0].password,
        name = "random name",
        slug = slugify(name),
        where = {where: {name}, raw: true}

export default describe('/goals API', function() {

    // Kill supertest server in watch mode to avoid errors
    before(() => server.close())

    // clean up
    after(async () => await Goals.destroy({where: {name}}))

    // POST test is intentionally first
    // because other tests rely on created goal
    it('POST goal', async () => {
        const user = await loginUser(username, password)
        await user.post('/api/goals')
            .send({ name })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(({body}) => {
                body.name.should.be.equal(name)
            })
    })

    it('GET goals', async () => {
        await agent
            .get('/api/goals')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(({body}) => {
                body.values.should.be.a('array')
                body.values.should.be.a('array')
            })
    })

    it('GET single goal', async () => {
        const goal = await Goals.findOne(where)
        await agent
            .get('/api/goals/goal/' + goal.id )
            .expect(200)
            .expect('Content-Type', /json/)
            .then(({body}) => {
                body.name.should.be.equal(name)
            })
    })

    it('PUT goal', async () => {
        const user = await loginUser(username, password)
        const goal = await Goals.findOne(where)
        const payload = {name: 'some name'}
        await user.put('/api/goals/' + goal.id)
            .send(payload)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(({body}) => {
                expect(body).to.have.properties(payload)
            })
    })

    it('DELETE goal', async () => {
        const goal = await Goals.findOne({order: 'rand()'})
        assert.isNotNull(
            goal,
            'document does not exist before DELETE'
        )
        const user = await loginUser(username, password)
        await user
            .delete('/api/goals/' + goal.id)
            .expect(200)
        await assert.isNull(
            await Goals.findById(goal.id),
            'document was not deleted'
        )
    })

    it('fail to POST if not authorized', async () => {
        await agent.post('/api/goals').expect(401)
    })

    it('fail to PUT if not authorized', async () => {
        await agent.put('/api/goals/someId').expect(401)
    })

    it('fail to DELETE if not authorized', async () => {
        await agent.delete('/api/goals/someId').expect(401)
    })

})