'use strict'

const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const Schmervice = require('@hapipal/schmervice')
const errorHelper = require('@utilities/error-helper')

const PgModel = require('@models/pg.model').schema
const BedModel = require('@models/bed.model').schema
const RoomModel = require('@models/room.model').schema
const PaymentModel = require('@models/payment.model').schema
const OccupantModel = require('@models/occupant.model').schema

module.exports = class DashboardService extends Schmervice.Service {

  async dashboard(request) {
    try {

      const [
        pgCountResult,
        occupantCountResult,
        bedCountResult,
        roomCountResult,
        totalRevenueResult,
      ] = await Promise.all([
        this.pgCount(),
        this.occupantCount(),
        this.bedCount(),
        this.roomCount(),
        this.totalRevenue(),
      ]);

      const data = {
        ...occupantCountResult,
        ...pgCountResult,
        ...bedCountResult,
        ...roomCountResult,
        ...totalRevenueResult,
      };

      return { success: true, data: data }
    } catch (err) {
      errorHelper.handleError(err);
    }
  }

  async pgCount() {
    const defaultCount = { totalPg: 0 };
    const pipeline = [
      {
        $match: {
          deleted: { $ne: true },
        }
      },
      {
        $group: {
          _id: null,
          totalPg: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalPg: 1,
        },
      },
    ];
    const result = await PgModel.aggregate(pipeline);
    return result[0] || defaultCount;
  }

  async occupantCount() {
    const defaultCount = { totalOccupant: 0 };
    const pipeline = [
      {
        $group: {
          _id: null,
          totalOccupant: { $sum: 1 },
          totalAssignedOccupant: {
            $sum: { $cond: [{ $eq: ["$bedId", null] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalOccupant: 1,
          totalAssignedOccupant: 1,
        },
      },
    ];
    const result = await OccupantModel.aggregate(pipeline);
    return result[0] || defaultCount;
  }

  async bedCount() {
    const defaultCount = { totalBed: 0 };
    const pipeline = [
      {
        $group: {
          _id: null,
          totalBed: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalBed: 1,
        },
      },
    ];
    const result = await BedModel.aggregate(pipeline);
    return result[0] || defaultCount;
  }

  async totalRevenue() {
    const defaultCount = { totalRevenue: 0 };
    const pipeline = [
      {
        $match: {
          status: "authorized",
        },
      },
    ];
    const PaymentData = await PaymentModel.aggregate(pipeline);

    let sum = 0;
    PaymentData.forEach((item) => {
      sum += item.amount;
    });

    const result = [{ totalRevenue: sum / 100 }];

    return result[0] || defaultCount;
  }

  async roomCount() {
    const defaultCount = { totalRoom: 0 };
    const pipeline = [
      {
        $group: {
          _id: null,
          totalRoom: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalRoom: 1,
        },
      },
    ];
    const result = await RoomModel.aggregate(pipeline);
    return result[0] || defaultCount;
  }
}
