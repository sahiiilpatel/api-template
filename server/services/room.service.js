'use strict'

const Joi = require('joi')
const Boom = require('@hapi/boom')
Joi.objectId = require('joi-objectid')(Joi)
const ObjectId = require('mongodb').ObjectId
const helper = require('@utilities/helper')
const Schmervice = require('@hapipal/schmervice')
const errorHelper = require('@utilities/error-helper')

const RoomModel = require('@models/room.model').schema
const BedModel = require('@models/bed.model').schema

module.exports = class RoomService extends Schmervice.Service {

  async getRoomList(request) {
    try {
      const { query, auth: { credentials: { user } } } = request;

      const role = ["superadmin", "pgowner"];
      if (!role.includes(user.role)) errorHelper.handleError(Boom.badRequest("Access denied"))
      let Obj = { deleted: { $ne: true } }

      if (query.roomType) Obj['roomType'] = query.roomType

      let aggregation = [{ $match: Obj }];

      if (query.search) {
        const searchableFields = ["roomName", "roomType", "description"];
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

      const results = await RoomModel.aggregate([
        {
          $facet: {
            RoomList: aggregation,
            totalResult: countQuery,
          },
        },
      ]);
      const { RoomList, totalResult } = results[0];

      const totalRoomData = totalResult[0] ? totalResult[0].total : 0;
      let hasMany = false;

      if (query.limit) {
        if (paginationData.skip + RoomList.length >= totalRoomData) {
          hasMany = false;
        } else {
          hasMany = true;
        }
      }
      let RoomData = {
        list: RoomList,
        count: RoomList.length,
        total: totalRoomData,
        from: RoomList.length === 0 ? 0 : paginationData.skip + 1,
        to: paginationData.skip + RoomList.length,
        hasMany: hasMany,
      };
      if (!RoomList) errorHelper.handleError(Boom.badRequest("something went wrong RoomList not found"))
      return { success: true, data: RoomData }
    } catch (err) {
      errorHelper.handleError(err);
    }
  }

  async addRoom(request) {
    try {
      const { payload, auth: { credentials: { user } } } = request;
      if (!["superadmin", "pgowner"].includes(user.role)) errorHelper.handleError(Boom.badRequest("access denied"))

      const checkRoomNumber = await RoomModel.findOne({ roomNumber: payload.roomNumber, pgId: new ObjectId(payload.pgId) });
      if (checkRoomNumber) errorHelper.handleError(Boom.badRequest("Room Number is already taken"))

      let Obj = {
        ...payload,
        createdBy: new ObjectId(user._id),
      };

      const newRoomData = await RoomModel.create(Obj);
      if (!newRoomData) errorHelper.handleError(Boom.badRequest("Room Not Created successfully"))

      let bedPayload = {
        pgId: new ObjectId(payload.pgId),
        roomId: new ObjectId(newRoomData._id),
        depositAmount: payload.depositAmount,
        rentAmount: payload.rentAmount,
      };

      for (let i = 1; i <= newRoomData.bedCount; i++) {
        await BedModel.create(bedPayload);
      }

      return { success: true, message: "Room Added successfully" }
    } catch (err) {
      errorHelper.handleError(err);
    }
  }
}
