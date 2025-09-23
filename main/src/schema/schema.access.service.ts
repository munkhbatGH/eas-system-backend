import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';
const { ObjectId } = require('mongodb')
var helper = require('../utils/helper')

interface SchemaObjectConfig {
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

  async findAll(modelName, fields, filter, sort = null) {
    const { collectionName }: SchemaObjectConfig = this.getSchema(modelName);
    const aggregation = this.findAggregation(modelName, fields, [{ $match: filter }], {})
    if (sort) {
      aggregation.push({ $sort: sort })
    }
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
        label: options.label
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
            promises.push(this.findAll(object.collection, object.lookupProject ? object.lookupProject : [], { _id: { $in: ids } }))
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

  //#endregion
}