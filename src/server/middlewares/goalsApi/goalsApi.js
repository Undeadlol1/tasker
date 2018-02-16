import { Router } from 'express'
import generateUuid from 'uuid/v4'
import { Goals } from 'server/data/models'
import { mustLogin } from 'server/services/permissions'

const limit = 12

export default Router()

  // get all goals
  .get('/:page?', async (req, res) => {
    try {
      const page = req.params.page,
            totalGoalss = await Goals.count(),
            offset = page ? limit * (page - 1) : 0,
            totalPages = Math.ceil(totalGoalss / limit),
            values = await Goals.findAll({limit, offset})
      res.json({ values, totalPages, currentPage: page || 1 })
    }
    catch (error) {
      console.log(error);
      res.status(500).end(error)
    }
  })

  // get single goal
  .get('/goal/:id', async ({params}, res) => {
    try {
      res.json(
        await Goals.findById(params.id)
      )
    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })

  // update goal
  .put('/:goalId', mustLogin, async ({user, body, params}, res) => {
    try {
      const goal = await Goals.findById(params.goalId)

      // check permissions
      if (!goal) return res.status(204).end()
      if (goal.UserId != user.id) res.status(401).end()
      else res.json(await goal.update(body))

    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })

  // create goal
  .post('/', mustLogin, async ({user, body}, res) => {
    try {
      const UserId = user.id
      res.json(
        await Goals.create({...body, UserId})
      )
    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })

  // delete goal
  .delete('/:id', mustLogin, async ({user, body, params}, res) => {
    try {
      const goal = await Goals.findById(params.id)
      // document was not found
      if (!goal) return res.status(204).end()
      // user must be documents owner to delete it
      if (goal && goal.UserId == user.id) {
        await goal.destroy()
        await res.status(200).end()
      }
      else res.boom.unauthorized('You must be the owner to delete this')
    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })