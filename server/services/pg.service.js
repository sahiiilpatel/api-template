'use strict'

const Joi = require('joi')
const Boom = require('@hapi/boom')
Joi.objectId = require('joi-objectid')(Joi)
const ObjectId = require('mongodb').ObjectId
const helper = require('@utilities/helper')
const Schmervice = require('@hapipal/schmervice')
const errorHelper = require('@utilities/error-helper')

const PgModel = require('@models/pg.model').schema

module.exports = class PgService extends Schmervice.Service {

  async getPgList(request) {
    try {
      const { query, auth: { credentials: { user } } } = request;

      const role = ["superadmin", "pgowner"];
      if (!role.includes(user.role)) errorHelper.handleError(Boom.badRequest("Access denied"))
      let Obj = { deleted: { $ne: true } }

      if (query.pgType) Obj['pgType'] = query.pgType

      let aggregation = [{ $match: Obj }];

      if (query.search) {
        const searchableFields = ["pgName", "pgType", "description"];
        aggregation.push(...helper.searchQuery(query, searchableFields));
      }

      const countQuery = [
        ...aggregation,
        {
          $count: "total",
        },
      ];

      console.log('query: sasdasd', query);
      let paginationData = helper.paginationQuery(query);
      aggregation.push(...paginationData.pagination);

      if (query.orderBy && query.isAsc !== null && query.isAsc !== undefined) {
        const sortStage = { $sort: {} };
        sortStage.$sort[query.orderBy] = query.isAsc ? 1 : -1;
        aggregation.push(sortStage);
      } else {
        aggregation.push({ $sort: { createdAt: -1 } });
      }

      const results = await PgModel.aggregate([
        {
          $facet: {
            PgList: aggregation,
            totalResult: countQuery,
          },
        },
      ]);
      const { PgList, totalResult } = results[0];

      const totalPgData = totalResult[0] ? totalResult[0].total : 0;
      let hasMany = false;

      if (query.limit) {
        if (paginationData.skip + PgList.length >= totalPgData) {
          hasMany = false;
        } else {
          hasMany = true;
        }
      }
      let PgData = {
        list: PgList,
        count: PgList.length,
        total: totalPgData,
        from: PgList.length === 0 ? 0 : paginationData.skip + 1,
        to: paginationData.skip + PgList.length,
        hasMany: hasMany,
      };
      if (!PgList) errorHelper.handleError(Boom.badRequest("something went wrong PgList not found"))
      return { success: true, data: PgData }
    } catch (err) {
      errorHelper.handleError(err);
    }
  }

  async getPgNameList(request) {
    try {
      const { auth: { credentials: { user } } } = request;

      const role = ["superadmin", "pgowner"];
      if (!role.includes(user.role)) errorHelper.handleError(Boom.badRequest("Access denied"))

      let Obj = { deleted: { $ne: true } }
      const pgNameList = await PgModel.find(Obj, { pgName: 1 }).lean();
      if (!pgNameList) errorHelper.handleError(Boom.badRequest("Pg Name List not found"))

      return { success: true, data: pgNameList }
    } catch (err) {
      errorHelper.handleError(err);
    }
  }

  async addNewPg(request) {
    try {
      const { payload, auth: { credentials: { user } } } = request;
      if (!["superadmin", "pgowner"].includes(user.role)) errorHelper.handleError(Boom.badRequest("access denied"))
      if (!payload.email) errorHelper.handleError(Boom.badRequest("Email is required"))

      const checkPgName = await PgModel.findOne({ pgName: payload.pgName });
      if (checkPgName) errorHelper.handleError(Boom.badRequest("PgName is already taken"))

      const checkEmail = await PgModel.findOne({ email: payload.email });
      if (checkEmail) errorHelper.handleError(Boom.badRequest("Email is already taken"))

      let Obj = {
        ...payload,
        createdBy: new ObjectId(user._id),
        address: {
          addressLine1: payload.addressLine1,
          addressLine2: payload.addressLine2,
          city: payload.city,
          zipCode: payload.zipCode,
        },
      };

      const newPgData = await PgModel.create(Obj);
      if (!newPgData) errorHelper.handleError(Boom.badRequest("PG Not Added successfully"))

      return { success: true, message: "PG Added successfully" }
    } catch (err) {
      errorHelper.handleError(err);
    }
  }

  async deletePg(request) {
    try {
      const { params: { pgId }, auth: { credentials: { user } } } = request;
      if (!["superadmin", "pgowner"].includes(user.role)) errorHelper.handleError(Boom.badRequest("access denied"))
      if (!pgId) errorHelper.handleError(Boom.badRequest("pgId is required"))

      const checkPg = await PgModel.findOne({ _id: new ObjectId(pgId), deleted: { $ne: true } })
      if (!checkPg) errorHelper.handleError(Boom.badRequest("Pg not found"))

      await PgModel.findOneAndUpdate(
        { _id: new ObjectId(pgId) },
        {
          $set: {
            deleted: true,
            deletedBy: new ObjectId(user._id),
            deletedAt: new Date(),
          }
        },
        { new: true }
      )

      return { success: true, message: "Pg Deleted successfully" }
    } catch (err) {
      errorHelper.handleError(err);
    }
  }
}
