<template>
  <div class="app-container" v-loading="isValidateAndRedirect" element-loading-text="加载中">
    <!-- 搜索工作栏 -->
    <el-card class="mb20" shadow="never" v-show="showSearch" >
      <el-form :model="queryParams" ref="queryForm" size="small">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="技术栈地域可用区" prop="mixSearch">
              <el-input
                v-model="queryParams.mixSearch"
                placeholder="请输入技术栈地域可用区"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资产分类" prop="assetCategory">
              <el-cascader
                v-model="assetCategory"
                :options="categories"
                :props="{ value: 'label', children: 'children', checkStrictly: true }"
                placeholder="请选择"
                @change="handleChange"
                style="width: 100%;"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备型号" prop="model">
              <el-input
                v-model="queryParams.model"
                placeholder="请输入设备型号"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资产状态" prop="assetStatus">
              <el-select v-model="queryParams.assetStatus" style="width: 100%;" placeholder="请选择资产状态" clearable >
                <el-option label="使用中" value="使用中"/>
                <el-option label="未使用" value="未使用"/>
                <el-option label="闲置" value="闲置"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品类型" prop="product">
              <el-input v-model="queryParams.product" placeholder="请输入产品类型" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="mt10">
            <el-form-item>
              <el-button type="primary" @click="handleQuery">查询</el-button>
              <el-button  @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!--  功能区  -->
    <el-row :gutter="10" class="mb20">
      <el-col :span="1.5">
        <el-button
          type="primary"
          @click="handleImport"
        >批量导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          @click="openForm(undefined)"
        >新增</el-button>
      </el-col>
      <div style="float: right; display: flex; align-items: center">
        <el-button
          type="danger"
          style="margin-right: 0px"
          @click="handleDeleteAll"
        >全部删除</el-button>
        <el-button
          type="primary"
          style="margin-right: 20px"
          @click="handleExport"
        >导出</el-button>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
      </div>
    </el-row>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="序列号" align="center" prop="serialNumber" v-if="columns[0].visible" fixed="left"/>
      <el-table-column label="名称" align="center" prop="model" v-if="columns[1].visible" fixed="left"/>
      <el-table-column label="配置概要" align="center" prop="configSummary" v-if="columns[2].visible"/>
      <el-table-column label="合同号" align="center" prop="contractNumber" v-if="columns[3].visible"/>
      <el-table-column label="事项编号" align="center" prop="matterNumber" v-if="columns[4].visible"/>
      <el-table-column label="技术栈" align="center" prop="techStack" v-if="columns[5].visible"/>
      <el-table-column label="地域" align="center" prop="region" v-if="columns[6].visible"/>
      <el-table-column label="可用区" align="center" prop="availabilityZone" v-if="columns[7].visible"/>
      <el-table-column label="开始使用日期" align="center" prop="startUseDate" width="150" v-if="columns[8].visible"/>
      <el-table-column label="折旧/摊销开始日期" align="center" prop="depreciationStartDate"  width="180" v-if="columns[9].visible"/>
      <el-table-column label="资产分类" align="center" prop="assetCategory" width="200" v-if="columns[10].visible"/>
      <el-table-column label="合同单价（元）" align="center" prop="contractUnitPrice" width="120" v-if="columns[11].visible"/>
      <el-table-column label="单价（元）" align="center" prop="unitPrice" width="120" v-if="columns[12].visible"/>
      <el-table-column label="保有量" align="center" prop="quantity" v-if="columns[13].visible"/>
      <el-table-column label="保有量单位" align="center" prop="quantityUnit" width="100" v-if="columns[14].visible"/>
      <el-table-column label="总价（元）" align="center" prop="purchaseTotal" width="100" v-if="columns[15].visible"/>
      <el-table-column label="折旧/摊销年限（月）" align="center" prop="depreciationPeriod" width="180" v-if="columns[16].visible"/>
      <el-table-column label="残值率" align="center" prop="residualValueRate" v-if="columns[17].visible"/>
      <el-table-column label="月成本（元）" align="center" prop="monthlyCost" width="120" v-if="columns[18].visible"/>
      <el-table-column label="资产状态" align="center" prop="assetStatus" v-if="columns[19].visible"/>
      <el-table-column label="所属领域" align="center" prop="domain" v-if="columns[20].visible"/>
      <el-table-column label="所属产品" align="center" prop="product" v-if="columns[21].visible"/>
      <el-table-column label="所属子产品" align="center" prop="subProduct" width="100" v-if="columns[22].visible"/>
      <el-table-column label="PAM组件1" align="center" prop="pamComponent1" width="100" v-if="columns[23].visible"/>
      <el-table-column label="PAM组件2" align="center" prop="pamComponent2" width="100" v-if="columns[24].visible"/>
      <el-table-column label="PAM组件3" align="center" prop="pamComponent3" width="100" v-if="columns[25].visible"/>
      <el-table-column label="规格" align="center" prop="specification" v-if="columns[26].visible"/>
      <el-table-column label="厂商" align="center" prop="vendor" width="100" v-if="columns[27].visible"/>
      <el-table-column label="设备高度" align="center" prop="deviceHeight" v-if="columns[28].visible"/>
      <el-table-column label="功率（千瓦）" align="center" prop="powerConsumption" width="100" v-if="columns[29].visible"/>
      <el-table-column label="备注" align="center" prop="remarks" v-if="columns[30].visible"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120" v-if="columns[31].visible" fixed="right">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="openForm(scope.row.uniqueAssetCode)"
          >修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>
    <!-- 对话框(添加 / 修改) -->
    <inputDialogForm ref="formRef" @success="getList" />

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="700px" append-to-body>
      <el-row :gutter="20" class="mb20">
        <el-col :span="7">
          <div style="height: 150px; display: flex; justify-content: center; align-items: center">
            下载模板
          </div>
        </el-col>
        <el-col :span="17">
          <el-row class="mb5">
            <div style="display: flex; justify-content: normal; align-items: center; ">
              <el-link type="primary" :underline="false" style="font-size:16px; margin-right: 10px" @click="importTemplate('hardware', '硬件设备类模板')">硬件设备类模板.XLS</el-link>
              <span>用于【固定资产/硬件设备】类资产</span>
            </div>
          </el-row>
          <el-row class="mb5">
            <div style="display: flex; justify-content: normal; align-items: center; ">
              <el-link type="primary" :underline="false" style="font-size:16px; margin-right: 10px" @click="importTemplate('software', '软件产品类模板')">软件产品类模板.XLS</el-link>
              <span>用于【无形资产/软件产品】类资产</span>
            </div>
          </el-row>
          <el-row class="mb5">
            <div style="display: flex; justify-content: normal; align-items: center; ">
              <el-link type="primary" :underline="false" style="font-size:16px; margin-right: 10px" @click="importTemplate('managementCost', '管理费用类模板')">管理费用类模板.XLS</el-link>
              <span>用于【管理费用】类资产（能耗电费除外）</span>
            </div>
          </el-row>
          <el-row class="mb5">
            <div style="display: flex; justify-content: normal; align-items: center; ">
              <el-link type="primary" :underline="false" style="font-size:16px; margin-right: 10px" @click="importTemplate('energy', '能耗电费类模板')">能耗电费类模板.XLS</el-link>
              <span>用于【管理费用/能耗电费】类资产</span>
            </div>
          </el-row>
          <el-row class="mb5">
            <div style="display: flex; justify-content: normal; align-items: center; ">
              <el-link type="primary" :underline="false" style="font-size:16px; margin-right: 10px" @click="importTemplate('cabinet', '机柜配套类模板')">机柜配套类模板.XLS</el-link>
              <span>用于【固定资产/机柜配套】类资产</span>
            </div>
          </el-row>
          <el-row>
            <div style="display: flex; justify-content: normal; align-items: center; ">
              <el-link type="primary" :underline="false" style="font-size:16px; margin-right: 10px" @click="importTemplate('serverRoomEnv', '机房环境类模板')">机房环境类模板.XLS</el-link>
              <span>用于【管理贵用/机房环境】类资产</span>
            </div>
          </el-row>
        </el-col>
      </el-row>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls"
                 style="width: 100%;"
                 :action="upload.url" :disabled="upload.isUploading"
                 :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-select v-model="upload.typeValue" placeholder="请选择" @change="selectUploadType">
              <el-option
                v-for="item in upload.dateList"
                :key="item.label"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="14">
            <el-row>
              <el-button size="small" style="float: left" type="primary">点击上传</el-button>
            </el-row>
            <el-row>
              <div style="font-size: 12px; color: #515a6e; float: left; margin-top: 10px">仅允许导入xls、xlsx格式文件。</div>
            </el-row>
          </el-col>
        </el-row>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as marketApi from '@/api/market/index'
import inputDialogForm from './compomenets/marketDialogForm.vue'
import { categories } from '@/views/ccb/tenantManager/data'
// import { checkVerify } from '@/api/ccb'

export default {
  name: 'UnusedCosts',
  components: {
    inputDialogForm
  },
  data () {
    return {
      isValidateAndRedirect: false,
      assetCategory: undefined,
      categories,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 战略成本投入列表
      list: [],
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 选中行
      currentRow: {},
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        mixSearch: null,
        uniqueAssetCode: null,
        serialNumber: null,
        model: null,
        configSummary: null,
        vendorModel: null,
        contractNumber: null,
        matterNumber: null,
        techStack: null,
        region: null,
        availabilityZone: null,
        startUseDate: [],
        depreciationStartDate: [],
        assetCategory: null,
        assetSubcategory: null,
        unitPrice: null,
        originalValue: null,
        quantity: null,
        quantityUnit: null,
        totalOriginalValue: null,
        depreciationPeriod: null,
        residualValueRate: null,
        monthlyCost: null,
        assetStatus: null,
        domain: null,
        product: null,
        subProduct: null,
        pamComponent1: null,
        pamComponent2: null,
        pamComponent3: null,
        specification: null,
        vendor: null,
        deviceHeight: null,
        powerConsumption: null,
        remarks: null,
        amortizationStartDate: [],
        purchaseTotal: null,
        servicePeriod: null,
        localElectricityPrice: null,
        cabinetOriginalValue: null,
        environmentUnitPrice: null
      },
      columns: [
        {
          key: 0,
          label: '序列号',
          visible: true,
          disable: true
        },
        {
          key: 1,
          label: '名称',
          visible: true,
          disable: true
        },
        {
          key: 2,
          label: '配置概要',
          visible: false
        },
        {
          key: 3,
          label: '合同号',
          visible: false
        },
        {
          key: 4,
          label: '事项编号',
          visible: false
        },
        {
          key: 5,
          label: '技术栈',
          visible: true,
          disable: true
        },
        {
          key: 6,
          label: '地域',
          visible: false
        },
        {
          key: 7,
          label: '可用区',
          visible: false
        },
        {
          key: 8,
          label: '开始使用日期',
          visible: true
        },
        {
          key: 9,
          label: '折旧/摊销开始日期',
          visible: true,
          disable: true
        },
        {
          key: 10,
          label: '资产分类',
          visible: true,
          disable: true
        },
        {
          key: 11,
          label: '合同单价（元）',
          visible: false
        },
        {
          key: 12,
          label: '单价（元）',
          visible: true
        },
        {
          key: 13,
          label: '保有量',
          visible: true
        },
        {
          key: 14,
          label: '保有量单位',
          visible: true
        },
        {
          key: 15,
          label: '总价（元）',
          visible: true
        },
        {
          key: 16,
          label: '折旧/摊销年限（月）',
          visible: true
        },
        {
          key: 17,
          label: '残值率',
          visible: true
        },
        {
          key: 18,
          label: '月成本（元）',
          visible: true,
          disable: true
        },
        {
          key: 19,
          label: '资产状态',
          visible: true,
          disable: true
        },
        { key: 20, label: '所属领域', visible: true, disable: true },
        { key: 21, label: '所属产品', visible: true, disable: true },
        { key: 22, label: '所属子产品', visible: true, disable: true },
        { key: 23, label: 'PAM组件1', visible: false },
        { key: 24, label: 'PAM组件2', visible: false },
        { key: 25, label: 'PAM组件3', visible: false },
        {
          key: 26,
          label: '规格',
          visible: false
        },
        {
          key: 27,
          label: '厂商',
          visible: false
        },
        {
          key: 28,
          label: '设备高度',
          visible: false
        },
        {
          key: 29,
          label: '功率（千瓦）',
          visible: false
        },
        {
          key: 30,
          label: '备注',
          visible: false
        },
        {
          key: 31,
          label: '操作',
          visible: true,
          disable: true
        }
      ],
      // 导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/admin-api/system/management-costs/import/hardware',
        dateList: [
          {
            label: '硬件设备类',
            value: '硬件设备类',
            url: '/admin-api/system/management-costs/import/hardware'
          },
          {
            label: '软件产品类',
            value: '软件产品类',
            url: '/admin-api/system/management-costs/import/software'
          },
          {
            label: '管理费用类',
            value: '管理费用类',
            url: '/admin-api/system/management-costs/import/managementCost'
          },
          {
            label: '能耗电费类',
            value: '能耗电费类',
            url: '/admin-api/system/management-costs/import/energy'
          },
          {
            label: '机柜配套类',
            value: '机柜配套类',
            url: '/admin-api/system/management-costs/import/cabinet'
          },
          {
            label: '机房环境类',
            value: '机房环境类',
            url: '/admin-api/system/management-costs/import/serverRoomEnv'
          }
        ],
        typeValue: '硬件设备类'
      }
    }
  },
  created () {
    // this.validateAndRedirect()
    this.getList()
  },
  methods: {
    /** 接口校验 */
    validateAndRedirect () {
      this.isValidateAndRedirect = true
      // checkVerify().then(response => {
      //   // 处理响应
      //   this.isValidateAndRedirect = false
      //   console.log('响应数据:', response.data)
      //   if (response.data.code === 200) {
      //     console.log('登录验证成功')
      //     this.getList()
      //   } else {
      //     console.error('登录验证失败')
      //   }
      // }).catch(error => {
      //   // 处理错误
      //   console.error('请求失败:', error)
      //   this.isValidateAndRedirect = false
      //   this.$modal.notifyError(error.toLocaleString())
      //   // 改变顶层窗口的位置
      //   window.top.location.href = 'http://api.bssmgt.yuncpt.ccb.com/'
      //   // // 将iframe的src指向登录页面
      //   // if (window.parent && window.parent.document.getElementById('yourIframeId')) {
      //   //   window.parent.document.getElementById('yourIframeId').src = 'http://your-main-system-login-url';
      //   // }
      // })
    },
    /** 查询列表 */
    async getList () {
      try {
        this.loading = true
        const res = await marketApi.getManagementCostsPage(this.queryParams)
        this.list = res.data.list
        this.total = res.data.total
      } catch (err) {
        this.loading = false
      } finally {
        this.loading = false
      }
    },
    handleChange (value) {
      console.log(value)
      this.queryParams.assetCategory = value.join('/')
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNo = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.assetCategory = undefined
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 添加/修改操作 */
    openForm (id) {
      this.$refs.formRef.open(id)
    },
    /** 删除按钮操作 */
    async handleDelete (row) {
      const id = row.uniqueAssetCode
      await this.$modal.confirm('是否确认删除市场运营成本投入编号为"' + id + '"的数据项?')
      try {
        await marketApi.deleteManagementCosts(id)
        await this.getList()
        this.$modal.msgSuccess('删除成功')
      } catch {
      }
    },
    /**
     * 全部删除
     */
    async handleDeleteAll () {
      await this.$modal.confirm('是否确认删除所有数据项?')
      try {
        await marketApi.deleteAllManagementCosts()
        await this.getList()
        this.$modal.msgSuccess('删除成功')
      } catch {}
    },
    /** 导出按钮操作 */
    async handleExport () {
      await this.$modal.confirm('是否确认导出所有市场运营成本投入数据项?')
      try {
        this.exportLoading = true
        const res = await marketApi.exportManagementCostsExcel(this.queryParams)
        this.$download.excel(res, '市场运营成本投入管理.xls')
      } catch {
      } finally {
        this.exportLoading = false
      }
    },
    /** 导入操作 */
    async handleImport () {
      this.upload.url = process.env.VUE_APP_BASE_API + '/admin-api/system/management-costs/import/hardware'
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
      this.upload.typeValue = '硬件设备类'
      this.upload.title = '市场运营成本投入管理'
      this.upload.open = true
    },
    /** 根据选择类型确定下载模板地址 */
    selectUploadType (type) {
      console.log('type', type)
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
      // 根据传入的type(datalist的value值)获取对应的url
      this.upload.url = process.env.VUE_APP_BASE_API + this.upload.dateList.find(item => item.value === type).url
    },
    /** 下载模板操作 */
    importTemplate (type, title) {
      marketApi.importTemplate(type).then(response => {
        this.$download.excel(response, title + '.xls')
      })
    },
    // 文件上传中处理
    handleFileUploadProgress (event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess (response, file, fileList) {
      if (response.code !== 0) {
        this.$modal.notifyError(response.msg)
        return
      }
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      // 拼接提示语
      const data = response.data
      let text = '创建成功数量：' + data.createCosts.length
      for (const username of data.createCosts) {
        text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;' + username
      }
      text += '<br />更新成功数量：' + data.updateCosts.length
      for (const username of data.updateCosts) {
        text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;' + username
      }
      text += '<br />更新失败数量：' + Object.keys(data.failureCosts).length
      for (const username in data.failureCosts) {
        text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;' + username + '：' + data.failureCosts[username]
      }
      this.$alert(text, '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    // 提交上传文件
    submitFileForm () {
      this.$refs.upload.submit()
    }
  }
}
</script>
