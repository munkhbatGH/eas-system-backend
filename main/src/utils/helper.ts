var self = module.exports = {
  isNullOrEmpty(values) {
    return values === undefined || values === null || values.length === 0
  },
  isNull(value) {
    return value === undefined || value === null
  },
  data(result, totals, lists) {
    const data = {rows: [], count: 0}
    if (!self.isNullOrEmpty(result)) {
      data.rows = self.isNullOrEmpty(result[0].rows) ? [] : result[0].rows
      data.count = self.isNullOrEmpty(result[0].totalCount) ? 0 : result[0].totalCount[0].count
      if (lists) {
        for (const l of lists) {
          data[l] = result[0][l]
        }
      }
    }
    if (totals) {
      for (const total of totals) {
        if (!self.isNull(result[0][total])) {
          data[total] = self.isNullOrEmpty(result[0][total][0]) ? 0 : result[0][total][0].count
        } else if (self.isNullOrEmpty(result[0]['totalCount' + total]) || self.isNullOrEmpty(result[0]['totalCount' + total][0])) {
          data['count' + total] = 0
        } else {
          data['count' + total] = result[0]['totalCount' + total][0].count
        }
      }
    }
    return data
  },
  flattenArray(list) {
    let ret: any[] = []
    for (var i = 0; i < list.length; i++) {
      if (Array.isArray(list[i])) {
        ret = ret.concat(this.flattenArray(list[i]))
      } else {
        ret.push(list[i])
      }
    }
    return ret
  },
}