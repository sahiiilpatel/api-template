'use strict'

const db = require('mongoose')
const Glob = require('glob')
db.Promise = require('bluebird')
let dbConn = null

exports.plugin = {
  async register(server, options) {
    try {
      db.plugin(this.addPaginationPlugin)
      dbConn = await db.createConnection(options.connections.db)

      dbConn.on('connected', () => {
        server.log(['mongoose', 'info', 'ignore'], 'dbConn Mongo Database connected')
      })

      dbConn.on('disconnected', () => {
        server.log(['mongoose', 'info', 'ignore'], 'dbConn Mongo Database disconnected')
      })
      server.decorate('server', 'DB', dbConn)
      process.on('SIGINT', async () => {
        await dbConn.close()
        server.log(
          ['mongoose', 'info'],
          'Mongo Database disconnected through app termination'
        )
        process.exit(0)
      })

      const models = Glob.sync('server/models/*.js')
      const landlordModels = Glob.sync('server/landlord/models/*.js')
      const allModels = [...models, ...landlordModels]
      allModels.forEach(model => {
        require(`${process.cwd()}/${model}`)
      })

    } catch (err) {
      console.log(err)
      throw err
    }
  },
  mainDbConn() {
    return dbConn
  },
  addPaginationPlugin(schema, options) {
    schema.statics.paginate = async function (pipeline, pageNumber = 1, pageSize = 15) {
      const skipAmount = (pageNumber - 1) * pageSize;

      try {
        let result = await this.aggregate([
          ...pipeline,
          {
            $facet: {
              list: [
                { "$skip": skipAmount },
                { "$limit": pageSize }
              ],
              totalCount: [{ $count: "total" }]
            },
          }

        ]).exec();


        if (!result || !result.length || !result[0].list || !result[0].list.length) {
          return {
            list: [],
            total: 0,
            from: 0,
            to: 0,
            hasMany: false
          };
        }

        result = result[0]
        result.totalCount = result.totalCount[0].total

        return {
          list: result.list,
          total: result.totalCount,
          from: skipAmount + 1,
          to: skipAmount + result.list.length,
          hasMany: skipAmount + result.list.length < result.totalCount
        };
      } catch (error) {
        console.log('error: ', error);
        throw error;
      }
    }
  },
  name: 'mongoose_connector',
  version: require('../../package.json').version
}
