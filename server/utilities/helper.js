'use strict'
const errorHelper = require('@utilities/error-helper');
const Boom = require('@hapi/boom');
const config = require('config');

const paginationQuery = (query) => {
  let paginationData = {};
  let aggregateArray = [];
  query.page = query.page ? query.page : 1;
  query.limit = query.limit ? query.limit : 10;
  const total = (query.page - 1) * query.limit;
  aggregateArray.push(
    { "$skip": total },
    { "$limit": query.limit }
  );
  paginationData['pagination'] = aggregateArray;
  paginationData['skip'] = total;
  return paginationData;
}

const searchQuery = (query, searchField) => {
  let aggregateArray = [];
  let likeQuery = []
  let search = query.search?.trim()

  const searchableFields = searchField;
  searchableFields.forEach(field => {
      likeQuery.push({
        [field]: {
          $regex: new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
        }
      })
  })
  aggregateArray.push({
    $match: {
      $or: likeQuery
    }
  })
  return aggregateArray
}

const containsSpecialCharacters = (str) => {
  // Regular expression to match any character that is not alphanumeric or whitespace
  // const regex = /[^a-zA-Z0-9\s]/;
  const regex = /[^a-zA-Z0-9\s@.]/;
  return regex.test(str);
}

const createExportFile = async (data, columns, name, fileType, isShowHeader = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      const Excel = require('exceljs')
      let workbook = new Excel.Workbook()
      // let fileName = `${name}-${(new Date()).getFullYear()}-${((new Date).getMonth() + 1).toString().padStart(2, '0')}-${(new Date).getDate().toString().padStart(2, '0')}`
      let worksheet = workbook.addWorksheet(name)

      worksheet.columns = [...columns];

      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          if (rowNumber === 1) {
            row.getCell(colNumber).font = { bold: true }
          }
        })
      })

      worksheet.addRows(data)

      if(!isShowHeader){
        // Remove the first row (headers)
        worksheet.spliceRows(1, 1);
      }

      const buffer = await workbook[fileType].writeBuffer()
      resolve(buffer)
    } catch (error) {
      reject(error);
    }
  })
}

const hasPolicyAccess = async (userInfo, pmsPolicies) => {
  if (userInfo.permission && userInfo.permission.includes('super_admin')) {
    return true
  }

  const allPolicies = []

  if (userInfo.metas?.company) {
    console.log("if condition call");
    const company = userInfo.metas.company
    // policies of companies
    Object.keys(company).map(companyId => {
      allPolicies.push(...company[companyId])
      return null
    })
  }

  if (userInfo.metas?.property) {
    console.log("if condition call 2");
    const property = userInfo.metas?.property
    // policies of properties
    Object.keys(property).map(propertyId => {
      allPolicies.push(...property[propertyId])
      return null
    })
  }

  // now check if policy present
  const hasAccess = allPolicies.some(policy => pmsPolicies.includes(policy))

  // check access
  if (!hasAccess) {
    errorHelper.handleError(Boom.badData('validatePMSAccess'));
  }

  return true
}

const hasAccess = (userInfo, policy) => {
  if (policy && policy.length) {
    for (let index = 0; index < policy.length; index++) {
      const element = policy[index];
      if (userInfo.policies?.includes(element) || userInfo.policies?.includes('super_admin')) {
        return true;
      }
    }
  } else {
    return !!(userInfo.policies?.includes(policy) || userInfo.policies?.includes('super_admin'))
  }
  return false;
}

function validateImage(filePath) {
  const extension = filePath.split('.').pop().toLowerCase();
  const allowedExtensions = ['jpg', 'jpeg', 'png'];
  return allowedExtensions.includes(extension) ? true : false;
}

// TODO : add dir & apiUrl and check below code once
const getStorageUrl = async (path, token = '') => {
  const config = require('config')
  const storageDir = config.constants.dir ? 'storage' : 'uploads'; // default to public/uploads
  const baseURL = config.constants.apiUrl

  let returnPath = `${baseURL}/${storageDir}/${path}`

  if (token) {
    // TODO : check for token code and if needed so Write code on base of old code from : getStorageUrl.ts
  }

  return returnPath;
}

const loggerFiles = {
  webhook: 'logs/webhook.log',
  cron: 'logs/cron.log',
  cron2: 'logs/cron2.log',
}

const log = (file, customLabel, log) => {
  const winston = require('winston')
  const { format } = require('winston')
  const { combine, timestamp, label } = format
  const logConfiguration = {
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: loggerFiles[file],
        format: combine(
          label({ label: customLabel || 'NO_LABEL' }),
          timestamp(),
          winston.format.json()
        )
      })
    ]
  }
  const logger = winston.createLogger(logConfiguration)
  logger.info(log)
}

const getList = async (query, queryParams, searchableFields, model, pagination, orderByField, selectField, populateFiled = "") => {
  try {
    const countQuery = model.find(queryParams)
    if(selectField.length > 0){
      selectField = selectField.join(' ')
    }
    const mongooseQuery = model.find(queryParams).populate(populateFiled).select(selectField)

    if (query.search) {
      var likeQuery = []
      var search = query.search
      if (searchableFields.length > 0) {
        searchableFields.forEach(field => {
          likeQuery.push({
            [field]: {
              $regex:new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
            }
          })
        })
        mongooseQuery.or(likeQuery)
        countQuery.or(likeQuery)
      }
    }

    if (query.orderBy && query.isAsc !== null && query.isAsc !== undefined) {
      if (orderByField[query.orderBy]) {
        query.orderBy = orderByField[query.orderBy]
      }
      mongooseQuery.sort({ [query.orderBy]: query.isAsc ? 1 : -1 })
    } else if (query.orderBy && query.sortBy) {
      if (orderByField[query.orderBy]) {
        query.orderBy = orderByField[query.orderBy]
      }
      mongooseQuery.sort({ [query.orderBy]: query.sortBy === 'desc' ? -1 : 1 })
    } else {
      mongooseQuery.sort({ _id: -1 })
    }

    let skip = 0
    let page = 1
    let hasMany = null
    let totalCountResult = 0
    if (pagination) {
      const limit = query && query.limit ? +query.limit : 10
      mongooseQuery.limit(limit)
      if (
        query.page !== undefined &&
        query.page !== '' &&
        query.page !== null
      ) {
        page = parseInt(query.page)
        skip = (parseInt(page) - 1) * parseInt(limit)
        mongooseQuery.skip(skip)
      }
      totalCountResult = await countQuery.countDocuments()
    }
    const result = await mongooseQuery.lean()

    if (pagination) {
      if (skip + result.length >= totalCountResult) {
        hasMany = false
      } else {
        hasMany = true
      }
    }

    return {
      list: result,
      count: result.length,
      total: totalCountResult,
      hasMany: hasMany,
      from: result.length && skip + 1,
      to: skip + result.length
    }
  } catch (error) {
    errorHelper.handleError(error);
  }
}


const jsonOrParsed = (string) => {
  try {
    return JSON.parse(string);
  } catch (e) {
    console.log('json parse error in model e: ', e);
    return string;
  }
}

// Convert any string into the lowercase
const convertToLowerCase = (string = "") => {
  let result = ""
  if (string && typeof string === 'string') {
    result = string.toLocaleLowerCase()
  }
  return result
}


const csvStringToArray = (csvDataString, delimiter) => {
    const regexPattern = new RegExp(
      `(\\${delimiter}|\\r?\\n|\\r|^)(?:\"((?:\\\\.|\"\"|[^\\\\\"])*)\"|([^\\${delimiter}\"\\r\\n]*))`,
      'gi'
    )
    let matchedPatternArray = regexPattern.exec(csvDataString)
    const resultCSV = [[]]
    while (matchedPatternArray) {
      if (matchedPatternArray[1].length && matchedPatternArray[1] !== delimiter) {
        resultCSV.push([])
      }
      const cleanValue = matchedPatternArray[2]
        ? matchedPatternArray[2].replace(new RegExp('[\\\\"](.)', 'g'), '$1')
        : matchedPatternArray[3]
      resultCSV[resultCSV.length - 1].push(cleanValue)
      matchedPatternArray = regexPattern.exec(csvDataString)
    }
    return resultCSV
  }

  const convertData = (csvRecordsArray, header) => {
    var dataArr = []
    var headersArray = csvRecordsArray[0]
    var startingRowToParseData = header ? 1 : 0
    for (var i = startingRowToParseData; i < csvRecordsArray.length; i++) {
      var data = csvRecordsArray[i]
      if (data.length === headersArray.length && header) {
        var csvRecord = {}
        for (var j = 0; j < data.length; j++) {
          if (data[j] === undefined || data[j] === null) {
            csvRecord[headersArray[j]] = ''
          } else {
            csvRecord[headersArray[j]] = data[j].trim()
          }
        }
        dataArr.push(csvRecord)
      } else {
        dataArr.push(data)
      }
    }
    return dataArr
  }

  const readCsvFile = (file, header) => {
    const buf = Buffer.from(file)
    const resRead = csvStringToArray(buf.toString().trim(), ',')
    return convertData(resRead, header)
  }

function mask(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj
  }
  const keys = ['password', 'cardNumber', 'accountNumber', 'routingNumber', 'confirmPassword', 'newPassword', 'currentPassword', 'token', 'Authorization', 'front_img_path', 'back_img_path', 'base64encodedContent', 'nationalId', 'ssn', 'html', '_data','mailgunCredentials']
  function removeKey(currentObj) {
    if (Array.isArray(currentObj)) {
      currentObj.forEach(item => removeKey(item));
    } else if (typeof currentObj === 'object' && currentObj !== null) {
      Object.keys(currentObj).forEach(key => {
        if (keys.includes(key)) {
          currentObj[key] = "**";
        } else {
          removeKey(currentObj[key]);
        }
      });
    }
  }

  const clonedObj = JSON.parse(JSON.stringify(obj));
  removeKey(clonedObj);
  return clonedObj;
}

const getFullName = (firstName, lastName) => {
  return [firstName ? firstName.trim() : '', lastName ? lastName.trim() : ''].filter(Boolean).join(' ')
}

const encodeBase64 = (str) => {
  return btoa(str);
}

const decodeBase64 = (str) => {
  return atob(str);
}

module.exports = {
  paginationQuery,
  searchQuery,
  createExportFile,
  getStorageUrl,
  hasPolicyAccess,
  hasAccess,
  validateImage,
  log,
  getList,
  jsonOrParsed,
  convertToLowerCase,
  readCsvFile,
  mask,
  getFullName,
  encodeBase64,
  decodeBase64
}
