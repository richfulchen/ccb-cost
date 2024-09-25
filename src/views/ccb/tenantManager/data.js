export const categories = [
  {
    label: '固定资产',
    children: [
      {
        label: '硬件设备',
        children: [
          { label: '机柜及配套设备' },
          { label: '服务器' },
          { label: '网络设备' },
          { label: '存储设备' },
          { label: '安全设备' }
        ]
      }
    ]
  },
  {
    label: '无形资产',
    children: [
      {
        label: '软件产品',
        children: [
          { label: '软件产品' },
          { label: '外购开发服务' }
        ]
      }
    ]
  },
  {
    label: '管理费用',
    children: [
      {
        label: '机房环境',
        children: [
          { label: '机房环境' }
        ]
      },
      {
        label: '能耗电费',
        children: [
          { label: '能耗电费' }
        ]
      },
      {
        label: '网络通讯',
        children: [
          { label: '网络通讯' }
        ]
      },
      {
        label: '运维及管理',
        children: [
          { label: '行内人力资源' },
          { label: '外购运维服务' },
          { label: '软件使用及维护' },
          { label: '硬件维护' },
          { label: '行政费用' }
        ]
      },
      {
        label: '市场宣传与销售',
        children: [
          { label: '市场宣传费' },
          { label: '销售费用' },
          { label: '渠道返佣' },
          { label: '生态合作' }
        ]
      }
    ]
  }
]

export const templateMapping = {
  机柜及配套设备: '模板五',
  服务器: '模板一',
  网络设备: '模板一',
  存储设备: '模板一',
  安全设备: '模板一',
  软件产品: '模板二',
  外购开发服务: '模板二',
  机房环境: '模板六',
  能耗电费: '模板四',
  网络通讯: '模板三',
  行内人力资源: '模板三',
  外购运维服务: '模板三',
  软件使用及维护: '模板三',
  硬件维护: '模板三',
  市场宣传费: '模板三',
  销售费用: '模板三',
  渠道返佣: '模板三',
  生态合作: '模板三',
  行政费用: '模板三'
}
// 根据分类名称匹配模板名称
export function getTemplateByCategory (thirdLevelCategory) {
  return templateMapping[thirdLevelCategory] || '模板未定义'
}
