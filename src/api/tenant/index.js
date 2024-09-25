import request from '@/utils/request'
// 创建租户投入要素
export function createInputFactor (data) {
  return request({
    url: '/system/input-factor/create',
    method: 'post',
    data: data
  })
}

// 更新租户投入要素
export function updateInputFactor (data) {
  return request({
    url: '/system/input-factor/update',
    method: 'put',
    data: data
  })
}

// 删除租户投入要素
export function deleteInputFactor (id) {
  return request({
    url: '/system/input-factor/delete?id=' + id,
    method: 'delete'
  })
}

// 删除战略成本投入- 全部删除
export function deleteAllInputFactor (type) {
  return request({
    url: '/system/input-factor/cleanAll/' + type,
    method: 'delete'
  })
}

// 获得租户投入要素
export function getInputFactor (id) {
  return request({
    url: '/system/input-factor/get?id=' + id,
    method: 'get'
  })
}

// 获得租户投入要素分页
export function getInputFactorPage (params) {
  return request({
    url: '/system/input-factor/page',
    method: 'get',
    params
  })
}
// 导出租户投入要素 Excel
export function exportInputFactorExcel (params) {
  return request({
    url: '/system/input-factor/export-excel',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 下载导入模板
export function importTemplateIn () {
  return request({
    url: '/system/input-factor/get-import-template/inside',
    method: 'get',
    responseType: 'blob'
  })
}

export function importTemplateOut () {
  return request({
    url: '/system/input-factor/get-import-template/outside',
    method: 'get',
    responseType: 'blob'
  })
}
