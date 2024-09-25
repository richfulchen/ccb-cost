import request from '@/utils/request'

// 创建战略成本投入
export function createUnusedCosts (data) {
  return request({
    url: '/system/unused-costs/create',
    method: 'post',
    data: data
  })
}

// 更新战略成本投入
export function updateUnusedCosts (data) {
  return request({
    url: '/system/unused-costs/update',
    method: 'put',
    data: data
  })
}

// 删除战略成本投入
export function deleteUnusedCosts (id) {
  return request({
    url: '/system/unused-costs/delete?id=' + id,
    method: 'delete'
  })
}

// 删除战略成本投入- 全部删除
export function deleteAllUnusedCosts () {
  return request({
    url: '/system/unused-costs/cleanAll',
    method: 'delete'
  })
}

// 获得战略成本投入
export function getUnusedCosts (id) {
  return request({
    url: '/system/unused-costs/get?id=' + id,
    method: 'get'
  })
}

// 获得战略成本投入分页
export function getUnusedCostsPage (params) {
  return request({
    url: '/system/unused-costs/page',
    method: 'get',
    params
  })
}
// 导出战略成本投入 Excel
export function exportUnusedCostsExcel (params) {
  return request({
    url: '/system/unused-costs/export-excel',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 下载导入模板
export function importTemplate (type) {
  return request({
    url: '/system/unused-costs/get-import-template/' + type,
    method: 'get',
    responseType: 'blob'
  })
}
