import request from '@/utils/request'

// 创建市场运营成本
export function createManagementCosts (data) {
  return request({
    url: '/system/management-costs/create',
    method: 'post',
    data: data
  })
}

// 更新市场运营成本
export function updateManagementCosts (data) {
  return request({
    url: '/system/management-costs/update',
    method: 'put',
    data: data
  })
}

// 删除市场运营成本
export function deleteManagementCosts (id) {
  return request({
    url: '/system/management-costs/delete?id=' + id,
    method: 'delete'
  })
}

// 删除战略成本投入- 全部删除
export function deleteAllManagementCosts () {
  return request({
    url: '/system/management-costs/cleanAll',
    method: 'delete'
  })
}

// 获得市场运营成本
export function getManagementCosts (id) {
  return request({
    url: '/system/management-costs/get?id=' + id,
    method: 'get'
  })
}

// 获得市场运营成本分页
export function getManagementCostsPage (params) {
  return request({
    url: '/system/management-costs/page',
    method: 'get',
    params
  })
}
// 导出市场运营成本 Excel
export function exportManagementCostsExcel (params) {
  return request({
    url: '/system/management-costs/export-excel',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 下载导入模板
export function importTemplate (type) {
  return request({
    url: '/system/management-costs/get-import-template/' + type,
    method: 'get',
    responseType: 'blob'
  })
}
