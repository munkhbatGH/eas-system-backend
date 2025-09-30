import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';
const { ObjectId } = require('mongodb')
import moment from 'moment';
const _ = require('lodash')
var helper = require('../utils/helper')

export interface SchemaObjectConfig {
  schema: any[];
  collectionName: string;
}

@Injectable()
export class SchemaAccessService {
  constructor(
    @InjectConnection() private connection: Connection,
  ) {}

  //#region MAIN

  getSchema(modelName: string, fields: any[] = [], isReport = false) {
    let data: any[] = []
    // This works similar to mongoose.model(name).schema
    const modelObject: any = this.connection.models[modelName] ? this.connection.models[modelName] : null;
    if (!modelObject) {
      return { schema: [], collectionName: '' }
    }
    const collectionName = modelObject.collection.collectionName;
    const schemPaths = modelObject.schema.paths

    const model: any[] = []
    Object.keys(schemPaths).forEach((fieldKey) => {
      const fieldObj = schemPaths[fieldKey]
      if (fieldObj && fieldObj.options) {
        if (Array.isArray(fieldObj.options.type)) {
          fieldObj.options.type.forEach((a) => {
            const nestedKeys = Object.keys(a)
            if (fieldObj.schema) {
              // nested object
              nestedKeys.forEach((key) => {
                const nestedFieldObj = {
                  instance: fieldObj.schema && fieldObj.schema.paths && fieldObj.schema.paths[key] ? fieldObj.schema.paths[key].instance : fieldObj.instance,
                  options: a[key]
                }
                const fieldConfig = this.getFieldConfig(`${fieldKey}.${key}`, nestedFieldObj)
                if (fieldConfig) {
                  model.push(fieldConfig)
                }
              })
            } else {
              const nestedFieldObj = {
                instance: fieldObj.instance,
                options: a
              }
              const fieldConfig = this.getFieldConfig(fieldKey, nestedFieldObj)
              if (fieldConfig) {
                model.push(fieldConfig)
              }
            }
          })
        } else {
          const fieldConfig = this.getFieldConfig(fieldKey, fieldObj)
          if (fieldConfig) {
            model.push(fieldConfig)
          }
        }
      }
    })
    data = model
    return { schema: data, collectionName }
  }

  getColumns(schema) {
    const columnNames: string[] = []
    schema.forEach((field) => {
      if (field.column || field.filter || field.allowed) {
        columnNames.push(field.key)
      }
    })
    return columnNames
  }

  getColumnsProps(schema) {
    const columns: any[] = []
    schema.forEach((field) => {
      if (field.column || field.filter || field.allowed) {
        columns.push({
          name: field.label.toUpperCase(),
          uid: field.key,
          sortable: field.sortable,
          filterable: field.filterable,
          filterType: field.filterType,
        })
      }
    })
    return columns
  }

  getAllSchemas() {
    const schemas = {};
    Object.keys(this.connection.models).forEach(modelName => {
      schemas[modelName] = this.connection.models[modelName].schema;
    });
    return schemas;
  }

  getModelNames() {
    return Object.keys(this.connection.models);
  }

  //#endregion

  //#region METHODS

  async findAll(modelName, fields, filter, query) {
    const { collectionName }: SchemaObjectConfig = this.getSchema(modelName);
    const aggregation = this.findAggregation(modelName, fields, [{ $match: filter }], {})

    let skip = 0
    let limit = 5

    if (query?.limit) {
      limit = Number(query.limit)
    }
    if (query.skip) {
      skip = Number(query.skip)
    }
    if (query.sort) {
      aggregation.push({ $sort: query.sort })
    }
    aggregation.push({ $skip: skip })
    aggregation.push({ $limit: limit })
    const list = await this.connection.collection(collectionName).aggregate(aggregation).toArray()
    const promises: any[] = []
    list.forEach((a) => {
      promises.push(this.lookup(a, this.getLookupColumns(modelName, fields, true)))
    })
    return await Promise.all(promises)
  }

  async findOne(collection, fields, filter, exclude = []) {
    const { collectionName }: SchemaObjectConfig = this.getSchema(collection);
    const limit = 1
    const aggregation: any[] = []

    aggregation.push({ $match: filter})
    aggregation.push({ $limit: limit})
    this.findAggregation(collection, fields, aggregation, {}, exclude)
    const aggregateResponse = await this.connection.collection(collectionName).aggregate(aggregation).toArray()
    const data = aggregateResponse && aggregateResponse.length > 0 ? aggregateResponse[0] : null
    const columns = this.getLookupColumns(collection, fields)
    return this.lookup(data, columns)
  }

  async listFilter(model, query, filter = {}, returnFilter = false, additionalAggregation = [], additionalAllFilter = [], modelSchema = null, inlineFilter = {}) {
    const { schema }: SchemaObjectConfig = this.getSchema(model);
    console.log(JSON.stringify(schema))
    const columns = this.getColumns(schema)
    let sort: any = { _id: -1 }
    let skip = 0
    let dates = []
    let limit = 10
    let aggregationFilter: any = {}

    if (query.limit) {
      limit = Number(query.limit)
    }
    if (query.skip) {
      skip = Number(query.skip)
    }
    if (query.createdDate) {
      dates = JSON.parse(query.createdDate)
    }
    if (query.sort) {
      const sorts = JSON.parse(query.sort)
      sort = sorts
    } else {
      if (columns.indexOf('name') > -1) {
        sort = { 'name': 1 }
      }
    }
    if (filter) {
      Object.keys(filter).forEach((key) => {
        const field = filter[key]
        aggregationFilter[key] = field
      })
    }
    if (dates && dates.length > 0) {
      const start = moment(dates[0])
      const end = moment(dates[1]).set({ hour: 23, minute: 59, second: 59})
      aggregationFilter[query.dateField ? query.dateField : 'createdAt'] = { $gte: start.toDate(), $lte: end.toDate() }
    }
    if (query.filter && !_.isEmpty(query.filter) && query.filter !== '{}') {
      const duplicateKeys: any[] = []
      const andFinds: any[] = []
      const queryFilter = JSON.parse(query.filter)
      Object.keys(queryFilter).forEach(async (key) => {
        if (key === 'all') {
          const orFilter: any[] = additionalAllFilter
          schema.filter((s) => ['String'].indexOf(s.type) > -1).forEach((field) => {
            orFilter.push({[field.key]: { $regex: queryFilter[key], $options: 'i' }})
          })
          let allFilter: any[] = []
          if (filter) {
            allFilter = [_.cloneDeep(filter)]
          }
          if (orFilter.length > 0) {
            allFilter.push({ $or: orFilter } )
          }
          if (allFilter.length > 0) {
            aggregationFilter = { $and: allFilter }
          }
        } else {
          const fieldConfig = schema.find((s) => s.key === key)
          let fieldValue = queryFilter[key]
          let filterConfig: any = null
          if (fieldConfig) {
            if (fieldConfig.type === 'Number') {
              filterConfig = Number(fieldValue)
            }
            if (fieldConfig.type === 'String') {
              if (typeof fieldValue === 'string') {
                if (fieldConfig.enum) {
                  filterConfig = fieldValue
                } else {
                  filterConfig = { $regex: fieldValue, $options: 'i' }
                }
              } else if (typeof fieldValue === 'object') {
                filterConfig = fieldValue
              }
            } else if (fieldConfig.type === 'Date') {
              if (fieldValue && Array.isArray(fieldValue)) {
                filterConfig = { $gte: new Date(fieldValue[0]), $lt: new Date(fieldValue[1]) }
              } else {
                filterConfig = { $gte: moment(fieldValue).startOf('day').toDate(), $lte: moment(fieldValue).endOf('day').toDate() }
              }
            } else if (fieldConfig.type === 'ObjectID') {
              if (Array.isArray(fieldValue)) {
                const list: any[] = []
                fieldValue.forEach((fieldId) => {
                  const id = fieldId.hasOwnProperty('_id') ? fieldId._id : fieldId
                  list.push(new ObjectId(id))
                })
                filterConfig = { $in: list }
              } else {
                if (fieldValue.hasOwnProperty('_id') || ObjectId.isValid(fieldValue)) {
                  fieldValue = fieldValue.hasOwnProperty('_id') ? fieldValue._id : fieldValue
                  if (fieldValue !== '') {
                    filterConfig = { $eq: new ObjectId(fieldValue) }
                  }
                } else if (inlineFilter.hasOwnProperty(fieldConfig.key)) {
                  filterConfig = inlineFilter[fieldConfig.key]
                }
              }
            } else if (fieldConfig.type === 'Array') {
              if (fieldValue && Array.isArray(fieldValue)) {
                const list: any[] = []
                fieldValue.forEach((fieldId) => {
                  const id = fieldId.hasOwnProperty('_id') ? fieldId._id : fieldId
                  list.push(new ObjectId(id))
                })
                filterConfig = { $in: list }
              } else if (inlineFilter.hasOwnProperty(fieldConfig.key)) {
                filterConfig = inlineFilter[fieldConfig.key]
              }
            } else if (fieldConfig.type === 'Boolean') {
              if (fieldValue === 'all') {
                filterConfig = { $in: [true, false]}
              } if (fieldValue === 'true') {
                filterConfig = { $eq: true }
              } else if (fieldValue === 'false') {
                filterConfig = { $eq: false }
              }
            }
            if (filterConfig !== null) {
              if (aggregationFilter.hasOwnProperty(key)) {
                duplicateKeys.push(key)
                andFinds.push({ [key]: filterConfig })
              } else {
                aggregationFilter[key] = filterConfig
              }
            }
          }
        }
      })
      if (duplicateKeys.length > 0) {
        duplicateKeys.forEach((key) => {
          andFinds.unshift({ [key]: aggregationFilter[key] })
          delete aggregationFilter[key]
        })
        if (!aggregationFilter.$and) {
          aggregationFilter.$and = []
        }
        aggregationFilter.$and = aggregationFilter.$and.concat(andFinds)
      }
    }
    if (returnFilter) {
      return aggregationFilter
    }

    const aggregation: any[] = []
    aggregation.push({ $sort: sort })
    aggregation.push({ $skip: skip })
    aggregation.push({ $limit: limit })

    this.listAggregation(schema, {}, aggregation, true)

    const mainAggregation: any[] = [{ $match: aggregationFilter }]
    if (additionalAggregation) {
      additionalAggregation.forEach((a) => {
        mainAggregation.push(a)
      })
    }
    mainAggregation.push(
      {
        $facet: {
          rows: aggregation,
          totalCount: [{ $count: 'count'}]
        }
      }
    )
    // console.log(JSON.stringify(mainAggregation))
    const aggregateResults = await mongoose.model(model).aggregate(mainAggregation)

    const result = helper.data(aggregateResults)
    const list: any[] = result.rows

    const promises: any[] = []
    list.forEach((a) => {
      promises.push(this.lookup(a, this.getLookupColumns(model, [], true, modelSchema)))
    })

    return {
      total: result.count,
      list: await Promise.all(promises)
    }
  }

  //#endregion


  //#region HELPERS

  getFieldConfig(fieldKey, fieldObj) {
    if (fieldObj && fieldObj.options) {
      let options = fieldObj.options
      const field: any = {
        key: fieldKey,
        path: fieldKey.indexOf('.') > -1 ? fieldKey.split('.') : [fieldKey],
        type: fieldObj.instance,
        allowed: (options.filter || options.column || options.short),
        collection: options.ref,
        label: options.label,
        sortable: options.sortable,
        filterable: options.filterable,
        filterType: options.filterType
      }
      if (Array.isArray(fieldObj.options)) {
        const obj = fieldObj.options[0]
        if (options.length > 0) {
          field.allowed = (obj.filter || obj.column || obj.short || obj.allowed)
          field.label = obj.label
          field.lookup = obj.lookup
          field.raw = obj.raw
          options = obj
          if (obj.ref) {
            field.collection = obj.ref
          }
        }
      }
      if (options.allowed) {
        field.allowed = options.allowed
      }
      if (options.enum) {
        field.enum = options.enum
      }
      if (options.options) {
        field.options = options.options
      }
      if (options.raw) {
        field.raw = options.raw
      }
      if (options.lookup) {
        field.lookup = options.lookup
      }
      if (options.report) {
        field.report = options.report
      }
      if (options.lookupProject) {
        field.lookupProject = options.lookupProject
      }
      if (options.filterAs) {
        field.filterAs = options.filterAs
      }
      if (options.showAs) {
        field.showAs = options.showAs
      }
      if (options.sortable) {
        field.sortable = options.sortable
      }
      if (options.short) {
        field.short = options.short
      }
      if (options.filter) {
        field.filter = options.filter
      }
      if (options.inputType) {
        field.inputType = options.inputType
      }
      if (options.column) {
        field.column = options.column
      }
      if (options.hidden) {
        field.hidden = options.hidden
      }
      if (options.width) {
        field.width = options.width
      }
      return field
    }
  }

  getShortFields(modelName, isReport = false) {
    const { schema }: SchemaObjectConfig = this.getSchema(modelName);
    const fields = { _id: 1 }
    schema.filter((c) => isReport ? c.report : c.short).forEach((collectionField) => {
      fields[collectionField.key] = 1
    })
    return fields
  }

  findAggregation(modelName, fields, aggregation, project, exclude: string[] = []) {
    const { schema }: SchemaObjectConfig = this.getSchema(modelName, fields);
    schema.forEach((field) => {
      const isAllowed = (fields && fields.length > 0 && fields.indexOf(field.path[0]) > -1)
      if (isAllowed || field.allowed) {
        if (field.collection) {
          const fieldKey = field.key
          const collectionName = mongoose.model(field.collection).collection.collectionName
          if (!field.lookup && !field.raw) {
            aggregation.push({ $lookup: { from: collectionName, localField: fieldKey, foreignField: '_id', as: fieldKey} })
            if (field.type !== 'Array') {
              aggregation.push({ $unwind: { path: `$${fieldKey}`, preserveNullAndEmptyArrays: true} })
            }
            const lookupFields = this.getShortFields(field.collection)
            project[field.key] = lookupFields
          } else {
            if (exclude.includes(field.key)) {
              project[field.key] = 1
            }
          }
        } else {
          if (exclude.indexOf(field.key) === -1) {
            project[field.key] = 1
          }
        }
      }
    })
    aggregation.push({ $project: project })
    return aggregation
  }

  async lookup(data, nestedObjects) {
    if (data === null) {
      return null
    }
    const promises: any[] = []
    nestedObjects.forEach(object => {
      if (data[object.path[0]]) {
        if (Array.isArray(data[object.path[0]])) {
          const ids: any[] = []
          data[object.path[0]].forEach(nested => {
            if (object.type === 'ObjectID' && nested[object.path[1]]) {
              ids.push(new ObjectId(nested[object.path[1]]))
            } else if (object.type === 'Array' && nested && !nested[object.path[1]]) {
              ids.push(nested)
            } else if (object.type === 'Array' && nested && nested[object.path[1]]) {
              nested[object.path[1]].forEach((i) => {
                ids.push(i)
              })
            }
          })
          if (ids.length > 0) {
            promises.push(this.findAll(object.collection, object.lookupProject ? object.lookupProject : [], { _id: { $in: ids } }, {}))
          }
        } else {
          if (Object.keys(data[object.path[0]]).length > 0) {
            promises.push(this.findOne(object.collection, object.lookupProject ? object.lookupProject : [], { _id: { $eq: new ObjectId(data[object.path[0]]) } }))
          }
        }
      }
    })
    let responses = await Promise.all(promises)
    responses = helper.flattenArray(responses)

    if (nestedObjects) {
      nestedObjects.forEach(object => {
        if (object && data[object.path[0]]) {
          if (Array.isArray(data[object.path[0]])) {
            data[object.path[0]].forEach((nested, index) => {
              if (nested[object.path[1]]) {
                const value = nested[object.path[1]]
                if (object.type === 'Array') {
                  const list: any[] = []
                  value.forEach((a) => {
                    list.push(responses.find(r => r._id.toString() === a.toString()))
                  })
                  nested[object.path[1]] = list
                } else if (object.type === 'ObjectID') {
                  nested[object.path[1]] = responses.find(r => r && r._id.toString() === value.toString()) || nested[object.path[1]]
                }
              } else {
                const found = responses.find(r => r && r._id.toString() === nested.toString())
                if (found) {
                  data[object.path[0]][index] = found
                }
              }
            })
          } else {
            const idValue = data[object.path[0]]
            const found = responses.find(r =>  r && r._id.toString() === idValue.toString())
            if (found) {
              data[object.path[0]] = found
            }
          }
        }
      })
    }
    return data
  }

  getLookupColumns(collection, fields, isColumn = false, modelSchema = null) {
    const lookup: any[] = []
    const { schema }: SchemaObjectConfig = this.getSchema(collection, fields = [])
    schema.forEach((field) => {
      const isAllowed = (fields.length > 0 && fields.indexOf(field.path[0]) > -1)
      if (isColumn) {
        if (field.column && field.collection && field.lookup) {
          lookup.push(field)
        }
      } else {
        if ((isAllowed || field.allowed) && field.collection && field.lookup) {
          lookup.push(field)
        }
      }
    })
    return lookup
  }

  listAggregation(schema, project, aggregation, isColumn = false, isReport = false, reportColumns: any[] = []) {
    schema.forEach((field) => {
      if (isReport || (isColumn ? (field.column || field.filter) : field.allowed)) {
        if (!field.collection) {
          project[`${field.key}`] = 1
        } else if (field.collection) {
          const fieldKey = field.key
          const collectionName = mongoose.model(field.collection).collection.collectionName
          if ((!field.lookup && !field.raw)) {
            const reportFound = reportColumns.find(r => r.path.indexOf(field.path.join('.')) > -1)
            if (!reportFound || field.type !== 'Array') {
              aggregation.push({ $lookup: { from: collectionName, localField: fieldKey, foreignField: '_id', as: fieldKey} })
              const lookupFields = this.getShortFields(field.collection, isReport)
              project[field.key] = lookupFields
            }
            if (field.type !== 'Array') {
              if (!reportFound || (reportFound && !reportFound.array)) {
                aggregation.push({ $unwind: { path: `$${fieldKey}`, preserveNullAndEmptyArrays: true} })
              }
              if (reportFound && reportFound.array && reportFound.filter) {
                project[field.key] = 1
                const fieldFilter = JSON.parse(JSON.stringify(reportFound.filter))
                if (fieldFilter.key && fieldFilter.collection) {
                  project[field.path[0] + '.' + fieldFilter.key] = 1
                }
              }
            }
          } else {
            project[field.key] = 1
          }
          reportColumns.filter(s => s.custom === true).forEach(element => {
            if (element.path.indexOf('.') > -1) {
              const split = element.path.split('.')
              if (!project[split[0]]) {
                project[split[0]] = {}
              }
              if (split.length > 2) {
                const s2 = split[2]
                if (!project[split[0]][split[1]]) {
                  project[split[0]][split[1]] = {}
                }
                project[split[0]][split[1]][s2] = 1
              } else {
                project[split[0]][split[1]] = 1
              }
            } else {
              project[element.path] = 1
            }
          })
        }
      }
    })
    if (isReport) {
      Object.keys(project).forEach(p => {
        if (p.indexOf('.') > -1) {
          const splitProps = p.split('.')
          const childs = Object.keys(project).filter(p2 => p2.indexOf('.') > -1 && p2.split('.')[0] === splitProps[0])
          childs.forEach(c => {
            const temp = project[c]
            delete project[c]
            let splitNames = c.split('.')
            splitNames.shift()
            const joinedSplitNames = splitNames.join('.')
            if (!project[splitProps[0]]) {
              project[splitProps[0]] = {}
            }
            project[splitProps[0]][joinedSplitNames] = temp
          })
        }
      })
    }
    aggregation.push({ $project: project })
    return aggregation
  }

  getSchemaJoiErrors(modelName, errors) {
    const msgs: any[] = []
    const { schema }: SchemaObjectConfig = this.getSchema(modelName);
    const fields = schema
    errors.forEach((msg) => {
      const match = msg.message.match(/"([^"]*)"/)
      if (match) {
        const paths: any[] = []
        msg.path.forEach((item) => {
          if (typeof item === 'string') {
            paths.push(item)
          }
        })
        const fullPath = paths.join('.')
        const found = fields.find((a) => a.key === fullPath)
        let errorMessage = msg.message
        if (found && found.label) {
          errorMessage = errorMessage.replace(match[1], found.label)
        }
        msgs.push(errorMessage)
      } else {
        msgs.push(msg.message)
      }
    })
    return msgs
  }

  //#endregion
}